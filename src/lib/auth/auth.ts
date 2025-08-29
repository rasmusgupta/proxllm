import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/lib/database/prisma';
import { authConfig } from './auth.config';

const nextAuth = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  callbacks: {
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
  ...authConfig,
});

export const { handlers, auth, signIn, signOut } = nextAuth;