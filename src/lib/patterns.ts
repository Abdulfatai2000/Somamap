/**
 * lib/patterns.ts
 *
 * Pure functions that take SymptomEvent[] and return human-readable
 * pattern insight strings for the PatternPanel component.
 *
 * All functions are side-effect free — no API calls, no imports of
 * anything non-standard. Safe to call in any environment.
 */

import type { SymptomEvent } from './types';

// ─── Helpers ────────────────────────────────────────────────────────────────

function daysBetween(a: Date, b: Date): number {
  return Math.abs(a.getTime() - b.getTime()) / (1000 * 60 * 60 * 24);
}

function startOfWeek(now: Date): Date {
  const d = new Date(now);
  d.setDate(d.getDate() - d.getDay()); // Sunday
  d.setHours(0, 0, 0, 0);
  return d;
}

function groupBy<T>(items: T[], key: (item: T) => string): Record<string, T[]> {
  return items.reduce((acc, item) => {
    const k = key(item);
    (acc[k] ??= []).push(item);
    return acc;
  }, {} as Record<string, T[]>);
}

function topKey(counts: Record<string, number>): string | null {
  let top: string | null = null;
  let max = 0;
  for (const [k, v] of Object.entries(counts)) {
    if (v > max) { max = v; top = k; }
  }
  return top;
}

// ─── 1. Most-logged region ───────────────────────────────────────────────────

export interface MostLoggedResult {
  region: string;
  count: number;
  scope: 'this week' | 'all time';
}

/**
 * Returns the body region most logged this week (Mon–Sun).
 * Falls back to all-time if no events exist in the current week.
 */
export function getMostLoggedRegion(
  events: SymptomEvent[],
  now = new Date()
): MostLoggedResult | null {
  if (events.length === 0) return null;

  const weekStart = startOfWeek(now);
  const thisWeek = events.filter(e => new Date(e.occurredAt) >= weekStart);

  const pool = thisWeek.length > 0 ? thisWeek : events;
  const scope: MostLoggedResult['scope'] = thisWeek.length > 0 ? 'this week' : 'all time';

  const counts = Object.fromEntries(
    Object.entries(groupBy(pool, e => e.data.system)).map(([k, v]) => [k, v.length])
  );

  const region = topKey(counts);
  if (!region) return null;

  return { region, count: counts[region], scope };
}

/** Human-readable copy for the most-logged region insight. */
export function describeMostLoggedRegion(events: SymptomEvent[], now?: Date): string | null {
  const result = getMostLoggedRegion(events, now);
  if (!result) return null;
  const { region, count, scope } = result;
  const plural = count === 1 ? 'entry' : 'entries';
  return `Your most-logged area ${scope} is your **${region}** (${count} ${plural}).`;
}

// ─── 2. Frequency interval ───────────────────────────────────────────────────

export interface FrequencyResult {
  region: string;
  /** Average days between occurrences, or null if only 1 event */
  avgIntervalDays: number | null;
  daysSinceLast: number;
}

/**
 * For the most-logged region (all-time), returns average recurrence interval
 * and days since the most recent event.
 */
export function getFrequencyInsight(
  events: SymptomEvent[],
  now = new Date()
): FrequencyResult | null {
  if (events.length === 0) return null;

  const byRegion = groupBy(events, e => e.data.system);

  // Find region with the most events (all-time, for a stable basis)
  const counts = Object.fromEntries(
    Object.entries(byRegion).map(([k, v]) => [k, v.length])
  );
  const region = topKey(counts);
  if (!region) return null;

  const regionEvents = byRegion[region]
    .map(e => new Date(e.occurredAt))
    .sort((a, b) => a.getTime() - b.getTime());

  const daysSinceLast = daysBetween(now, regionEvents[regionEvents.length - 1]);

  if (regionEvents.length < 2) {
    return { region, avgIntervalDays: null, daysSinceLast };
  }

  // Compute average gap between consecutive events
  let totalGap = 0;
  for (let i = 1; i < regionEvents.length; i++) {
    totalGap += daysBetween(regionEvents[i], regionEvents[i - 1]);
  }
  const avgIntervalDays = totalGap / (regionEvents.length - 1);

  return { region, avgIntervalDays, daysSinceLast };
}

/** Human-readable copy for the frequency insight. */
export function describeFrequency(events: SymptomEvent[], now?: Date): string | null {
  const result = getFrequencyInsight(events, now);
  if (!result) return null;

  const { region, avgIntervalDays, daysSinceLast } = result;
  const lastStr = daysSinceLast < 1
    ? 'today'
    : daysSinceLast < 2
    ? 'yesterday'
    : `${Math.round(daysSinceLast)} days ago`;

  if (avgIntervalDays === null) {
    return `Your **${region}** has been logged once, most recently ${lastStr}.`;
  }

  const interval = Math.round(avgIntervalDays);
  return `Your **${region}** occurs roughly every **${interval} day${interval === 1 ? '' : 's'}**, most recently ${lastStr}.`;
}

// ─── 3. Severity trend ───────────────────────────────────────────────────────

export type SeverityTrend = 'rising' | 'falling' | 'steady';

export interface SeverityTrendResult {
  region: string;
  trend: SeverityTrend;
  recentAvg: number;
  olderAvg: number;
}

/**
 * Compares average severity of the most recent half of events vs the older half
 * for the most-logged region. Returns null if fewer than 3 events.
 */
export function getSeverityTrend(
  events: SymptomEvent[],
  now = new Date()
): SeverityTrendResult | null {
  const freq = getFrequencyInsight(events, now);
  if (!freq) return null;

  const regionEvents = events
    .filter(e => e.data.system === freq.region)
    .sort((a, b) => new Date(a.occurredAt).getTime() - new Date(b.occurredAt).getTime());

  if (regionEvents.length < 3) return null;

  const mid = Math.floor(regionEvents.length / 2);
  const older = regionEvents.slice(0, mid);
  const recent = regionEvents.slice(mid);

  const avg = (arr: SymptomEvent[]) =>
    arr.reduce((s, e) => s + e.data.severity, 0) / arr.length;

  const olderAvg = avg(older);
  const recentAvg = avg(recent);
  const diff = recentAvg - olderAvg;

  const trend: SeverityTrend = diff > 0.75 ? 'rising' : diff < -0.75 ? 'falling' : 'steady';

  return { region: freq.region, trend, recentAvg, olderAvg };
}

/** Human-readable copy for the severity trend insight. */
export function describeSeverityTrend(events: SymptomEvent[], now?: Date): string | null {
  const result = getSeverityTrend(events, now);
  if (!result) return null;

  const { region, trend, recentAvg } = result;
  const avgStr = recentAvg.toFixed(1);

  switch (trend) {
    case 'rising':
      return `Severity in your **${region}** is trending **upward** (recent avg: ${avgStr}/10) — consider logging more detail.`;
    case 'falling':
      return `Severity in your **${region}** is trending **downward** (recent avg: ${avgStr}/10) — things are improving.`;
    case 'steady':
      return `Severity in your **${region}** has been **steady** around ${avgStr}/10.`;
  }
}
