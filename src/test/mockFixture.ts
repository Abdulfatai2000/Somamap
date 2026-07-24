/**
 * src/test/mockFixture.ts
 *
 * Hardcoded fixture of 10 fake SymptomEvent entries spanning multiple
 * body regions and dates. Available for Storybook / unit tests.
 *
 * Note: The main app (src/app/page.tsx) feeds real twin events into
 * PatternPanel; this fixture is not used in the live flow.
 */

import type { SymptomEvent } from '@/lib/types';

/** Convenience helper so dates read clearly in the fixture. */
function daysAgo(n: number, hour = 10): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
}

export const MOCK_EVENTS: SymptomEvent[] = [
  // ── chest (5 entries — most-logged all-time) ──────────────────────────────
  {
    id: 'evt-001',
    twinId: 'twin-demo',
    eventType: 'symptom_log',
    occurredAt: daysAgo(28),
    title: 'Tight chest',
    data: { system: 'chest', severity: 4, symptomName: 'Tight chest' },
  },
  {
    id: 'evt-002',
    twinId: 'twin-demo',
    eventType: 'symptom_log',
    occurredAt: daysAgo(21),
    title: 'Chest discomfort',
    data: { system: 'chest', severity: 5, symptomName: 'Chest discomfort', resolvedConceptId: '29857009', resolvedTerm: 'Chest pain (finding)' },
  },
  {
    id: 'evt-003',
    twinId: 'twin-demo',
    eventType: 'symptom_log',
    occurredAt: daysAgo(14),
    title: 'Chest tightness',
    data: { system: 'chest', severity: 6, symptomName: 'Chest tightness', resolvedConceptId: '29857009', resolvedTerm: 'Chest pain (finding)' },
  },
  {
    id: 'evt-004',
    twinId: 'twin-demo',
    eventType: 'symptom_log',
    occurredAt: daysAgo(7),
    title: 'Sharp chest pain',
    data: { system: 'chest', severity: 7, symptomName: 'Sharp chest pain' },
  },
  {
    id: 'evt-005',
    twinId: 'twin-demo',
    eventType: 'symptom_log',
    occurredAt: daysAgo(1),
    title: 'Chest pressure',
    data: { system: 'chest', severity: 8, symptomName: 'Chest pressure' },
  },

  // ── head (3 entries — second-most frequent) ───────────────────────────────
  {
    id: 'evt-006',
    twinId: 'twin-demo',
    eventType: 'symptom_log',
    occurredAt: daysAgo(20),
    title: 'Headache',
    data: { system: 'head', severity: 3, symptomName: 'Headache', resolvedConceptId: '25064002', resolvedTerm: 'Headache (finding)' },
  },
  {
    id: 'evt-007',
    twinId: 'twin-demo',
    eventType: 'symptom_log',
    occurredAt: daysAgo(10),
    title: 'Migraine aura',
    data: { system: 'head', severity: 6, symptomName: 'Migraine aura' },
  },
  {
    id: 'evt-008',
    twinId: 'twin-demo',
    eventType: 'symptom_log',
    occurredAt: daysAgo(2),
    title: 'Throbbing headache',
    data: { system: 'head', severity: 5, symptomName: 'Throbbing headache' },
  },

  // ── abdomen (1 entry) ─────────────────────────────────────────────────────
  {
    id: 'evt-009',
    twinId: 'twin-demo',
    eventType: 'symptom_log',
    occurredAt: daysAgo(5),
    title: 'Stomach cramp',
    data: { system: 'abdomen', severity: 4, symptomName: 'Stomach cramp' },
  },

  // ── left-leg (1 entry) ────────────────────────────────────────────────────
  {
    id: 'evt-010',
    twinId: 'twin-demo',
    eventType: 'symptom_log',
    occurredAt: daysAgo(3),
    title: 'Knee ache after walk',
    data: { system: 'left-leg', severity: 2, symptomName: 'Knee ache' },
  },
];
