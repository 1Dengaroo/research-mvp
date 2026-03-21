'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export function ErrorBoundary({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-8">
      <h2 className="text-foreground text-2xl font-semibold">Something went wrong</h2>
      <p className="text-muted-foreground max-w-md text-center">
        An unexpected error occurred. Please try again.
      </p>
      <Button onClick={reset} variant="outline">
        Try again
      </Button>
    </div>
  );
}

export function GlobalErrorBoundary({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div
          style={{
            display: 'flex',
            minHeight: '100vh',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            fontFamily: 'system-ui, sans-serif'
          }}
        >
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Something went wrong</h2>
          <p style={{ color: '#666', maxWidth: '28rem', textAlign: 'center' }}>
            An unexpected error occurred. Please try again.
          </p>
          <button
            onClick={reset}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '0.375rem',
              border: '1px solid #ccc',
              background: 'transparent',
              cursor: 'pointer'
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
