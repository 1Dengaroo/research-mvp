'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Check, Mail, CheckCircle, Loader2, LogOut, Plus, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { themes } from '@/lib/theme/theme-registry';
import { fonts } from '@/lib/theme/font-registry';
import { useFont } from '@/lib/theme/font-provider';
import { useProfileStore } from '@/lib/store/profile-store';
import { useSignatureStore } from '@/lib/store/signature-store';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import { getGmailStatus, connectGmail, disconnectGmail } from '@/lib/api';
import type { User } from '@supabase/supabase-js';

function AppearanceTab() {
  const { theme, setTheme } = useTheme();
  const { font: currentFont, setFont } = useFont();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="space-y-6">
      <section>
        <h3 className="mb-3 text-sm font-medium">Theme</h3>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              className={`hover:bg-accent/50 flex flex-col items-center gap-1.5 rounded-lg border p-3 text-xs transition-colors ${
                mounted && t.id === theme ? 'border-primary ring-primary ring-1' : 'border-border'
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
            </button>
          ))}
        </div>
      </section>

      <section>
        <h3 className="mb-3 text-sm font-medium">Font</h3>
        <div className="flex flex-col gap-1">
          {fonts.map((f) => (
            <button
              key={f.id}
              onClick={() => setFont(f.id)}
              className={`hover:bg-accent/50 flex items-center justify-between rounded-lg border px-3 py-2 text-sm transition-colors ${
                mounted && f.id === currentFont.id
                  ? 'border-primary ring-primary ring-1'
                  : 'border-border'
              }`}
              style={{ fontFamily: `var(${f.variable})` }}
            >
              <div className="flex flex-col items-start gap-0.5">
                <span>{f.name}</span>
                <span className="text-muted-foreground text-xs">{f.description}</span>
              </div>
              {mounted && f.id === currentFont.id && <Check className="text-primary size-3.5" />}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

function ConnectionsTab() {
  const [gmailConnected, setGmailConnected] = useState(false);
  const [gmailEmail, setGmailEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [disconnecting, setDisconnecting] = useState(false);

  useEffect(() => {
    getGmailStatus().then((status) => {
      setGmailConnected(status.connected);
      setGmailEmail(status.email);
      setLoading(false);
    });
  }, []);

  return (
    <div>
      <p className="text-muted-foreground mb-4 text-sm">
        Connect your email to send outreach directly from Signal.
      </p>

      <div className="border-border flex items-center justify-between rounded-md border p-4">
        <div className="flex items-center gap-3">
          <div className="bg-muted flex size-10 items-center justify-center rounded-lg">
            <Mail className="text-muted-foreground size-5" />
          </div>
          <div>
            <p className="text-foreground text-sm font-medium">Gmail</p>
            {loading ? (
              <p className="text-muted-foreground text-xs">Checking...</p>
            ) : gmailConnected ? (
              <p className="text-muted-foreground flex items-center gap-1 text-xs">
                <CheckCircle className="text-primary size-3" />
                {gmailEmail}
              </p>
            ) : (
              <p className="text-muted-foreground text-xs">Not connected</p>
            )}
          </div>
        </div>

        {!loading &&
          (gmailConnected ? (
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                setDisconnecting(true);
                try {
                  await disconnectGmail();
                  setGmailConnected(false);
                  setGmailEmail(null);
                  toast.success('Gmail disconnected');
                } catch {
                  toast.error('Failed to disconnect Gmail');
                } finally {
                  setDisconnecting(false);
                }
              }}
              disabled={disconnecting}
            >
              {disconnecting && <Loader2 className="size-3.5 animate-spin" />}
              Disconnect
            </Button>
          ) : (
            <Button size="sm" onClick={() => connectGmail()}>
              Connect Gmail
            </Button>
          ))}
      </div>
    </div>
  );
}

function SignaturesTab() {
  const signatures = useSignatureStore((s) => s.signatures);
  const isLoading = useSignatureStore((s) => s.isLoading);
  const loadSignatures = useSignatureStore((s) => s.loadSignatures);
  const createSig = useSignatureStore((s) => s.createSignature);
  const updateSig = useSignatureStore((s) => s.updateSignature);
  const deleteSig = useSignatureStore((s) => s.deleteSignature);

  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [body, setBody] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    loadSignatures();
  }, [loadSignatures]);

  function resetForm() {
    setName('');
    setBody('');
    setAdding(false);
    setEditingId(null);
  }

  async function handleSave() {
    if (!name.trim() || !body.trim()) return;
    try {
      if (editingId) {
        await updateSig(editingId, { name: name.trim(), body: body.trim() });
        toast.success('Signature updated');
      } else {
        await createSig(name.trim(), body.trim());
        toast.success('Signature created');
      }
      resetForm();
    } catch {
      toast.error('Failed to save signature');
    }
  }

  const deletingSignature = signatures.find((s) => s.id === deletingId);

  return (
    <div className="space-y-6">
      <section>
        <h3 className="mb-3 text-sm font-medium">Signatures</h3>
        <p className="text-muted-foreground mb-4 text-sm">
          Appended to outreach emails when sending.
        </p>
        {!adding && !editingId && (
          <Button size="sm" className="mb-4" onClick={() => setAdding(true)}>
            <Plus className="size-3.5" />
            Add Signature
          </Button>
        )}

        {(adding || editingId) && (
          <div className="border-border mb-4 space-y-3 rounded-md border p-4">
            <div className="space-y-1.5">
              <label className="text-muted-foreground text-xs font-medium">Name</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Work, Casual"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-muted-foreground text-xs font-medium">Signature</label>
              <Textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Best,&#10;John Doe&#10;CEO, Acme Inc."
                className="min-h-24 resize-none"
              />
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={handleSave} disabled={!name.trim() || !body.trim()}>
                {editingId ? 'Update' : 'Save'}
              </Button>
              <Button size="sm" variant="ghost" onClick={resetForm}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="text-muted-foreground flex items-center gap-2 py-4 text-sm">
            <Loader2 className="size-3.5 animate-spin" />
            Loading...
          </div>
        ) : signatures.length === 0 && !adding ? (
          <div className="border-border rounded-md border py-8 text-center">
            <p className="text-muted-foreground text-sm">No signatures yet</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {signatures.map((sig) => (
              <div
                key={sig.id}
                className="border-border flex items-center justify-between rounded-md border p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-muted flex size-10 items-center justify-center rounded-lg">
                    <Mail className="text-muted-foreground size-5" />
                  </div>
                  <div>
                    <p className="text-foreground text-sm font-medium">{sig.name}</p>
                    <p className="text-muted-foreground flex items-center gap-1 text-xs">
                      {sig.is_default && <CheckCircle className="text-primary size-3" />}
                      {sig.is_default ? 'Default' : sig.body.split('\n')[0]}
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {!sig.is_default && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        updateSig(sig.id, { is_default: true })
                          .then(() => toast.success('Default signature updated'))
                          .catch(() => toast.error('Failed to set default'))
                      }
                    >
                      Set default
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingId(sig.id);
                      setName(sig.name);
                      setBody(sig.body);
                    }}
                  >
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setDeletingId(sig.id)}>
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <AlertDialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete signature?</AlertDialogTitle>
            <AlertDialogDescription>
              &ldquo;{deletingSignature?.name}&rdquo; will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel size="sm">Cancel</AlertDialogCancel>
            <AlertDialogAction
              size="sm"
              onClick={() => {
                if (deletingId) {
                  deleteSig(deletingId)
                    .then(() => toast.success('Signature deleted'))
                    .catch(() => toast.error('Failed to delete signature'));
                }
                setDeletingId(null);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function AccountTab({ user }: { user: User | null }) {
  const router = useRouter();
  const closeProfile = useProfileStore((s) => s.closeProfile);
  const configured = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabase = configured ? createClient() : null;

  async function handleLogout() {
    await supabase?.auth.signOut();
    closeProfile();
    router.push('/');
    router.refresh();
  }

  return (
    <div className="space-y-4">
      {user && (
        <div className="border-border flex items-center gap-3 rounded-md border p-4">
          {user.user_metadata?.avatar_url ? (
            <img
              src={user.user_metadata.avatar_url}
              alt=""
              className="size-10 rounded-full"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-full text-sm font-medium">
              {(user.email?.[0] ?? '?').toUpperCase()}
            </div>
          )}
          <div>
            <p className="text-foreground text-sm font-medium">
              {user.user_metadata?.full_name ?? user.email}
            </p>
            {user.user_metadata?.full_name && (
              <p className="text-muted-foreground text-xs">{user.email}</p>
            )}
          </div>
        </div>
      )}

      <Button variant="outline" size="sm" onClick={handleLogout} className="gap-1.5">
        <LogOut className="size-3.5" />
        Sign out
      </Button>
    </div>
  );
}

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
              {[
                { value: 'appearance', label: 'Appearance' },
                { value: 'connections', label: 'Connections' },
                { value: 'signatures', label: 'Signatures' },
                { value: 'account', label: 'Account' }
              ].map((item) => (
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
