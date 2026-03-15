import {
  Building2,
  Briefcase,
  DollarSign,
  Mail,
  ExternalLink,
  Linkedin,
  Sparkles,
  Tag
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { SignalBadge } from './signal-badge';
import { CopyButton } from './copy-button.client';
import type { CompanyResult } from '@/lib/types';

export function CompanyCard({ result }: { result: CompanyResult }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <CardTitle className="flex items-center gap-2 text-lg">
              {result.company_name}
              {result.website && (
                <a
                  href={result.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <ExternalLink className="size-3.5" />
                </a>
              )}
            </CardTitle>
            <CardDescription className="mt-1 flex flex-wrap items-center gap-2 text-xs">
              <span className="flex items-center gap-1">
                <Building2 className="size-3" />
                {result.industry}
              </span>
              <span className="text-border">|</span>
              <span className="flex items-center gap-1">
                <DollarSign className="size-3" />
                {result.amount_raised}
              </span>
              <span className="text-border">|</span>
              <span>{result.funding_stage}</span>
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Signals */}
        <div>
          <h4 className="text-muted-foreground mb-2 flex items-center gap-1.5 text-xs font-medium tracking-wider uppercase">
            <Sparkles className="size-3" />
            Signals Detected
          </h4>
          <div className="space-y-2">
            {result.signals.map((signal, i) => (
              <div key={i} className="bg-muted/50 rounded-lg px-3 py-2">
                <div className="mb-1 flex items-center gap-2">
                  <SignalBadge type={signal.type} />
                  <span className="text-sm font-medium">{signal.title}</span>
                </div>
                {signal.key_phrases.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {signal.key_phrases.map((phrase, j) => (
                      <span
                        key={j}
                        className="bg-background text-muted-foreground flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs"
                      >
                        <Tag className="size-2.5" />
                        {phrase}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Why they match */}
        <div>
          <h4 className="text-muted-foreground mb-1.5 flex items-center gap-1.5 text-xs font-medium tracking-wider uppercase">
            <Briefcase className="size-3" />
            Why They Match
          </h4>
          <p className="text-sm">{result.match_reason}</p>
        </div>

        {/* Target contact */}
        {result.target_contact && (
          <div>
            <h4 className="text-muted-foreground mb-1.5 flex items-center gap-1.5 text-xs font-medium tracking-wider uppercase">
              <Linkedin className="size-3" />
              Target Contact
            </h4>
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium">{result.target_contact.name}</span>
              <span className="text-muted-foreground">{result.target_contact.title}</span>
              {result.target_contact.linkedin_url && (
                <a
                  href={result.target_contact.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  <Linkedin className="size-3.5" />
                </a>
              )}
            </div>
          </div>
        )}

        {/* Email hook */}
        <div>
          <h4 className="text-muted-foreground mb-1.5 flex items-center gap-1.5 text-xs font-medium tracking-wider uppercase">
            <Mail className="size-3" />
            Suggested Email Hook
          </h4>
          <div className="border-primary/20 bg-primary/5 flex items-start gap-2 rounded-lg border px-3 py-2">
            <p className="flex-1 text-sm italic">&ldquo;{result.email_hook}&rdquo;</p>
            <CopyButton text={result.email_hook} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
