import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/clerk';
import { prisma } from '@/lib/database/prisma';

export async function GET() {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get additional statistics from database
    const [conversationsCount, messagesCount, totalTokens] = await Promise.all([
      // Count conversations for this user
      prisma.conversation.count({
        where: { userId: user.id }
      }),
      
      // Count total messages for this user
      prisma.message.count({
        where: { 
          conversation: { 
            userId: user.id 
          } 
        }
      }),
      
      // Sum tokens used from messages
      prisma.message.aggregate({
        where: { 
          conversation: { 
            userId: user.id 
          },
          tokensUsed: { not: null }
        },
        _sum: {
          tokensUsed: true
        }
      })
    ]);

    const userProfile = {
      // Basic info from database record
      id: user.id,
      clerkId: user.clerkId,
      name: user.name,
      email: user.email,
      image: user.image,
      role: user.role,
      status: user.status,
      plan: user.plan,
      tokensUsed: user.tokensUsed,
      monthlyLimit: user.monthlyLimit,
      lastActiveAt: user.lastActiveAt,
      createdAt: user.createdAt,
      
      // Statistics
      statistics: {
        conversations: conversationsCount,
        totalMessages: messagesCount,
        totalTokensFromMessages: totalTokens._sum.tokensUsed || 0
      }
    };

    return NextResponse.json(userProfile);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}