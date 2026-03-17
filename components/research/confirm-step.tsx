'use client';

import { useState } from 'react';
import { Building2, ExternalLink, X, Plus, Loader2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { DiscoveredCompanyPreview } from '@/lib/types';

function Checkbox({ checked, className }: { checked: boolean; className?: string }) {
  return (
    <div
      className={`flex size-4 shrink-0 items-center justify-center rounded border transition-colors ${
        checked ? 'border-primary bg-primary text-primary-foreground' : 'border-border'
      } ${className ?? ''}`}
    >
      {checked && (
        <svg className="size-3" viewBox="0 0 12 12" fill="none">
          <path
            d="M2.5 6L5 8.5L9.5 3.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </div>
  );
}

function LoadingStatus({ statusMessage }: { statusMessage: string }) {
  return (
    <div className="bg-card border-border mb-6 overflow-hidden rounded-lg border">
      <div className="relative px-4 py-4">
        <div className="bg-muted absolute inset-x-0 bottom-0 h-0.5">
          <div className="bg-primary h-full w-1/3 animate-[shimmer_2s_ease-in-out_infinite] rounded-full" />
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 flex size-8 items-center justify-center rounded-lg">
            <Search className="text-primary size-4 animate-pulse" />
          </div>
          <div>
            <p className="text-sm font-medium">{statusMessage || 'Searching...'}</p>
            <p className="text-muted-foreground mt-0.5 text-xs">
              Finding companies that match your ICP
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SkeletonRow({ index }: { index: number }) {
  return (
    <div
      className="border-border flex items-center gap-4 border-b px-4 py-3 last:border-b-0"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="border-border size-4 rounded border" />
      <div className="min-w-0 flex-1 space-y-1.5">
        <div className="bg-muted h-4 w-1/3 animate-pulse rounded" />
        <div className="bg-muted h-3 w-2/3 animate-pulse rounded" />
      </div>
    </div>
  );
}

export function ConfirmStep({
  candidates,
  selected,
  onSelectionChange,
  isDiscovering,
  statusMessage,
  error
}: {
  candidates: DiscoveredCompanyPreview[];
  selected: string[];
  onSelectionChange: (companies: string[]) => void;
  isDiscovering: boolean;
  statusMessage: string;
  error: string | null;
}) {
  const [adding, setAdding] = useState(false);
  const [newCompany, setNewCompany] = useState('');

  const selectedSet = new Set(selected);

  const toggle = (name: string) => {
    if (selectedSet.has(name)) {
      onSelectionChange(selected.filter((n) => n !== name));
    } else {
      onSelectionChange([...selected, name]);
    }
  };

  const addCustom = () => {
    if (newCompany.trim() && !selectedSet.has(newCompany.trim())) {
      onSelectionChange([...selected, newCompany.trim()]);
      setNewCompany('');
      setAdding(false);
    }
  };

  const candidateNames = new Set(candidates.map((c) => c.name));
  const customNames = selected.filter((n) => !candidateNames.has(n));
  const allSelected = candidates.length > 0 && candidates.every((c) => selectedSet.has(c.name));
  const showSkeletons = isDiscovering && candidates.length === 0;

  return (
    <>
      <div className="mb-6">
        <h2 className="text-xl font-semibold tracking-tight">Confirm companies</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Select which companies to deep-research. You can add or remove from the list.
        </p>
      </div>

      {error && <p className="text-destructive mb-4 text-sm">{error}</p>}

      {isDiscovering && <LoadingStatus statusMessage={statusMessage} />}

      <div className="border-border bg-card overflow-hidden rounded-xl border">
        {/* Header */}
        <div className="bg-muted/50 border-border flex items-center gap-4 border-b px-4 py-2.5">
          {candidates.length > 0 && (
            <button
              onClick={() => {
                if (allSelected) {
                  onSelectionChange(customNames);
                } else {
                  const allNames = [...candidates.map((c) => c.name), ...customNames];
                  onSelectionChange([...new Set(allNames)]);
                }
              }}
            >
              <Checkbox checked={allSelected} />
            </button>
          )}
          <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
            Company
          </span>
          <span className="text-muted-foreground ml-auto text-xs">{selected.length} selected</span>
        </div>

        {/* Skeleton rows while discovering */}
        {showSkeletons &&
          Array.from({ length: 3 }).map((_, i) => <SkeletonRow key={i} index={i} />)}

        {/* Candidate rows */}
        {candidates.map((company, i) => (
          <button
            key={company.name}
            onClick={() => toggle(company.name)}
            className={`animate-in fade-in slide-in-from-bottom-2 fill-mode-both border-border flex w-full items-start gap-4 border-b px-4 py-3 text-left transition-colors duration-300 last:border-b-0 ${
              selectedSet.has(company.name)
                ? 'bg-card hover:bg-muted/30'
                : 'bg-card opacity-50 hover:opacity-70'
            }`}
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <Checkbox checked={selectedSet.has(company.name)} className="mt-0.5" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <Building2 className="text-muted-foreground size-3.5 shrink-0" />
                <span className="text-sm font-medium">{company.name}</span>
                {company.website && (
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink className="size-3" />
                  </a>
                )}
              </div>
              {company.description && (
                <p className="text-muted-foreground mt-0.5 text-xs leading-relaxed">
                  {company.description}
                </p>
              )}
            </div>
          </button>
        ))}

        {/* Custom additions */}
        {customNames.map((name) => (
          <div
            key={name}
            className="border-border flex items-center gap-4 border-b px-4 py-3 last:border-b-0"
          >
            <Checkbox checked />
            <div className="flex min-w-0 flex-1 items-center gap-1.5">
              <Building2 className="text-muted-foreground size-3.5 shrink-0" />
              <span className="text-sm font-medium">{name}</span>
              <span className="bg-primary/10 text-primary rounded px-1.5 py-0.5 text-xs">
                Custom
              </span>
            </div>
            <button
              onClick={() => onSelectionChange(selected.filter((n) => n !== name))}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="size-3.5" />
            </button>
          </div>
        ))}

        {/* Add custom */}
        <div className="border-border border-t px-4 py-2.5">
          {adding ? (
            <div className="flex gap-2">
              <Input
                value={newCompany}
                onChange={(e) => setNewCompany(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') addCustom();
                  if (e.key === 'Escape') setAdding(false);
                }}
                placeholder="Company name..."
                className="h-8 flex-1 text-sm"
                autoFocus
              />
              <Button size="sm" onClick={addCustom} disabled={!newCompany.trim()}>
                Add
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setAdding(false)}>
                Cancel
              </Button>
            </div>
          ) : (
            <button
              onClick={() => setAdding(true)}
              className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm transition-colors"
            >
              <Plus className="size-3.5" />
              Add a company
            </button>
          )}
        </div>
      </div>
    </>
  );
}
