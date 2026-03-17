'use client';

import { Loader2, ChevronRight, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Step = 'input' | 'review' | 'confirm' | 'results';

function NavButton({
  label,
  active,
  enabled,
  onClick
}: {
  label: string;
  active: boolean;
  enabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={() => enabled && onClick()}
      disabled={!enabled}
      className={`rounded-md px-2.5 py-1.5 transition-colors ${
        active
          ? 'bg-muted text-foreground font-medium'
          : enabled
            ? 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            : 'text-muted-foreground/50 cursor-not-allowed'
      }`}
    >
      {label}
    </button>
  );
}

export function BottomNav({
  step,
  setStep,
  isExtracting,
  isDiscovering,
  isLoading,
  hasIcp,
  hasCandidates,
  hasResults,
  transcript,
  icpDescription,
  selectedCount,
  onExtractICP,
  onDiscover,
  onResearch,
  onStartOver,
  onSkip
}: {
  step: Step;
  setStep: (s: Step) => void;
  isExtracting: boolean;
  isDiscovering: boolean;
  isLoading: boolean;
  hasIcp: boolean;
  hasCandidates: boolean;
  hasResults: boolean;
  transcript: string;
  icpDescription: string;
  selectedCount: number;
  onExtractICP: () => void;
  onDiscover: () => void;
  onResearch: () => void;
  onStartOver: () => void;
  onSkip: () => void;
}) {
  return (
    <div className="border-border bg-card/80 fixed right-0 bottom-0 left-0 border-t backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        {/* Left: step navigation */}
        <div className="flex items-center gap-1 text-xs">
          <NavButton
            label="1. Transcript"
            active={step === 'input'}
            enabled
            onClick={() => setStep('input')}
          />
          <span className="text-border">&mdash;</span>
          <NavButton
            label="2. ICP"
            active={step === 'review'}
            enabled={hasIcp}
            onClick={() => setStep('review')}
          />
          <span className="text-border">&mdash;</span>
          <NavButton
            label="3. Companies"
            active={step === 'confirm'}
            enabled={hasCandidates || isDiscovering}
            onClick={() => setStep('confirm')}
          />
          <span className="text-border">&mdash;</span>
          <NavButton
            label="4. Results"
            active={step === 'results'}
            enabled={hasResults || isLoading}
            onClick={() => setStep('results')}
          />
        </div>

        {/* Right: action buttons */}
        <div className="flex items-center gap-2">
          {(isDiscovering || isLoading) && step !== 'confirm' && step !== 'results' && (
            <span className="text-muted-foreground flex items-center gap-1.5 text-xs">
              <Loader2 className="size-3 animate-spin" />
              {isDiscovering ? 'Discovering...' : 'Researching...'}
            </span>
          )}

          {step === 'input' && (
            <>
              <Button size="sm" variant="ghost" onClick={onSkip}>
                Skip
                <ChevronRight className="size-4" />
              </Button>
              <Button
                size="sm"
                onClick={onExtractICP}
                disabled={isExtracting || !transcript.trim()}
              >
                {isExtracting ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin" />
                    Extracting...
                  </>
                ) : (
                  <>
                    Extract ICP
                    <ChevronRight className="size-4" />
                  </>
                )}
              </Button>
            </>
          )}

          {step === 'review' && (
            <Button
              size="sm"
              onClick={onDiscover}
              disabled={isDiscovering || !icpDescription.trim()}
            >
              {isDiscovering ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  Finding...
                </>
              ) : (
                <>
                  Find Companies
                  <ChevronRight className="size-4" />
                </>
              )}
            </Button>
          )}

          {step === 'confirm' && (
            <>
              {isDiscovering && (
                <span className="text-muted-foreground flex items-center gap-1.5 text-xs">
                  <Loader2 className="size-3 animate-spin" />
                  Discovering...
                </span>
              )}
              <Button
                size="sm"
                onClick={onResearch}
                disabled={isDiscovering || isLoading || selectedCount === 0}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin" />
                    Researching...
                  </>
                ) : (
                  <>
                    Research {selectedCount} {selectedCount === 1 ? 'Company' : 'Companies'}
                    <ChevronRight className="size-4" />
                  </>
                )}
              </Button>
            </>
          )}

          {step === 'results' && (
            <>
              {isLoading && (
                <span className="text-muted-foreground flex items-center gap-1.5 text-xs">
                  <Loader2 className="size-3.5 animate-spin" />
                  Researching...
                </span>
              )}
              <Button size="sm" variant="outline" onClick={onStartOver}>
                <RotateCcw className="size-3.5" />
                New Research
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
