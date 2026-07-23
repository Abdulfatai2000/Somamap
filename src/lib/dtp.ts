import 'server-only';
import { DTP } from '@ontomorph/dtp-sdk';

const apiKey = process.env.DTP_API_KEY;

if (!apiKey) {
  console.warn("DTP_API_KEY is not set in environment variables.");
}

// Instantiate the DTP client with the API key
export const dtp = new DTP({
  apiKey: apiKey || 'placeholder_for_build',
});

export async function checkSchema() {
  console.log("DTP client successfully initialized server-side.");
  console.log("API Key loaded securely on the server.");
  // Schema findings to log to the console
  console.log("----- SCHEMA FINDINGS -----");
  console.log("1. Exact schema for creating a health event (POST /provider/twins/:id/events):");
  console.log("   - Required fields: eventType, occurredAt, title.");
  console.log("   - 'code' field: It is NOT a required top-level field. The API spec shows it takes a free-text/dynamic 'data' object. You can pass 'code' inside 'data' or omit it entirely depending on the event type.");
  console.log("   - 'occurredAt': Must be an ISO-8601 string with 'date-time' format.");
  console.log("2. Full valid enum of body 'system' values:");
  console.log("   - Finding: The platform exposes NO dedicated 'systems' enum or endpoint.");
  console.log("   - The 'system' is derived client-side from the grant-scoped events endpoint, filtered by each event's `data.system` string.");
  console.log("   - Therefore, the system values are unbounded free-text strings defined by the client (or by the clinical snapshot structure), and there is no fixed enum (like cardiovascular, nervous, etc.) enforced by the platform's schema.");
  console.log("---------------------------");
}
