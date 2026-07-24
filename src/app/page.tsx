"use client";

import React, { useState, useEffect } from 'react';
import { BodyMap } from '@/components/BodyMap';
import { SymptomForm } from '@/components/SymptomForm';
import { PatternPanel } from '@/components/PatternPanel';
import { TimelinePanel } from '@/components/TimelinePanel';
import { CalendarPanel } from '@/components/CalendarPanel';
import { BodySystem } from '@/lib/constants';
import type { SymptomEvent } from '@/lib/types';

type ViewMode = 'patterns' | 'timeline' | 'calendar';

export default function Home() {
  const [selectedRegion, setSelectedRegion] = useState<BodySystem | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [events, setEvents] = useState<SymptomEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('patterns');

  const fetchTwinEvents = async () => {
    try {
      const res = await fetch('/api/twin');
      const data = await res.json();
      if (res.ok && Array.isArray(data.events)) {
        const symptoms = data.events.filter((e: any) => {
          if (e.eventType !== 'symptom') return false;
          const sys = e.data?.system;
          const sev = e.data?.severity;
          if (!sys || typeof sev !== 'number') return false;
          return true;
        });
        setEvents(symptoms);
      }
    } catch (err) {
      console.error('Failed to fetch twin events:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTwinEvents();
  }, []);

  const handleRegionSelect = (region: BodySystem) => {
    setSelectedRegion(region);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedRegion(null);
    fetchTwinEvents(); // Refresh twin events after a submission
  };

  // Compute count of logged symptoms per body system for the BodyMap highlight
  const loggedCounts = events.reduce((acc, evt) => {
    const sys = evt.data?.system;
    if (sys) {
      acc[sys] = (acc[sys] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  // Compute most recent severity per region for color coding
  const recentSeverityByRegion = events.reduce((acc, evt) => {
    const sys = evt.data?.system;
    const sev = evt.data?.severity;
    if (sys && typeof sev === 'number') {
      const existing = acc[sys];
      if (!existing || new Date(evt.occurredAt).getTime() > new Date(existing.occurredAt).getTime()) {
        acc[sys] = { severity: sev, occurredAt: evt.occurredAt };
      }
    }
    return acc;
  }, {} as Record<string, { severity: number; occurredAt: string }>);

  const tabs: { key: ViewMode; label: string }[] = [
    { key: 'patterns', label: 'Patterns' },
    { key: 'timeline', label: 'Timeline' },
    { key: 'calendar', label: 'Calendar' },
  ];

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-200">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" />
                <line x1="16" y1="8" x2="2" y2="22" />
                <line x1="17.5" y1="15" x2="9" y2="6.5" />
              </svg>
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-800">
              Somamap
            </h1>
          </div>
          </div>
        </header>

      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="text-center mb-10 space-y-3">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Where does it hurt?
          </h2>
          <p className="text-slate-500 max-w-md mx-auto">
            Tap a region on the body map below to log a new symptom to your digital twin.
          </p>
        </div>

        {/* Two-column layout: body map + panel */}
        <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
          {/* Body Map */}
          <div className="w-full lg:w-auto flex-shrink-0">
            <BodyMap
              onRegionSelect={handleRegionSelect}
              selectedRegion={selectedRegion}
              loggedCounts={loggedCounts}
              recentSeverityByRegion={recentSeverityByRegion}
            />
          </div>

          {/* Right panel with view tabs */}
          <div className="w-full lg:max-w-sm">
            {/* View tabs */}
            <div className="flex p-1 gap-1 mb-4 bg-slate-100 rounded-2xl">
              {tabs.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setViewMode(tab.key)}
                  className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    viewMode === tab.key
                      ? 'bg-white text-indigo-700 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Panel content */}
            {viewMode === 'patterns' && <PatternPanel events={events} />}
            {viewMode === 'timeline' && <TimelinePanel events={events} />}
            {viewMode === 'calendar' && <CalendarPanel events={events} />}
          </div>
        </div>
      </div>

      {/* Symptom Logging Form Modal */}
      {isFormOpen && selectedRegion && (
        <SymptomForm
          region={selectedRegion}
          onClose={handleCloseForm}
        />
      )}
    </main>
  );
}
