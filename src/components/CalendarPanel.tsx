'use client';

import React, { useState, useMemo } from 'react';
import type { SymptomEvent } from '@/lib/types';

interface CalendarPanelProps {
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

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export function CalendarPanel({ events }: CalendarPanelProps) {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const daysInMonth = new Date(currentMonth.year, currentMonth.month + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentMonth.year, currentMonth.month, 1).getDay();

  const eventsByDate = useMemo(() => {
    const map: Record<string, SymptomEvent[]> = {};
    for (const evt of events) {
      const d = new Date(evt.occurredAt);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      if (!map[key]) map[key] = [];
      map[key].push(evt);
    }
    return map;
  }, [events]);

  const selectedEvents = selectedDate ? (eventsByDate[selectedDate] ?? []) : [];

  const goToPrevMonth = () => {
    setCurrentMonth(prev => {
      if (prev.month === 0) {
        return { year: prev.year - 1, month: 11 };
      }
      return { year: prev.year, month: prev.month - 1 };
    });
  };

  const goToNextMonth = () => {
    setCurrentMonth(prev => {
      if (prev.month === 11) {
        return { year: prev.year + 1, month: 0 };
      }
      return { year: prev.year, month: prev.month + 1 };
    });
  };

  const renderCalendarDays = () => {
    const days: React.ReactNode[] = [];
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="h-8" />);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = `${currentMonth.year}-${String(currentMonth.month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayEvents = eventsByDate[dateKey] ?? [];
      const hasEvents = dayEvents.length > 0;
      const isSelected = selectedDate === dateKey;

      days.push(
        <button
          key={day}
          onClick={() => setSelectedDate(isSelected ? null : dateKey)}
          className={`
            h-8 w-8 mx-auto rounded-lg flex items-center justify-center text-xs font-medium
            transition-all duration-150 relative
            ${isSelected
              ? 'bg-indigo-600 text-white shadow-sm'
              : hasEvents
                ? 'bg-white text-slate-700 hover:bg-indigo-50 border border-slate-200'
                : 'bg-transparent text-slate-400 hover:text-slate-600'
            }
          `}
        >
          {day}
          {hasEvents && !isSelected && (
            <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 flex gap-0.5">
              {dayEvents.length === 1 ? (
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: severityColor(dayEvents[0].data?.severity ?? 5) }}
                />
              ) : (
                <span className="flex gap-0.5">
                  {dayEvents.slice(0, 3).map((evt, i) => (
                    <span
                      key={i}
                      className="w-1 h-1 rounded-full"
                      style={{ backgroundColor: severityColor(evt.data?.severity ?? 5) }}
                    />
                  ))}
                </span>
              )}
            </span>
          )}
        </button>
      );
    }
    return days;
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      {/* Panel header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-800">Calendar</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {events.length} symptom log{events.length !== 1 ? 's' : ''} total
          </p>
        </div>
      </div>

      {/* Month navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={goToPrevMonth}
          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <span className="text-sm font-semibold text-slate-700">
          {MONTH_NAMES[currentMonth.month]} {currentMonth.year}
        </span>
        <button
          onClick={goToNextMonth}
          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      {/* Day-of-week headers */}
      <div className="grid grid-cols-7 mb-2">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
          <div key={d} className="h-6 flex items-center justify-center text-[10px] font-semibold text-slate-400 uppercase">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-y-1 mb-4">
        {renderCalendarDays()}
      </div>

      {/* Selected day popover */}
      {selectedDate && (
        <div className="mt-4 p-4 rounded-2xl border border-slate-100 bg-white">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-slate-700">
              {formatDate(selectedDate)}
            </h4>
            <button
              onClick={() => setSelectedDate(null)}
              className="text-[11px] text-slate-400 hover:text-slate-600"
            >
              Close
            </button>
          </div>
          {selectedEvents.length === 0 ? (
            <p className="text-sm text-slate-400 italic">No symptoms logged on this day.</p>
          ) : (
            <div className="space-y-2">
              {selectedEvents.map(evt => (
                <div key={evt.id} className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50">
                  <div className="flex-shrink-0 mt-0.5">
                    <span
                      className="inline-block w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: severityColor(evt.data?.severity ?? 5) }}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-800 truncate">
                      {evt.data?.symptomName || evt.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-white text-slate-600 border border-slate-100">
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
      )}
    </div>
  );
}
