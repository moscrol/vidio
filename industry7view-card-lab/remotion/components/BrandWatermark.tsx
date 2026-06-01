import { AbsoluteFill } from 'remotion';

/**
 * 全程右下品牌角标，避开抖音 UI（点赞按钮约在右下 220-460px 高度区）。
 * 放在右上更安全；这里走右上避开点赞 + 评论 + 分享按钮。
 */
export function BrandWatermark({ brand, slug }: { brand: string; slug: string }) {
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <div
        style={{
          position: 'absolute',
          top: 56,
          right: 56,
          padding: '12px 20px',
          background: 'rgba(15, 39, 71, 0.78)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          borderRadius: 10,
          color: '#ffffff',
          fontFamily: '"Inter", "Noto Sans SC", system-ui, sans-serif',
          fontSize: 24,
          fontWeight: 700,
          letterSpacing: '0.08em',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <span style={{ width: 8, height: 8, background: '#b8832d', borderRadius: 2 }} />
        <span>{brand}</span>
      </div>
      {slug ? (
        <div
          style={{
            position: 'absolute',
            top: 108,
            right: 56,
            padding: '6px 12px',
            background: 'rgba(255, 255, 255, 0.92)',
            borderRadius: 6,
            color: '#0f2747',
            fontFamily: '"JetBrains Mono", "Inter", monospace',
            fontSize: 16,
            fontWeight: 600,
            letterSpacing: '0.04em',
          }}
        >
          /{slug}
        </div>
      ) : null}
    </AbsoluteFill>
  );
}
