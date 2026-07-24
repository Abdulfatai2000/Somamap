'use client';

import React from 'react';
import type { SymptomEvent } from '@/lib/types';
import {
  describeMostLoggedRegion,
  describeFrequency,
  describeSeverityTrend,
} from '@/lib/patterns';

interface PatternPanelProps {
  events: SymptomEvent[];
}

/** Render a markdown-bold inline string (e.g. "your **chest**") */
function InlineMd({ text }: { text: string }) {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1
          ? <strong key={i} className="font-semibold text-slate-800">{part}</strong>
          : <span key={i}>{part}</span>
      )}
    </>
  );
}

interface InsightCardProps {
  icon: React.ReactNode;
  label: string;
  copy: string | null;
  accent: string;
  emptyMsg?: string;
}

function InsightCard({ icon, label, copy, accent, emptyMsg }: InsightCardProps) {
  return (
    <div className={`flex gap-4 p-4 rounded-2xl border bg-white ${accent}`}>
      <div className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center bg-current/10">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">{label}</p>
        {copy
          ? <p className="text-sm text-slate-600 leading-relaxed"><InlineMd text={copy} /></p>
          : <p className="text-sm text-slate-400 italic">{emptyMsg ?? 'Not enough data yet.'}</p>
        }
      </div>
    </div>
  );
}

/**
 * PatternPanel
 *
 * Renders pattern insights derived from the provided events array.
 * Currently wired to MOCK_EVENTS from @/test/mockFixture.
 *
 * ══════════════════════════════════════════════════════════════
 *  ⚡ SWAP POINT — see src/app/page.tsx where <PatternPanel>
 *  receives its `events` prop. Replace the mock fixture import
 *  there with real twin.events.list() output.
 * ══════════════════════════════════════════════════════════════
 */
export function PatternPanel({ events }: PatternPanelProps) {
  const mostLogged = describeMostLoggedRegion(events);
  const frequency  = describeFrequency(events);
  const trend      = describeSeverityTrend(events);
  const totalLogs  = events.length;

  return (
    <div className="w-full max-w-sm mx-auto">
      {/* Panel header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-800">Your Patterns</h3>
          <p className="text-xs text-slate-400 mt-0.5">{totalLogs} symptom log{totalLogs !== 1 ? 's' : ''} analysed</p>
        </div>
        {/* Live Twin status badge */}
        <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          Live Twin
        </span>
      </div>

      <div className="space-y-3">
        {/* 1. Frequency interval — highest priority per spec */}
        <InsightCard
          label="Recurrence"
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
          }
          copy={frequency}
          accent="border-indigo-100"
          emptyMsg="Log at least 2 symptoms to see recurrence patterns."
        />

        {/* 2. Most-logged region */}
        <InsightCard
          label="Hotspot"
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/>
            </svg>
          }
          copy={mostLogged}
          accent="border-amber-100"
          emptyMsg="No symptom logs yet."
        />

        {/* 3. Severity trend */}
        <InsightCard
          label="Severity trend"
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
            </svg>
          }
          copy={trend}
          accent="border-emerald-100"
          emptyMsg="Log 3+ symptoms in one region to see a trend."
        />
      </div>
    </div>
  );
}
