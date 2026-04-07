'use client';

import { useSyncExternalStore } from 'react';
import { Check } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { themes } from '@/lib/theme/theme-registry';
import { fonts } from '@/lib/theme/font-registry';
import { useFont } from '@/lib/theme/font-provider';

const subscribe = () => () => {};
function useMounted() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
}

export function AppearanceTab() {
  const { theme, setTheme } = useTheme();
  const { font: currentFont, setFont } = useFont();
  const mounted = useMounted();

  return (
    <div className="space-y-6">
      <section>
        <h3 className="mb-3 text-sm font-medium">Theme</h3>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {themes.map((t) => (
            <Button
              key={t.id}
              variant="outline"
              onClick={() => setTheme(t.id)}
              className={`hover:bg-accent/50 h-auto flex-col gap-1.5 rounded-lg p-3 text-xs ${
                mounted && t.id === theme ? 'border-primary ring-primary ring-1' : ''
              }`}
            >
              <div className="flex gap-1">
                <span
                  className="border-border/50 inline-block size-3.5 rounded-full border"
                  style={{ background: t.previewColors.bg }}
                />
                <span
                  className="border-border/50 inline-block size-3.5 rounded-full border"
                  style={{ background: t.previewColors.primary }}
                />
                <span
                  className="border-border/50 inline-block size-3.5 rounded-full border"
                  style={{ background: t.previewColors.secondary }}
                />
                <span
                  className="border-border/50 inline-block size-3.5 rounded-full border"
                  style={{ background: t.previewColors.tertiary }}
                />
              </div>
              <span>{t.name}</span>
            </Button>
          ))}
        </div>
      </section>

      <section>
        <h3 className="mb-3 text-sm font-medium">Font</h3>
        <div className="flex flex-col gap-1">
          {fonts.map((f) => (
            <Button
              key={f.id}
              variant="outline"
              onClick={() => setFont(f.id)}
              className={`hover:bg-accent/50 h-auto justify-between rounded-lg px-3 py-2 ${
                mounted && f.id === currentFont.id ? 'border-primary ring-primary ring-1' : ''
              }`}
              style={f.variable ? { fontFamily: `var(${f.variable})` } : undefined}
            >
              <div className="flex flex-col items-start gap-0.5">
                <span>{f.name}</span>
                <span className="text-muted-foreground text-xs">{f.description}</span>
              </div>
              {mounted && f.id === currentFont.id && <Check className="text-primary size-3.5" />}
            </Button>
          ))}
        </div>
      </section>
    </div>
  );
}
