'use client';

import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export function ProfileTab() {
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/profile')
      .then((r) => r.json())
      .then((data: { full_name?: string }) => setFullName(data.full_name ?? ''))
      .finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ full_name: fullName })
      });
      if (!res.ok) throw new Error();
      toast.success('Profile saved');
    } catch {
      toast.error('Failed to save profile');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-xs space-y-4">
      <div className="space-y-1.5">
        <label className="text-muted-foreground text-xs font-medium">Full Name</label>
        <Input
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder={loading ? 'Loading...' : 'Your name'}
          disabled={loading}
        />
      </div>
      <Button size="sm" onClick={handleSave} disabled={loading || saving}>
        {saving && <Loader2 className="size-3.5 animate-spin" />}
        {saving ? 'Saving...' : 'Save'}
      </Button>
    </div>
  );
}
