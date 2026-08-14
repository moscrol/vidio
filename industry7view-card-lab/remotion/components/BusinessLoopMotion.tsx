import { interpolate, useCurrentFrame } from 'remotion';
import { ease, elasticSpring } from './motion';
import { CardShell } from './CardShell';
import type { BusinessLoopCard, Segment } from './types';

/**
 * BusinessLoop 卡：与静态 PNG loop 静态版对齐
 * - 标题左上 anchor + 金色短横下划线
 * - step 列表纵向排列：左金色边条 + 编号 + 文本，最后一行高亮 (data-bg)
 * - 隐藏 rail
 */
export function BusinessLoopMotion({ segment, card }: { segment: Segment; card: BusinessLoopCard }) {
  const frame = useCurrentFrame();
  const duration = segment.durationInFrames;
  const steps = card.steps || [];

  const opacity = interpolate(frame, [0, 10, Math.max(duration - 8, 11), duration], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const titleSpring = elasticSpring(frame, 4);
  const titleY = interpolate(titleSpring, [0, 1], [24, 0]);
  const titleOpacity = interpolate(titleSpring, [0, 1], [0, 1]);

  return (
    <div style={{ width: '100%', height: '100%', opacity }}>
      <CardShell tag={card.tag} footer={card.footer} showRail={false}>
        {/* 标题 */}
        <div
          style={{
            position: 'absolute',
            top: 258,
            left: 96,
            right: 96,
            color: '#0f2747',
            fontSize: 84,
            fontWeight: 900,
            lineHeight: 1.18,
            letterSpacing: '-0.05em',
            zIndex: 2,
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
          }}
        >
          {card.title}
          <div style={{ background: '#b8832d', height: 9, marginTop: 36, width: 96 }} />
        </div>

        {/* loop-list */}
        <div
          style={{
            position: 'absolute',
            top: 540,
            left: 96,
            right: 96,
            display: 'grid',
            gap: 24,
            zIndex: 2,
          }}
        >
          {steps.map((step, index) => {
            const startFrame = 22 + index * 10;
            const stepSpring = elasticSpring(frame, startFrame, 30, 90, 18, 0.85);
            const stepOpacity = interpolate(stepSpring, [0, 1], [0, 1]);
            const stepX = interpolate(stepSpring, [0, 1], [-32, 0]);
            const isFinal = index === steps.length - 1;

            return (
              <div
                key={`${step}-${index}`}
                style={{
                  alignItems: 'center',
                  background: isFinal ? '#fff7e6' : 'rgba(255,255,255,0.96)',
                  border: isFinal ? '3px solid #f0c46c' : '3px solid rgba(15,39,71,0.16)',
                  borderLeft: '9px solid rgba(184,131,45,0.6)',
                  display: 'grid',
                  gap: 36,
                  gridTemplateColumns: '120px 1fr',
                  minHeight: 156,
                  padding: '30px 42px',
                  opacity: stepOpacity,
                  transform: `translateX(${stepX}px)`,
                }}
              >
                <span
                  style={{
                    color: '#b8832d',
                    fontFamily: '"JetBrains Mono", SFMono-Regular, Menlo, monospace',
                    fontSize: 45,
                    fontWeight: 900,
                  }}
                >
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span
                  style={{
                    color: '#0f2747',
                    fontSize: 54,
                    fontWeight: 900,
                    letterSpacing: '-0.03em',
                  }}
                >
                  {step}
                </span>
              </div>
            );
          })}
        </div>
      </CardShell>
    </div>
  );
}
