'use client';

import { Toaster } from 'sonner';

interface ClientProvidersProps {
  children: React.ReactNode;
}

export function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <>
      {children}
      <Toaster position="top-right" />
    </>
  );
}