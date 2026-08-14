import { interpolate, useCurrentFrame } from 'remotion';
import { ease, elasticSpring } from './motion';
import { CardShell } from './CardShell';
import type { Segment, SupplyChainShiftCard } from './types';

/**
 * SupplyChainShift 卡：与静态 PNG 09-supply-chain-shift 对齐
 * - 标题左上 anchor + 金色短横下划线
 * - shift-flow（from→to 横向）
 * - shift-drivers-box 列表（gold dots）
 * - shift-result-box（蓝色背景 + 金色左边条）
 * - 隐藏 rail
 */
export function SupplyChainShiftMotion({ segment, card }: { segment: Segment; card: SupplyChainShiftCard }) {
  const frame = useCurrentFrame();
  const duration = segment.durationInFrames;
  const drivers = card.drivers || [];

  const opacity = interpolate(frame, [0, 10, Math.max(duration - 8, 11), duration], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const titleSpring = elasticSpring(frame, 4);
  const titleY = interpolate(titleSpring, [0, 1], [24, 0]);
  const titleOpacity = interpolate(titleSpring, [0, 1], [0, 1]);
  const fromX = ease(frame, [12, 32], [-50, 0]);
  const fromOpacity = ease(frame, [12, 32], [0, 1]);
  const arrowOpacity = ease(frame, [28, 48], [0, 1]);
  const arrowScale = ease(frame, [28, 48], [0.5, 1]);
  const toX = ease(frame, [38, 58], [50, 0]);
  const toOpacity = ease(frame, [38, 58], [0, 1]);
  const resultOpacity = ease(frame, [80 + drivers.length * 8, 100 + drivers.length * 8], [0, 1]);
  const resultY = ease(frame, [80 + drivers.length * 8, 100 + drivers.length * 8], [16, 0]);

  return (
    <div style={{ width: '100%', height: '100%', opacity }}>
      <CardShell tag={card.tag} footer={card.footer} showRail={false}>
        {/* 标题 */}
        <div
          style={{
            position: 'absolute',
            top: 300,
            left: 96,
            right: 84,
            color: '#0f2747',
            fontSize: 72,
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

        {/* shift-flow */}
        <div
          style={{
            position: 'absolute',
            top: 522,
            left: 96,
            right: 96,
            display: 'flex',
            alignItems: 'center',
            gap: 30,
            zIndex: 2,
          }}
        >
          {/* from */}
          <div
            style={{
              flex: 1,
              padding: '42px 42px',
              border: '6px solid rgba(15,39,71,0.18)',
              minHeight: 234,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              background: '#f9fafb',
              color: '#5f6b7a',
              opacity: fromOpacity,
              transform: `translateX(${fromX}px)`,
            }}
          >
            <div
              style={{
                fontFamily: '"JetBrains Mono", SFMono-Regular, Menlo, monospace',
                fontSize: 30,
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                opacity: 0.6,
                marginBottom: 12,
              }}
            >
              FROM
            </div>
            <div style={{ fontSize: 57, fontWeight: 900, letterSpacing: '-0.03em' }}>{card.from}</div>
          </div>
          {/* arrow */}
          <div
            style={{
              fontSize: 84,
              color: '#b8832d',
              fontWeight: 900,
              lineHeight: 1,
              opacity: arrowOpacity,
              transform: `scale(${arrowScale})`,
            }}
          >
            →
          </div>
          {/* to */}
          <div
            style={{
              flex: 1,
              padding: '42px 42px',
              border: '6px solid #b8832d',
              minHeight: 234,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              background: '#0f2747',
              color: '#fff',
              opacity: toOpacity,
              transform: `translateX(${toX}px)`,
            }}
          >
            <div
              style={{
                fontFamily: '"JetBrains Mono", SFMono-Regular, Menlo, monospace',
                fontSize: 30,
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                opacity: 0.6,
                marginBottom: 12,
              }}
            >
              TO
            </div>
            <div style={{ fontSize: 57, fontWeight: 900, letterSpacing: '-0.03em' }}>{card.to}</div>
          </div>
        </div>

        {/* drivers */}
        <div style={{ position: 'absolute', top: 846, left: 96, right: 96, zIndex: 2 }}>
          <div
            style={{
              fontFamily: '"JetBrains Mono", SFMono-Regular, Menlo, monospace',
              fontSize: 30,
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: '#0f2747',
              opacity: 0.6,
              borderBottom: '3px solid rgba(15,39,71,0.14)',
              paddingBottom: 12,
              marginBottom: 30,
            }}
          >
            SHIFT DRIVERS
          </div>
          <div style={{ display: 'grid', gap: 30 }}>
            {drivers.map((driver, index) => {
              const startFrame = 60 + index * 8;
              const itemOpacity = ease(frame, [startFrame, startFrame + 18], [0, 1]);
              const itemX = ease(frame, [startFrame, startFrame + 18], [-20, 0]);
              return (
                <div
                  key={`${driver}-${index}`}
                  style={{
                    fontSize: 45,
                    fontWeight: 800,
                    color: '#0f2747',
                    display: 'flex',
                    gap: 24,
                    lineHeight: 1.35,
                    opacity: itemOpacity,
                    transform: `translateX(${itemX}px)`,
                  }}
                >
                  <span style={{ color: '#b8832d', fontWeight: 900 }}>•</span>
                  <span>{driver}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* result */}
        {card.result && (
          <div
            style={{
              position: 'absolute',
              left: 96,
              right: 96,
              bottom: 270,
              background: '#eef4ff',
              borderLeft: '9px solid #b8832d',
              padding: '36px 42px',
              zIndex: 2,
              opacity: resultOpacity,
              transform: `translateY(${resultY}px)`,
            }}
          >
            <div style={{ color: '#0f2747', fontSize: 45, fontWeight: 850, lineHeight: 1.4 }}>
              {card.result}
            </div>
          </div>
        )}
      </CardShell>
    </div>
  );
}
