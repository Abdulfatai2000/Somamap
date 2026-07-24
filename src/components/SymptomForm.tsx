'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { BodySystem } from '@/lib/constants';
import type { HolonConcept } from '@/lib/types';

interface SymptomFormProps {
  region: BodySystem;
  onClose: () => void;
  selectedDate?: string | null;
}

export function SymptomForm({ region, onClose, selectedDate }: SymptomFormProps) {
  const [name, setName] = useState('');
  const [symptomType, setSymptomType] = useState('pain');
  const [severity, setSeverity] = useState<number>(5);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // HOLON suggestion state
  const [suggestions, setSuggestions] = useState<HolonConcept[]>([]);
  const [isFetchingSuggestions, setIsFetchingSuggestions] = useState(false);
  const [acceptedConcept, setAcceptedConcept] = useState<HolonConcept | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const justAcceptedRef = useRef(false);

  // Debounced HOLON search — fires 350ms after the user stops typing
  const fetchSuggestions = useCallback(async (query: string) => {
    if (query.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    setIsFetchingSuggestions(true);
    try {
      const res = await fetch(`/api/holon?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      const rawHits = data.hits ?? [];
      const cleanHits = rawHits.filter((h: any) => h.term && !h.term.toLowerCase().includes('unspecified'));
      setSuggestions(cleanHits);
      setShowSuggestions(cleanHits.length > 0);
    } catch {
      setSuggestions([]);
    } finally {
      setIsFetchingSuggestions(false);
    }
  }, []);

  useEffect(() => {
    // Clear any previously accepted concept when the user types again
    if (acceptedConcept && name !== acceptedConcept.term) {
      setAcceptedConcept(null);
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(name), 350);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name]);

  const handleAcceptConcept = (concept: HolonConcept) => {
    setAcceptedConcept(concept);
    setName(concept.term);
    setSuggestions([]);
    setShowSuggestions(false);
    justAcceptedRef.current = true;
    setTimeout(() => { justAcceptedRef.current = false; }, 400);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    if (selectedDate) {
      const [year, month, day] = selectedDate.split('-').map(Number);
      const selected = new Date(year, month - 1, day);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      selected.setHours(0, 0, 0, 0);
      
      if (selected.getTime() !== today.getTime()) {
        setErrorMsg('Symptoms can only be logged for today. Please select today\'s date.');
        setIsSubmitting(false);
        return;
      }
    }

    let occurredAt: string;
    if (selectedDate) {
      const [year, month, day] = selectedDate.split('-').map(Number);
      const d = new Date(year, month - 1, day);
      const now = new Date();
      d.setHours(now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds());
      occurredAt = d.toISOString();
    } else {
      occurredAt = new Date().toISOString();
    }

    const payload = {
      eventType: 'symptom_log',
      occurredAt,
      title: name || `Symptom in ${region}`,
      description: notes,
      data: {
        system: region,
        severity,
        symptomName: name,
        symptomType,
        // HOLON-resolved fields — only present if user accepted a suggestion
        ...(acceptedConcept && {
          resolvedConceptId: acceptedConcept.conceptId,
          resolvedTerm: acceptedConcept.term,
        }),
      },
    };

    try {
      const res = await fetch('/api/twin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Couldn't save, try again.");
      console.log('Symptom logged:', data);
      onClose();
    } catch (err: any) {
      console.error('Submission failed:', err);
      setErrorMsg("Couldn't save, try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            Log Symptom
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-medium uppercase tracking-wider">
              {region}
            </span>
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1"
            aria-label="Close"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* ── Symptom Type ───────────────────────────────────────────── */}
          <div className="space-y-2">
            <label htmlFor="sym-type" className="block text-sm font-medium text-slate-700">
              Symptom Type
            </label>
            <select
              id="sym-type"
              value={symptomType}
              onChange={(e) => setSymptomType(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
            >
              <option value="pain">Pain</option>
              <option value="itch">Itch</option>
              <option value="swelling">Swelling</option>
              <option value="numbness">Numbness</option>
              <option value="stiffness">Stiffness</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* ── Symptom Name + HOLON suggestions ─────────────────────── */}
          <div className="space-y-2">
            <label htmlFor="sym-name" className="block text-sm font-medium text-slate-700">
              Symptom Name {symptomType === 'other' ? '' : <span className="text-slate-400 font-normal">(Optional)</span>}
            </label>
            <div className="relative">
              <input
                id="sym-name"
                type="text"
                required={symptomType === 'other'}
                value={name}
                onChange={(e) => setName(e.target.value)}
                onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                placeholder={symptomType === 'other' ? 'Describe your symptom...' : 'Optional detail (e.g. sharp, dull, throbbing)...'}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                autoComplete="off"
              />
              {/* Spinner while fetching */}
              {isFetchingSuggestions && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <svg className="animate-spin h-4 w-4 text-indigo-400" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                </div>
              )}
              {/* Suggestion dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <ul className="absolute z-10 mt-1 w-full bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden">
                  <li className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider bg-slate-50 border-b border-slate-100">
                    Clinical terms — tap to accept
                  </li>
                  {suggestions.map((concept) => (
                    <li key={concept.conceptId}>
                      <button
                        type="button"
                        onMouseDown={() => handleAcceptConcept(concept)}
                        className="w-full text-left px-4 py-2.5 hover:bg-indigo-50 transition-colors text-sm"
                      >
                        <span className="font-medium text-slate-800">{concept.term}</span>
                        <span className="ml-2 text-[11px] text-slate-400 font-mono">{concept.conceptId}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {/* Accepted concept badge */}
            {acceptedConcept && (
              <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-1.5">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                <span>Clinical term accepted: <strong>{acceptedConcept.term}</strong></span>
                <button
                  type="button"
                  onClick={() => { setAcceptedConcept(null); setName(''); }}
                  className="ml-auto text-emerald-500 hover:text-emerald-700"
                  aria-label="Clear accepted concept"
                >×</button>
              </div>
            )}
          </div>

          {/* ── Severity ─────────────────────────────────────────────── */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label htmlFor="severity" className="block text-sm font-medium text-slate-700">
                Severity
              </label>
              <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                {severity} / 10
              </span>
            </div>
            <input
              id="severity"
              type="range"
              min="1" max="10"
              value={severity}
              onChange={(e) => setSeverity(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-xs font-medium text-slate-400 px-1">
              <span>Mild</span><span>Severe</span>
            </div>
          </div>

          {/* ── Notes ────────────────────────────────────────────────── */}
          <div className="space-y-2">
            <label htmlFor="notes" className="block text-sm font-medium text-slate-700">
              Additional Notes <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <textarea
              id="notes"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="When did it start? What makes it better or worse?"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all resize-none"
            />
          </div>

          {/* ── Submit ───────────────────────────────────────────────── */}
          <div className="pt-2 space-y-3">
            {errorMsg && (
              <div className="text-red-500 text-sm font-medium text-center" role="alert">
                {errorMsg}
              </div>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 px-4 text-white rounded-xl font-medium shadow-sm transition-all ${
                isSubmitting
                  ? 'bg-indigo-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200 active:scale-[0.98]'
              }`}
            >
              {isSubmitting ? 'Saving...' : 'Save Symptom Log'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
