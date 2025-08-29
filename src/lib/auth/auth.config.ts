import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnChat = nextUrl.pathname.startsWith('/');
      const isOnAuth = nextUrl.pathname.startsWith('/auth');

      if (isOnAuth) {
        if (isLoggedIn) return Response.redirect(new URL('/', nextUrl));
        return true;
      }

      if (isOnChat) {
        if (isLoggedIn) return true;
        return Response.redirect(new URL('/auth/signin', nextUrl));
      }

      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;