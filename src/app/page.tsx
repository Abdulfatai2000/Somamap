"use client";

import React, { useState } from 'react';
import { BodyMap } from '@/components/BodyMap';
import { SymptomForm } from '@/components/SymptomForm';
import { PatternPanel } from '@/components/PatternPanel';
import { BodySystem } from '@/lib/constants';

// ══════════════════════════════════════════════════════════════════
//  ⚡ SWAP POINT — Phase 5.5 mock data source
//
//  Replace this import with real events from the twin API:
//
//    const events = await twin.events.list({ limit: 200 });
//
//  Then pass `events` (cast to SymptomEvent[]) to <PatternPanel>.
//  The pattern functions in lib/patterns.ts need no other changes.
// ══════════════════════════════════════════════════════════════════
import { MOCK_EVENTS } from '@/test/mockFixture';

export default function Home() {
  const [selectedRegion, setSelectedRegion] = useState<BodySystem | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleRegionSelect = (region: BodySystem) => {
    setSelectedRegion(region);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedRegion(null);
  };

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
          <div className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full">
            Phase 5.5 UI
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

        {/* Two-column layout: body map + pattern panel */}
        <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
          {/* Body Map */}
          <div className="w-full lg:w-auto flex-shrink-0">
            <BodyMap
              onRegionSelect={handleRegionSelect}
              selectedRegion={selectedRegion}
            />
          </div>

          {/* Pattern Panel */}
          <div className="w-full lg:max-w-sm">
            {/*
              ⚡ SWAP POINT: Replace MOCK_EVENTS with real events
              (see the import at the top of this file)
            */}
            <PatternPanel events={MOCK_EVENTS} />
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
