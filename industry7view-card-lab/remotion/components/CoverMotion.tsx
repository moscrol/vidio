import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { ease, elasticSpring } from './motion';
import { backgroundStyle } from './styles';
import type { Segment } from './types';

export type CoverCard = {
  id: string;
  type: 'cover';
  tag?: string;
  kicker?: string;
  titleHtml?: string;
  subtitle?: string;
  badge?: string;
  footer?: string;
};

export function CoverMotion({ segment, card }: { segment: Segment; card: CoverCard }) {
  const frame = useCurrentFrame();
  const duration = segment.durationInFrames;
  
  const opacity = interpolate(frame, [0, 10, Math.max(duration - 8, 11), duration], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  
  const shellSpring = elasticSpring(frame, 0);
  const shellY = interpolate(shellSpring, [0, 1], [30, 0]);
  const shellScale = interpolate(shellSpring, [0, 1], [0.98, 1]);

  const titleSpring = elasticSpring(frame, 8, 30, 90, 16, 0.85);
  const titleY = interpolate(titleSpring, [0, 1], [34, 0]);
  const titleOpacity = interpolate(titleSpring, [0, 1], [0, 1]);

  const subtitleSpring = elasticSpring(frame, 22, 30, 90, 16, 0.85);
  const subtitleY = interpolate(subtitleSpring, [0, 1], [18, 0]);
  const subtitleOpacity = interpolate(subtitleSpring, [0, 1], [0, 1]);

  const kickerOpacity = ease(frame, [4, 18], [0, 0.6]);
  const gridShift = Math.sin(frame / 30) * 12;

  // Render HTML helper
  const renderTitle = (html?: string) => {
    if (!html) return '';
    return html.replace(/<br\s*\/?>/gi, '\n');
  };

  return (
    <AbsoluteFill style={backgroundStyle}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.24,
          backgroundImage:
            'linear-gradient(rgba(184,131,45,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(184,131,45,0.06) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          transform: `translate(${gridShift}px, ${gridShift * 0.5}px)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 72,
          borderRadius: 42,
          background: '#0f2747',
          border: '4px solid #b8832d',
          boxShadow: '0 34px 90px rgba(15,39,71,0.28)',
          opacity,
          transform: `translateY(${shellY}px) scale(${shellScale})`,
          padding: 58,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          overflow: 'hidden',
          color: '#ffffff',
        }}
      >
        <div>
          <div style={{ color: '#b8832d', fontSize: 24, fontWeight: 900, letterSpacing: 4, opacity: kickerOpacity }}>
            {card.kicker || 'INDUSTRY 7VIEW'}
          </div>
          <div
            style={{
              color: '#ffffff',
              fontSize: 62,
              fontWeight: 950,
              lineHeight: 1.15,
              letterSpacing: -2,
              marginTop: 48,
              opacity: titleOpacity,
              transform: `translateY(${titleY}px)`,
              whiteSpace: 'pre-line',
            }}
          >
            {renderTitle(card.titleHtml)}
          </div>
          <div
            style={{
              color: 'rgba(255, 255, 255, 0.72)',
              fontSize: 28,
              fontWeight: 800,
              lineHeight: 1.45,
              marginTop: 34,
              opacity: subtitleOpacity,
              transform: `translateY(${subtitleY}px)`,
            }}
          >
            {card.subtitle}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ color: '#b8832d', fontSize: 24, fontWeight: 900, fontFamily: 'monospace' }}>
            {card.badge || 'REPORT'}
          </div>
          <div style={{ color: 'rgba(255, 255, 255, 0.4)', fontSize: 24, fontWeight: 700 }}>
            {card.footer}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
}
