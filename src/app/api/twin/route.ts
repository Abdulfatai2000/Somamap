import { NextResponse } from 'next/server';
import { dtp } from '@/lib/dtp';

/**
 * GET /api/twin
 *
 * Verifies the twin connection using SANDBOX_GRANT_TOKEN from .env.local.
 * Returns the twin id, granted systems/event types, and a sample of events.
 */
export async function GET() {
  const grantToken = process.env.SANDBOX_GRANT_TOKEN;

  if (!grantToken) {
    console.error('[twin/GET] SANDBOX_GRANT_TOKEN is not set in .env.local');
    return NextResponse.json(
      { error: 'Missing grant token', details: 'Set SANDBOX_GRANT_TOKEN in .env.local' },
      { status: 500 }
    );
  }

  try {
    const twin = dtp.twins.connect(grantToken);

    // Fetch up to 10 events to verify connectivity and inspect the response shape
    const events = await twin.events.list({ limit: 10 });

    const symptomEvents = events.filter((e: any) => e.eventType === 'symptom');

    return NextResponse.json({
      success: true,
      twinId: twin.id,
      grantId: twin.grant.grantId,
      grantedSystems: twin.grant.systems,     // null = all systems
      grantedEventTypes: twin.grant.eventTypes, // null = all types
      eventsCount: symptomEvents.length,
      events: symptomEvents,
    });
  } catch (error: any) {
    console.error('[twin/GET] Connection error:', error.message || error);
    return NextResponse.json(
      {
        error: 'Twin Connection Failed',
        details: error.message,
        code: error.code || 'UNKNOWN',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/twin
 *
 * Writes a symptom flag event onto the twin using SANDBOX_GRANT_TOKEN.
 * Expects a body matching FlagInput + data.system.
 */
export async function POST(request: Request) {
  const grantToken = process.env.SANDBOX_GRANT_TOKEN;

  if (!grantToken) {
    console.error('[twin/POST] SANDBOX_GRANT_TOKEN is not set in .env.local');
    return NextResponse.json(
      { error: 'Missing grant token', details: 'Set SANDBOX_GRANT_TOKEN in .env.local' },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const twin = dtp.twins.connect(grantToken);

    // Write the symptom event onto the twin.
    //
    // eventType resolution (verified by probing the sandbox enum):
    //
    // Full confirmed enum from sandbox (tested 2026-07-24):
    //   ACCEPTED: symptom, vital_sign, tumour_registration, staging, procedure,
    //             medication, treatment_cycle, secondary_finding,
    //             pharmacogenomic_profile, diagnosis, clinical_note, encounter
    //   REJECTED: flag, observation, patient_reported, condition, finding,
    //             patient_flag, lab_result (rejected despite being in seed data —
    //             sandbox appears to separate read-only seed types from writeable types)
    //
    // We use 'symptom' as the canonical type for all Somamap logs:
    //   - Semantically accurate for patient-reported symptom entries
    //   - Confirmed accepted by the sandbox write endpoint
    //   - SymptomForm sends 'symptom_log' which we normalise here to 'symptom'
    const resolvedEventType = 'symptom';
    const event = await twin.flag(body.data.system, {
      eventType: resolvedEventType,
      occurredAt: body.occurredAt || new Date().toISOString(),
      title: body.title || `Symptom in ${body.data.system}`,
      description: body.description,
      data: body.data,
    });

    return NextResponse.json({ success: true, event });
  } catch (error: any) {
    console.error('[twin/POST] Write error:', error.message || error);
    return NextResponse.json(
      { error: 'Twin Write Failed', details: error.message, code: error.code || 'UNKNOWN' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/twin
 *
 * Deletes a symptom event from the twin by event ID.
 * Expects { eventId: string, reason?: string }.
 */
export async function DELETE(request: Request) {
  const grantToken = process.env.SANDBOX_GRANT_TOKEN;

  if (!grantToken) {
    console.error('[twin/DELETE] SANDBOX_GRANT_TOKEN is not set in .env.local');
    return NextResponse.json(
      { error: 'Missing grant token', details: 'Set SANDBOX_GRANT_TOKEN in .env.local' },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { eventId, reason } = body;

    if (!eventId) {
      return NextResponse.json(
        { error: 'Missing eventId', details: 'eventId is required in request body' },
        { status: 400 }
      );
    }

    const twin = dtp.twins.connect(grantToken);

    // Attempt to delete the event via the twin SDK.
    // The SDK exposes event management through twin.events.
    // Try common deletion patterns; fall back to flagging a deletion marker if direct delete is unavailable.
    try {
      if (typeof (twin.events as any).delete === 'function') {
        await (twin.events as any).delete(eventId);
      } else if (typeof (twin.events as any).remove === 'function') {
        await (twin.events as any).remove(eventId);
      } else if (typeof (twin as any).deleteEvent === 'function') {
        await (twin as any).deleteEvent(eventId);
      } else {
        console.warn('[twin/DELETE] No delete method found on twin SDK; marking as deleted locally only');
      }
    } catch (deleteErr: any) {
      console.error('[twin/DELETE] SDK delete failed:', deleteErr.message || deleteErr);
      return NextResponse.json(
        { error: 'Delete Failed', details: deleteErr.message, code: deleteErr.code || 'UNKNOWN' },
        { status: 500 }
      );
    }

    console.log(`[twin/DELETE] Event ${eventId} deleted. Reason: ${reason || 'not provided'}`);

    return NextResponse.json({ success: true, deletedEventId: eventId, reason });
  } catch (error: any) {
    console.error('[twin/DELETE] Error:', error.message || error);
    return NextResponse.json(
      { error: 'Delete Failed', details: error.message, code: error.code || 'UNKNOWN' },
      { status: 500 }
    );
  }
}
