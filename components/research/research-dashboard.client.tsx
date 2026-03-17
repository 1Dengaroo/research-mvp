'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { TranscriptStep } from './transcript-step';
import { ReviewStep } from './review-step';
import { ConfirmStep } from './confirm-step';
import { ResultsStep } from './results-step';
import { BottomNav } from './bottom-nav';
import { EmailEditorPanel } from './email-editor-panel.client';
import { parseICP, discoverCompanies, researchCompanies } from '@/lib/api';
import type {
  CompanyResult,
  ComposeEmailParams,
  DiscoveredCompanyPreview,
  ICPCriteria
} from '@/lib/types';

type Step = 'input' | 'review' | 'confirm' | 'results';

const EMPTY_ICP: ICPCriteria = {
  description: '',
  industry_keywords: [],
  min_funding_amount: null,
  funding_stages: [],
  hiring_signals: [],
  tech_keywords: [],
  company_examples: []
};

export function ResearchDashboard() {
  const [step, setStep] = useState<Step>('input');
  const [transcript, setTranscript] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [isDiscovering, setIsDiscovering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [icp, setIcp] = useState<ICPCriteria | null>(null);
  const [candidates, setCandidates] = useState<DiscoveredCompanyPreview[]>([]);
  const [results, setResults] = useState<CompanyResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [composeParams, setComposeParams] = useState<ComposeEmailParams | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const handleExtractICP = useCallback(async () => {
    if (!transcript.trim() || isExtracting) return;

    setIsExtracting(true);
    setError(null);

    try {
      const data = await parseICP(transcript.trim());
      setIcp(data);
      setStep('review');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to extract ICP');
    } finally {
      setIsExtracting(false);
    }
  }, [transcript, isExtracting]);

  // Phase 1: Discover companies
  const handleDiscover = useCallback(async () => {
    if (!icp || isDiscovering) return;

    setIsDiscovering(true);
    setStatusMessage('');
    setCandidates([]);
    setError(null);
    setStep('confirm');

    try {
      const found = await discoverCompanies(icp, (event) => {
        if (event.type === 'status') setStatusMessage(event.message);
      });
      setCandidates(found);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Discovery failed');
    } finally {
      setIsDiscovering(false);
    }
  }, [icp, isDiscovering]);

  // Phase 2: Research confirmed companies
  const handleResearch = useCallback(
    async (companyNames: string[]) => {
      if (!icp || isLoading || companyNames.length === 0) return;

      setIsLoading(true);
      setStatusMessage('');
      setResults([]);
      setError(null);
      setStep('results');

      abortRef.current = new AbortController();

      try {
        await researchCompanies(
          icp,
          companyNames,
          (event) => {
            switch (event.type) {
              case 'status':
                setStatusMessage(event.message);
                break;
              case 'company':
                setResults((prev) => [...prev, event.data]);
                break;
              case 'done':
                setStatusMessage(`Research complete. Found ${event.total} companies.`);
                break;
            }
          },
          abortRef.current.signal
        );
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') return;
        setError(err instanceof Error ? err.message : 'Something went wrong');
      } finally {
        setIsLoading(false);
      }
    },
    [icp, isLoading]
  );

  const handleStartOver = () => {
    setStep('input');
    setIcp(null);
    setCandidates([]);
    setResults([]);
    setError(null);
    setStatusMessage('');
  };

  // Store selected companies for the bottom nav to trigger research
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);

  // Sync selected when candidates change
  useEffect(() => {
    setSelectedCompanies(candidates.map((c) => c.name));
  }, [candidates]);

  // Cmd+Enter / Ctrl+Enter to advance
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        if (step === 'input' && transcript.trim() && !isExtracting) {
          handleExtractICP();
        } else if (step === 'review' && icp?.description?.trim() && !isDiscovering) {
          handleDiscover();
        } else if (step === 'confirm' && selectedCompanies.length > 0 && !isLoading) {
          handleResearch(selectedCompanies);
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [
    step,
    transcript,
    icp,
    selectedCompanies,
    isExtracting,
    isDiscovering,
    isLoading,
    handleExtractICP,
    handleDiscover,
    handleResearch
  ]);

  return (
    <div className="bg-background min-h-screen">
      <main className="mx-auto max-w-7xl px-6 pt-10 pb-24">
        <div className="animate-in fade-in duration-300" key={step}>
          {step === 'input' && (
            <TranscriptStep
              transcript={transcript}
              setTranscript={setTranscript}
              isExtracting={isExtracting}
              error={error}
            />
          )}

          {step === 'review' && icp && (
            <ReviewStep icp={icp} setIcp={setIcp} error={error} setError={setError} />
          )}

          {step === 'confirm' && (
            <ConfirmStep
              candidates={candidates}
              selected={selectedCompanies}
              onSelectionChange={setSelectedCompanies}
              isDiscovering={isDiscovering}
              statusMessage={statusMessage}
              error={error}
            />
          )}

          {step === 'results' && (
            <ResultsStep
              icp={icp}
              results={results}
              isLoading={isLoading}
              statusMessage={statusMessage}
              error={error}
              onComposeEmail={setComposeParams}
              onEditCriteria={() => setStep('review')}
            />
          )}
        </div>
      </main>

      <EmailEditorPanel
        open={composeParams !== null}
        params={composeParams}
        onClose={() => setComposeParams(null)}
      />

      <BottomNav
        step={step}
        setStep={setStep}
        isExtracting={isExtracting}
        isDiscovering={isDiscovering}
        isLoading={isLoading}
        hasIcp={!!icp}
        hasCandidates={candidates.length > 0}
        hasResults={results.length > 0}
        transcript={transcript}
        icpDescription={icp?.description ?? ''}
        selectedCount={selectedCompanies.length}
        onExtractICP={handleExtractICP}
        onDiscover={handleDiscover}
        onResearch={() => handleResearch(selectedCompanies)}
        onStartOver={handleStartOver}
        onSkip={() => {
          if (!icp) setIcp({ ...EMPTY_ICP });
          setStep('review');
        }}
      />
    </div>
  );
}
