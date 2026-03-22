export function PageLoader() {
  return (
    <div className="flex min-h-[calc(100vh-49px)] flex-col items-center justify-center gap-4">
      <div className="flex items-center gap-1.5">
        <span
          className="bg-primary/60 inline-block size-2 rounded-full"
          style={{ animation: 'pulse-dot 1.4s ease-in-out infinite' }}
        />
        <span
          className="bg-primary/60 inline-block size-2 rounded-full"
          style={{ animation: 'pulse-dot 1.4s ease-in-out 0.2s infinite' }}
        />
        <span
          className="bg-primary/60 inline-block size-2 rounded-full"
          style={{ animation: 'pulse-dot 1.4s ease-in-out 0.4s infinite' }}
        />
      </div>
    </div>
  );
}
