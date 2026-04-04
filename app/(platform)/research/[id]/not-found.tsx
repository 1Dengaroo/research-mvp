import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function SessionNotFound() {
  return (
    <div className="relative flex min-h-[calc(100vh-49px)] flex-col items-center justify-center overflow-hidden px-6 text-center">
      <div
        className="pointer-events-none absolute inset-0 opacity-6"
        style={{
          background:
            'radial-gradient(ellipse at 50% 40%, #7c3aed 0%, #a855f7 40%, transparent 70%)'
        }}
      />

      <p
        className="text-8xl font-extrabold tracking-tighter sm:text-9xl"
        style={{
          background: 'linear-gradient(135deg, #6366f1, #7c3aed, #a855f7, #d946ef)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}
      >
        404
      </p>

      <h1 className="text-foreground mt-3 text-xl font-semibold tracking-tight">
        Session not found
      </h1>
      <p className="text-muted-foreground mt-2 max-w-xs text-sm leading-relaxed">
        This session doesn&apos;t exist or you don&apos;t have access to it.
      </p>

      <Link
        href="/research"
        className="bg-primary text-primary-foreground hover:bg-primary/90 mt-8 inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition-colors"
      >
        <ArrowLeft className="size-4" />
        Back to sessions
      </Link>
    </div>
  );
}
