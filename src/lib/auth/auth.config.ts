import type { NextAuthOptions } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
  },
  providers: [],
  secret: process.env.NEXTAUTH_SECRET,
} satisfies NextAuthOptions;