/**
 * scripts/seed-demo.ts
 *
 * Seeds the connected sandbox twin with realistic demo symptom events
 * spanning ~2 weeks across multiple body regions. Run once before demo:
 *
 *   npx tsx scripts/seed-demo.ts
 *
 * Or with a specific grant token:
 *
 *   SANDBOX_GRANT_TOKEN=eyJ... npx tsx scripts/seed-demo.ts
 */

import { DTP } from '@ontomorph/dtp-sdk';

const GRANT_TOKEN = process.env.SANDBOX_GRANT_TOKEN;
const DTP_API_KEY = process.env.DTP_API_KEY;
const BASE_URL = process.env.DTP_BASE_URL ?? 'https://sandbox-api.ontomorph.com';

if (!GRANT_TOKEN) {
  console.error('SANDBOX_GRANT_TOKEN is required. Set it in .env.local or pass it inline.');
  process.exit(1);
}

if (!DTP_API_KEY) {
  console.error('DTP_API_KEY is required. Set it in .env.local or pass it inline.');
  process.exit(1);
}

const dtp = new DTP({ apiKey: DTP_API_KEY, baseUrl: BASE_URL });

function daysAgo(n: number, hour = 10): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
}

const DEMO_EVENTS = [
  // ── chest (4 entries — most-logged region) ───────────────────────────────
  {
    eventType: 'symptom' as const,
    occurredAt: daysAgo(13),
    title: 'Tight chest after coffee',
    description: 'Noticeable after second espresso. Lasted ~20 min.',
    data: { system: 'chest', severity: 5, symptomName: 'Tight chest', resolvedConceptId: '23924001', resolvedTerm: 'Tight chest (finding)' },
  },
  {
    eventType: 'symptom' as const,
    occurredAt: daysAgo(10),
    title: 'Chest discomfort',
    description: 'Dull ache, worse when breathing deep.',
    data: { system: 'chest', severity: 4, symptomName: 'Chest discomfort', resolvedConceptId: '29857009', resolvedTerm: 'Chest pain (finding)' },
  },
  {
    eventType: 'symptom' as const,
    occurredAt: daysAgo(6),
    title: 'Sharp chest pain',
    description: 'Sudden sharp pain on left side, gone within minutes.',
    data: { system: 'chest', severity: 7, symptomName: 'Sharp chest pain' },
  },
  {
    eventType: 'symptom' as const,
    occurredAt: daysAgo(1),
    title: 'Chest pressure',
    description: 'Heavy feeling, especially when climbing stairs.',
    data: { system: 'chest', severity: 6, symptomName: 'Chest pressure' },
  },

  // ── head (3 entries) ─────────────────────────────────────────────────────
  {
    eventType: 'symptom' as const,
    occurredAt: daysAgo(12),
    title: 'Tension headache',
    description: 'Band-like pressure around forehead. Started in afternoon.',
    data: { system: 'head', severity: 4, symptomName: 'Tension headache', resolvedConceptId: '25064002', resolvedTerm: 'Headache (finding)' },
  },
  {
    eventType: 'symptom' as const,
    occurredAt: daysAgo(8),
    title: 'Migraine aura',
    description: 'Flickering lights in peripheral vision, followed by throbbing pain.',
    data: { system: 'head', severity: 8, symptomName: 'Migraine aura', resolvedConceptId: '37796009', resolvedTerm: 'Migraine (disorder)' },
  },
  {
    eventType: 'symptom' as const,
    occurredAt: daysAgo(3),
    title: 'Throbbing headache',
    description: 'One-sided, sensitive to light.',
    data: { system: 'head', severity: 6, symptomName: 'Throbbing headache' },
  },

  // ── neck (1 entry) ───────────────────────────────────────────────────────
  {
    eventType: 'symptom' as const,
    occurredAt: daysAgo(10),
    title: 'Neck stiffness',
    description: 'After sleeping wrong, tight on the left side.',
    data: { system: 'neck', severity: 3, symptomName: 'Neck stiffness' },
  },

  // ── right-shoulder (1 entry) ─────────────────────────────────────────────
  {
    eventType: 'symptom' as const,
    occurredAt: daysAgo(11),
    title: 'Right shoulder stiffness',
    description: 'Worst in the morning, improves with movement.',
    data: { system: 'right-shoulder', severity: 4, symptomName: 'Shoulder stiffness', resolvedConceptId: '57676002', resolvedTerm: 'Joint pain (finding)' },
  },

  // ── right-elbow (1 entry) ────────────────────────────────────────────────
  {
    eventType: 'symptom' as const,
    occurredAt: daysAgo(8),
    title: 'Right elbow soreness',
    description: 'After lifting, tender to touch.',
    data: { system: 'right-elbow', severity: 3, symptomName: 'Elbow soreness' },
  },

  // ── left-forearm (1 entry) ────────────────────────────────────────────────
  {
    eventType: 'symptom' as const,
    occurredAt: daysAgo(9),
    title: 'Left forearm cramp',
    description: 'After long typing session. Muscle felt knotted.',
    data: { system: 'left-forearm', severity: 3, symptomName: 'Forearm cramp', resolvedConceptId: '55300003', resolvedTerm: 'Muscle cramp (finding)' },
  },

  // ── left-hand (1 entry) ──────────────────────────────────────────────────
  {
    eventType: 'symptom' as const,
    occurredAt: daysAgo(7),
    title: 'Left wrist tingling',
    description: 'Numbness in fingers after sleeping on hand.',
    data: { system: 'left-hand', severity: 2, symptomName: 'Wrist tingling' },
  },

  // ── waist (1 entry) ─────────────────────────────────────────────────────
  {
    eventType: 'symptom' as const,
    occurredAt: daysAgo(6),
    title: 'Lower back stiffness',
    description: 'After sitting too long, tight across waist.',
    data: { system: 'waist', severity: 4, symptomName: 'Lower back stiffness' },
  },

  // ── right-knee (1 entry) ─────────────────────────────────────────────────
  {
    eventType: 'symptom' as const,
    occurredAt: daysAgo(5),
    title: 'Right knee clicking',
    description: 'Painless click when climbing stairs.',
    data: { system: 'right-knee', severity: 2, symptomName: 'Knee clicking' },
  },

  // ── left-lower-leg (1 entry) ─────────────────────────────────────────────
  {
    eventType: 'symptom' as const,
    occurredAt: daysAgo(2),
    title: 'Left shin splint',
    description: 'Dull ache along tibia after running.',
    data: { system: 'left-lower-leg', severity: 5, symptomName: 'Shin splint' },
  },

  // ── right-foot (1 entry) ─────────────────────────────────────────────────
  {
    eventType: 'symptom' as const,
    occurredAt: daysAgo(1),
    title: 'Right heel pain',
    description: 'Worse first thing in the morning.',
    data: { system: 'right-foot', severity: 6, symptomName: 'Heel pain' },
  },
];

async function main() {
  console.log('Connecting to twin...');
  const twin = dtp.twins.connect(GRANT_TOKEN!);
  console.log(`Connected: ${twin.id}`);

  console.log(`Seeding ${DEMO_EVENTS.length} demo events...`);
  for (const event of DEMO_EVENTS) {
    const created = await twin.flag(event.data.system, {
      eventType: event.eventType,
      occurredAt: event.occurredAt,
      title: event.title,
      description: event.description,
      data: event.data,
    });
    console.log(`  ✓ ${event.occurredAt.slice(0, 10)} — ${event.title} (${event.data.system}, severity ${event.data.severity})`);
  }

  console.log('Done. Refresh the app to see the new patterns.');
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
