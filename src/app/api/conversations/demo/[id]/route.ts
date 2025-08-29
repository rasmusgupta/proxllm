import { NextRequest, NextResponse } from 'next/server';
import { demoConversations, demoMessages } from '@/lib/demo-storage';
import type { DemoConversation } from '@/lib/demo-storage';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const conversation = demoConversations.find(c => c.id === id);
    
    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    const messages = demoMessages
      .filter(m => m.conversationId === id)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    return NextResponse.json({
      ...conversation,
      messages,
    });
  } catch (error) {
    console.error('Error fetching demo conversation:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title } = body;

    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    const conversationIndex = demoConversations.findIndex(c => c.id === id);
    
    if (conversationIndex === -1) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    demoConversations[conversationIndex] = {
      ...demoConversations[conversationIndex],
      title,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json(demoConversations[conversationIndex]);
  } catch (error) {
    console.error('Error updating demo conversation:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const conversationIndex = demoConversations.findIndex(c => c.id === id);
    
    if (conversationIndex === -1) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    // Remove the conversation
    demoConversations.splice(conversationIndex, 1);

    // Also delete associated messages
    const messagesToRemove = [];
    for (let i = demoMessages.length - 1; i >= 0; i--) {
      if (demoMessages[i].conversationId === id) {
        messagesToRemove.push(i);
      }
    }
    messagesToRemove.forEach(index => demoMessages.splice(index, 1));

    return NextResponse.json({ message: 'Conversation deleted successfully' });
  } catch (error) {
    console.error('Error deleting demo conversation:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}