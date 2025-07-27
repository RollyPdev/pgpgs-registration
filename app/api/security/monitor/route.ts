import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { event, details, userAgent, ip } = data;

    // Log security events (in production, send to a security monitoring service)
    console.log('SECURITY EVENT:', {
      timestamp: new Date().toISOString(),
      event,
      details,
      userAgent,
      ip: request.headers.get('x-forwarded-for') || 'unknown',
      path: request.nextUrl.pathname,
      method: request.method,
    });

    // Return success without revealing any information
    return NextResponse.json({ success: true });
  } catch (error) {
    // Don't reveal error details
    return NextResponse.json({ success: false }, { status: 500 });
  }
} 