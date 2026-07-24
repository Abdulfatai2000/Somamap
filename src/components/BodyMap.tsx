import React, { useState } from 'react';
import { BodySystem } from '@/lib/constants';

interface BodyMapProps {
  onRegionSelect: (region: BodySystem) => void;
  selectedRegion?: BodySystem | null;
  loggedCounts?: Record<string, number>;
  recentSeverityByRegion?: Record<string, { severity: number; occurredAt: string }>;
}

/**
 * Visual region state:
 *  selected  → indigo-500 fill, indigo-600 stroke
 *  has logs  → color-coded by most recent severity:
 *               low (1-3): amber, medium (4-6): orange, high (7-10): red
 *  default   → slate-50 fill, slate-200 stroke (always visible, not relying on hover alone)
 */
export function BodyMap({ onRegionSelect, selectedRegion, loggedCounts = {}, recentSeverityByRegion = {} }: BodyMapProps) {
  const [view, setView] = useState<'front' | 'back'>('front');

  const getSeverityColor = (severity: number): { fill: string; stroke: string } => {
    if (severity <= 3) return { fill: '#fef3c7', stroke: '#f59e0b' };
    if (severity <= 6) return { fill: '#ffedd5', stroke: '#f97316' };
    return { fill: '#fee2e2', stroke: '#ef4444' };
  };

  const regionsInView = view === 'front'
    ? (['head', 'chest', 'abdomen', 'left-arm', 'right-arm', 'left-leg', 'right-leg'] as BodySystem[])
    : (['head', 'back', 'left-arm', 'right-arm', 'left-leg', 'right-leg'] as BodySystem[]);

  const getRegionProps = (region: BodySystem) => {
    const isActive = selectedRegion === region;
    const hasLogs = (loggedCounts[region] || 0) > 0;
    const count = loggedCounts[region] || 0;
    const recent = recentSeverityByRegion[region];

    let fill: string, stroke: string;
    if (isActive)    { fill = '#6366f1'; stroke = '#4f46e5'; }
    else if (hasLogs && recent) {
      const sevColor = getSeverityColor(recent.severity);
      fill = sevColor.fill;
      stroke = sevColor.stroke;
    }
    else if (hasLogs){ fill = '#e0e7ff'; stroke = '#a5b4fc'; }
    else             { fill = '#f8fafc'; stroke = '#cbd5e1'; }

    return {
      fill,
      stroke,
      strokeWidth: isActive ? 2.5 : 1.5,
      style: { cursor: 'pointer', transition: 'fill 0.18s, stroke 0.18s' } as React.CSSProperties,
      onClick: () => onRegionSelect(region),
      'aria-label': `${region}${count ? ` (${count} log${count > 1 ? 's' : ''})` : ''} — tap to log symptom`,
    };
  };

  return (
    <div className="flex flex-col items-center w-full mx-auto p-5 sm:p-6 bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-100">
      {/* Front / Back toggle */}
      <div className="flex p-1 gap-1 mb-6 bg-slate-100 rounded-2xl w-full">
        {(['front', 'back'] as const).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
              view === v ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {v === 'front' ? 'Front' : 'Back'}
          </button>
        ))}
      </div>

      {/* Region label hint */}
      <p className="text-[11px] font-medium text-slate-400 mb-3 tracking-wide uppercase">
        Tap a region to log a symptom
      </p>

      {/* SVG body map — inline fills so resting-state borders always appear in recordings */}
      <div className="relative w-full max-w-[220px] mx-auto">
        <svg
          viewBox="0 0 240 480"
          className="w-full h-auto overflow-visible"
          aria-label="Body map"
          role="img"
        >
          {/* ── Head ─────────────────────────────────────────────────────── */}
          <circle cx="120" cy="50" r="36" {...getRegionProps('head')} />

          {/* ── Neck connector ───────────────────────────────────────────── */}
          <rect x="108" y="84" width="24" height="14" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />

          {view === 'front' ? (
            <>
              {/* Chest */}
              <path d="M 82 98 L 158 98 L 148 182 L 92 182 Z" {...getRegionProps('chest')} />
              {/* Abdomen */}
              <path d="M 92 182 L 148 182 L 143 262 L 97 262 Z" {...getRegionProps('abdomen')} />
            </>
          ) : (
            /* Back — spans chest+abdomen height */
            <path d="M 82 98 L 158 98 L 143 262 L 97 262 Z" {...getRegionProps('back')} />
          )}

          {/* ── Arms ─────────────────────────────────────────────────────── */}
          {/* Patient's right arm (screen left) */}
          <path d="M 82 98 L 42 228 L 60 228 L 88 148 Z" {...getRegionProps('right-arm')} />
          {/* Patient's left arm (screen right) */}
          <path d="M 158 98 L 198 228 L 180 228 L 152 148 Z" {...getRegionProps('left-arm')} />

          {/* ── Hips connector ───────────────────────────────────────────── */}
          <path d="M 97 262 L 143 262 L 148 282 L 92 282 Z" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />

          {/* ── Legs ─────────────────────────────────────────────────────── */}
          {/* Patient's right leg (screen left) */}
          <path d="M 92 282 L 76 444 L 110 444 L 118 282 Z" {...getRegionProps('right-leg')} />
          {/* Patient's left leg (screen right) */}
          <path d="M 148 282 L 164 444 L 130 444 L 122 282 Z" {...getRegionProps('left-leg')} />

          {/* ── Log count badges ─────────────────────────────────────────── */}
          {Object.entries(loggedCounts).map(([region, count]) => {
            if (!count || !regionsInView.includes(region as BodySystem)) return null;
            const pos: Record<string, [number, number]> = {
              head: [120, 50], chest: [120, 138], abdomen: [120, 220],
              back: [120, 178], 'right-arm': [57, 168], 'left-arm': [183, 168],
              'right-leg': [95, 360], 'left-leg': [145, 360],
            };
            const [cx, cy] = pos[region] ?? [0, 0];
            if (!cx) return null;
            return (
              <g key={region} style={{ pointerEvents: 'none' }}>
                <circle cx={cx} cy={cy} r="11" fill="#4f46e5" opacity="0.9" />
                <text x={cx} y={cy + 4} textAnchor="middle" fill="white" fontSize="10" fontWeight="700">
                  {count > 9 ? '9+' : count}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 mt-5 text-[11px] text-slate-400 font-medium">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-slate-50 border border-slate-300 inline-block" />
          No logs
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-amber-100 border border-amber-400 inline-block" />
          Low (1–3)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-orange-100 border border-orange-400 inline-block" />
          Medium (4–6)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-red-100 border border-red-400 inline-block" />
          High (7–10)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-indigo-500 border border-indigo-600 inline-block" />
          Selected
        </span>
      </div>
    </div>
  );
}
