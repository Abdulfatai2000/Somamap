import React, { useState } from 'react';
import { BodySystem } from '@/lib/constants';

interface BodyMapProps {
  onRegionSelect: (region: BodySystem) => void;
  selectedRegion?: BodySystem | null;
}

export function BodyMap({ onRegionSelect, selectedRegion }: BodyMapProps) {
  const [view, setView] = useState<'front' | 'back'>('front');

  const width = 240;
  const height = 480;

  const getRegionClass = (region: BodySystem) => {
    const isActive = selectedRegion === region;
    return `cursor-pointer transition-all duration-200 stroke-[2px] ${
      isActive 
        ? 'fill-indigo-500 stroke-indigo-600' 
        : 'fill-slate-100 stroke-slate-300 hover:fill-indigo-100 hover:stroke-indigo-300'
    }`;
  };

  return (
    <div className="flex flex-col items-center max-w-sm w-full mx-auto p-6 bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
      <div className="flex p-1 space-x-1 mb-8 bg-slate-100/80 rounded-2xl backdrop-blur-md w-full">
        <button
          onClick={() => setView('front')}
          className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
            view === 'front' 
              ? 'bg-white text-indigo-700 shadow-sm' 
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Front View
        </button>
        <button
          onClick={() => setView('back')}
          className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
            view === 'back' 
              ? 'bg-white text-indigo-700 shadow-sm' 
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Back View
        </button>
      </div>

      <div className="relative">
        <svg width={width} height={height} viewBox="0 0 240 480" className="drop-shadow-sm">
          {/* Head */}
          <circle 
            cx="120" 
            cy="50" 
            r="35" 
            className={getRegionClass('head')} 
            onClick={() => onRegionSelect('head')} 
          />
          
          {view === 'front' ? (
            <>
              {/* Chest */}
              <path 
                d="M 85 95 L 155 95 L 145 180 L 95 180 Z" 
                className={getRegionClass('chest')} 
                onClick={() => onRegionSelect('chest')} 
              />
              {/* Abdomen */}
              <path 
                d="M 95 180 L 145 180 L 140 260 L 100 260 Z" 
                className={getRegionClass('abdomen')} 
                onClick={() => onRegionSelect('abdomen')} 
              />
            </>
        ) : (
            <>
              {/* Back */}
              <path 
                d="M 85 95 L 155 95 L 140 260 L 100 260 Z" 
                className={getRegionClass('back')} 
                onClick={() => onRegionSelect('back')} 
              />
            </>
          )}

          {/* Arms (Anatomical Left/Right from Patient perspective) */}
          {/* Patient's Right Arm (Screen Left) */}
          <path 
            d="M 80 95 L 45 220 L 60 220 L 90 140 Z" 
            className={getRegionClass('right-arm')} 
            onClick={() => onRegionSelect('right-arm')} 
          />
          
          {/* Patient's Left Arm (Screen Right) */}
          <path 
            d="M 160 95 L 195 220 L 180 220 L 150 140 Z" 
            className={getRegionClass('left-arm')} 
            onClick={() => onRegionSelect('left-arm')} 
          />
          
          {/* Legs */}
          {/* Patient's Right Leg (Screen Left) */}
          <path 
            d="M 100 260 L 85 430 L 115 430 L 120 260 Z" 
            className={getRegionClass('right-leg')} 
            onClick={() => onRegionSelect('right-leg')} 
          />
          
          {/* Patient's Left Leg (Screen Right) */}
          <path 
            d="M 140 260 L 155 430 L 125 430 L 120 260 Z" 
            className={getRegionClass('left-leg')} 
            onClick={() => onRegionSelect('left-leg')} 
          />
        </svg>
      </div>
    </div>
  );
}
