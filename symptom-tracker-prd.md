# PRD: Symptom Tracker Plugin (Ontomorph Hackathon)

## 1. Overview

**Product:** A body-map symptom tracker built as a plugin on the Ontomorph
digital twin platform. Users tap a region on a body diagram to log a
symptom, and the app surfaces patterns in what they've logged over time.

**Author:** coldWande (solo)
**Event:** Ontomorph Hackathon (OAU)
**Submission deadline:** Friday 24 July, 11:00pm WAT
**Demo day:** Saturday 25 July
**Stack:** Next.js (fullstack), TypeScript, `@ontomorph/dtp-sdk`

## 2. Problem

People experience symptoms in specific, recurring body locations but rarely
track them systematically. Without a record, it's hard for a patient or
clinician to spot that "left knee pain" has occurred 6 times in 3 weeks, or
that chest tightness correlates with certain days. Free-text symptom diaries
don't capture *where on the body* something happened, which is often the
most diagnostically useful signal.

## 3. Goal

Let a user log a symptom by tapping where it hurts on a body diagram, and
show them a simple pattern view (frequency by region, trend over time) that
a plain list or text diary wouldn't surface. Every write and read goes
through the Ontomorph twin, not a local database, so the data is portable
and system-typed.

## 4. Users

- Primary: an individual tracking their own recurring symptoms
- Secondary (stretch, not MVP): a clinician viewing a patient's twin

## 5. Success criteria (tied to judging rubric)

| Criterion | How this product addresses it |
|---|---|
| Innovation | Spatial (body-mapped) logging instead of a text/list form |
| Clinical value | Pattern surfacing turns raw logs into something actionable |
| Execution | Working end-to-end: log → store on twin → read back → visualize |
| Use of platform | Twin creation, systems, events, flags all exercised directly |

## 6. Core user flow

1. User opens app → twin is created or loaded automatically (no manual setup)
2. User sees a body diagram with clickable regions
3. User taps a region → modal: symptom name, severity (1–10), optional note
4. Submit → event is written to the twin, tagged to the body system nearest
   that region
5. Body diagram updates with a marker at that region
6. A separate panel shows patterns: e.g. most-logged region this week, a
   simple frequency count per system, trend arrows if data supports it

## 7. Non-goals (explicitly out of scope for MVP)

- Multi-user accounts / login system beyond a single demo user
- Clinician dashboard or multi-patient view
- HOLON clinical code resolution for symptoms
- Live event streaming (poll-on-load is enough)
- Mobile app (responsive web is enough)
- Editing or deleting past entries

## 8. Platform integration details

- SDK: `@ontomorph/dtp-sdk`
- Auth: bearer API key, server-side only (Next.js API routes / server actions —
  never expose the key in client-side code)
- Twin: create once via `POST /twins/` with `displayName` +
  `personalisationProfile` (age, sex, height, weight, bmi, skinTone, ancestry,
  hairColor — can be static placeholder values for the demo), then reuse
  the twin id on subsequent loads
- Write: `twin.flag(system, event)` for each symptom log
- Read: `twin.events.list({ system })` or per-system `twin.systems.get(system)`
  to rebuild the body map and pattern panel on load
- Body region → system mapping is a static lookup table in the app (see
  open items below for what the valid system enum actually is)

## 9. Open items to resolve before/during build

- [ ] Exact schema for creating an event (confirm via API reference "Events"
      group): required fields, whether `code` needs to come from a
      vocabulary or can be free text, timestamp handling
- [ ] Full list of valid `system` values (cardiovascular, nervous, skeletal,
      etc. — confirm complete enum)
- [ ] Confirm shape of the object passed to `twin.flag(system, event)` —
      SDK docs example uses `{ title, data: {...} }`

## 10. Risks

- Docs for event-creation schema are not fully explored yet — could cause
  a wasted first attempt if the agent guesses wrong. Mitigate by checking
  the API reference "Events" group before writing the log function.
- Solo + ~24hr window means scope discipline matters more than feature count.
  Cut list in Phase plan below exists for this reason.

---

# Phased Build Plan

## Phase 0 — Setup (target: ~30 min)
- Init Next.js project (TypeScript, App Router)
- Install `@ontomorph/dtp-sdk`
- Store API key in `.env.local`, confirm it's never referenced client-side
- Confirm event-creation schema by expanding "Events" in `/api-reference`
- Confirm valid `system` enum values

**Exit criteria:** project boots, API key loads server-side, schema questions answered.

## Phase 1 — Twin connection (target: ~30–45 min)
- Server route/action: create twin on first run (or fetch if one already
  exists for this demo user), store twin id
- Confirm a basic read call succeeds (e.g. list twins, get the created twin)

**Exit criteria:** can programmatically prove a twin exists and is reachable.

## Phase 2 — Body map UI (target: ~1–1.5 hr)
- Static front-view body illustration (SVG) with 6–10 clickable regions:
  head, chest, abdomen, left/right arm, left/right leg, back (adjust as needed)
- Each region is tappable and visually distinct on hover/tap
- No data wired yet — just the interactive shell

**Exit criteria:** clicking any region triggers a callback with a region id.

## Phase 3 — Log symptom flow (target: ~1 hr)
- Tap region → modal/form: symptom name, severity slider (1–10), note field
- Map region id → nearest body system using the static lookup table
- Submit → call `twin.flag(system, event)` with the symptom data
- Handle loading/error states on submit

**Exit criteria:** submitting a symptom actually creates a new event on the twin (verify via API reference try-it console or a read-back call).

## Phase 4 — Read-back & visualization (target: ~1–1.5 hr)
- On load, fetch all events for the twin (or per-system)
- Render a marker on the body map for each logged region, sized or colored
  by count/recency
- Basic empty state for a fresh twin with no events yet

**Exit criteria:** refreshing the page shows previously logged symptoms on the map, not just the current session's.

## Phase 5 — Pattern panel (target: ~45 min–1 hr)
- Group events by region/system
- Surface at least one clear insight: e.g. "Most logged: [region] — Nx this
  week" or a small per-region frequency bar list
- This is the clinical-value differentiator — don't skip it for polish elsewhere

**Exit criteria:** a non-technical viewer looking at the panel immediately understands "this is a pattern, not just a log."

## Phase 6 — Polish & demo prep (target: remaining time)
- Basic visual pass (spacing, colors, mobile-responsive check)
- Seed a few realistic-looking historical entries so the demo isn't empty
- Write the 3-minute demo script (see below)
- Record demo video
- Write submission description: what it does, who it's for, which platform
  parts it uses (twins, systems, events, flags)

**Exit criteria:** working deployed link or runnable repo, video recorded, description written, submitted before 11pm WAT Friday.

## Cut list (drop these first if time runs out, in this order)
1. Visual polish beyond "looks intentional"
2. Multiple body views (front only is fine)
3. Trend arrows / anything beyond simple frequency counts in Phase 5
4. Seeded historical data variety (a handful of entries is enough)

---

# Demo Script (3 min max)

1. **(5s)** Open app, show empty body map — "this is a fresh twin, no data yet"
2. **(30s)** Tap 2–3 different regions, log symptoms with different
   severities, ideally across different simulated days
3. **(15s)** Show markers appearing on the body map in real time
4. **(30s)** Switch to pattern panel — call out the specific insight it
   surfaces ("chest tightness logged 4 times this week")
5. **(15s)** One sentence: "This uses Ontomorph's twin, systems, events, and
   flag APIs directly — every log is a real event on the patient's own twin,
   not a local database."
