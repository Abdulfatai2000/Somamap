'use client';

import React from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import type { SymptomEvent } from '@/lib/types';

const PALETTE = [
  '#4f46e5',
  '#0ea5e9',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
  '#ec4899',
  '#14b8a6',
  '#f97316',
  '#6366f1',
];

function getColorForLabel(label: string): string {
  let hash = 0;
  for (let i = 0; i < label.length; i++) {
    hash = label.charCodeAt(i) + ((hash << 5) - hash);
  }
  return PALETTE[Math.abs(hash) % PALETTE.length];
}

function getDateKey(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function formatDateShort(iso: string): string {
  const d = new Date(iso);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

interface ChartsPanelProps {
  events: SymptomEvent[];
}

export function ChartsPanel({ events }: ChartsPanelProps) {
  const validEvents = events.filter(
    e => typeof e.data?.severity === 'number' && e.data?.system && e.data?.symptomName
  );

  if (validEvents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-sm text-slate-400">No data yet.</p>
        <p className="text-xs text-slate-400 mt-1">Log a symptom to see your chart.</p>
      </div>
    );
  }

  const symptomNames = Array.from(
    new Set(validEvents.map(e => e.data!.symptomName).filter(Boolean))
  );

  const groupBySymptom = symptomNames.length >= 2;
  const groupField = groupBySymptom ? 'symptomName' : 'system';

  const groups = groupBySymptom
    ? symptomNames
    : Array.from(new Set(validEvents.map(e => e.data!.system).filter(Boolean)));

  const colors = groups.reduce<Record<string, string>>((acc, group) => {
    acc[group] = getColorForLabel(group);
    return acc;
  }, {});

  const allDates = Array.from(
    new Set(validEvents.map(e => getDateKey(e.occurredAt)))
  ).sort();

  const lineData = allDates.map(date => {
    const entry: Record<string, any> = { date: formatDateShort(date) };
    const dateEvents = validEvents.filter(e => getDateKey(e.occurredAt) === date);

    groups.forEach(group => {
      const groupEvents = dateEvents.filter(
        e => e.data![groupField as keyof typeof e.data] === group
      );
      if (groupEvents.length > 0) {
        const sum = groupEvents.reduce((s, ev) => s + ev.data!.severity, 0);
        entry[group] = Math.round((sum / groupEvents.length) * 10) / 10;
      } else {
        entry[group] = undefined;
      }
    });

    return entry;
  });

  const barData = groups.map(group => {
    const count = validEvents.filter(
      e => e.data![groupField as keyof typeof e.data] === group
    ).length;
    return { name: group, count };
  });

  const tooltipStyle = {
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.12)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
    background: 'rgba(15, 23, 42, 0.92)',
    backdropFilter: 'blur(12px)',
    color: '#f8fafc',
  };

  return (
    <div className="space-y-6 glass rounded-2xl border border-white/10 p-5 animate-fade-in-up">
      <div>
        <h4 className="text-sm font-semibold text-slate-200 mb-3">Severity over time</h4>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={lineData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: '#94a3b8' }}
              tickLine={false}
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
            />
            <YAxis
              domain={[1, 10]}
              tick={{ fontSize: 11, fill: '#94a3b8' }}
              tickLine={false}
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
            />
            <Tooltip contentStyle={tooltipStyle} />
            {groups.map(group => (
              <Line
                key={group}
                type="monotone"
                dataKey={group}
                stroke={colors[group]}
                strokeWidth={2}
                dot={{ r: 3, fill: colors[group], strokeWidth: 0 }}
                activeDot={{ r: 5, fill: colors[group], strokeWidth: 2, stroke: '#fff' }}
                connectNulls={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-slate-200 mb-3">Occurrences</h4>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={barData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11, fill: '#94a3b8' }}
              tickLine={false}
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 11, fill: '#94a3b8' }}
              tickLine={false}
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
            />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {barData.map(entry => (
                <Cell key={entry.name} fill={colors[entry.name]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-wrap gap-3 pt-2 border-t border-white/8">
        {groups.map(group => (
          <div key={group} className="flex items-center gap-1.5">
            <span
              className="inline-block w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: colors[group] }}
            />
            <span className="text-xs text-slate-300">{group}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
