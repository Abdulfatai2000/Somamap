'use client';

import React, { useState, useRef, useEffect } from 'react';
import type { SymptomEvent } from '@/lib/types';
import { BodySystem } from '@/lib/constants';

interface TimelinePanelProps {
  events: SymptomEvent[];
  selectedDate?: string | null;
  onDateSelect?: (date: string | null) => void;
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

const SORT_OPTIONS: { value: SortOrder; label: string; icon: React.ReactNode }[] = [
  { 
    value: 'newest', 
    label: 'Newest first', 
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12l7-7 7 7"/></svg>
  },
  { 
    value: 'oldest', 
    label: 'Oldest first', 
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5M5 12l7 7 7-7"/></svg>
  },
  { 
    value: 'severity-high', 
    label: 'Severity: High to Low', 
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M3 12h12M3 18h6"/></svg>
  },
  { 
    value: 'severity-low', 
    label: 'Severity: Low to High', 
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 18h18M3 12h12M3 6h6"/></svg>
  },
];

const getDateKey = (iso: string): string => {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const isToday = (dateKey: string): boolean => {
  const [year, month, day] = dateKey.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date.getTime() === today.getTime();
};

const isLoggableDate = (dateKey: string): boolean => {
  return isToday(dateKey);
};

const getDateLabel = (dateKey: string): string => {
  const [year, month, day] = dateKey.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (date.getTime() === today.getTime()) return 'Today';
  if (date.getTime() === yesterday.getTime()) return 'Yesterday';
  
  return date.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });
};

export function TimelinePanel({ events, selectedDate, onDateSelect, onDeleteEvent }: TimelinePanelProps) {
  const [regionFilter, setRegionFilter] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; title: string } | null>(null);
  const [deleteReason, setDeleteReason] = useState('');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showAllDates, setShowAllDates] = useState(false);
  const sortButtonRef = useRef<HTMLButtonElement>(null);

  const sortEvents = (items: SymptomEvent[], order: SortOrder): SymptomEvent[] => {
    const sorted = [...items];
    sorted.sort((a, b) => {
      if (order === 'newest') {
        return new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime();
      } else if (order === 'oldest') {
        return new Date(a.occurredAt).getTime() - new Date(b.occurredAt).getTime();
      } else if (order === 'severity-high') {
        const sevDiff = (b.data?.severity ?? 0) - (a.data?.severity ?? 0);
        if (sevDiff !== 0) return sevDiff;
        return new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime();
      } else if (order === 'severity-low') {
        const sevDiff = (a.data?.severity ?? 0) - (b.data?.severity ?? 0);
        if (sevDiff !== 0) return sevDiff;
        return new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime();
      }
      return 0;
    });
    return sorted;
  };

  const filtered = sortEvents(
    events.filter(e => regionFilter === 'all' || e.data?.system === regionFilter),
    sortOrder
  );

  // Group events by date
  const groupedByDate = filtered.reduce((acc, evt) => {
    const dateKey = getDateKey(evt.occurredAt);
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(evt);
    return acc;
  }, {} as Record<string, SymptomEvent[]>);

  const dateKeys = Object.keys(groupedByDate).sort((a, b) => {
    if (sortOrder === 'newest' || sortOrder === 'severity-high' || sortOrder === 'severity-low') {
      return b.localeCompare(a);
    }
    return a.localeCompare(b);
  });

  const visibleDateKeys = showAllDates ? dateKeys : dateKeys.slice(0, 2);
  const hasMoreDates = dateKeys.length > 2;

  const handleDeleteClick = (evt: SymptomEvent) => {
    setDeleteConfirm({ id: evt.id, title: evt.title || evt.data?.symptomName || 'this entry' });
    setDeleteReason('');
  };

  const handleConfirmDelete = () => {
    if (!deleteConfirm?.id || !onDeleteEvent) return;
    onDeleteEvent(deleteConfirm.id);
    setDeleteConfirm(null);
    setDeleteReason('');
  };

  const handleCancelDelete = () => {
    setDeleteConfirm(null);
    setDeleteReason('');
  };

  const currentSortOption = SORT_OPTIONS.find(o => o.value === sortOrder);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (sortButtonRef.current && !sortButtonRef.current.contains(e.target as Node)) {
        setShowSortDropdown(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

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
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
            title="Sort options"
          >
            {currentSortOption?.icon}
          </button>
          {showSortDropdown && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-slate-200 rounded-xl shadow-lg z-20 py-1" onMouseDown={(e) => e.stopPropagation()}>
              {SORT_OPTIONS.map(option => (
                <button
                  key={option.value}
                  onClick={() => {
                    setSortOrder(option.value);
                    setShowSortDropdown(false);
                  }}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors ${
                    sortOrder === option.value
                      ? 'bg-indigo-50 text-indigo-700 font-medium'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="flex-shrink-0">{option.icon}</span>
                  <span className="flex-1 text-left">{option.label}</span>
                  {sortOrder === option.value && (
                    <span className="text-indigo-500 ml-auto">✓</span>
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

      {/* Event list — scrollable, grouped by date */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 min-h-0">
        {filtered.length === 0 && (
          <p className="text-sm text-slate-400 italic text-center py-6">No events yet.</p>
        )}
        
        {visibleDateKeys.map(dateKey => {
          const dateEvents = groupedByDate[dateKey];
          const isSelected = selectedDate === dateKey;
          const dateLabel = getDateLabel(dateKey);
          const loggable = isLoggableDate(dateKey);
          
          return (
            <div key={dateKey} className="space-y-2">
              {/* Date header — clickable for viewing all dates */}
              <button
                onClick={() => onDateSelect?.(isSelected ? null : dateKey)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                  isSelected
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>{dateLabel}</span>
                <div className="flex items-center gap-2">
                  {loggable && (
                    <span className="text-[10px] font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">
                      Loggable
                    </span>
                  )}
                  <span className="text-xs text-slate-400">{dateEvents.length}</span>
                </div>
              </button>
              
              {/* Events for this date — show only if selected or first 2 dates */}
              {(isSelected || !showAllDates) && (
                <div className="space-y-2 pl-2">
                  {dateEvents.map(evt => (
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
              )}
            </div>
          );
        })}

        {/* See more / Show less */}
        {hasMoreDates && (
          <button
            onClick={() => setShowAllDates(prev => !prev)}
            className="w-full py-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            {showAllDates ? 'Show less' : `See more (${dateKeys.length - 2} more dates)`}
          </button>
        )}
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
