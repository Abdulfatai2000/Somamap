/**
 * SymptomEvent — the shape of a symptom log entry as stored on the twin.
 * Maps 1:1 to a HealthEvent from @ontomorph/dtp-sdk, but with our
 * domain-specific data fields made explicit so patterns.ts stays pure/typed.
 */
export interface SymptomEvent {
  id: string;
  twinId: string;
  eventType: string;
  occurredAt: string; // ISO-8601
  title: string;
  description?: string;
  data: {
    system: string;         // body region e.g. "chest", "head"
    severity: number;       // 1–10
    symptomName: string;    // raw user-typed name
    // HOLON-resolved fields (optional — only present if user accepted suggestion)
    resolvedConceptId?: string;
    resolvedTerm?: string;
  };
}

/** HOLON concept search result shape */
export interface HolonConcept {
  conceptId: string;
  term: string;
  /** Optional score 0–1 returned by the real HOLON API */
  score?: number;
}
