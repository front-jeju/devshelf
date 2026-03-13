/**
 * BookCard.tsx
 * 책장에 꽂혀있는 책 한 권을 표현하는 컴포넌트입니다.
 *
 * 시각적 특징:
 *   - 책 등(spine)이 세로로 표시되며 이름·역할이 rotated 텍스트로 렌더링됩니다.
 *   - portfolio.spineColor / coverColor / accentColor로 책마다 고유한 색상을 가집니다.
 *   - featured=true인 경우 오른쪽 상단에 황금 점 배지가 표시됩니다.
 *
 * 상태:
 *   isHovered — 마우스 오버 시 책이 왼쪽으로 튀어나오는 3D 효과 활성화
 *
 * 로직 흐름:
 *   hover → isHovered=true → 책 x:-12, rotateY:8, 그림자 강조
 *   isFiltered=true → opacity/saturation 감소, 클릭 비활성화
 *   클릭 → onSelect(portfolio) → BookShelf에서 BookCover 오버레이 표시
 *
 * memo로 감싸진 이유:
 *   책이 많을 때 FilterBar 클릭마다 전체 재렌더를 방지합니다.
 */
import { useState, memo } from 'react';
import { motion } from 'framer-motion';
import type { Portfolio } from '../../types';

interface BookCardProps {
  portfolio: Portfolio;
  isFiltered: boolean;  // true면 현재 필터 조건에 맞지 않아 흐리게 표시
  onSelect: (portfolio: Portfolio) => void; // 클릭 시 BookShelf에 선택 알림
}

export const BookCard = memo(function BookCard({ portfolio, isFiltered, onSelect }: BookCardProps) {
  // 마우스 오버 여부 (3D 튀어나오기 효과 제어)
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="book-wrapper relative select-none"
      style={{ width: 80, height: 200, cursor: 'pointer' }}
      animate={{
        opacity: isFiltered ? 0.18 : 1,
        filter: isFiltered ? 'saturate(0) brightness(0.4)' : 'none',
        scale: isFiltered ? 0.97 : 1,
      }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      onHoverStart={() => !isFiltered && setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => !isFiltered && onSelect(portfolio)}
    >
      {/* 책 본체 */}
      <motion.div
        className="w-full h-full relative"
        style={{ borderRadius: '2px 4px 4px 2px', transformOrigin: 'left center' }}
        animate={{
          x: isHovered ? -12 : 0,
          rotateY: isHovered ? 8 : 0,
          boxShadow: isHovered
            ? `8px 12px 30px rgba(0,0,0,0.8), -2px 0 8px rgba(0,0,0,0.4), 0 0 20px ${portfolio.spineColor}40`
            : '4px 6px 15px rgba(0,0,0,0.6), -1px 0 4px rgba(0,0,0,0.3)',
        }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* 책 등(spine) */}
        <div
          className="w-full h-full relative overflow-hidden flex flex-col items-center justify-between"
          style={{
            borderRadius: '2px 4px 4px 2px',
            background: `linear-gradient(180deg,
              ${portfolio.coverColor}ee 0%,
              ${portfolio.spineColor} 30%,
              ${portfolio.spineColor}dd 70%,
              ${portfolio.coverColor}cc 100%
            )`,
            padding: '14px 6px',
          }}
        >
          {/* 왼쪽 바인딩 선 */}
          <div
            className="absolute left-0 top-0 bottom-0"
            style={{
              width: 6,
              background: 'linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.4) 100%)',
              boxShadow: 'inset -1px 0 2px rgba(255,255,255,0.1)',
            }}
          />

          {/* 황금 장식선 상단 */}
          <div
            style={{
              width: '70%',
              height: 1,
              background: `linear-gradient(90deg, transparent, ${portfolio.accentColor}80, transparent)`,
              marginBottom: 8,
            }}
          />

          {/* 제목 (세로) */}
          <div
            style={{
              writingMode: 'vertical-lr',
              textOrientation: 'mixed',
              fontFamily: "'Cinzel', serif",
              fontSize: '0.7rem',
              fontWeight: 700,
              letterSpacing: '0.12em',
              color: portfolio.accentColor,
              textShadow: `0 0 10px ${portfolio.accentColor}60`,
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              maxHeight: 120,
              overflow: 'hidden',
              lineHeight: 1.2,
            }}
          >
            {portfolio.name}
          </div>

          {/* 역할 (세로 작게) */}
          <div
            style={{
              writingMode: 'vertical-lr',
              textOrientation: 'mixed',
              fontFamily: "'EB Garamond', serif",
              fontSize: '0.58rem',
              color: `${portfolio.accentColor}90`,
              letterSpacing: '0.05em',
              marginTop: 4,
            }}
          >
            {portfolio.role.split(' ')[0]}
          </div>

          {/* 황금 장식선 하단 */}
          <div
            style={{
              width: '70%',
              height: 1,
              background: `linear-gradient(90deg, transparent, ${portfolio.accentColor}80, transparent)`,
              marginTop: 8,
            }}
          />

          {/* featured 배지 */}
          {portfolio.featured && (
            <div
              className="absolute"
              style={{
                top: 8,
                right: 4,
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: '#d4af37',
                boxShadow: '0 0 8px rgba(212,175,55,0.8)',
              }}
            />
          )}

          {/* 텍스처 오버레이 */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)' }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
});
