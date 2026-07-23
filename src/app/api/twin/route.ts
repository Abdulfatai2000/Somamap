import { NextResponse } from 'next/server';
import { dtp } from '@/lib/dtp';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    // Use the placeholder explicitly
    const grantToken = url.searchParams.get('grantToken') || process.env.DEMO_GRANT_TOKEN || 'PLACEHOLDER_TOKEN_REPLACE_ME';

    if (grantToken === 'PLACEHOLDER_TOKEN_REPLACE_ME') {
      console.log('Using placeholder grant token. Real API call will fail gracefully.');
    }

    // Connect to the twin using the grant token.
    const twin = dtp.twins.connect(grantToken);

    // Fetch the grant-scoped events to verify end-to-end connectivity
    const events = await twin.events.list({ limit: 10 });

    return NextResponse.json({
      success: true,
      message: "Successfully connected to twin!",
      twinId: twin.id,
      grantedSystems: twin.grant.systems,
      eventsCount: events.length,
      events: events,
    });
  } catch (error: any) {
    console.error("Twin connection error:", error.message || error);
    // Fail gracefully instead of crashing the process
    return NextResponse.json(
      { 
        error: "Twin Connection Failed",
        details: error.message,
        code: error.code || 'UNKNOWN'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const url = new URL(request.url);
    const grantToken = url.searchParams.get('grantToken') || process.env.DEMO_GRANT_TOKEN || 'PLACEHOLDER_TOKEN_REPLACE_ME';
    
    const body = await request.json();

    if (grantToken === 'PLACEHOLDER_TOKEN_REPLACE_ME') {
      console.log('Using placeholder grant token for POST. API call will fail gracefully.');
    }

    const twin = dtp.twins.connect(grantToken);
    
    // Call the flag api which will fail if using placeholder token
    const event = await twin.flag(body.data.system, body);

    return NextResponse.json({ success: true, event });
  } catch (error: any) {
    console.error("Twin write error:", error.message || error);
    return NextResponse.json(
      { error: "Twin Write Failed", details: error.message, code: error.code || 'UNKNOWN' },
      { status: 500 }
    );
  }
}
