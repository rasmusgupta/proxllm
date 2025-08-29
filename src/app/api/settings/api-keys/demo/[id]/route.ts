import { NextRequest, NextResponse } from 'next/server';
import { demoApiKeys } from '@/lib/demo-storage';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const keyIndex = demoApiKeys.findIndex(key => key.id === id);
    
    if (keyIndex === -1) {
      return NextResponse.json({ error: 'API key not found' }, { status: 404 });
    }

    // Remove the API key
    demoApiKeys.splice(keyIndex, 1);

    return NextResponse.json({ message: 'API key deleted successfully' });
  } catch (error) {
    console.error('Error deleting demo API key:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}