import { useEffect, useRef } from 'react';

// 황금빛 색상 팔레트 - 다양한 gold 톤으로 실감나는 빛 표현
const GOLD_PALETTE = ['#FFD700', '#FFC400', '#FFE566', '#F0C040', '#FFAA00', '#FFF0A0'];

interface Thread {
  angle: number;     // 현재 선두 각도 (라디안)
  speed: number;     // 각속도 (rad/frame), 부호로 회전 방향 결정
  span: number;      // 호의 길이 (라디안)
  phase: number;     // sin 파형 위상 오프셋
  waveAmp: number;   // 반경 방향 진폭 (px)
  waveFreq: number;  // sin 주기 수 (정수, 높을수록 더 꼬인 느낌)
  width: number;     // 선 굵기
  alpha: number;     // 기본 불투명도
  color: string;     // gold 변형 색상
}

interface Spark {
  angle: number;
  speed: number;
  phase: number;    // 개별 위상으로 흔들림 다양화
  waveAmp: number;
  size: number;
  alpha: number;
}

export function PortalCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // mouseRef로 마우스 좌표 추적 (리렌더 없이 애니메이션 루프에서 직접 읽음)
  const mouseRef = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let time = 0;

    // CSS 표시 크기에 맞게 캔버스 해상도 동기화
    const resize = () => {
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = width;
      canvas.height = height;
      // 리사이즈 시 캔버스가 초기화되므로 어두운 배경으로 채움
      ctx.fillStyle = '#080300';
      ctx.fillRect(0, 0, width, height);
    };
    resize();
    window.addEventListener('resize', resize);

    // 마우스 위치를 캔버스 로컬 좌표로 변환하여 저장
    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onMouseLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 };
    };
    window.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseleave', onMouseLeave);

    // --- 실 (Thread) 초기화 ---
    // 서로 다른 방향·속도·파형으로 교차하며 얽힌 에너지 링 형성
    const THREADS: Thread[] = Array.from({ length: 40 }, () => ({
      angle: Math.random() * Math.PI * 2,
      speed: (0.006 + Math.random() * 0.011) * (Math.random() > 0.5 ? 1 : -1),
      span: Math.PI * (0.5 + Math.random() * 0.9),   // 90° ~ 252° 호
      phase: Math.random() * Math.PI * 2,
      waveAmp: 8 + Math.random() * 22,
      waveFreq: 2 + Math.floor(Math.random() * 4),
      width: 0.5 + Math.random() * 1.8,
      alpha: 0.22 + Math.random() * 0.45,
      color: GOLD_PALETTE[Math.floor(Math.random() * GOLD_PALETTE.length)],
    }));

    // --- 스파크 (Spark) 초기화 ---
    // 링 위를 유기적으로 흐르는 밝은 점 입자들
    const SPARKS: Spark[] = Array.from({ length: 140 }, () => ({
      angle: Math.random() * Math.PI * 2,
      speed: (0.004 + Math.random() * 0.015) * (Math.random() > 0.5 ? 1 : -1),
      phase: Math.random() * Math.PI * 2,
      waveAmp: 5 + Math.random() * 20,
      size: 0.4 + Math.random() * 2.2,
      alpha: 0.45 + Math.random() * 0.55,
    }));

    const ARC_STEPS = 52; // 호 한 개를 몇 개 선분으로 나눌지 (많을수록 부드럽지만 느림)

    // --- 메인 애니메이션 루프 ---
    const draw = () => {
      const W = canvas.width;
      const H = canvas.height;
      if (!W || !H) { animId = requestAnimationFrame(draw); return; }

      const cx = W / 2;
      const cy = H / 2;
      const baseR = Math.min(W, H) * 0.36; // 링의 기본 반지름

      // 마우스가 링 중심 근처일수록 proximity가 1에 가까워짐
      const { x: mx, y: my } = mouseRef.current;
      const mouseDist = Math.hypot(mx - cx, my - cy);
      const proximity = Math.max(0, 1 - mouseDist / (baseR * 1.6));
      // 에너지 폭발 직전 느낌: 속도 최대 3.8×, 파형 진폭 추가
      const speedBoost = 1 + proximity * 2.8;
      const instability = proximity * 30;

      // 이전 프레임을 반투명 어둠으로 덮어 잔상(trail) 효과 생성
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
      ctx.fillStyle = 'rgba(8, 3, 0, 0.20)';
      ctx.fillRect(0, 0, W, H);

      // 가산 합성: 빛이 겹칠수록 밝아져 자연스러운 발광 표현
      ctx.globalCompositeOperation = 'lighter';

      // --- 링 기저 글로우 (ring backbone) ---
      // 모든 실들이 이 원을 중심으로 분포하도록 희미한 기저 링 표시
      ctx.globalAlpha = 0.05;
      ctx.shadowBlur = 50;
      ctx.shadowColor = '#FFD700';
      ctx.beginPath();
      ctx.arc(cx, cy, baseR, 0, Math.PI * 2);
      ctx.strokeStyle = '#FFD700';
      ctx.lineWidth = 28;
      ctx.stroke();

      // --- 얽힌 에너지 실 (threads) 렌더링 ---
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#FFD700';
      for (const t of THREADS) {
        t.angle += t.speed * speedBoost;

        const stepAngle = t.span / ARC_STEPS;
        ctx.beginPath();

        for (let s = 0; s <= ARC_STEPS; s++) {
          const a = t.angle + s * stepAngle;
          // sin 파형으로 반지름을 유기적으로 변형 → 꼬인 실 느낌
          const wobble = (t.waveAmp + instability) * Math.sin(t.waveFreq * a + t.phase + time * 0.55);
          const r = baseR + wobble;
          const x = cx + Math.cos(a) * r;
          const y = cy + Math.sin(a) * r;
          s === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }

        ctx.strokeStyle = t.color;
        ctx.lineWidth = t.width;
        ctx.globalAlpha = t.alpha;
        ctx.stroke();
      }

      // --- 스파크 입자 렌더링 ---
      ctx.shadowBlur = 20;
      ctx.shadowColor = '#FFE566';
      for (const s of SPARKS) {
        s.angle += s.speed * speedBoost;

        // 스파크도 sin 파형으로 링을 따라 유기적으로 흔들림
        const wobble = (s.waveAmp + instability * 0.55) * Math.sin(3 * s.angle + s.phase + time);
        const r = baseR + wobble;
        const x = cx + Math.cos(s.angle) * r;
        const y = cy + Math.sin(s.angle) * r;

        // 흰색 코어: 밝은 발광점
        ctx.globalAlpha = s.alpha * 0.9;
        ctx.beginPath();
        ctx.arc(x, y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();

        // 황금 헤일로: 코어 주변 황금빛 번짐
        ctx.globalAlpha = s.alpha * 0.38;
        ctx.beginPath();
        ctx.arc(x, y, s.size * 3.2, 0, Math.PI * 2);
        ctx.fillStyle = '#FFD700';
        ctx.fill();
      }

      // --- 링 주변 환경광 (ambient aura) ---
      // 중심부보다 링 주변이 밝은 도넛형 밀도 구조
      ctx.shadowBlur = 0;
      const aura = ctx.createRadialGradient(cx, cy, baseR * 0.55, cx, cy, baseR * 1.45);
      aura.addColorStop(0, 'rgba(255, 190, 30, 0.0)');
      aura.addColorStop(0.55, 'rgba(255, 165, 0, 0.07)');
      aura.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.globalAlpha = 1;
      ctx.fillStyle = aura;
      ctx.beginPath();
      ctx.arc(cx, cy, baseR * 1.45, 0, Math.PI * 2);
      ctx.fill();

      // 상태 초기화
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;

      time += 0.016;
      animId = requestAnimationFrame(draw);
    };

    draw();

    // 메모리 누수 방지: 루프 취소 + 이벤트 리스너 제거
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '100%', height: '100%', display: 'block' }}
    />
  );
}
