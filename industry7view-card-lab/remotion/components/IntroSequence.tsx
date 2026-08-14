import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';

export type IntroData = {
  brand: string;
  kicker: string;
  titleHtml: string;
  subtitle: string;
  badge: string;
};

/**
 * 片头封面：纯静态封面停留 1.0s，最后 0.5s 渐隐过渡到口播主体。
 * 用于抖音前 3 秒识别 / B 站封面停顿。
 */
export function IntroSequence({ data, durationInFrames }: { data: IntroData; durationInFrames: number }) {
  const frame = useCurrentFrame();

  const titleOpacity = interpolate(frame, [0, 8], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const titleY = interpolate(frame, [0, 12], [24, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const exitStart = Math.max(durationInFrames - 12, 1);
  const exitOpacity = interpolate(frame, [exitStart, durationInFrames], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        background: '#0f2747',
        opacity: exitOpacity,
        justifyContent: 'center',
        alignItems: 'center',
        padding: '0 80px',
      }}
    >
      {/* 顶部 kicker */}
      <div
        style={{
          position: 'absolute',
          top: 220,
          left: 0,
          right: 0,
          textAlign: 'center',
          color: '#b8832d',
          fontFamily: '"Inter", "JetBrains Mono", monospace',
          fontSize: 28,
          fontWeight: 700,
          letterSpacing: '0.18em',
          opacity: titleOpacity,
        }}
      >
        {data.kicker}
      </div>

      {/* 主标题 */}
      <div
        style={{
          color: '#ffffff',
          fontFamily: '"Noto Serif SC", "Noto Sans SC", serif',
          fontSize: 110,
          fontWeight: 800,
          lineHeight: 1.18,
          letterSpacing: '0.01em',
          textAlign: 'center',
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
        }}
        dangerouslySetInnerHTML={{ __html: data.titleHtml }}
      />

      {/* 副标题 */}
      <div
        style={{
          marginTop: 40,
          color: '#d4dae4',
          fontFamily: '"Noto Sans SC", system-ui, sans-serif',
          fontSize: 38,
          fontWeight: 500,
          lineHeight: 1.45,
          textAlign: 'center',
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
        }}
      >
        {data.subtitle}
      </div>

      {/* 底部品牌 */}
      <div
        style={{
          position: 'absolute',
          bottom: 280,
          left: 0,
          right: 0,
          textAlign: 'center',
          opacity: titleOpacity,
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 14,
            padding: '14px 28px',
            background: 'rgba(184, 131, 45, 0.18)',
            border: '1px solid rgba(184, 131, 45, 0.5)',
            borderRadius: 8,
            color: '#b8832d',
            fontFamily: '"Inter", "Noto Sans SC", sans-serif',
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: '0.16em',
          }}
        >
          <span style={{ width: 10, height: 10, background: '#b8832d', borderRadius: 2 }} />
          {data.brand}
        </div>
      </div>
    </AbsoluteFill>
  );
}
