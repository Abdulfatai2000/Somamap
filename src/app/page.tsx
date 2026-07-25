'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

const navLinks = [
  { href: '#how-it-works', label: 'How It Works' },
  { href: '#why', label: 'Why Somamap' },
  { href: '#twin', label: 'Digital Twin' },
  { href: '#holon', label: 'HOLON' },
];

const steps = [
  { num: '01', title: 'LOCATE', desc: 'Tap where you feel it on the interactive body map.' },
  { num: '02', title: 'RECORD', desc: 'Capture symptom, severity, duration, trigger, and notes.' },
  { num: '03', title: 'SYNC', desc: 'Store the symptom as a structured event on your Ontomorph digital twin.' },
  { num: '04', title: 'UNDERSTAND', desc: 'Reveal patterns, hotspots, trends, and history over time.' },
];

const dimensions = ['WHERE', 'WHEN', 'SEVERITY', 'TRIGGER', 'CONTEXT'];

const comparisonLeft = [
  ['Headache', '7/10'],
  ['Stomach pain', '5/10'],
  ['Back hurt', '8/10'],
];

const comparisonRight = [
  ['WHERE', 'Head'],
  ['WHAT', 'Headache'],
  ['SEVERITY', '7/10'],
  ['DURATION', '3 hours'],
  ['TRIGGER', 'Lack of sleep'],
  ['WHEN', 'Monday'],
  ['TWIN', 'Structured event']
];

const roadmap = [
  { phase: 'TODAY', desc: 'Personal symptom tracking', color: 'bg-indigo-600' },
  { phase: 'NEXT', desc: 'Structured patient symptom summaries', color: 'bg-indigo-500' },
  { phase: 'THEN', desc: 'Longitudinal health insights', color: 'bg-indigo-400' },
  { phase: 'FUTURE', desc: 'Integration with wearables and physiological data', color: 'bg-indigo-300' },
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

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [assistantInput, setAssistantInput] = useState('');
  const [assistantMessages, setAssistantMessages] = useState<{ from: 'user' | 'bot'; text: string }[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
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
    <div className="min-h-screen bg-[#0f172a] text-slate-100 font-sans selection:bg-indigo-500/30 relative overflow-x-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-500/15 rounded-full blur-3xl" />
        <div className="absolute top-1/3 left-0 -translate-x-1/2 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 translate-x-1/3 w-[500px] h-[500px] bg-cyan-500/8 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[length:24px_24px] opacity-60" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-strong border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shadow-lg shadow-indigo-500/40">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" />
                <line x1="16" y1="8" x2="2" y2="22" />
                <line x1="17.5" y1="15" x2="9" y2="6.5" />
              </svg>
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-purple-300">Somamap</span>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map(link => (
              <button key={link.href} onClick={() => scrollTo(link.href.replace('#', ''))} className="text-sm text-slate-300 hover:text-indigo-300 transition-colors">
                {link.label}
              </button>
            ))}
            <Link href="/app" className="text-sm font-semibold px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-500/30">
              Explore Somamap
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-slate-300 hover:text-white transition-colors">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {menuOpen ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></> : <><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></>}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden glass-strong border-t border-white/10 px-6 py-4 space-y-3">
            {navLinks.map(link => (
              <button key={link.href} onClick={() => scrollTo(link.href.replace('#', ''))} className="block w-full text-left text-sm text-slate-300 hover:text-indigo-300 transition-colors">
                {link.label}
              </button>
            ))}
            <Link href="/app" className="block w-full text-center text-sm font-semibold px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 transition-colors">
              Explore Somamap
            </Link>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-white/10 text-xs font-medium text-indigo-300 mb-8">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Built on Ontomorph Digital Twin Platform
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6 leading-tight">
            Your body has a story.
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">Somamap</span> gives it a map.
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Track where symptoms occur, understand how they change over time, and turn your experiences into structured health data connected to your digital twin.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/app" className="px-8 py-3.5 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-500/30 text-base">
              Explore Somamap
            </Link>
            <button onClick={() => scrollTo('how-it-works')} className="px-8 py-3.5 rounded-xl glass border border-white/10 text-slate-200 font-semibold hover:bg-white/10 transition-colors text-base">
              See How It Works
            </button>
          </div>
        </div>

        {/* Hero body map visual */}
        <div className="mt-16 relative max-w-4xl mx-auto">
          <div className="absolute -inset-8 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-[3rem] blur-3xl" />
          <div className="relative glass rounded-3xl border border-white/10 p-8 shadow-2xl">
            <svg viewBox="0 0 240 480" className="w-full max-w-[280px] mx-auto h-auto">
              <defs>
                <filter id="heroGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
                  <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
              </defs>
              {[
                { cx: 120, cy: 50, r: 36, fill: 'rgba(99,102,241,0.15)', stroke: 'rgba(99,102,241,0.6)', label: 'Headache' },
                { cx: 120, cy: 138, r: 30, fill: 'rgba(239,68,68,0.15)', stroke: 'rgba(239,68,68,0.6)', label: 'Chest pain' },
                { cx: 68, cy: 110, r: 18, fill: 'rgba(249,115,22,0.15)', stroke: 'rgba(249,115,22,0.6)', label: 'Shoulder' },
                { cx: 120, cy: 230, r: 24, fill: 'rgba(245,158,11,0.15)', stroke: 'rgba(245,158,11,0.6)', label: 'Abdomen' },
              ].map((spot, i) => (
                <g key={i} filter="url(#heroGlow)">
                  <circle cx={spot.cx} cy={spot.cy} r={spot.r} fill={spot.fill} stroke={spot.stroke} strokeWidth="2" />
                  <circle cx={spot.cx} cy={spot.cy} r="4" fill={spot.stroke} opacity="0.9" />
                </g>
              ))}
              <ellipse cx="120" cy="25" rx="18" ry="22" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
              <path d="M30 45 Q50 55 70 45 L68 85 Q50 95 32 85 Z" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
              <path d="M35 85 L30 130" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
              <path d="M65 85 L70 130" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
              <path d="M45 90 L42 135" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
              <path d="M55 90 L58 135" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
              <path d="M82 98 L158 98 L148 182 L92 182 Z" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
              <path d="M92 182 L148 182 L143 262 L97 262 Z" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
              <path d="M92 262 L148 262 L148 282 L92 282 Z" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
              <path d="M92 282 L84 362 L114 362 L118 282 Z" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
              <path d="M148 282 L156 362 L126 362 L122 282 Z" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
            </svg>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="py-20 px-6 relative">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white text-center mb-4">Symptoms don&apos;t happen in isolation.</h2>
          <p className="text-lg text-slate-400 text-center mb-12 max-w-2xl mx-auto">Your body remembers. Your health records often don&apos;t.</p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
            {dimensions.map(d => (
              <div key={d} className="p-5 rounded-2xl glass border border-white/10 text-center">
                <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest">{d}</p>
              </div>
            ))}
          </div>
          <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-600 to-indigo-800 text-white text-center shadow-2xl">
            <p className="text-lg font-medium">A symptom isn&apos;t just a word.</p>
            <p className="text-sm opacity-90 mt-1">It&apos;s a location + severity + duration + trigger + time.</p>
          </div>
        </div>
      </section>

      {/* Big Idea */}
      <section className="py-20 px-6 relative">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-8">What if your symptoms had a map?</h2>
          <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
            {['BODY', 'SYMPTOM', 'STRUCTURED DATA', 'DIGITAL TWIN'].map((label, i) => (
              <React.Fragment key={label}>
                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${i % 2 === 0 ? 'glass border border-white/10 text-slate-300' : 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'}`}>{label}</span>
                {i < 3 && <span className="text-indigo-400 text-lg">→</span>}
              </React.Fragment>
            ))}
          </div>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Somamap turns subjective symptom experiences into structured, spatial, longitudinal health data.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 px-6 relative">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-extrabold text-white text-center mb-12">How Somamap Works</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {steps.map(step => (
              <div key={step.num} className="p-6 rounded-3xl glass border border-white/10 text-center hover:bg-white/10 transition-colors">
                <p className="text-xs font-bold text-indigo-400 mb-2 tracking-wider">{step.num}</p>
                <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product */}
      <section className="py-20 px-6 relative">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-extrabold text-white text-center mb-4">Meet your body&apos;s digital map.</h2>
          <p className="text-slate-400 text-center mb-12">The actual Somamap interface.</p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: 'Interactive Body Map', desc: 'Tap regions to log symptoms with visual severity feedback' },
              { title: 'Patterns & Timeline', desc: 'Discover recurrence, hotspots, and severity trends' },
              { title: 'Charts & Insights', desc: 'Longitudinal visualization of your symptom history' },
            ].map(item => (
              <div key={item.title} className="rounded-2xl glass border border-white/10 p-6 hover:bg-white/10 transition-colors">
                <div className="w-full aspect-[4/3] rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/5 flex items-center justify-center mb-4">
                  <span className="text-indigo-300 font-semibold">{item.title}</span>
                </div>
                <p className="text-sm text-slate-400 text-center">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Somamap */}
      <section id="why" className="py-20 px-6 relative">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-extrabold text-white text-center mb-4">A symptom isn&apos;t just a word.</h2>
          <p className="text-slate-400 text-center mb-12">It&apos;s a place, a pattern, and a story.</p>
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="p-6 rounded-3xl glass border border-white/10">
              <p className="text-sm font-bold text-slate-500 mb-4 tracking-wider">TRADITIONAL</p>
              <div className="space-y-2">
                {comparisonLeft.map(([a, b]) => (
                  <div key={a} className="p-3 rounded-xl bg-white/5 border border-white/5">
                    <p className="text-sm text-slate-300">{a} — {b}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-6 rounded-3xl border border-indigo-500/30 bg-indigo-500/5">
              <p className="text-sm font-bold text-indigo-400 mb-4 tracking-wider">SOMAMAP</p>
              <div className="space-y-2">
                {comparisonRight.map(([label, value]) => (
                  <div key={label} className="flex items-center gap-3 p-2 rounded-lg bg-white/5">
                    <span className="text-xs font-bold text-indigo-400 w-20">{label}</span>
                    <span className="text-sm text-slate-300 font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <p className="text-center text-indigo-400 font-semibold text-lg">Somamap adds a spatial dimension to symptom tracking.</p>
        </div>
      </section>

      {/* Patterns */}
      <section className="py-20 px-6 relative">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-extrabold text-white mb-4">Patterns become visible over time.</h2>
          <p className="text-slate-400 mb-12">Recurrence, hotspots, and severity trends — automatically derived from your symptom history.</p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { label: 'Recurrence', icon: '↻', desc: 'How often symptoms repeat' },
              { label: 'Hotspot', icon: '◎', desc: 'Most frequently logged region' },
              { label: 'Severity Trend', icon: '📈', desc: 'How intensity changes over time' },
            ].map(item => (
              <div key={item.label} className="p-6 rounded-3xl glass border border-white/10">
                <div className="text-3xl mb-3">{item.icon}</div>
                <p className="text-sm font-bold text-indigo-400 mb-1">{item.label}</p>
                <p className="text-xs text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Digital Twin */}
      <section id="twin" className="py-20 px-6 relative">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-extrabold text-white text-center mb-12">Your symptoms become part of your digital twin.</h2>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              {[
                ['USER', 'Interacts with Somamap'],
                ['SOMAMAP', 'Captures symptom data'],
                ['STRUCTURED EVENT', 'eventType: "symptom"'],
                ['DIGITAL TWIN', 'Persistent health context'],
                ['INSIGHTS', 'Patterns + Trends + History'],
              ].map(([label, desc], i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-xs font-bold text-indigo-400 w-28">{label}</span>
                  <span className="text-xs text-slate-400 flex-1">{desc}</span>
                  {i < 4 && <span className="text-indigo-500">↓</span>}
                </div>
              ))}
            </div>
            <div className="p-6 rounded-3xl glass border border-white/10">
              <p className="text-sm font-bold text-indigo-400 mb-3">EXAMPLE EVENT</p>
              <div className="space-y-2 font-mono text-xs text-slate-300">
                <p>eventType: <span className="text-indigo-300">"symptom"</span></p>
                <p>system: <span className="text-indigo-300">"chest"</span></p>
                <p>severity: <span className="text-indigo-300">6</span></p>
                <p>trigger: <span className="text-indigo-300">"after exercise"</span></p>
                <p>occurredAt: <span className="text-indigo-300">"2026-07-25T..."</span></p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOLON */}
      <section id="holon" className="py-20 px-6 relative">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-extrabold text-white mb-4">Speak naturally. Understand clinically.</h2>
          <p className="text-slate-400 mb-12 max-w-2xl mx-auto">HOLON bridges everyday symptom language with structured clinical terminology.</p>
          <div className="p-6 rounded-3xl glass border border-white/10 text-left max-w-xl mx-auto">
            <p className="text-sm text-slate-500 mb-2">USER INPUT</p>
            <p className="text-base text-white mb-4">"My chest has been hurting after exercise."</p>
            <div className="flex justify-center my-4"><span className="text-indigo-400 text-xl">↓</span></div>
            <p className="text-sm text-slate-500 mb-2">HOLON SUGGESTION</p>
            <p className="text-base text-indigo-300">Chest pain (finding)</p>
            <p className="text-xs text-slate-500 mt-1">+ structured clinical concept</p>
          </div>
        </div>
      </section>

      {/* Health Story */}
      <section className="py-20 px-6 relative">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-extrabold text-white mb-4">From scattered moments to a clearer health story.</h2>
          <p className="text-slate-400 mb-12">Your symptom history, visualized and organized.</p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-slate-300">
            {['Symptom', 'History', 'Pattern', 'Insight'].map((step, i) => (
              <React.Fragment key={step}>
                <span className="px-4 py-2 rounded-full glass border border-white/10">{step}</span>
                {i < 3 && <span className="text-indigo-400">→</span>}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* Future */}
      <section className="py-20 px-6 relative">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-extrabold text-white text-center mb-12">Where Somamap goes next.</h2>
          <div className="space-y-4">
            {roadmap.map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-2xl ${item.color} flex items-center justify-center text-white font-bold text-sm shadow-lg`}>{item.phase}</div>
                <div className="flex-1 p-4 rounded-2xl glass border border-white/10">
                  <p className="text-sm font-semibold text-slate-200">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6 relative">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">Your symptoms have a story.
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">Give that story a map.</span>
          </h2>
          <p className="text-lg text-slate-400 mb-10">Explore Somamap and see your health experience from a new perspective.</p>
          <Link href="/app" className="inline-block px-10 py-4 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-500/30 text-lg">
            Explore Somamap
          </Link>
          <p className="text-xs text-slate-500 mt-6">Built on the Ontomorph Digital Twin Platform • Powered by Ontomorph + HOLON</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shadow-lg shadow-indigo-500/40">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" />
                <line x1="16" y1="8" x2="2" y2="22" />
                <line x1="17.5" y1="15" x2="9" y2="6.5" />
              </svg>
            </div>
            <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-purple-300">Somamap</span>
          </div>
          <div className="flex flex-wrap items-center gap-6 text-sm text-slate-400">
            {navLinks.map(link => (
              <button key={link.href} onClick={() => scrollTo(link.href.replace('#', ''))} className="hover:text-indigo-300 transition-colors">
                {link.label}
              </button>
            ))}
            <a href="https://ontomorph.com" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-300 transition-colors">Ontomorph</a>
          </div>
          <p className="text-xs text-slate-500">Built for the Ontomorph Hackathon • OAU</p>
        </div>
      </footer>

      {/* Assistant Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {!assistantOpen && (
          <button
            onClick={() => setAssistantOpen(true)}
            className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30 flex items-center justify-center hover:scale-110 transition-transform"
            title="Ask Somamap"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </button>
        )}

        {/* Assistant Panel */}
        {assistantOpen && (
          <div className="absolute bottom-16 right-0 w-80 sm:w-96 rounded-3xl glass-strong border border-white/10 shadow-2xl overflow-hidden animate-fade-in-up">
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
                    <button key={q} onClick={() => { setAssistantInput(q); handleAssistantSend(); }} className="block w-full text-left text-xs text-indigo-300 hover:text-indigo-200 glass rounded-lg px-3 py-2 border border-white/5">
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
    </div>
  );
}
