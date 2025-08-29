import { NextRequest, NextResponse } from 'next/server';
import { demoConversations } from '@/lib/demo-storage';
import type { DemoConversation } from '@/lib/demo-storage';

export async function GET() {
  try {
    return NextResponse.json(demoConversations);
  } catch (error) {
    console.error('Error fetching demo conversations:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, modelProvider, modelName } = body;

    if (!title || !modelProvider || !modelName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const conversation: DemoConversation = {
      id: `conv-${Date.now()}`,
      userId: 'demo-user',
      title,
      modelProvider,
      modelName,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      _count: { messages: 0 },
    };

    demoConversations.unshift(conversation);

    return NextResponse.json(conversation, { status: 201 });
  } catch (error) {
    console.error('Error creating demo conversation:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}