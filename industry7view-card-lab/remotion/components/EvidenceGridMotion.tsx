import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { ease, elasticSpring } from './motion';
import { backgroundStyle } from './styles';
import type { Segment } from './types';

export type EvidenceGridCard = {
  id: string;
  type: 'evidenceGrid';
  tag?: string;
  meta?: string;
  titleHtml?: string;
  subtitle?: string;
  evidences?: Array<{
    label: string;
    value: string;
  }>;
  footer?: string;
};

export function EvidenceGridMotion({ segment, card }: { segment: Segment; card: EvidenceGridCard }) {
  const frame = useCurrentFrame();
  const duration = segment.durationInFrames;
  const evidences = card.evidences || [];
  
  const opacity = interpolate(frame, [0, 10, Math.max(duration - 8, 11), duration], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  
  const shellSpring = elasticSpring(frame, 0);
  const shellY = interpolate(shellSpring, [0, 1], [30, 0]);
  const shellScale = interpolate(shellSpring, [0, 1], [0.98, 1]);

  const titleSpring = elasticSpring(frame, 4);
  const titleY = interpolate(titleSpring, [0, 1], [24, 0]);
  const titleOpacity = interpolate(titleSpring, [0, 1], [0, 1]);

  const footerOpacity = ease(frame, [120, 144], [0, 1]);
  const gridShift = Math.sin(frame / 24) * 8;

  // Render title with potential gold span
  const renderTitle = (html?: string) => {
    if (!html) return null;
    const parts = html.split(/<span class="gold">|<\/span>/gi);
    if (parts.length === 1) {
      return html.replace(/<br\s*\/?>/gi, '\n');
    }
    return (
      <div style={{ whiteSpace: 'pre-line' }}>
        {parts.map((part, i) => {
          const isGold = i % 2 === 1;
          const cleanPart = part.replace(/<br\s*\/?>/gi, '\n');
          return (
            <span key={i} style={{ color: isGold ? '#b8832d' : '#0f2747' }}>
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
          opacity: 0.2,
          backgroundImage:
            'linear-gradient(rgba(15,39,71,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(15,39,71,0.08) 1px, transparent 1px)',
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
          <div
            style={{
              color: '#0f2747',
              fontSize: 54,
              fontWeight: 900,
              lineHeight: 1.12,
              letterSpacing: -2,
              marginTop: 22,
              opacity: titleOpacity,
              transform: `translateY(${titleY}px)`,
            }}
          >
            {renderTitle(card.titleHtml)}
          </div>
          {card.subtitle && (
            <div style={{ color: '#6b7280', fontSize: 22, fontWeight: 700, marginTop: 14, lineHeight: 1.4 }}>
              {card.subtitle}
            </div>
          )}
        </div>

        {/* 2x2 Evidence Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, margin: '20px 0' }}>
          {evidences.map((item, index) => {
            const startFrame = 18 + index * 10;
            const itemSpring = elasticSpring(frame, startFrame, 30, 95, 16, 0.85);
            const itemOpacity = interpolate(itemSpring, [0, 1], [0, 1]);
            const itemScale = interpolate(itemSpring, [0, 1], [0.94, 1]);

            return (
              <div
                key={`${item.label}-${index}`}
                style={{
                  background: '#f9fafb',
                  border: '2px solid rgba(15, 39, 71, 0.14)',
                  padding: '24px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  textAlign: 'center',
                  minHeight: 130,
                  opacity: itemOpacity,
                  transform: `scale(${itemScale})`,
                }}
              >
                <div style={{ fontSize: 18, fontWeight: 800, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 1 }}>
                  {item.label}
                </div>
                <div style={{ fontSize: 30, fontWeight: 950, color: '#0f2747', marginTop: 8, letterSpacing: -0.5 }}>
                  {item.value}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ color: '#8a94a6', fontSize: 24, fontWeight: 700, opacity: footerOpacity }}>
          {card.footer}
        </div>
      </div>
    </AbsoluteFill>
  );
}
