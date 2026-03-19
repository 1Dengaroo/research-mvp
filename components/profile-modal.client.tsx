'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { useProfileStore } from '@/lib/store/profile-store';
import { createClient } from '@/lib/supabase/client';
import { ProfileTab } from '@/components/settings/profile-tab.client';
import { AppearanceTab } from '@/components/settings/appearance-tab.client';
import { ConnectionsTab } from '@/components/settings/connections-tab.client';
import { SignaturesTab } from '@/components/settings/signatures-tab.client';
import { AccountTab } from '@/components/settings/account-tab.client';
import type { User } from '@supabase/supabase-js';

const TABS = [
  { value: 'profile', label: 'Profile' },
  { value: 'appearance', label: 'Appearance' },
  { value: 'connections', label: 'Connections' },
  { value: 'signatures', label: 'Signatures' },
  { value: 'account', label: 'Account' }
];

export function ProfileModal() {
  const open = useProfileStore((s) => s.open);
  const tab = useProfileStore((s) => s.tab);
  const closeProfile = useProfileStore((s) => s.closeProfile);
  const setTab = useProfileStore((s) => s.setTab);
  const [user, setUser] = useState<User | null>(null);

  const configured = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabase = configured ? createClient() : null;

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && closeProfile()}>
      <DialogContent size="lg" className="p-0">
        <div className="flex h-[560px]">
          {/* Sidebar */}
          <div className="border-border flex w-48 shrink-0 flex-col border-r p-4">
            <DialogHeader className="mb-4 px-1">
              <DialogTitle className="text-sm">Settings</DialogTitle>
              <DialogDescription className="sr-only">
                Manage your account, connections, and preferences.
              </DialogDescription>
            </DialogHeader>
            <nav className="flex flex-col gap-0.5">
              {TABS.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setTab(item.value)}
                  className={`rounded-md px-3 py-1.5 text-left text-sm transition-colors ${
                    tab === item.value
                      ? 'bg-muted text-foreground font-medium'
                      : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {tab === 'profile' && <ProfileTab />}
            {tab === 'appearance' && <AppearanceTab />}
            {tab === 'connections' && <ConnectionsTab />}
            {tab === 'signatures' && <SignaturesTab />}
            {tab === 'account' && <AccountTab user={user} />}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
