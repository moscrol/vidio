import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { ease, elasticSpring } from './motion';
import { backgroundStyle } from './styles';
import type { Segment } from './types';

export type LogisticsCard = {
  id: string;
  type: 'logistics';
  tag?: string;
  meta?: string;
  titleHtml?: string;
  subtitle?: string;
  footer?: string;
};

export function LogisticsMotion({ segment, card }: { segment: Segment; card: LogisticsCard }) {
  const frame = useCurrentFrame();
  const duration = segment.durationInFrames;
  
  const opacity = interpolate(frame, [0, 10, Math.max(duration - 8, 11), duration], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  
  const shellSpring = elasticSpring(frame, 0);
  const shellY = interpolate(shellSpring, [0, 1], [30, 0]);
  const shellScale = interpolate(shellSpring, [0, 1], [0.98, 1]);

  const titleSpring = elasticSpring(frame, 6, 30, 95, 15, 0.85);
  const titleY = interpolate(titleSpring, [0, 1], [28, 0]);
  const titleOpacity = interpolate(titleSpring, [0, 1], [0, 1]);

  const subtitleSpring = elasticSpring(frame, 20, 30, 90, 17, 0.85);
  const subtitleY = interpolate(subtitleSpring, [0, 1], [18, 0]);
  const subtitleOpacity = interpolate(subtitleSpring, [0, 1], [0, 1]);

  const footerOpacity = ease(frame, [110, 134], [0, 1]);
  const gridShift = Math.sin(frame / 26) * 10;

  // Render title with potential risk span
  const renderTitle = (html?: string) => {
    if (!html) return null;
    const parts = html.split(/<span class="risk">|<\/span>/gi);
    if (parts.length === 1) {
      return html.replace(/<br\s*\/?>/gi, '\n');
    }
    return (
      <div style={{ whiteSpace: 'pre-line' }}>
        {parts.map((part, i) => {
          const isRisk = i % 2 === 1;
          const cleanPart = part.replace(/<br\s*\/?>/gi, '\n');
          return (
            <span key={i} style={{ color: isRisk ? '#e53935' : '#0f2747' }}>
              {cleanPart}
            </span>
          );
        })}
      </div>
    );
  };

  return (
    <AbsoluteFill style={backgroundStyle}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.22,
          backgroundImage:
            'linear-gradient(rgba(15,39,71,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(15,39,71,0.06) 1px, transparent 1px)',
          backgroundSize: '58px 58px',
          transform: `translate(${gridShift}px, ${gridShift * 0.5}px)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 72,
          borderRadius: 42,
          background: '#ffffff',
          boxShadow: '0 34px 90px rgba(15,39,71,0.16)',
          opacity,
          transform: `translateY(${shellY}px) scale(${shellScale})`,
          padding: 58,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          overflow: 'hidden',
        }}
      >
        <div>
          <div style={{ color: '#b8832d', fontSize: 28, fontWeight: 800, letterSpacing: 4 }}>{card.tag}</div>
          <div style={{ color: '#6b7280', fontSize: 24, fontWeight: 700, marginTop: 18 }}>{card.meta}</div>
          <div
            style={{
              fontSize: 58,
              fontWeight: 950,
              lineHeight: 1.15,
              letterSpacing: -2,
              marginTop: 48,
              opacity: titleOpacity,
              transform: `translateY(${titleY}px)`,
            }}
          >
            {renderTitle(card.titleHtml)}
          </div>
          <div
            style={{
              color: '#4b5563',
              fontSize: 28,
              fontWeight: 800,
              lineHeight: 1.5,
              marginTop: 34,
              opacity: subtitleOpacity,
              transform: `translateY(${subtitleY}px)`,
            }}
          >
            {card.subtitle}
          </div>
        </div>

        <div style={{ color: '#8a94a6', fontSize: 24, fontWeight: 700, opacity: footerOpacity }}>
          {card.footer}
        </div>
      </div>
    </AbsoluteFill>
  );
}
