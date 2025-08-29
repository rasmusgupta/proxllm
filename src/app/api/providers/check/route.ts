import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Check which providers have API keys configured
    const availability = {
      anthropic: !!process.env.ANTHROPIC_API_KEY,
      openai: !!process.env.OPENAI_API_KEY,
      google: !!process.env.GOOGLE_API_KEY,
    };

    return NextResponse.json(availability);
  } catch (error) {
    console.error('Error checking provider availability:', error);
    return NextResponse.json(
      { error: 'Failed to check provider availability' },
      { status: 500 }
    );
  }
}