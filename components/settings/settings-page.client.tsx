'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useProfileStore } from '@/lib/store/profile-store';

export function SettingsPage() {
  const router = useRouter();
  const openProfile = useProfileStore((s) => s.openProfile);

  useEffect(() => {
    openProfile('connections');
    router.replace('/');
  }, [openProfile, router]);

  return null;
}
