import { interpolate, useCurrentFrame } from 'remotion';
import { ease } from './motion';
import { CardShell } from './CardShell';
import type { CompareCard, Segment } from './types';

/**
 * Compare 卡：与静态 PNG 04-not-a-is-b 对齐
 * - 纵向堆叠：old box（白）→ ≠ → new box（深蓝/金边）
 * - explain 文字在底部
 * - 隐藏全局金色 rail (showRail=false)
 */
export function CompareMotion({ segment, card }: { segment: Segment; card: CompareCard }) {
  const frame = useCurrentFrame();
  const duration = segment.durationInFrames;
  const opacity = interpolate(frame, [0, 10, Math.max(duration - 8, 11), duration], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const oldY = ease(frame, [4, 26], [-30, 0]);
  const oldOpacity = ease(frame, [4, 26], [0, 1]);
  const neqScale = ease(frame, [22, 44], [0.5, 1]);
  const neqOpacity = ease(frame, [22, 44], [0, 1]);
  const newY = ease(frame, [38, 62], [40, 0]);
  const newOpacity = ease(frame, [38, 62], [0, 1]);
  const explainY = ease(frame, [62, 86], [18, 0]);
  const explainOpacity = ease(frame, [60, 84], [0, 1]);

  return (
    <div style={{ width: '100%', height: '100%', opacity }}>
      <CardShell tag={card.tag} footer={card.footer} showRail={false}>
        {/* compare-stage: 纵向 1fr+gap+neq+gap+1fr */}
        <div
          style={{
            position: 'absolute',
            top: 360,
            bottom: 474,
            left: 90,
            right: 90,
            display: 'grid',
            gridTemplateRows: '1fr auto 1fr',
            gap: 48,
            zIndex: 2,
          }}
        >
          {/* old box */}
          <div
            style={{
              background: 'rgba(255,255,255,0.96)',
              border: '6px solid rgba(15,39,71,0.22)',
              boxShadow: '0 3px 0 rgba(15,39,71,0.04)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '72px 78px',
              opacity: oldOpacity,
              transform: `translateY(${oldY}px)`,
            }}
          >
            <strong
              style={{
                color: '#5f6b7a',
                fontSize: 96,
                fontWeight: 900,
                letterSpacing: '-0.06em',
                lineHeight: 1.1,
              }}
            >
              {card.oldText}
            </strong>
          </div>
          {/* ≠ */}
          <div
            style={{
              color: '#b8832d',
              fontFamily: '"JetBrains Mono", SFMono-Regular, Menlo, monospace',
              fontSize: 132,
              fontWeight: 900,
              lineHeight: 1,
              textAlign: 'center',
              opacity: neqOpacity,
              transform: `scale(${neqScale})`,
            }}
          >
            ≠
          </div>
          {/* new box */}
          <div
            style={{
              background: '#0f2747',
              border: '6px solid #b8832d',
              boxShadow: '0 3px 0 rgba(15,39,71,0.04)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '72px 78px',
              opacity: newOpacity,
              transform: `translateY(${newY}px)`,
            }}
          >
            <strong
              style={{
                color: '#b8832d',
                fontSize: 96,
                fontWeight: 900,
                letterSpacing: '-0.06em',
                lineHeight: 1.1,
              }}
            >
              {card.newText}
            </strong>
          </div>
        </div>
        {/* explain */}
        <div
          style={{
            position: 'absolute',
            bottom: 216,
            left: 90,
            right: 90,
            color: '#0f2747',
            fontSize: 51,
            fontWeight: 850,
            lineHeight: 1.45,
            textAlign: 'center',
            zIndex: 3,
            opacity: explainOpacity,
            transform: `translateY(${explainY}px)`,
          }}
        >
          {card.explain}
        </div>
      </CardShell>
    </div>
  );
}
