import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message } = body;

    // Simple echo response for testing
    return NextResponse.json({
      id: 'test-' + Date.now(),
      content: `Echo: ${message}`,
      tokensUsed: 10,
      model: 'test-model',
      provider: 'test',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Test chat error:', error);
    return NextResponse.json(
      { error: 'Test chat failed' },
      { status: 500 }
    );
  }
}