import { interpolate, useCurrentFrame } from 'remotion';
import { ease } from './motion';
import { CardShell } from './CardShell';
import type { DataHeroCard, Segment } from './types';

/**
 * DataHero 卡：与静态 PNG 02-data-hero 对齐
 * - 白色 panel inside 卡片，整体保持品牌底盘
 * - small-label (gold mono) → number-row (大金色数字 + navy 单位) → label → compare pill → insight (navy bg)
 * - 保留全局 rail（深色版式可视化好）
 */
export function DataHeroMotion({ segment, card }: { segment: Segment; card: DataHeroCard }) {
  const frame = useCurrentFrame();
  const duration = segment.durationInFrames;
  const opacity = interpolate(frame, [0, 10, Math.max(duration - 8, 11), duration], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const numberProgress = ease(frame, [8, 42], [0, 1]);
  const numberMatch = String(card.number || '').match(/(\d+(?:\.\d+)?)([^\d.]*)/);
  const parsedNumber = Number(numberMatch?.[1] || 0);
  const numberSuffix = numberMatch?.[2] || '';
  const animatedNumber = parsedNumber
    ? `${Math.max(1, Math.round(parsedNumber * numberProgress))}${numberSuffix}`
    : card.number;

  const unitOpacity = ease(frame, [24, 42], [0, 1]);
  const unitScale = ease(frame, [24, 42], [0.82, 1]);
  const labelY = ease(frame, [44, 64], [18, 0]);
  const labelOpacity = ease(frame, [42, 62], [0, 1]);
  const compareOpacity = ease(frame, [56, 76], [0, 1]);
  const insightY = ease(frame, [70, 92], [22, 0]);
  const insightOpacity = ease(frame, [68, 88], [0, 1]);

  return (
    <div style={{ width: '100%', height: '100%', opacity }}>
      <CardShell tag={card.tag} footer={card.footer} showRail={true}>
        {/* main panel */}
        <div
          style={{
            position: 'absolute',
            top: 366,
            left: 90,
            right: 90,
            bottom: 354,
            background: 'rgba(255,255,255,0.94)',
            border: '3px solid rgba(15,39,71,0.13)',
            padding: '108px 84px 90px',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 2,
          }}
        >
          {/* small label */}
          <div
            style={{
              color: '#b8832d',
              fontFamily: '"JetBrains Mono", SFMono-Regular, Menlo, monospace',
              fontSize: 36,
              fontWeight: 900,
              letterSpacing: '0.12em',
            }}
          >
            {card.meta || 'DATA / 关键指标'}
          </div>

          {/* number row */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 30, marginTop: 78 }}>
            <div
              style={{
                color: '#b8832d',
                fontFamily: '"JetBrains Mono", SFMono-Regular, Menlo, monospace',
                fontSize: 192,
                fontWeight: 900,
                letterSpacing: '-0.1em',
                lineHeight: 0.92,
              }}
            >
              {animatedNumber}
            </div>
            <div
              style={{
                color: '#0f2747',
                fontSize: 78,
                fontWeight: 900,
                letterSpacing: '-0.05em',
                lineHeight: 1,
                paddingBottom: 21,
                opacity: unitOpacity,
                transform: `scale(${unitScale})`,
                transformOrigin: 'left bottom',
                whiteSpace: 'nowrap',
              }}
            >
              {card.unit}
            </div>
          </div>

          {/* label */}
          <div
            style={{
              color: '#0f2747',
              fontSize: 69,
              fontWeight: 900,
              letterSpacing: '-0.05em',
              lineHeight: 1.25,
              marginTop: 72,
              opacity: labelOpacity,
              transform: `translateY(${labelY}px)`,
            }}
          >
            {card.label}
          </div>

          {/* compare pill */}
          {card.compareText && (
            <div
              style={{
                background: '#fff7e6',
                border: '3px solid #f0c46c',
                color: '#b8832d',
                display: 'inline-flex',
                fontFamily: '"JetBrains Mono", SFMono-Regular, Menlo, monospace',
                fontSize: 36,
                fontWeight: 900,
                marginTop: 60,
                padding: '27px 33px',
                alignSelf: 'flex-start',
                opacity: compareOpacity,
              }}
            >
              {card.compareText}
            </div>
          )}

          {/* insight */}
          {card.insight && (
            <div
              style={{
                background: '#0f2747',
                color: '#fff',
                fontSize: 57,
                fontWeight: 900,
                lineHeight: 1.35,
                marginTop: 66,
                padding: '48px 54px',
                opacity: insightOpacity,
                transform: `translateY(${insightY}px)`,
              }}
            >
              {card.insight}
            </div>
          )}
        </div>
      </CardShell>
    </div>
  );
}
