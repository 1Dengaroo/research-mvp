'use client';

import { useEffect } from 'react';
import { RotateCcw } from 'lucide-react';
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
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <h2 className="text-foreground text-lg font-semibold tracking-tight">Something went wrong</h2>
      <p className="text-muted-foreground mt-1.5 max-w-xs text-sm leading-relaxed">
        An unexpected error occurred. Please try again, or head back home if the problem persists.
      </p>

      {error.digest && (
        <p className="text-muted-foreground/60 mt-2 font-mono text-xs">Error ID: {error.digest}</p>
      )}

      <div className="mt-6 flex items-center gap-3">
        <Button onClick={reset} variant="default" size="sm" className="gap-1.5">
          <RotateCcw className="size-3.5" />
          Try again
        </Button>
        <Button variant="outline" size="sm" asChild>
          <a href="/">Back to home</a>
        </Button>
      </div>
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
      <body
        style={{
          margin: 0,
          fontFamily: 'system-ui, -apple-system, sans-serif',
          backgroundColor: '#0a0a0a',
          color: '#fafafa'
        }}
      >
        <div
          style={{
            display: 'flex',
            minHeight: '100vh',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              opacity: 0.06,
              background:
                'radial-gradient(ellipse at 50% 40%, #ef4444 0%, #f87171 40%, transparent 70%)',
              pointerEvents: 'none'
            }}
          />

          <p
            style={{
              fontSize: 'clamp(6rem, 15vw, 9rem)',
              fontWeight: 800,
              letterSpacing: '-0.05em',
              lineHeight: 1,
              background: 'linear-gradient(135deg, #ef4444, #dc2626, #b91c1c, #991b1b)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              margin: 0
            }}
          >
            Oops
          </p>

          <h1
            style={{
              fontSize: '1.25rem',
              fontWeight: 600,
              letterSpacing: '-0.01em',
              marginTop: '0.75rem'
            }}
          >
            Something went wrong
          </h1>
          <p
            style={{
              color: '#a1a1aa',
              maxWidth: '20rem',
              fontSize: '0.875rem',
              lineHeight: 1.6,
              marginTop: '0.5rem'
            }}
          >
            An unexpected error occurred. Please try again.
          </p>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '2rem' }}>
            <button
              onClick={reset}
              style={{
                padding: '0.625rem 1.25rem',
                borderRadius: '0.5rem',
                border: 'none',
                background: '#ef4444',
                color: '#fff',
                fontSize: '0.875rem',
                fontWeight: 500,
                cursor: 'pointer'
              }}
            >
              Try again
            </button>
            <a
              href="/"
              style={{
                padding: '0.625rem 1.25rem',
                borderRadius: '0.5rem',
                border: '1px solid #27272a',
                background: 'transparent',
                color: '#fafafa',
                fontSize: '0.875rem',
                fontWeight: 500,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center'
              }}
            >
              Back to home
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
