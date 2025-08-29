import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { prisma } from '@/lib/database/prisma';

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

    const deletedKey = await prisma.apiKey.deleteMany({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (deletedKey.count === 0) {
      return NextResponse.json({ error: 'API key not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'API key deleted successfully' });
  } catch (error) {
    console.error('Error deleting API key:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}