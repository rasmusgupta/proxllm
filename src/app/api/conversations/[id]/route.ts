import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { prisma } from '@/lib/database/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const conversation = await prisma.conversation.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
      include: {
        messages: {
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    return NextResponse.json(conversation);
  } catch (error) {
    console.error('Error fetching conversation:', error);
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
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title } = body;

    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    const conversation = await prisma.conversation.updateMany({
      where: {
        id,
        userId: session.user.id,
      },
      data: {
        title,
        updatedAt: new Date(),
      },
    });

    if (conversation.count === 0) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    const updatedConversation = await prisma.conversation.findUnique({
      where: { id },
    });

    return NextResponse.json(updatedConversation);
  } catch (error) {
    console.error('Error updating conversation:', error);
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
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const deletedConversation = await prisma.conversation.deleteMany({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (deletedConversation.count === 0) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Conversation deleted successfully' });
  } catch (error) {
    console.error('Error deleting conversation:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}