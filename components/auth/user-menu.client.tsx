'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { User } from '@supabase/supabase-js';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/lib/store/auth-store';

export function UserMenu() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const openAuthModal = useAuthStore((s) => s.openAuthModal);
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

  async function handleLogout() {
    await supabase?.auth.signOut();
    router.push('/');
    router.refresh();
  }

  if (!user) {
    return (
      <Button variant="ghost" size="sm" onClick={openAuthModal}>
        Sign in
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {user.user_metadata?.avatar_url ? (
        <img
          src={user.user_metadata.avatar_url}
          alt=""
          className="size-7 rounded-full"
          referrerPolicy="no-referrer"
        />
      ) : (
        <div className="bg-primary/10 text-primary flex size-7 items-center justify-center rounded-full text-xs font-medium">
          {(user.email?.[0] ?? '?').toUpperCase()}
        </div>
      )}
      <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-1.5">
        <LogOut className="size-3.5" />
        Sign out
      </Button>
    </div>
  );
}
