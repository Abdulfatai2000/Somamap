import React, { useState } from 'react';
import { BodySystem } from '@/lib/constants';

interface BodyMapProps {
  onRegionSelect: (region: BodySystem) => void;
  selectedRegion?: BodySystem | null;
  loggedCounts?: Record<string, number>;
  recentSeverityByRegion?: Record<string, { severity: number; occurredAt: string }>;
}

const HOVER_FILL = '#e0e7ff';
const HOVER_STROKE = '#6366f1';

export function BodyMap({ onRegionSelect, selectedRegion, loggedCounts = {}, recentSeverityByRegion = {} }: BodyMapProps) {
  const [view, setView] = useState<'front' | 'back'>('front');
  const [hoveredRegion, setHoveredRegion] = useState<BodySystem | null>(null);

  const getSeverityColor = (severity: number): { fill: string; stroke: string } => {
    if (severity <= 3) return { fill: '#fef3c7', stroke: '#f59e0b' };
    if (severity <= 6) return { fill: '#ffedd5', stroke: '#f97316' };
    return { fill: '#fee2e2', stroke: '#ef4444' };
  };

  const regionsInView = view === 'front'
    ? (['head', 'chest', 'abdomen', 'waist', 'left-shoulder', 'right-shoulder', 'left-elbow', 'right-elbow', 'left-upper-arm', 'right-upper-arm', 'left-forearm', 'right-forearm', 'left-hand', 'right-hand', 'left-thigh', 'right-thigh', 'left-knee', 'right-knee', 'left-lower-leg', 'right-lower-leg', 'left-foot', 'right-foot'] as BodySystem[])
    : (['head', 'back', 'waist', 'left-shoulder', 'right-shoulder', 'left-elbow', 'right-elbow', 'left-upper-arm', 'right-upper-arm', 'left-forearm', 'right-forearm', 'left-hand', 'right-hand', 'left-thigh', 'right-thigh', 'left-knee', 'right-knee', 'left-lower-leg', 'right-lower-leg', 'left-foot', 'right-foot'] as BodySystem[]);

  const labelPositions: Record<string, { x: number; y: number }> = {
    head: { x: 120, y: 50 },
    chest: { x: 120, y: 138 },
    abdomen: { x: 120, y: 230 },
    waist: { x: 120, y: 268 },
    back: { x: 120, y: 178 },
    'right-shoulder': { x: 68, y: 110 },
    'left-shoulder': { x: 172, y: 110 },
    'right-elbow': { x: 50, y: 185 },
    'left-elbow': { x: 190, y: 185 },
    'right-upper-arm': { x: 65, y: 145 },
    'left-upper-arm': { x: 175, y: 145 },
    'right-forearm': { x: 65, y: 225 },
    'left-forearm': { x: 175, y: 225 },
    'right-hand': { x: 50, y: 255 },
    'left-hand': { x: 190, y: 255 },
    'right-thigh': { x: 98, y: 320 },
    'left-thigh': { x: 142, y: 320 },
    'right-knee': { x: 98, y: 368 },
    'left-knee': { x: 142, y: 368 },
    'right-lower-leg': { x: 98, y: 415 },
    'left-lower-leg': { x: 142, y: 415 },
    'right-foot': { x: 95, y: 452 },
    'left-foot': { x: 145, y: 452 },
  };

  const getRegionProps = (region: BodySystem) => {
    const isActive = selectedRegion === region;
    const hasLogs = (loggedCounts[region] || 0) > 0;
    const count = loggedCounts[region] || 0;
    const recent = recentSeverityByRegion[region];
    const isHovered = hoveredRegion === region;

    let fill: string, stroke: string;
    if (isActive)    { fill = '#6366f1'; stroke = '#4f46e5'; }
    else if (isHovered) { fill = HOVER_FILL; stroke = HOVER_STROKE; }
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
      strokeWidth: isActive ? 2.5 : isHovered ? 2.2 : 1.5,
      style: { cursor: 'pointer', transition: 'fill 0.15s, stroke 0.15s' } as React.CSSProperties,
      onClick: () => onRegionSelect(region),
      onMouseEnter: () => setHoveredRegion(region),
      onMouseLeave: () => setHoveredRegion(null),
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

          {/* ── Shoulders ────────────────────────────────────────────────── */}
          {/* Patient's right shoulder (screen left) */}
          <path d="M 82 98 L 55 98 L 60 130 L 82 120 Z" {...getRegionProps('right-shoulder')} />
          {/* Patient's left shoulder (screen right) */}
          <path d="M 158 98 L 185 98 L 180 130 L 158 120 Z" {...getRegionProps('left-shoulder')} />

          {/* ── Arms ─────────────────────────────────────────────────────── */}
          {/* Patient's right upper arm (screen left) */}
          <path d="M 82 120 L 60 130 L 42 180 L 60 180 L 88 148 Z" {...getRegionProps('right-upper-arm')} />
          {/* Patient's right elbow (screen left) */}
          <path d="M 42 180 L 60 180 L 58 200 L 44 200 Z" {...getRegionProps('right-elbow')} />
          {/* Patient's right forearm (screen left) */}
          <path d="M 44 200 L 58 200 L 60 228 L 42 228 L 44 244 L 60 244 L 92 165 Z" {...getRegionProps('right-forearm')} />
          {/* Patient's right hand (screen left) */}
          <path d="M 44 244 L 60 244 L 58 260 L 42 260 Z" {...getRegionProps('right-hand')} />
          {/* Patient's left upper arm (screen right) */}
          <path d="M 158 120 L 180 130 L 198 180 L 180 180 L 152 148 Z" {...getRegionProps('left-upper-arm')} />
          {/* Patient's left elbow (screen right) */}
          <path d="M 198 180 L 180 180 L 182 200 L 196 200 Z" {...getRegionProps('left-elbow')} />
          {/* Patient's left forearm (screen right) */}
          <path d="M 196 200 L 182 200 L 180 228 L 198 228 L 196 244 L 180 244 L 148 165 Z" {...getRegionProps('left-forearm')} />
          {/* Patient's left hand (screen right) */}
          <path d="M 196 244 L 180 244 L 182 260 L 198 260 Z" {...getRegionProps('left-hand')} />

          {/* ── Waist / Hip band ──────────────────────────────────────────── */}
          <path d="M 92 262 L 148 262 L 148 282 L 92 282 Z" {...getRegionProps('waist')} />

          {/* ── Legs ─────────────────────────────────────────────────────── */}
          {/* Patient's right thigh (screen left) */}
          <path d="M 92 282 L 84 362 L 114 362 L 118 282 Z" {...getRegionProps('right-thigh')} />
          {/* Patient's right knee (screen left) */}
          <path d="M 84 362 L 114 362 L 112 378 L 86 378 Z" {...getRegionProps('right-knee')} />
          {/* Patient's right lower-leg (screen left) */}
          <path d="M 86 378 L 112 378 L 110 444 L 76 444 Z" {...getRegionProps('right-lower-leg')} />
          {/* Patient's right foot (screen left) */}
          <path d="M 76 444 L 110 444 L 108 460 L 78 460 Z" {...getRegionProps('right-foot')} />
          {/* Patient's left thigh (screen right) */}
          <path d="M 148 282 L 156 362 L 126 362 L 122 282 Z" {...getRegionProps('left-thigh')} />
          {/* Patient's left knee (screen right) */}
          <path d="M 156 362 L 126 362 L 124 378 L 154 378 Z" {...getRegionProps('left-knee')} />
          {/* Patient's left lower-leg (screen right) */}
          <path d="M 154 378 L 124 378 L 130 444 L 164 444 Z" {...getRegionProps('left-lower-leg')} />
          {/* Patient's left foot (screen right) */}
          <path d="M 164 444 L 130 444 L 132 460 L 162 460 Z" {...getRegionProps('left-foot')} />

          {/* ── Log count badges ─────────────────────────────────────────── */}
          {Object.entries(loggedCounts).map(([region, count]) => {
            if (!count || !regionsInView.includes(region as BodySystem)) return null;
            const pos: Record<string, [number, number]> = {
              head: [120, 50], chest: [120, 138], abdomen: [120, 220],
              waist: [120, 268], back: [120, 178], 'right-shoulder': [57, 105], 'left-shoulder': [183, 105],
              'right-elbow': [45, 185], 'left-elbow': [195, 185],
              'right-upper-arm': [57, 140], 'left-upper-arm': [183, 140],
              'right-forearm': [57, 215], 'left-forearm': [183, 215],
              'right-hand': [50, 250], 'left-hand': [190, 250],
              'right-thigh': [95, 320], 'left-thigh': [145, 320],
              'right-knee': [95, 368], 'left-knee': [145, 368],
              'right-lower-leg': [95, 410], 'left-lower-leg': [145, 410],
              'right-foot': [90, 452], 'left-foot': [150, 452],
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

          {/* ── Hover label ─────────────────────────────────────────────── */}
          {hoveredRegion && (() => {
            const pos = labelPositions[hoveredRegion];
            if (!pos) return null;
            const label = hoveredRegion.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
            return (
              <g style={{ pointerEvents: 'none' }}>
                <rect x={pos.x - 36} y={pos.y - 28} width="72" height="18" rx="4" fill="#1e293b" opacity="0.92" />
                <text x={pos.x} y={pos.y - 15} textAnchor="middle" fill="white" fontSize="9" fontWeight="600">
                  {label}
                </text>
              </g>
            );
          })()}
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
