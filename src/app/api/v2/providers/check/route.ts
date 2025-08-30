import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/clerk';
import { prisma } from '@/lib/database/prisma';

export async function GET() {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      // If not authenticated, check environment variables as fallback
      const availability = {
        anthropic: !!process.env.ANTHROPIC_API_KEY,
        openai: !!process.env.OPENAI_API_KEY,
        google: !!process.env.GOOGLE_API_KEY,
      };
      return NextResponse.json(availability);
    }

    // Get user's valid API keys from database
    const userApiKeys = await prisma.apiKey.findMany({
      where: {
        userId: user.id,
        isValid: true,
      },
      select: {
        provider: true,
      },
    });

    // Create availability map based on user's API keys
    const userProviders = new Set(userApiKeys.map(key => key.provider));
    
    const availability = {
      anthropic: userProviders.has('anthropic') || !!process.env.ANTHROPIC_API_KEY,
      openai: userProviders.has('openai') || !!process.env.OPENAI_API_KEY,
      google: userProviders.has('google') || !!process.env.GOOGLE_API_KEY,
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