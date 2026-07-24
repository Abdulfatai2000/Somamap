# Somamap

**Body-mapped symptom logging, connected to your Ontomorph Digital Twin.**

Built solo for the [Ontomorph Hackathon (OAU)](https://developer.ontomorph.com) within a compressed timeline.

---

## What it does

Somamap lets a person tap a region of their own body on an interactive anatomical diagram, describe a symptom, rate its severity, and save it — directly onto their Ontomorph digital twin as a real, clinical-grade event.

On the right, a live **Pattern Panel** reads all events back from the twin and derives three insights automatically:

- **Recurrence** — average interval between logs in the most active region
- **Hotspot** — the body system with the highest all-time log count
- **Severity trend** — whether the most active region is getting better or worse

Symptom names can optionally be resolved to structured clinical terms via the **HOLON concept search**, which fires a debounced lookup as the user types and lets them accept a normalised SNOMED-style term (e.g. "Chest pain (finding)") — stored alongside the free-text entry on the twin event's `data` object.

---

## Ontomorph platform pieces used

| Piece | How it's used |
|---|---|
| **Digital Twin** (`dtp.twins.connect`) | User's health state is persisted across sessions on their twin |
| **Events** (`twin.events.list`, `twin.flag`) | Symptoms written as `eventType: "symptom"` events with `data.system` (body region), `data.severity`, `data.symptomName` |
| **Body Systems** | `data.system` is an unbounded client-defined string matching the 8 BODY_SYSTEMS constants (`head`, `chest`, `abdomen`, `left-arm`, `right-arm`, `left-leg`, `right-leg`, `back`) |
| **HOLON** (`dtp.holon.concepts.search`) | Debounced clinical-term lookup on the symptom name field; resolved concept stored as `data.resolvedConceptId` + `data.resolvedTerm` |
| **Grant Tokens** | Single grant token from the sandbox dashboard scopes all read/write; token lives in `.env.local`, never exposed to the client |

---

## Stack

- **Next.js 16** (App Router, Turbopack)
- **React 19**
- **Tailwind CSS**
- **`@ontomorph/dtp-sdk`** — for twin connection, event read/write, and HOLON search
- TypeScript throughout

---

## Run locally

### Prerequisites

- Node.js ≥ 18
- An Ontomorph sandbox account — [developer.ontomorph.com](https://developer.ontomorph.com)

### 1. Clone and install

```bash
git clone https://github.com/Abdulfatai2000/Somamap
cd Somamap/Somamap
npm install
```

### 2. Configure environment

Create `.env.local` in the project root (`Somamap/Somamap/`) with:

```env
# DTP API key (dtp_... from your developer dashboard)
DTP_API_KEY=your_api_key_here

# Sandbox grant token — grab one from Dashboard → Sandbox → Grant Token
SANDBOX_GRANT_TOKEN=eyJhbG...

# Optional: HOLON clinical-term search (omit to use mock suggestions)
HOLON_API_KEY=holon_...
HOLON_API_URL=https://holon.ontomorph.com
```

> **Sandbox host:** The DTP client is pre-configured with `baseUrl: https://sandbox-api.ontomorph.com`. Synthetic sandbox twins live on a separate host from production twins.

### 3. Seed demo data (optional)

Populate your sandbox twin with ~2 weeks of realistic demo events across multiple body regions:

```bash
npx tsx scripts/seed-demo.ts
```

### 4. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 5. Try it

1. Tap any region on the body diagram (chest, head, abdomen, etc.)
2. Type a symptom name — clinical suggestions appear after ~350ms
3. Set a severity (1–10) and optional notes
4. Click **Save Symptom Log** — the event is written to your sandbox twin
5. Regions you've logged turn indigo with a count badge
6. The Pattern Panel on the right updates in real time

---

## Project structure

```
src/
├── app/
│   ├── api/
│   │   ├── twin/route.ts     # GET (read events) + POST (write symptom) — server-side only
│   │   └── holon/route.ts    # HOLON concept search — server-side, falls back to mock
│   └── page.tsx              # Main page — fetches twin events, wires BodyMap + PatternPanel
├── components/
│   ├── BodyMap.tsx           # SVG body diagram with region interaction + log count badges
│   ├── SymptomForm.tsx       # Modal form with debounced HOLON suggestions
│   └── PatternPanel.tsx      # Live insight cards (recurrence, hotspot, severity trend)
└── lib/
    ├── dtp.ts                # DTP client singleton (server-side)
    ├── types.ts              # SymptomEvent, HolonConcept types
    ├── patterns.ts           # Pure pattern analysis functions
    └── constants.ts          # BODY_SYSTEMS enum

scripts/
└── seed-demo.ts              # One-time seed script for demo data
```

---

## Notes

- **API keys are server-side only** — all calls to Ontomorph go through `/api/twin` and `/api/holon` Next.js route handlers. No credentials reach the client bundle.
- **HOLON fallback** — if `HOLON_API_KEY` is not set, the HOLON route returns a local mock keyword database so the suggestion UI is always functional for demo purposes.
- **Sandbox eventType** — the sandbox write endpoint accepts a specific enum. Somamap uses `"symptom"` (confirmed valid; full enum documented in `src/app/api/twin/route.ts`).
- **Grant token rotation** — sandbox grant tokens should be rotated before each demo session since they are long-lived credentials.
- **Built for OAU Hackathon** — this project was built solo within a compressed timeline to demonstrate real-time symptom logging on the Ontomorph Digital Twin Platform.
