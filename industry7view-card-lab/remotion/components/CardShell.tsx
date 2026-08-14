import type React from 'react';
import { AbsoluteFill } from 'remotion';

/**
 * 复用静态卡片的"底盘"：paper 底色 + 网格背景 + brand-row + bottom-note。
 * 单位以 1080×1920 画布为基准（=静态卡 360×640 的 3 倍）。
 *
 * 使用方法：把每张卡片的 Motion 内容当作 children，CardShell 负责一致的外壳。
 */
export type CardShellProps = {
  tag?: string;
  footer?: string;
  /** 是否显示左侧金色竖线（rail）。静态版在 cover/checklist/compare/loop/orderValidation/supplyChainShift 上隐藏 */
  showRail?: boolean;
  /** 是否使用深色版（cover/quote） */
  dark?: boolean;
  children: React.ReactNode;
};

export function CardShell({ tag, footer, showRail = true, dark = false, children }: CardShellProps) {
  const navy = '#0f2747';
  const gold = '#b8832d';
  const paper = '#fbfaf7';

  return (
    <AbsoluteFill
      style={{
        background: dark
          ? 'radial-gradient(circle at 80% 20%, rgba(184,131,45,0.12), transparent 28%), linear-gradient(180deg, #102744 0%, #0a1e38 100%)'
          : paper,
        color: dark ? '#fff' : navy,
        fontFamily: 'Inter, "Noto Sans SC", "PingFang SC", "Microsoft YaHei", system-ui, sans-serif',
        WebkitFontSmoothing: 'antialiased',
        overflow: 'hidden',
      }}
    >
      {/* 网格背景 (相当于 .video-card::before) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: dark
            ? 'linear-gradient(rgba(255,255,255,0.034) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.034) 1px, transparent 1px)'
            : 'linear-gradient(rgba(15,39,71,0.052) 1px, transparent 1px), linear-gradient(90deg, rgba(15,39,71,0.052) 1px, transparent 1px)',
          backgroundSize: '108px 108px',
          opacity: 0.78,
          pointerEvents: 'none',
        }}
      />
      {/* 金色竖线 rail (相当于 .video-card::after) */}
      {showRail && (
        <div
          style={{
            position: 'absolute',
            left: 84,
            top: 276,
            bottom: 234,
            width: 6,
            background: `linear-gradient(180deg, ${gold}, rgba(184,131,45,0.08))`,
            zIndex: 1,
          }}
        />
      )}
      {/* brand-row */}
      <div
        style={{
          position: 'absolute',
          top: 78,
          left: 84,
          right: 84,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 3,
        }}
      >
        <div
          style={{
            background: dark ? 'transparent' : navy,
            border: dark ? '3px solid rgba(184,131,45,0.40)' : `3px solid ${navy}`,
            color: dark ? 'rgba(255,255,255,0.74)' : '#fff',
            display: 'inline-flex',
            alignItems: 'center',
            fontSize: 36,
            fontWeight: 800,
            letterSpacing: '0.08em',
            padding: '24px 33px',
          }}
        >
          {tag}
        </div>
        <div
          style={{
            color: dark ? 'rgba(255,255,255,0.54)' : navy,
            fontFamily: '"JetBrains Mono", SFMono-Regular, Menlo, monospace',
            fontSize: 30,
            fontWeight: 800,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}
        >
          INDUSTRY 7VIEW
        </div>
      </div>
      {/* 内容区 */}
      {children}
      {/* bottom-note */}
      {footer && (
        <div
          style={{
            position: 'absolute',
            bottom: 78,
            left: 78,
            right: 78,
            color: dark ? 'rgba(255,255,255,0.65)' : '#5f6b7a',
            fontSize: 33,
            fontWeight: 700,
            lineHeight: 1.45,
            borderTop: dark ? '1px solid rgba(255,255,255,0.16)' : '1px solid rgba(15,39,71,0.14)',
            paddingTop: 36,
            zIndex: 3,
          }}
        >
          {footer}
        </div>
      )}
    </AbsoluteFill>
  );
}
