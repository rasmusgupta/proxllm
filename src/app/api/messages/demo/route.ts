import { NextRequest, NextResponse } from 'next/server';
import { demoMessages, demoConversations } from '@/lib/demo-storage';
import type { DemoMessage, DemoConversation } from '@/lib/demo-storage';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { conversationId, role, content, tokensUsed } = body;

    if (!conversationId || !role || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if conversation exists (create it if it doesn't for demo)
    let conversation = demoConversations.find(c => c.id === conversationId);
    if (!conversation) {
      const newConversation: DemoConversation = {
        id: conversationId,
        userId: 'demo-user',
        title: content.slice(0, 50) + (content.length > 50 ? '...' : ''),
        modelProvider: 'anthropic',
        modelName: 'claude-3-5-haiku-20241022',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        _count: { messages: 0 },
      };
      demoConversations.unshift(newConversation);
      conversation = newConversation;
    }

    // Create the message
    const message: DemoMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      conversationId,
      role,
      content,
      tokensUsed: tokensUsed || undefined,
      createdAt: new Date().toISOString(),
    };

    demoMessages.push(message);

    // Update conversation's updatedAt timestamp
    const conversationIndex = demoConversations.findIndex(c => c.id === conversationId);
    if (conversationIndex !== -1) {
      demoConversations[conversationIndex].updatedAt = new Date().toISOString();
    }

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error('Error creating demo message:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get('conversationId');

    if (!conversationId) {
      return NextResponse.json(
        { error: 'Conversation ID is required' },
        { status: 400 }
      );
    }

    const messages = demoMessages
      .filter(m => m.conversationId === conversationId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error fetching demo messages:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}