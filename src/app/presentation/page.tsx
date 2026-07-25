'use client';

import React, { useState, useEffect, useCallback } from 'react';

type SlideId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

const slides: { id: SlideId; title?: string; subtitle?: string }[] = [
  { id: 1, title: 'SOMAMAP', subtitle: 'Turn symptoms into a living map of your body.' },
  { id: 2, title: 'THE PROBLEM', subtitle: 'Your body remembers. Your health records often don\'t.' },
  { id: 3, title: 'THE BIG IDEA', subtitle: 'What if your symptoms had a map?' },
  { id: 4, title: 'HOW SOMAMAP WORKS' },
  { id: 5, title: 'INNOVATION', subtitle: 'From a symptom list to a living map of the body.' },
  { id: 6, title: 'CLINICAL VALUE', subtitle: 'From "I don\'t feel well" to a clearer health story.' },
  { id: 7, title: 'EXECUTION', subtitle: 'Built. Connected. Working.' },
  { id: 8, title: 'USE OF THE PLATFORM', subtitle: 'Somamap is built on the Ontomorph ecosystem.' },
  { id: 9, title: 'SEE IT IN ACTION' },
  { id: 10, title: 'WHERE SOMAMAP GOES NEXT' },
  { id: 11, title: 'SOMAMAP' },
];

const slideContent: Record<SlideId, React.ReactNode> = {
  1: (
    <div className="flex flex-col items-center justify-center h-full text-center px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-200/30 rounded-full blur-3xl" />
      <div className="relative z-10">
        <div className="w-64 h-80 mx-auto mb-8 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-100 to-indigo-200 rounded-full opacity-60" />
          <svg viewBox="0 0 100 160" className="w-48 h-72 mx-auto relative z-10 text-indigo-900">
            <ellipse cx="50" cy="25" rx="18" ry="22" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <path d="M30 45 Q50 55 70 45 L68 85 Q50 95 32 85 Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <path d="M35 85 L30 130" stroke="currentColor" strokeWidth="1.5" />
            <path d="M65 85 L70 130" stroke="currentColor" strokeWidth="1.5" />
            <path d="M45 90 L42 135" stroke="currentColor" strokeWidth="1.5" />
            <path d="M55 90 L58 135" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="50" cy="25" r="4" fill="#6366f1" opacity="0.9" />
            <circle cx="50" cy="60" r="4" fill="#6366f1" opacity="0.9" />
            <circle cx="30" cy="130" r="4" fill="#6366f1" opacity="0.9" />
            <circle cx="70" cy="130" r="4" fill="#6366f1" opacity="0.9" />
          </svg>
        </div>
        <h1 className="text-7xl font-extrabold tracking-tight text-slate-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-800">
          SOMAMAP
        </h1>
        <p className="text-2xl text-slate-600 mb-6 font-light">Turn symptoms into a living map of your body.</p>
        <div className="flex items-center justify-center gap-3 text-sm text-slate-500">
          <span className="px-3 py-1 rounded-full bg-white border border-slate-200 shadow-sm">Built on Ontomorph</span>
          <span className="text-indigo-400">•</span>
          <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 font-semibold">Hackathon OAU 2026</span>
        </div>
      </div>
    </div>
  ),
  2: (
    <div className="flex flex-col items-center justify-center h-full px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-white to-slate-50" />
      <div className="relative z-10 w-full max-w-5xl">
        <h2 className="text-5xl font-extrabold text-slate-900 mb-4 text-center">THE PROBLEM</h2>
        <p className="text-xl text-slate-500 text-center mb-12 font-light">Your body remembers. Your health records often don't.</p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
          {['LOCATION', 'TIME', 'SEVERITY', 'TRIGGERS', 'CONTEXT'].map((label) => (
            <div key={label} className="p-5 rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-200/50 text-center backdrop-blur">
              <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest">{label}</p>
            </div>
          ))}
        </div>
        <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-600 to-indigo-800 text-white text-center shadow-2xl shadow-indigo-200">
          <p className="text-lg font-medium">A symptom isn't just a word.</p>
          <p className="text-sm opacity-90 mt-1">It's a location + severity + duration + trigger + time.</p>
        </div>
      </div>
    </div>
  ),
  3: (
    <div className="flex flex-col items-center justify-center h-full text-center px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50" />
      <div className="relative z-10">
        <div className="flex items-center justify-center gap-3 mb-10 flex-wrap">
          {['BODY', 'SYMPTOM', 'STRUCTURED DATA', 'DIGITAL TWIN'].map((label, i) => (
            <React.Fragment key={label}>
              <span className={`px-4 py-2 rounded-full text-sm font-semibold ${i % 2 === 0 ? 'bg-white border border-slate-200 text-slate-700 shadow-sm' : 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'}`}>{label}</span>
              {i < 3 && <span className="text-indigo-400 text-lg">→</span>}
            </React.Fragment>
          ))}
        </div>
        <h2 className="text-5xl font-extrabold text-slate-900 mb-6">THE BIG IDEA</h2>
        <p className="text-xl text-slate-600 max-w-2xl leading-relaxed">
          Somamap turns the experience of symptoms into structured, spatial, longitudinal health data.
        </p>
      </div>
    </div>
  ),
  4: (
    <div className="flex flex-col items-center justify-center h-full px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-white to-slate-50" />
      <div className="relative z-10 w-full max-w-5xl">
        <h2 className="text-5xl font-extrabold text-slate-900 mb-12 text-center">HOW SOMAMAP WORKS</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { num: '01', title: 'LOCATE', desc: 'Tap where you feel it.', icon: '📍' },
            { num: '02', title: 'RECORD', desc: 'Capture symptom, severity, duration, trigger, and notes.', icon: '📝' },
            { num: '03', title: 'SYNC', desc: 'Store the symptom as a structured event on the Ontomorph digital twin.', icon: '🔄' },
            { num: '04', title: 'UNDERSTAND', desc: 'Reveal patterns, hotspots, trends, and history.', icon: '📊' },
          ].map((step) => (
            <div key={step.num} className="p-6 rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50 text-center backdrop-blur hover:shadow-2xl hover:scale-105 transition-all duration-300">
              <div className="text-4xl mb-4">{step.icon}</div>
              <p className="text-xs font-bold text-indigo-600 mb-2 tracking-wider">{step.num}</p>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{step.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
  5: (
    <div className="flex flex-col items-center justify-center h-full px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-white to-indigo-50/30" />
      <div className="relative z-10 w-full max-w-5xl">
        <h2 className="text-5xl font-extrabold text-slate-900 mb-10 text-center">INNOVATION</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-8 rounded-3xl border border-slate-200 bg-white shadow-lg">
            <p className="text-sm font-bold text-slate-400 mb-4 tracking-wider">TRADITIONAL</p>
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-sm text-slate-600">"Headache — 7/10 — Monday"</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-sm text-slate-600">"Stomach pain — 5/10 — Tuesday"</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-sm text-slate-600">"Back hurt — 8/10 — Friday"</p>
              </div>
            </div>
          </div>
          <div className="p-8 rounded-3xl border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-white shadow-xl shadow-indigo-100">
            <p className="text-sm font-bold text-indigo-600 mb-4 tracking-wider">SOMAMAP</p>
            <div className="space-y-2">
              {[
                ['WHERE', 'Head'],
                ['WHAT', 'Headache'],
                ['SEVERITY', '7/10'],
                ['DURATION', '3 hours'],
                ['TRIGGER', 'Lack of sleep'],
                ['WHEN', 'Monday'],
                ['TWIN', 'Structured event'],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center gap-3 p-2 rounded-lg bg-white/60">
                  <span className="text-xs font-bold text-indigo-600 w-20">{label}</span>
                  <span className="text-sm text-slate-700 font-medium">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-8 p-4 rounded-2xl bg-indigo-600 text-white text-center shadow-lg">
          <p className="text-lg font-semibold">Somamap adds a spatial dimension to symptom tracking.</p>
        </div>
      </div>
    </div>
  ),
  6: (
    <div className="flex flex-col items-center justify-center h-full px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-white to-slate-50" />
      <div className="relative z-10 w-full max-w-4xl">
        <h2 className="text-5xl font-extrabold text-slate-900 mb-10 text-center">CLINICAL VALUE</h2>
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm text-center">
            <p className="text-lg text-slate-700 italic">"I've been having chest pain sometimes."</p>
          </div>
          <div className="flex justify-center">
            <div className="h-8 w-px bg-gradient-to-b from-indigo-300 to-indigo-600" />
          </div>
          <div className="p-6 rounded-2xl bg-indigo-50 border border-indigo-100 shadow-sm">
            <p className="text-sm text-indigo-900 text-center font-medium">Chest • 6/10 • Every ~7 days • After exercise • 30 minutes</p>
          </div>
          <div className="flex justify-center">
            <div className="h-8 w-px bg-gradient-to-b from-indigo-300 to-indigo-600" />
          </div>
          <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-800 text-white shadow-lg text-center">
            <p className="text-lg font-semibold">"Chest symptoms recur approximately every 7 days."</p>
          </div>
        </div>
        <p className="text-xs text-slate-400 text-center mt-6">Somamap does not diagnose. It helps users preserve and communicate their symptom history.</p>
      </div>
    </div>
  ),
  7: (
    <div className="flex flex-col items-center justify-center h-full px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-white to-slate-50" />
      <div className="relative z-10 w-full max-w-5xl">
        <h2 className="text-5xl font-extrabold text-slate-900 mb-3 text-center">EXECUTION</h2>
        <p className="text-xl text-slate-500 text-center mb-10 font-light">Built. Connected. Working.</p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
          {['Interactive body mapping', 'Real-time symptom history', 'Pattern analysis', 'Longitudinal visualization', 'Digital twin sync'].map((label) => (
            <div key={label} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-md text-center hover:shadow-lg transition-shadow">
              <p className="text-xs font-semibold text-slate-700">{label}</p>
            </div>
          ))}
        </div>
        <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-600 to-indigo-800 text-white text-center shadow-2xl">
          <p className="text-2xl font-bold mb-2">From tap → to twin → to insight.</p>
          <p className="text-sm opacity-80">Next.js Full-Stack • Live Deployment • End-to-End Working Product</p>
        </div>
      </div>
    </div>
  ),
  8: (
    <div className="flex flex-col items-center justify-center h-full px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-white to-indigo-50/30" />
      <div className="relative z-10 w-full max-w-5xl">
        <h2 className="text-5xl font-extrabold text-slate-900 mb-10 text-center">USE OF THE PLATFORM</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">DT</div>
              <p className="text-sm font-bold text-slate-900">DIGITAL TWIN</p>
            </div>
            <div className="space-y-3">
              {[
                ['USER', 'Interacts with Somamap'],
                ['SOMAMAP', 'Captures symptom data'],
                ['STRUCTURED EVENT', 'eventType: "symptom"'],
                ['DIGITAL TWIN', 'Persistent health context'],
                ['INSIGHTS', 'Patterns + Trends + History'],
              ].map(([label, desc], i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-xs font-bold text-indigo-600 w-28">{label}</span>
                  <span className="text-xs text-slate-500 flex-1">{desc}</span>
                  {i < 4 && <span className="text-indigo-400">↓</span>}
                </div>
              ))}
            </div>
          </div>
          <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-600 to-indigo-800 text-white shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-bold">H</div>
              <p className="text-sm font-bold">HOLON CLINICAL TERMINOLOGY</p>
            </div>
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur">
                <p className="text-xs text-indigo-200 mb-1">USER INPUT</p>
                <p className="text-sm font-medium">"chest pai..."</p>
              </div>
              <div className="flex justify-center">
                <span className="text-indigo-300 text-xl">↓</span>
              </div>
              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur">
                <p className="text-xs text-indigo-200 mb-1">CLINICAL SUGGESTIONS</p>
                <p className="text-sm font-medium">Chest pain (finding)</p>
                <p className="text-xs text-indigo-200 mt-1">+ structured clinical concept</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
  9: (
    <div className="flex flex-col items-center justify-center h-full px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-white to-slate-50" />
      <div className="relative z-10 w-full max-w-5xl">
        <h2 className="text-5xl font-extrabold text-slate-900 mb-10 text-center">SEE IT IN ACTION</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { step: '1', title: 'TAP A BODY REGION', desc: 'Interactive body map' },
            { step: '2', title: 'LOG A SYMPTOM', desc: 'Severity, duration, trigger, notes' },
            { step: '3', title: 'SAVE TO DIGITAL TWIN', desc: 'Structured symptom event' },
            { step: '4', title: 'SEE IT IN TIMELINE', desc: 'Chronological history' },
            { step: '5', title: 'DISCOVER PATTERNS', desc: 'Recurrence analysis' },
            { step: '6', title: 'VISUALIZE TRENDS', desc: 'Severity charts over time' },
          ].map((item) => (
            <div key={item.step} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-md hover:shadow-xl transition-all group">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-bold mb-3 group-hover:scale-110 transition-transform">{item.step}</div>
              <p className="text-sm font-bold text-slate-900 mb-1">{item.title}</p>
              <p className="text-xs text-slate-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
  10: (
    <div className="flex flex-col items-center justify-center h-full px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-white to-indigo-50/30" />
      <div className="relative z-10 w-full max-w-4xl">
        <h2 className="text-5xl font-extrabold text-slate-900 mb-10 text-center">WHERE SOMAMAP GOES NEXT</h2>
        <div className="space-y-4">
          {[
            { phase: 'TODAY', desc: 'Personal symptom tracking', color: 'bg-indigo-600' },
            { phase: 'NEXT', desc: 'Structured patient symptom summaries', color: 'bg-indigo-500' },
            { phase: 'THEN', desc: 'Longitudinal health insights', color: 'bg-indigo-400' },
            { phase: 'FUTURE', desc: 'Integration with wearables and physiological data', color: 'bg-indigo-300' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-2xl ${item.color} flex items-center justify-center text-white font-bold text-sm shadow-lg`}>{item.phase}</div>
              <div className="flex-1 p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <p className="text-sm font-semibold text-slate-900">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-10 p-6 rounded-3xl bg-gradient-to-r from-indigo-600 to-indigo-800 text-white text-center shadow-2xl">
          <p className="text-xl font-semibold">Somamap turns "How have you been feeling?" into something you can actually see.</p>
        </div>
      </div>
    </div>
  ),
  11: (
    <div className="flex flex-col items-center justify-center h-full text-center px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-900" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-400/20 rounded-full blur-3xl" />
      <div className="relative z-10">
        <div className="w-32 h-40 mx-auto mb-8 relative">
          <svg viewBox="0 0 100 160" className="w-32 h-40 text-white/90">
            <ellipse cx="50" cy="25" rx="18" ry="22" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <path d="M30 45 Q50 55 70 45 L68 85 Q50 95 32 85 Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <path d="M35 85 L30 130" stroke="currentColor" strokeWidth="1.5" />
            <path d="M65 85 L70 130" stroke="currentColor" strokeWidth="1.5" />
            <path d="M45 90 L42 135" stroke="currentColor" strokeWidth="1.5" />
            <path d="M55 90 L58 135" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="50" cy="25" r="4" fill="white" opacity="0.8" />
            <circle cx="50" cy="60" r="4" fill="white" opacity="0.8" />
            <circle cx="30" cy="130" r="4" fill="white" opacity="0.8" />
            <circle cx="70" cy="130" r="4" fill="white" opacity="0.8" />
          </svg>
        </div>
        <h2 className="text-6xl font-extrabold text-white mb-4">SOMAMAP</h2>
        <p className="text-xl text-indigo-100 mb-8 font-light">Your symptoms have a story.<br />We give that story a map.</p>
        <p className="text-sm text-indigo-300">Built on Ontomorph</p>
      </div>
    </div>
  ),
};

export default function Presentation() {
  const [currentSlide, setCurrentSlide] = useState<SlideId>(1);

  const next = useCallback(() => {
    setCurrentSlide((s) => (s >= 11 ? 11 : ((s + 1) as SlideId)));
  }, []);

  const prev = useCallback(() => {
    setCurrentSlide((s) => (s <= 1 ? 1 : ((s - 1) as SlideId)));
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [next, prev]);

  return (
    <div className="fixed inset-0 bg-white text-slate-900 overflow-hidden select-none">
      <div
        key={currentSlide}
        className="h-full w-full flex flex-col"
        style={{
          animation: `slideIn 0.5s cubic-bezier(0.16, 1, 0.3, 1)`,
        }}
      >
        <div className="flex-1 flex items-center justify-center relative">
          {slideContent[currentSlide]}
        </div>
      </div>

      {/* Progress bar */}
      <div className="absolute top-0 left-0 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-500 ease-out" style={{ width: `${((currentSlide - 1) / 10) * 100}%` }} />

      {/* Navigation */}
      <div className="absolute bottom-6 left-0 right-0 flex items-center justify-center gap-4 z-50">
        <button
          onClick={prev}
          disabled={currentSlide === 1}
          className="px-5 py-2.5 rounded-full bg-white/90 backdrop-blur border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 disabled:opacity-20 disabled:cursor-not-allowed transition-all shadow-lg"
        >
          ← Prev
        </button>
        <span className="text-sm font-bold text-slate-700 bg-white/90 backdrop-blur px-4 py-2 rounded-full border border-slate-200 shadow-lg">
          {currentSlide} / 11
        </span>
        <button
          onClick={next}
          disabled={currentSlide === 11}
          className="px-5 py-2.5 rounded-full bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 disabled:opacity-20 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-200"
        >
          Next →
        </button>
      </div>

      {/* Dot indicators */}
      <div className="absolute bottom-16 left-0 right-0 flex justify-center gap-2 z-50">
        {slides.map((s) => (
          <button
            key={s.id}
            onClick={() => setCurrentSlide(s.id)}
            className={`rounded-full transition-all duration-300 ${
              currentSlide === s.id ? 'bg-indigo-600 w-6 h-2.5' : 'bg-slate-300 hover:bg-slate-400 w-2.5 h-2.5'
            }`}
          />
        ))}
      </div>

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
