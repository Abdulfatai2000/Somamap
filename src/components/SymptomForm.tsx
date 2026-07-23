import React, { useState } from 'react';
import { BodySystem } from '@/lib/constants';

interface SymptomFormProps {
  region: BodySystem;
  onClose: () => void;
}

export function SymptomForm({ region, onClose }: SymptomFormProps) {
  const [name, setName] = useState('');
  const [severity, setSeverity] = useState<number>(5);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');
    
    // MOCK PAYLOAD LOGGING (Phase 3 Stub)
    const payload = {
      eventType: 'symptom_log',
      occurredAt: new Date().toISOString(),
      title: name || `Symptom in ${region}`,
      description: notes,
      data: {
        system: region,
        severity: severity,
        symptomName: name,
      }
    };

    try {
      const res = await fetch('/api/twin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Couldn't save, try again.");
      }
      
      console.log("Mock Payload Sent:", data);
      onClose();
    } catch (err: any) {
      console.error("Submission failed:", err);
      setErrorMsg("Couldn't save, try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
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
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-slate-700">
              Symptom Name
            </label>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Sharp pain, Aching..."
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
            />
          </div>

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
              min="1"
              max="10"
              value={severity}
              onChange={(e) => setSeverity(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-xs font-medium text-slate-400 px-1">
              <span>Mild</span>
              <span>Severe</span>
            </div>
          </div>

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

          <div className="pt-2 space-y-3">
            {errorMsg && (
              <div className="text-red-500 text-sm font-medium text-center">
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
