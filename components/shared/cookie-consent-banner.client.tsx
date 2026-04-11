'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

const STORAGE_KEY = 'remes_cookie_consent';

export function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      setVisible(true);
    }
  }, []);

  function dismiss(value: 'accepted' | 'declined') {
    localStorage.setItem(STORAGE_KEY, value);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 p-4 sm:p-6">
      <div className="mx-auto flex max-w-lg flex-col items-center gap-3 rounded-xl border border-(--landing-border-card) bg-(--landing-bg-card) px-5 py-4 shadow-lg sm:flex-row sm:gap-4">
        <p className="text-landing-fg-secondary text-xs leading-relaxed sm:text-sm">
          We use cookies to improve your experience.{' '}
          <a
            href="/privacy"
            className="text-landing-fg underline underline-offset-2 transition-colors hover:text-(--landing-accent)"
          >
            Privacy policy
          </a>
        </p>
        <div className="flex shrink-0 gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => dismiss('declined')}
            className="text-landing-fg-muted hover:text-landing-fg text-xs"
          >
            Decline
          </Button>
          <Button
            size="sm"
            onClick={() => dismiss('accepted')}
            className="bg-(--landing-accent) text-xs text-white hover:bg-(--landing-accent)/80"
          >
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
}
