import { useEffect, useRef } from 'react';

// ---- 입자 데이터 구조 ----
interface Particle {
  angle: number;          // 현재 궤도 각도 (radian)
  radiusFactor: number;   // 캔버스 반폭 기준 비율 → 리사이즈 시 자동 적응
  speed: number;          // 프레임당 각속도 (음수 = 반시계 방향)
  size: number;           // 입자 반지름 (px)
  alpha: number;          // 기본 불투명도
  wavePhase: number;      // sin 파형 개별 위상 오프셋
  waveFreq: number;       // sin 파형 주파수 (낮을수록 느린 흔들림)
  waveAmpFactor: number;  // 반경 진폭 비율 (radiusFactor 단위)
  ring: 0 | 1 | 2;       // 링 레이어 (0=내부, 1=중간, 2=외부)
}

interface Props {
  className?: string;
  style?: React.CSSProperties;
}

export function PortalCanvas({ className, style }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // ---- 반응형 캔버스 크기 ----
    const getSize = () =>
      window.innerWidth < 768
        ? Math.min(window.innerWidth * 0.62, 230)
        : Math.min(window.innerWidth * 0.24, 270);

    canvas.width = getSize();
    canvas.height = getSize();

    // ---- 디바이스 퍼포먼스 기반 입자 수 결정 ----
    const isMobile = window.innerWidth < 768;
    const TOTAL = isMobile ? 155 : 215;

    // 링 정의: 내부(0) / 중간(1) / 외부(2) 각각 비율, 반경 범위, 속도, 크기 범위
    const ringDefs = [
      { ring: 0 as const, frac: 0.18, rMin: 0.19, rMax: 0.31, spd: 0.022, sz: [1.2, 2.2] },
      { ring: 1 as const, frac: 0.42, rMin: 0.45, rMax: 0.60, spd: 0.013, sz: [0.9, 1.7] },
      { ring: 2 as const, frac: 0.40, rMin: 0.72, rMax: 0.88, spd: 0.008, sz: [0.6, 1.3] },
    ];

    // ---- 입자 생성 (링 순서대로 배열에 추가 → 인덱스 범위 계산 가능) ----
    const particles: Particle[] = [];
    let r0count = 0, r1count = 0;

    for (const d of ringDefs) {
      const count = Math.round(TOTAL * d.frac);
      if (d.ring === 0) r0count = count;
      if (d.ring === 1) r1count = count;

      for (let i = 0; i < count; i++) {
        const ccw = Math.random() < 0.13; // 13%는 반시계 방향으로 역행
        particles.push({
          angle: Math.random() * Math.PI * 2,
          radiusFactor: d.rMin + Math.random() * (d.rMax - d.rMin),
          speed: (ccw ? -1 : 1) * d.spd * (0.6 + Math.random() * 0.8),
          size: d.sz[0] + Math.random() * (d.sz[1] - d.sz[0]),
          alpha: 0.45 + Math.random() * 0.55,
          wavePhase: Math.random() * Math.PI * 2,
          waveFreq: 0.014 + Math.random() * 0.024,
          waveAmpFactor: 0.038 + Math.random() * 0.048,
          ring: d.ring,
        });
      }
    }

    // 링별 배열 인덱스 경계 (연결선 효율화용)
    const r0end = r0count;
    const r1end = r0count + r1count;
    // ring2: r1end ~ particles.length - 1

    // ---- 마우스/터치 상태 (캔버스 기준 상대 좌표) ----
    const mouse = { x: -9999, y: -9999 };

    // 위치 캐시 → 입자 드로우 후 연결선 단계에서 재사용
    const pos = new Float32Array(particles.length * 2);

    let time = 0;
    let rafId = 0;

    // ========== 메인 드로우 루프 ==========
    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;
      const hw = w / 2; // 최대 궤도 기준 반폭

      // ---- 마우스 영향력 계산 ----
      // 중심으로부터의 거리 → 0(멀) ~ 1(가까움)
      const mdx = mouse.x - cx;
      const mdy = mouse.y - cy;
      const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
      const influence = Math.max(0, 1 - mDist / (hw * 1.6));

      // 속도 배율: 최대 3.8배 가속 (에너지 폭발 직전 느낌)
      const speedMult = 1 + influence * 2.8;
      // 반경 흔들림 강도 (마우스 가까울수록 궤도 불안정)
      const chaosScale = influence * hw * 0.032;

      // ---- 캔버스 초기화 ----
      ctx.clearRect(0, 0, w, h);

      // ---- 중심 glow 배경 (마우스 근접 시 더 밝아짐) ----
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, hw);
      grad.addColorStop(0, `rgba(255,215,0,${0.10 + influence * 0.12})`);
      grad.addColorStop(0.4, `rgba(255,165,0,${0.04 + influence * 0.05})`);
      grad.addColorStop(0.85, `rgba(200,80,0,${0.01 + influence * 0.02})`);
      grad.addColorStop(1, 'rgba(150,50,0,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // ========== 입자 업데이트 & 드로우 ==========
      // lighter: 빛이 겹칠수록 밝아지는 가산 합성
      ctx.globalCompositeOperation = 'lighter';
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#FFD700';

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // 각도 갱신 (마우스 영향으로 가속)
        p.angle += p.speed * speedMult;

        // sin 파형으로 반경 유기적 흔들기 + 마우스 chaos 추가
        const wave = Math.sin(time * p.waveFreq + p.wavePhase);
        const chaos = chaosScale * Math.sin(time * 0.07 + i * 1.27);
        const r = (p.radiusFactor + wave * p.waveAmpFactor) * hw + chaos;

        const x = cx + Math.cos(p.angle) * r;
        const y = cy + Math.sin(p.angle) * r;

        // 위치 캐시 저장 (연결선 단계에서 재사용)
        pos[i * 2] = x;
        pos[i * 2 + 1] = y;

        // 링에 따른 밝기: 내부일수록 더 밝게 (중심 밀도 표현)
        const brightFactor = p.ring === 0 ? 1.35 : p.ring === 1 ? 1.0 : 0.72;
        const a = Math.min(1, p.alpha * brightFactor * (0.68 + wave * 0.32));

        // 황금빛 컬러 (wave에 따라 그린 채널 미세 변화 → 살아있는 느낌)
        const g = (188 + (wave * 27) | 0);

        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,${g},0,${a})`;
        ctx.fill();
      }

      // ========== 연결선 드로우 ==========
      // 그림자 비활성화 (선에는 불필요, 퍼포먼스 확보)
      ctx.shadowBlur = 0;
      const maxDist = hw * 0.27;
      const maxDist2 = maxDist * maxDist;

      // ---- 링 내부 연결선: 각 링 입자를 건너뛰며 연결 → 별 다각형 패턴 ----
      // lighter 합성 + 낮은 alpha → 교차점이 자연스럽게 밝아짐
      const drawIntraRing = (start: number, end: number, step: number, alpha: number) => {
        const count = end - start;
        ctx.strokeStyle = `rgba(255,215,0,${alpha})`;
        ctx.lineWidth = 0.45;
        ctx.beginPath();
        for (let i = start; i < end; i++) {
          const j = start + ((i - start + step) % count);
          ctx.moveTo(pos[i * 2], pos[i * 2 + 1]);
          ctx.lineTo(pos[j * 2], pos[j * 2 + 1]);
        }
        ctx.stroke();
      };

      // 내부링: step=5로 촘촘한 패턴
      drawIntraRing(0, r0end, 5, 0.07 + influence * 0.04);
      // 중간링: step=7
      drawIntraRing(r0end, r1end, 7, 0.055 + influence * 0.03);
      // 외부링: step=6
      drawIntraRing(r1end, particles.length, 6, 0.04 + influence * 0.025);

      // ---- 링 간 연결선: 인접 거리 기반 → 에너지 실선 얽힘 표현 ----
      // ring0 ↔ ring1
      for (let i = 0; i < r0end; i++) {
        const ax = pos[i * 2], ay = pos[i * 2 + 1];
        for (let j = r0end; j < r1end; j++) {
          const dx = ax - pos[j * 2];
          const dy = ay - pos[j * 2 + 1];
          const d2 = dx * dx + dy * dy;
          if (d2 < maxDist2) {
            const t = 1 - Math.sqrt(d2) / maxDist;
            ctx.beginPath();
            ctx.moveTo(ax, ay);
            ctx.lineTo(pos[j * 2], pos[j * 2 + 1]);
            ctx.strokeStyle = `rgba(255,215,0,${t * (0.13 + influence * 0.07)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // ring1 ↔ ring2
      for (let i = r0end; i < r1end; i++) {
        const ax = pos[i * 2], ay = pos[i * 2 + 1];
        for (let j = r1end; j < particles.length; j++) {
          const dx = ax - pos[j * 2];
          const dy = ay - pos[j * 2 + 1];
          const d2 = dx * dx + dy * dy;
          if (d2 < maxDist2) {
            const t = 1 - Math.sqrt(d2) / maxDist;
            ctx.beginPath();
            ctx.moveTo(ax, ay);
            ctx.lineTo(pos[j * 2], pos[j * 2 + 1]);
            ctx.strokeStyle = `rgba(255,215,0,${t * (0.09 + influence * 0.05)})`;
            ctx.lineWidth = 0.4;
            ctx.stroke();
          }
        }
      }

      // ---- 합성 모드 복원 ----
      ctx.globalCompositeOperation = 'source-over';

      time++;
      rafId = requestAnimationFrame(draw);
    };

    rafId = requestAnimationFrame(draw);

    // ---- 윈도우 레벨 마우스 추적 (캔버스 바깥에서도 영향력 계산) ----
    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const onMouseLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseleave', onMouseLeave);

    // ---- 창 리사이즈 처리 ----
    // radiusFactor 비율 기반이므로 입자 재생성 없이 자동 적응
    const onResize = () => {
      canvas.width = getSize();
      canvas.height = getSize();
    };
    window.addEventListener('resize', onResize);

    // ---- 클린업: 메모리 누수 방지 ----
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: 'block', ...style }}
    />
  );
}
