'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import type { SymptomEvent } from '@/lib/types';

interface CalendarPanelProps {
  events: SymptomEvent[];
  selectedDate?: string | null;
  onDateSelect?: (date: string | null) => void;
}

const severityColor = (severity: number): string => {
  if (severity <= 3) return '#f59e0b';
  if (severity <= 6) return '#f97316';
  return '#ef4444';
};

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const isToday = (dateKey: string): boolean => {
  const [year, month, day] = dateKey.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date.getTime() === today.getTime();
};

export function CalendarPanel({ events, selectedDate, onDateSelect }: CalendarPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

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

  const handleDayClick = (dateKey: string) => {
    if (selectedDate === dateKey) {
      onDateSelect?.(null);
    } else {
      onDateSelect?.(dateKey);
    }
    setIsOpen(false);
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
      const loggable = isToday(dateKey);

      days.push(
        <button
          key={day}
          onClick={() => handleDayClick(dateKey)}
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
          {loggable && !isSelected && (
            <span className="absolute -top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-500" title="Today" />
          )}
        </button>
      );
    }
    return days;
  };

  return (
    <div className="relative w-full max-w-sm mx-auto" ref={dropdownRef}>
      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors shadow-sm"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
        <span>Days</span>
        {selectedDate && (
          <span className="ml-1 text-[10px] font-medium text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-full">
            Selected
          </span>
        )}
      </button>

      {/* Dropdown popover */}
      {isOpen && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50">
          {/* Month navigation */}
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={goToPrevMonth}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>

          {/* Day-of-week headers */}
          <div className="grid grid-cols-7 mb-1">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
              <div key={d} className="h-5 flex items-center justify-center text-[10px] font-semibold text-slate-400 uppercase">
                {d}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-y-0.5">
            {renderCalendarDays()}
          </div>

          {/* Selected date indicator */}
          {selectedDate && (
            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Viewing: <strong className="text-slate-700">{selectedDate}</strong>
              </span>
              <button
                onClick={() => {
                  onDateSelect?.(null);
                  setIsOpen(false);
                }}
                className="text-[11px] text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Clear filter
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
