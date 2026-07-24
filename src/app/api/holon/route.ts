import { NextResponse } from 'next/server';

/**
 * GET /api/holon?q=<query>
 *
 * Server-side HOLON concept search route.
 * Tries a real dtp.holon.concepts.search() call if HOLON_API_KEY and
 * HOLON_API_URL are set; otherwise returns mock results so the UI
 * always works for demo purposes.
 *
 * HOLON is independent of the twin grant token sandbox — it only needs
 * its own API key. When the sandbox is down, HOLON may still work.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get('q') ?? '').trim();

  if (!q || q.length < 2) {
    return NextResponse.json({ hits: [], source: 'skipped' });
  }

  const holonApiKey = process.env.HOLON_API_KEY;
  const holonApiUrl = process.env.HOLON_API_URL ?? 'https://holon.ontomorph.com';

  // ── Real HOLON call ───────────────────────────────────────────────────────
  if (holonApiKey) {
    try {
      // Import server-only DTP client (never exposed to browser)
      // We re-instantiate here with holon config rather than mutating
      // the shared dtp singleton in lib/dtp.ts (which has no holon keys).
      const { DTP } = await import('@ontomorph/dtp-sdk');
      const dtpWithHolon = new DTP({
        apiKey: process.env.DTP_API_KEY || 'placeholder',
        holonApiUrl,
        holonApiKey,
      });
      const results = await dtpWithHolon.holon.concepts.search(q);
      const realHits = (results.hits ?? []).filter(
        (h: any) => h.term && !h.term.toLowerCase().includes('unspecified')
      );
      return NextResponse.json({ hits: realHits, source: 'holon-real' });
    } catch (err: any) {
      console.error('[holon route] real HOLON call failed:', err.message);
      // Fall through to mock so the UI stays functional
    }
  } else {
    console.log(
      '[holon route] HOLON_API_KEY not set — using mock results. ' +
      'Set HOLON_API_KEY=<your holon key> and HOLON_API_URL=https://holon.ontomorph.com ' +
      'in .env.local to try the real API.'
    );
  }

  // ── Mock fallback ─────────────────────────────────────────────────────────
  const mockDb: Record<string, Array<{ conceptId: string; term: string }>> = {
    chest:    [{ conceptId: '29857009', term: 'Chest pain (finding)' }, { conceptId: '23924001', term: 'Tight chest (finding)' }],
    pain:     [{ conceptId: '22253000', term: 'Pain (finding)' }, { conceptId: '57676002', term: 'Joint pain (finding)' }],
    head:     [{ conceptId: '25064002', term: 'Headache (finding)' }, { conceptId: '37796009', term: 'Migraine (disorder)' }],
    migraine: [{ conceptId: '37796009', term: 'Migraine (disorder)' }],
    nausea:   [{ conceptId: '422587007', term: 'Nausea (finding)' }],
    fatigue:  [{ conceptId: '84229001', term: 'Fatigue (finding)' }],
    dizz:     [{ conceptId: '404640003', term: 'Dizziness (finding)' }],
    sharp:    [{ conceptId: '55300003', term: 'Sharp pain (finding)' }],
    ache:     [{ conceptId: '57676002', term: 'Aching pain (finding)' }],
    cramp:    [{ conceptId: '55300003', term: 'Muscle cramp (finding)' }],
    tight:    [{ conceptId: '23924001', term: 'Tightness sensation (finding)' }],
    breath:   [{ conceptId: '230145002', term: 'Difficulty breathing (finding)' }],
  };

  const lower = q.toLowerCase();
  const hits = Object.entries(mockDb)
    .filter(([key]) => lower.includes(key) || key.includes(lower))
    .flatMap(([, concepts]) => concepts)
    .slice(0, 4);

  // Filter out low-quality / unspecified results
  const filteredHits = hits.filter(h => h.term && !h.term.toLowerCase().includes('unspecified'));

  return NextResponse.json({ hits: filteredHits, source: 'mock' });
}
