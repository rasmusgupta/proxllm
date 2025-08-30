import { auth, currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/database/prisma';
import type { User } from '@/types';

/**
 * Get the current authenticated user from Clerk and sync with database
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return null;
    }

    // Check if user exists in our database
    let dbUser = await prisma.user.findUnique({
      where: { clerkId: userId }
    });

    // If user doesn't exist, create from Clerk data
    if (!dbUser) {
      const clerkUser = await currentUser();
      
      if (!clerkUser) {
        return null;
      }

      dbUser = await prisma.user.create({
        data: {
          clerkId: userId,
          email: clerkUser.emailAddresses[0]?.emailAddress || '',
          name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim(),
          image: clerkUser.imageUrl,
          role: 'USER',
          status: 'ACTIVE',
          plan: 'FREE',
          tokensUsed: 0,
          lastActiveAt: new Date(),
        }
      });
    }

    // Update last active time
    await prisma.user.update({
      where: { id: dbUser.id },
      data: { lastActiveAt: new Date() }
    });

    return dbUser;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

/**
 * Check if current user is admin
 */
export async function isCurrentUserAdmin(): Promise<boolean> {
  const user = await getCurrentUser();
  return user?.role === 'ADMIN';
}

/**
 * Get user by Clerk ID
 */
export async function getUserByClerkId(clerkId: string): Promise<User | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { clerkId }
    });
    return user;
  } catch (error) {
    console.error('Error getting user by Clerk ID:', error);
    return null;
  }
}

/**
 * Sync user data from Clerk webhook
 */
export async function syncUserFromClerk(clerkUser: any, eventType: string) {
  try {
    const userData = {
      email: clerkUser.email_addresses?.[0]?.email_address || '',
      name: `${clerkUser.first_name || ''} ${clerkUser.last_name || ''}`.trim(),
      image: clerkUser.image_url,
      lastActiveAt: new Date(),
    };

    switch (eventType) {
      case 'user.created':
        await prisma.user.create({
          data: {
            clerkId: clerkUser.id,
            role: 'USER',
            status: 'ACTIVE',
            plan: 'FREE',
            tokensUsed: 0,
            ...userData,
          }
        });
        break;

      case 'user.updated':
        await prisma.user.upsert({
          where: { clerkId: clerkUser.id },
          create: {
            clerkId: clerkUser.id,
            role: 'USER',
            status: 'ACTIVE',
            plan: 'FREE',
            tokensUsed: 0,
            ...userData,
          },
          update: userData,
        });
        break;

      case 'user.deleted':
        await prisma.user.delete({
          where: { clerkId: clerkUser.id }
        });
        break;

      default:
        console.log(`Unhandled webhook event: ${eventType}`);
    }
  } catch (error) {
    console.error('Error syncing user from Clerk:', error);
    throw error;
  }
}