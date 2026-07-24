'use client';

import React, { useState, useRef, useEffect } from 'react';
import type { SymptomEvent } from '@/lib/types';
import { BodySystem } from '@/lib/constants';

interface TimelinePanelProps {
  events: SymptomEvent[];
  onDeleteEvent?: (eventId: string) => void;
}

type SortOrder = 'newest' | 'oldest' | 'severity-high' | 'severity-low';

const severityColor = (severity: number): string => {
  if (severity <= 3) return '#f59e0b';
  if (severity <= 6) return '#f97316';
  return '#ef4444';
};

const formatDateTime = (iso: string): string => {
  const d = new Date(iso);
  return d.toLocaleString(undefined, { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
};

const ALL_REGIONS = [
  'head', 'neck', 'chest', 'abdomen', 'back', 'waist',
  'left-shoulder', 'right-shoulder', 'left-elbow', 'right-elbow',
  'left-upper-arm', 'right-upper-arm', 'left-forearm', 'right-forearm',
  'left-hand', 'right-hand',
  'left-thigh', 'right-thigh', 'left-knee', 'right-knee',
  'left-lower-leg', 'right-lower-leg', 'left-foot', 'right-foot'
] as const;

const SORT_OPTIONS: { value: SortOrder; label: string }[] = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'severity-high', label: 'Severity: High to Low' },
  { value: 'severity-low', label: 'Severity: Low to High' },
];

export function TimelinePanel({ events, onDeleteEvent }: TimelinePanelProps) {
  const [regionFilter, setRegionFilter] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; title: string } | null>(null);
  const [deleteReason, setDeleteReason] = useState('');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const sortButtonRef = useRef<HTMLButtonElement>(null);

  const filtered = events
    .filter(e => regionFilter === 'all' || e.data?.system === regionFilter)
    .sort((a, b) => {
      if (sortOrder === 'newest') {
        return new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime();
      } else if (sortOrder === 'oldest') {
        return new Date(a.occurredAt).getTime() - new Date(b.occurredAt).getTime();
      } else if (sortOrder === 'severity-high') {
        const sevDiff = (b.data?.severity ?? 0) - (a.data?.severity ?? 0);
        if (sevDiff !== 0) return sevDiff;
        return new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime();
      } else if (sortOrder === 'severity-low') {
        const sevDiff = (a.data?.severity ?? 0) - (b.data?.severity ?? 0);
        if (sevDiff !== 0) return sevDiff;
        return new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime();
      }
      return 0;
    });

  const handleDeleteClick = (evt: SymptomEvent) => {
    setDeleteConfirm({ id: evt.id, title: evt.title || evt.data?.symptomName || 'this entry' });
    setDeleteReason('');
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirm?.id) return;
    await onDeleteEvent?.(deleteConfirm.id);
    setDeleteConfirm(null);
    setDeleteReason('');
  };

  const handleCancelDelete = () => {
    setDeleteConfirm(null);
    setDeleteReason('');
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (sortButtonRef.current && !sortButtonRef.current.contains(e.target as Node)) {
        setShowSortDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentSortLabel = SORT_OPTIONS.find(o => o.value === sortOrder)?.label ?? 'Sort';

  return (
    <div className="w-full max-w-sm mx-auto flex flex-col h-full">
      {/* Panel header */}
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <div>
          <h3 className="text-base font-bold text-slate-800">Timeline</h3>
          <p className="text-xs text-slate-400 mt-0.5">{filtered.length} event{filtered.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="relative">
          <button
            ref={sortButtonRef}
            onClick={() => setShowSortDropdown(prev => !prev)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
            title="Sort options"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18M3 12h12M3 18h6" />
            </svg>
          </button>
          {showSortDropdown && (
            <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-slate-200 rounded-xl shadow-lg z-20 py-1">
              {SORT_OPTIONS.map(option => (
                <button
                  key={option.value}
                  onClick={() => {
                    setSortOrder(option.value);
                    setShowSortDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                    sortOrder === option.value
                      ? 'bg-indigo-50 text-indigo-700 font-medium'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {option.label}
                  {sortOrder === option.value && (
                    <span className="ml-2 text-indigo-500">✓</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Region filter */}
      <div className="mb-4 flex-shrink-0">
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

      {/* Event list — constrained frame, scrolls internally */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 min-h-0">
        {filtered.length === 0 && (
          <p className="text-sm text-slate-400 italic text-center py-6">No events yet.</p>
        )}
        {filtered.map(evt => (
          <div key={evt.id} className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 bg-white group relative">
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
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-[11px] text-slate-400">{formatDateTime(evt.occurredAt)}</span>
                  <button
                    onClick={() => handleDeleteClick(evt)}
                    className="text-red-400 hover:text-red-600 transition-colors"
                    title="Delete entry"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
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

      {/* Delete confirmation modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-base font-bold text-slate-800 mb-2">Delete entry?</h3>
            <p className="text-sm text-slate-600 mb-4">
              Are you sure you want to delete <strong>{deleteConfirm.title}</strong>? This action cannot be undone.
            </p>
            <div className="mb-4">
              <label htmlFor="delete-reason" className="block text-xs font-medium text-slate-500 mb-1">
                Reason (optional)
              </label>
              <textarea
                id="delete-reason"
                value={deleteReason}
                onChange={(e) => setDeleteReason(e.target.value)}
                placeholder="e.g. entered by mistake, duplicate..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all resize-none"
                rows={2}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-xl transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
