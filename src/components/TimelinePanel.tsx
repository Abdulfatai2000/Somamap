'use client';

import React, { useState } from 'react';
import type { SymptomEvent } from '@/lib/types';
import { BodySystem } from '@/lib/constants';

interface TimelinePanelProps {
  events: SymptomEvent[];
}

const severityColor = (severity: number): string => {
  if (severity <= 3) return '#f59e0b';
  if (severity <= 6) return '#f97316';
  return '#ef4444';
};

const formatDate = (iso: string): string => {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
};

const ALL_REGIONS = [
  'head', 'chest', 'abdomen', 'back',
  'left-upper-arm', 'right-upper-arm', 'left-forearm', 'right-forearm',
  'left-thigh', 'right-thigh', 'left-lower-leg', 'right-lower-leg'
] as const;

export function TimelinePanel({ events }: TimelinePanelProps) {
  const [regionFilter, setRegionFilter] = useState<string>('all');

  const filtered = events
    .filter(e => regionFilter === 'all' || e.data?.system === regionFilter)
    .sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime());

  return (
    <div className="w-full max-w-sm mx-auto">
      {/* Panel header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-800">Timeline</h3>
          <p className="text-xs text-slate-400 mt-0.5">{filtered.length} event{filtered.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {/* Region filter */}
      <div className="mb-4">
        <select
          value={regionFilter}
          onChange={(e) => setRegionFilter(e.target.value)}
          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
        >
          <option value="all">All regions</option>
          {ALL_REGIONS.map(r => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>

      {/* Event list */}
      <div className="space-y-2">
        {filtered.length === 0 && (
          <p className="text-sm text-slate-400 italic text-center py-6">No events yet.</p>
        )}
        {filtered.map(evt => (
          <div key={evt.id} className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 bg-white">
            <div className="flex-shrink-0 mt-0.5">
              <span
                className="inline-block w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: severityColor(evt.data?.severity ?? 5) }}
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium text-slate-800 truncate">
                  {evt.data?.symptomName || evt.title}
                </p>
                <span className="text-[11px] text-slate-400 flex-shrink-0">{formatDate(evt.occurredAt)}</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  {evt.data?.system}
                </span>
                <span className="text-[11px] text-slate-400">
                  severity {evt.data?.severity ?? '—'}
                </span>
                {evt.data?.duration && (
                  <span className="text-[11px] text-slate-400">
                    • {evt.data.duration}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
