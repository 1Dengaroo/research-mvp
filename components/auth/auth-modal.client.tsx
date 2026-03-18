'use client';

import { Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { VisuallyHidden } from 'radix-ui';
import { useAuthStore } from '@/lib/store/auth-store';
import { AuthForm } from '@/components/auth/auth-form.client';

function LoginParamListener() {
  const searchParams = useSearchParams();
  const openAuthModal = useAuthStore((s) => s.openAuthModal);

  useEffect(() => {
    if (searchParams.get('login') === 'true') {
      openAuthModal();
    }
  }, [searchParams, openAuthModal]);

  return null;
}

export function AuthModal() {
  const { open, openAuthModal, closeAuthModal } = useAuthStore();

  return (
    <>
      <Suspense>
        <LoginParamListener />
      </Suspense>
      <Dialog open={open} onOpenChange={(v) => (v ? openAuthModal() : closeAuthModal())}>
        <DialogContent className="p-8 sm:max-w-md">
          <VisuallyHidden.Root>
            <DialogTitle>Sign in</DialogTitle>
          </VisuallyHidden.Root>
          <AuthForm />
        </DialogContent>
      </Dialog>
    </>
  );
}
