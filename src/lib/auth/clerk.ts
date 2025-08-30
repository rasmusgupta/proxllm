import { auth, currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/database/prisma';
import type { User } from '@/types';

interface ClerkEmailAddress {
  email_address: string;
}


/**
 * Get the current authenticated user from Clerk and sync with database
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const { userId } = await auth();
    console.log('[getCurrentUser] Clerk userId:', userId);
    
    if (!userId) {
      console.log('[getCurrentUser] No userId from auth()');
      return null;
    }

    // Check if user exists in our database
    let dbUser = await prisma.user.findUnique({
      where: { clerkId: userId }
    });
    console.log('[getCurrentUser] Found dbUser:', dbUser ? { id: dbUser.id, email: dbUser.email, role: dbUser.role } : 'null');

    // If user doesn't exist, create from Clerk data
    if (!dbUser) {
      console.log('[getCurrentUser] User not found, creating new user');
      const clerkUser = await currentUser();
      
      if (!clerkUser) {
        console.log('[getCurrentUser] No clerkUser from currentUser()');
        return null;
      }

      console.log('[getCurrentUser] Creating user with email:', clerkUser.emailAddresses[0]?.emailAddress);
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
      console.log('[getCurrentUser] Created new user:', { id: dbUser.id, email: dbUser.email, role: dbUser.role });
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
  const isAdmin = user?.role === 'ADMIN';
  console.log('[isCurrentUserAdmin] User:', user ? { id: user.id, email: user.email, role: user.role } : 'null');
  console.log('[isCurrentUserAdmin] Is admin:', isAdmin);
  return isAdmin;
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
export async function syncUserFromClerk(clerkUser: Record<string, unknown>, eventType: string) {
  try {
    const emailAddresses = clerkUser.email_addresses as ClerkEmailAddress[] | undefined;
    const userData = {
      email: emailAddresses?.[0]?.email_address || '',
      name: `${clerkUser.first_name as string || ''} ${clerkUser.last_name as string || ''}`.trim(),
      image: clerkUser.image_url as string,
      lastActiveAt: new Date(),
    };

    switch (eventType) {
      case 'user.created':
        await prisma.user.create({
          data: {
            clerkId: clerkUser.id as string,
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
          where: { clerkId: clerkUser.id as string },
          create: {
            clerkId: clerkUser.id as string,
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
          where: { clerkId: clerkUser.id as string }
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