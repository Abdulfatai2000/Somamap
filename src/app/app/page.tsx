"use client";

import React, { useState, useEffect, useRef } from 'react';
import { BodyMap } from '@/components/BodyMap';
import { SymptomForm } from '@/components/SymptomForm';
import { PatternPanel } from '@/components/PatternPanel';
import { TimelinePanel } from '@/components/TimelinePanel';
import { ChartsPanel } from '@/components/ChartsPanel';
import { CalendarPanel } from '@/components/CalendarPanel';
import { BodySystem } from '@/lib/constants';
import type { SymptomEvent } from '@/lib/types';
import Link from 'next/link';

type ViewMode = 'patterns' | 'timeline' | 'charts';

export default function Dashboard() {
  const [selectedRegion, setSelectedRegion] = useState<BodySystem | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [events, setEvents] = useState<SymptomEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('patterns');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [assistantInput, setAssistantInput] = useState('');
  const [assistantMessages, setAssistantMessages] = useState<{ from: 'user' | 'bot'; text: string }[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
    fetchTwinEvents();
  };

  const getDateKey = (iso: string): string => {
    const d = new Date(iso);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const eventsForBodyMap = selectedDate
    ? events.filter(e => getDateKey(e.occurredAt) === selectedDate)
    : events;

  const loggedCounts = eventsForBodyMap.reduce((acc, evt) => {
    const sys = evt.data?.system;
    if (sys) {
      acc[sys] = (acc[sys] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const recentSeverityByRegion = eventsForBodyMap.reduce((acc, evt) => {
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
    { key: 'charts', label: 'Charts' },
  ];

  const assistantQuestions = [
    'What is Somamap?',
    'How does it work?',
    'What is a digital twin?',
    'How do I log a symptom?',
  ];

  const knowledgeBase: Record<string, string> = {
    'What is Somamap?':
      'Somamap is a body-map symptom tracker built on the Ontomorph digital twin platform. You tap a body region, log symptoms with severity and context, and the data is stored as structured events on your digital twin.',
    'How does it work?':
      'It works in four steps: Locate — tap where you feel it on the body map. Record — capture symptom, severity, duration, trigger, and notes. Sync — the symptom is saved as a structured event on your Ontomorph digital twin. Understand — review patterns, hotspots, trends, and history.',
    'What is a digital twin?':
      'A digital twin is a persistent, structured representation of your health data on the Ontomorph platform. In Somamap, every symptom you log becomes a structured event stored on your twin, so you can read it back, analyze it, and share it.',
    'How do I log a symptom?':
      'Tap any region on the body map. A form opens where you can select symptom type, enter a name, rate severity from 1–10, add notes, and note what happened before the symptom started. Then save it to your digital twin.',
    'What does severity 1–10 mean?':
      'Severity is a personal rating of how intense the symptom feels. 1 is mild or barely noticeable. 10 is severe or unbearable. There is no right or wrong answer — it is your personal assessment.',
    'What is HOLON?':
      'HOLON is Ontomorph\'s clinical terminology service. When you type a symptom name, HOLON can suggest real clinical terms so your entries use consistent, structured medical language.',
    'How does Somamap use Ontomorph?':
      'Somamap uses Ontomorph in two ways: your symptoms are stored as structured events on your Ontomorph digital twin, and the HOLON service helps map everyday symptom language to clinical terminology.',
    'How do I use the body map?':
      'The body map shows the front and back of the body. Use the toggle to switch views. Tap any highlighted region to log a symptom for that area. Regions with existing logs show colored indicators based on recent severity.',
  };

  const handleAssistantSend = () => {
    const q = assistantInput.trim();
    if (!q) return;
    setAssistantMessages(prev => [...prev, { from: 'user', text: q }]);
    const answer = knowledgeBase[q] || 'I do not have a specific answer for that yet. Somamap is a body-map symptom tracker connected to your Ontomorph digital twin. For medical concerns, please consult a qualified healthcare professional.';
    setTimeout(() => {
      setAssistantMessages(prev => [...prev, { from: 'bot', text: answer }]);
    }, 300);
    setAssistantInput('');
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [assistantMessages]);

  return (
    <main className="min-h-screen text-slate-100 font-sans selection:bg-indigo-500/30 relative z-10">
      {/* Header */}
      <header className="glass-strong sticky top-0 z-40 border-b border-white/10 shadow-lg shadow-indigo-900/10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shadow-lg shadow-indigo-500/40">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" />
                <line x1="16" y1="8" x2="2" y2="22" />
                <line x1="17.5" y1="15" x2="9" y2="6.5" />
              </svg>
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-purple-300">
              Somamap
            </h1>
          </Link>
          {selectedDate && (
            <button
              onClick={() => setSelectedDate(null)}
              className="text-xs font-medium px-3 py-1.5 rounded-lg glass hover:bg-white/10 transition-colors text-indigo-200 hover:text-indigo-100"
            >
              Clear date filter
            </button>
          )}
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-12 relative">
        {/* Glow blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-0 -translate-x-1/2 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-0 translate-x-1/2 w-[300px] h-[300px] bg-cyan-500/8 rounded-full blur-3xl pointer-events-none" />
        
        <div className="text-center mb-10 space-y-3 relative">
          <h2 className="text-4xl font-extrabold tracking-tight text-white">
            Where does it hurt?
          </h2>
          <p className="text-slate-400 max-w-md mx-auto">
            Tap a region on the body map below to log a new symptom to your digital twin.
          </p>
        </div>

        {/* Calendar date picker - above body map */}
        <div className="flex justify-center mb-8">
          <CalendarPanel events={events} selectedDate={selectedDate} onDateSelect={setSelectedDate} />
        </div>

        {/* Two-column layout: body map + panel */}
        <div className="flex flex-col lg:flex-row gap-8 items-stretch relative">
          {/* Body Map */}
          <div className="w-full lg:w-auto flex-shrink-0 relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-3xl blur-2xl pointer-events-none" />
            <div className="relative">
              <BodyMap
                onRegionSelect={handleRegionSelect}
                selectedRegion={selectedRegion}
                loggedCounts={loggedCounts}
                recentSeverityByRegion={recentSeverityByRegion}
              />
            </div>
          </div>

          {/* Right panel with view tabs */}
          <div className="w-full lg:max-w-sm flex flex-col min-h-0 lg:self-stretch lg:max-h-[580px]">
            {/* View tabs */}
            <div className="flex p-1 gap-1 mb-4 glass rounded-2xl flex-shrink-0">
              {tabs.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setViewMode(tab.key)}
                  className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    viewMode === tab.key
                      ? 'bg-white/15 text-indigo-200 shadow-sm backdrop-blur-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Panel content — stretches to match body map height */}
            <div className="flex-1 min-h-0">
              {viewMode === 'patterns' && <PatternPanel events={eventsForBodyMap} />}
               {viewMode === 'timeline' && <TimelinePanel events={events} selectedDate={selectedDate} onDateSelect={setSelectedDate} />}
               {viewMode === 'charts' && <ChartsPanel events={eventsForBodyMap} />}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 glass border-t border-white/10 z-40 pb-safe">
        <div className="flex items-center justify-around py-2">
          <button
            onClick={() => setViewMode('patterns')}
            className={`flex flex-col items-center gap-0.5 px-4 py-2 rounded-xl transition-all ${
              viewMode === 'patterns' ? 'text-indigo-300' : 'text-slate-400'
            }`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" />
              <line x1="16" y1="8" x2="2" y2="22" />
              <line x1="17.5" y1="15" x2="9" y2="6.5" />
            </svg>
            <span className="text-[10px] font-medium">Map</span>
          </button>
          <button
            onClick={() => setViewMode('patterns')}
            className={`flex flex-col items-center gap-0.5 px-4 py-2 rounded-xl transition-all ${
              viewMode === 'patterns' ? 'text-indigo-300' : 'text-slate-400'
            }`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
            <span className="text-[10px] font-medium">Patterns</span>
          </button>
          <button
            onClick={() => setViewMode('timeline')}
            className={`flex flex-col items-center gap-0.5 px-4 py-2 rounded-xl transition-all ${
              viewMode === 'timeline' ? 'text-indigo-300' : 'text-slate-400'
            }`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
            </svg>
            <span className="text-[10px] font-medium">Timeline</span>
          </button>
          <button
            onClick={() => setViewMode('charts')}
            className={`flex flex-col items-center gap-0.5 px-4 py-2 rounded-xl transition-all ${
              viewMode === 'charts' ? 'text-indigo-300' : 'text-slate-400'
            }`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
            </svg>
            <span className="text-[10px] font-medium">Charts</span>
          </button>
        </div>
      </nav>

      {/* Symptom Logging Form Modal */}
      {isFormOpen && selectedRegion && (
        <SymptomForm
          region={selectedRegion}
          onClose={handleCloseForm}
          selectedDate={selectedDate}
        />
      )}

      {/* Floating Assistant */}
      <div className="fixed bottom-20 lg:bottom-6 right-4 lg:right-6 z-50">
        {!assistantOpen && (
          <button
            onClick={() => setAssistantOpen(true)}
            className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30 flex items-center justify-center hover:scale-110 transition-transform"
            title="Ask Somamap"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </button>
        )}

        {assistantOpen && (
          <div className="w-80 sm:w-96 rounded-3xl glass-strong border border-white/10 shadow-2xl overflow-hidden animate-fade-in-up">
            <div className="p-4 border-b border-white/8 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-white">Somamap Assistant</p>
                <p className="text-[11px] text-slate-400">Ask me about Somamap</p>
              </div>
              <button onClick={() => setAssistantOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className="h-64 overflow-y-auto p-4 space-y-3">
              {assistantMessages.length === 0 && (
                <div className="space-y-2">
                  <p className="text-xs text-slate-400 mb-2">Try asking:</p>
                  {assistantQuestions.map(q => (
                    <button key={q} onClick={() => { setAssistantInput(q); }} className="block w-full text-left text-xs text-indigo-300 hover:text-indigo-200 glass rounded-lg px-3 py-2 border border-white/5">
                      {q}
                    </button>
                  ))}
                </div>
              )}
              {assistantMessages.map((msg, i) => (
                <div key={i} className={`text-xs ${msg.from === 'user' ? 'text-indigo-300 text-right' : 'text-slate-300 text-left'}`}>
                  <span className={`inline-block px-3 py-2 rounded-xl ${msg.from === 'user' ? 'bg-indigo-500/20' : 'glass border border-white/10'}`}>{msg.text}</span>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="p-3 border-t border-white/8 flex gap-2">
              <input
                type="text"
                value={assistantInput}
                onChange={e => setAssistantInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAssistantSend()}
                placeholder="Ask about Somamap..."
                className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 outline-none focus:border-indigo-500/50"
              />
              <button onClick={handleAssistantSend} className="px-3 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 transition-colors">
                Send
              </button>
            </div>
            <p className="text-[10px] text-slate-500 text-center py-2">Somamap is not a diagnostic tool. For medical concerns, consult a healthcare professional.</p>
          </div>
        )}
      </div>
    </main>
  );
}
