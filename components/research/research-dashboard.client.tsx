'use client';

import { useState, useRef, useCallback } from 'react';
import { Search, Loader2, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeSettings } from '@/components/theme-settings';
import { CompanyCard } from './company-card';
import type { CompanyResult, ICPCriteria, ResearchStreamEvent } from '@/lib/types';

const EXAMPLE_QUERIES = [
  "Find companies that would use Modal's GPU infra for ML training and inference — startups hiring for ML engineers, posting about scaling model pipelines, or mentioning compute bottlenecks",
  'Find companies similar to Modal — AI-intensive startups that raised at least $50M and are hiring for MLOps or GPU infrastructure roles',
  'B2B SaaS companies in the developer tools space with Series B+ funding, hiring for platform engineering',
  'Climate tech startups with $20M+ funding building energy storage or grid optimization software'
];

export function ResearchDashboard() {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [icp, setIcp] = useState<ICPCriteria | null>(null);
  const [results, setResults] = useState<CompanyResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const handleRun = useCallback(async () => {
    if (!query.trim() || isLoading) return;

    setIsLoading(true);
    setStatusMessage('');
    setIcp(null);
    setResults([]);
    setError(null);

    abortRef.current = new AbortController();

    try {
      const response = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: query.trim() }),
        signal: abortRef.current.signal
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || `Request failed: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response stream');

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const json = line.slice(6);
          try {
            const event: ResearchStreamEvent = JSON.parse(json);

            switch (event.type) {
              case 'status':
                setStatusMessage(event.message);
                break;
              case 'icp':
                setIcp(event.data);
                break;
              case 'company':
                setResults((prev) => [...prev, event.data]);
                break;
              case 'done':
                setStatusMessage(`Research complete. Found ${event.total} companies.`);
                break;
              case 'error':
                setError(event.message);
                break;
            }
          } catch {
            // skip malformed events
          }
        }
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return;
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  }, [query, isLoading]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleRun();
      }
    },
    [handleRun]
  );

  return (
    <div className="bg-background min-h-screen">
      <header className="border-border border-b">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary flex size-8 items-center justify-center rounded-lg">
              <Zap className="text-primary-foreground size-4" />
            </div>
            <h1 className="text-lg font-semibold tracking-tight">Signal</h1>
          </div>
          <ThemeSettings />
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-semibold tracking-tight">
            Catch the moment. Close the deal.
          </h2>
          <p className="text-muted-foreground mt-2 text-sm">
            Describe your ideal customer. Signal monitors the web for buying signals and drafts
            hyper-personalized outreach.
          </p>
        </div>

        <div className="mb-4">
          <label
            htmlFor="signal-query"
            className="text-muted-foreground mb-1.5 block text-sm font-medium"
          >
            Describe your ideal customer profile
          </label>
          <div className="flex gap-2">
            <Input
              id="signal-query"
              placeholder="e.g. AI startups that raised $50M+ and are hiring for MLOps..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="h-11 flex-1"
              disabled={isLoading}
            />
            <Button onClick={handleRun} disabled={isLoading || !query.trim()} className="h-11 px-5">
              {isLoading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Running
                </>
              ) : (
                <>
                  <Search className="size-4" />
                  Run
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Example queries */}
        {!isLoading && results.length === 0 && !error && (
          <div className="mb-10">
            <p className="text-muted-foreground mb-2 text-xs font-medium tracking-wider uppercase">
              Try an example
            </p>
            <div className="flex flex-col gap-1.5">
              {EXAMPLE_QUERIES.map((eq, i) => (
                <button
                  key={i}
                  onClick={() => setQuery(eq)}
                  className="text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg px-3 py-2 text-left text-sm transition-colors"
                >
                  {eq}
                </button>
              ))}
            </div>
          </div>
        )}

        {error && (
          <Card className="border-destructive/30 bg-destructive/5 mb-6">
            <CardContent className="pt-6">
              <p className="text-destructive text-sm">{error}</p>
            </CardContent>
          </Card>
        )}

        {isLoading && statusMessage && (
          <div className="mb-6 flex items-center gap-3">
            <Loader2 className="text-primary size-4 animate-spin" />
            <p className="text-muted-foreground text-sm">{statusMessage}</p>
          </div>
        )}

        {icp && (
          <Card className="mb-6" size="sm">
            <CardHeader>
              <CardTitle className="text-sm">Research Criteria</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-2 text-sm">{icp.description}</p>
              <div className="flex flex-wrap gap-1.5">
                {icp.industry_keywords.map((kw, i) => (
                  <span
                    key={i}
                    className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-xs"
                  >
                    {kw}
                  </span>
                ))}
                {icp.tech_keywords.map((kw, i) => (
                  <span
                    key={i}
                    className="bg-secondary text-secondary-foreground rounded-full px-2 py-0.5 text-xs"
                  >
                    {kw}
                  </span>
                ))}
                {icp.hiring_signals.map((kw, i) => (
                  <span
                    key={i}
                    className="rounded-full bg-blue-500/10 px-2 py-0.5 text-xs text-blue-600 dark:text-blue-400"
                  >
                    {kw}
                  </span>
                ))}
                {icp.min_funding_amount && (
                  <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-600 dark:text-emerald-400">
                    ${(icp.min_funding_amount / 1_000_000).toFixed(0)}M+ raised
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {results.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-sm font-medium">
              {isLoading
                ? `${results.length} companies found so far...`
                : `${results.length} companies found`}
            </h3>
            {results.map((result, i) => (
              <CompanyCard key={`${result.company_name}-${i}`} result={result} />
            ))}
          </div>
        )}

        {!isLoading && !error && results.length === 0 && icp && (
          <div className="py-12 text-center">
            <p className="text-muted-foreground text-sm">
              No matching companies found. Try broadening your criteria.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
