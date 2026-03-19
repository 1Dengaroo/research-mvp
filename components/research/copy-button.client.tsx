'use client';

import { useState, useCallback } from 'react';
import { Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  }, [text]);

  return (
    <Button variant="ghost" size="icon-xs" onClick={handleCopy} label="Copy to clipboard">
      {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
    </Button>
  );
}
