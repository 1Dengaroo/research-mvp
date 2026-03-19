'use client';

import { Toaster as SonnerToaster } from 'sonner';

export function Toaster() {
  return (
    <SonnerToaster
      position="bottom-right"
      toastOptions={{
        style: {
          background: 'var(--color-card)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--card-radius)',
          color: 'var(--color-foreground)',
          fontFamily: 'var(--font-body)',
          fontSize: '0.875rem'
        }
      }}
    />
  );
}
