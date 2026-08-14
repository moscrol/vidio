import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';

export type OutroData = {
  brand: string;
  ctaPrimary: string;
  ctaSecondary: string;
};

/**
 * 片尾品牌引导：只露品牌 + 关注引导，不出具体 slug。
 * 节奏：0-0.4s 渐入；中段稳定；最后 0.3s 微退场。
 */
export function OutroSequence({ data, durationInFrames }: { data: OutroData; durationInFrames: number }) {
  const frame = useCurrentFrame();

  const enterOpacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const enterY = interpolate(frame, [0, 16], [30, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const exitStart = Math.max(durationInFrames - 9, 1);
  const exitOpacity = interpolate(frame, [exitStart, durationInFrames], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // 金色下划线生长
  const lineWidth = interpolate(frame, [10, 28], [0, 320], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        background: '#0f2747',
        opacity: enterOpacity * exitOpacity,
        justifyContent: 'center',
        alignItems: 'center',
        padding: '0 80px',
      }}
    >
      {/* 品牌大字 */}
      <div
        style={{
          color: '#ffffff',
          fontFamily: '"Inter", "Noto Sans SC", sans-serif',
          fontSize: 86,
          fontWeight: 800,
          letterSpacing: '0.06em',
          textAlign: 'center',
          transform: `translateY(${enterY}px)`,
          display: 'flex',
          alignItems: 'center',
          gap: 24,
        }}
      >
        <span style={{ width: 22, height: 22, background: '#b8832d', borderRadius: 4 }} />
        {data.brand}
      </div>

      {/* 金色下划线 */}
      <div
        style={{
          marginTop: 28,
          width: lineWidth,
          height: 4,
          background: '#b8832d',
          borderRadius: 2,
        }}
      />

      {/* 主 CTA */}
      <div
        style={{
          marginTop: 80,
          color: '#ffffff',
          fontFamily: '"Noto Sans SC", system-ui, sans-serif',
          fontSize: 56,
          fontWeight: 800,
          lineHeight: 1.3,
          textAlign: 'center',
          transform: `translateY(${enterY}px)`,
        }}
      >
        {data.ctaPrimary}
      </div>

      {/* 次要 CTA */}
      <div
        style={{
          marginTop: 32,
          color: '#d4dae4',
          fontFamily: '"Noto Sans SC", system-ui, sans-serif',
          fontSize: 34,
          fontWeight: 500,
          lineHeight: 1.5,
          textAlign: 'center',
          transform: `translateY(${enterY}px)`,
        }}
      >
        {data.ctaSecondary}
      </div>
    </AbsoluteFill>
  );
}
