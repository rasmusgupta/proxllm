'use client';

import { ClerkProvider } from '@clerk/nextjs';
import { Toaster } from 'sonner';

interface ClientProvidersProps {
  children: React.ReactNode;
}

export function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <ClerkProvider>
      {children}
      <Toaster position="top-right" />
    </ClerkProvider>
  );
}