import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { ease, elasticSpring } from './motion';
import { backgroundStyle } from './styles';
import type { Segment } from './types';

export type ChecklistCard = {
  id: string;
  type: 'checklist';
  tag?: string;
  meta?: string;
  titleHtml?: string;
  items?: Array<{
    title: string;
    desc: string;
  }>;
  footer?: string;
};

export function ChecklistMotion({ segment, card }: { segment: Segment; card: ChecklistCard }) {
  const frame = useCurrentFrame();
  const duration = segment.durationInFrames;
  const items = card.items || [];
  
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
        </div>

        {/* Checklist Rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, margin: '20px 0' }}>
          {items.map((item, index) => {
            const startFrame = 18 + index * 12;
            const itemSpring = elasticSpring(frame, startFrame, 30, 95, 17, 0.8);
            const itemOpacity = interpolate(itemSpring, [0, 1], [0, 1]);
            const itemX = interpolate(itemSpring, [0, 1], [-24, 0]);

            return (
              <div
                key={`${item.title}-${index}`}
                style={{
                  background: 'rgba(255, 255, 255, 0.94)',
                  border: '2px solid rgba(15, 39, 71, 0.14)',
                  padding: '16px 24px',
                  display: 'grid',
                  gridTemplateColumns: '48px 1fr',
                  gap: 16,
                  alignItems: 'center',
                  opacity: itemOpacity,
                  transform: `translateX(${itemX}px)`,
                }}
              >
                <div
                  style={{
                    fontFamily: 'monospace',
                    fontSize: 22,
                    fontWeight: 900,
                    color: '#b8832d',
                  }}
                >
                  {String(index + 1).padStart(2, '0')}
                </div>
                <div>
                  <div style={{ fontSize: 26, fontWeight: 900, color: '#0f2747', letterSpacing: -0.5 }}>
                    {item.title}
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: '#6b7280', marginTop: 4, lineHeight: 1.3 }}>
                    {item.desc}
                  </div>
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
