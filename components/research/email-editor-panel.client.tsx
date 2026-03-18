'use client';

import { useState, useEffect, useCallback } from 'react';
import { Copy, Check, Send, RefreshCw, Loader2, Link2 } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetBody,
  SheetFooter,
  SheetTitle,
  SheetDescription
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { ComposeEmailParams } from '@/lib/types';
import { generateEmail, sendEmail as sendEmailApi, getGmailStatus } from '@/lib/api';
import { useProfileStore } from '@/lib/store/profile-store';

export function EmailEditorPanel({
  open,
  params,
  onClose
}: {
  open: boolean;
  params: ComposeEmailParams | null;
  onClose: () => void;
}) {
  const [toEmail, setToEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [copied, setCopied] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  const [gmailConnected, setGmailConnected] = useState(false);
  const [gmailChecked, setGmailChecked] = useState(false);

  // Check Gmail connection on mount
  useEffect(() => {
    getGmailStatus().then((status) => {
      setGmailConnected(status.connected);
      setGmailChecked(true);
    });
  }, []);

  // Generate email when panel opens with new params
  useEffect(() => {
    if (!params || !open) return;

    setToEmail(params.contact.email ?? '');
    setSendResult(null);

    const controller = new AbortController();
    setGenerating(true);
    generateEmail(params.company, params.contact, params.icp, controller.signal)
      .then((email) => {
        setSubject(email.subject);
        setBody(email.body);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          // Fallback to the email hook
          const signalTitle = params.company.signals[0]?.title ?? 'Introduction';
          setSubject(`${signalTitle} — ${params.company.company_name}`);
          setBody(params.initialBody);
        }
      })
      .finally(() => setGenerating(false));

    return () => controller.abort();
  }, [params, open]);

  const handleRegenerate = useCallback(async () => {
    if (!params) return;
    setGenerating(true);
    setSendResult(null);
    try {
      const email = await generateEmail(params.company, params.contact, params.icp);
      setSubject(email.subject);
      setBody(email.body);
    } catch {
      // keep current content
    } finally {
      setGenerating(false);
    }
  }, [params]);

  const handleCopy = useCallback(() => {
    const text = `Subject: ${subject}\n\n${body}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [subject, body]);

  const handleSend = useCallback(async () => {
    if (!params || !toEmail) return;
    setSending(true);
    setSendResult(null);
    try {
      const result = await sendEmailApi({
        to: toEmail,
        subject,
        body,
        companyName: params.company.company_name,
        contactName: params.contact.name
      });
      if (result.success) {
        setSendResult({ type: 'success', message: 'Email sent successfully' });
      } else {
        setSendResult({ type: 'error', message: result.error ?? 'Send failed' });
      }
    } catch (err) {
      setSendResult({
        type: 'error',
        message: err instanceof Error ? err.message : 'Send failed'
      });
    } finally {
      setSending(false);
    }
  }, [params, toEmail, subject, body]);

  const company = params?.company;
  const contact = params?.contact;

  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent side="right" size="lg">
        <SheetHeader>
          <SheetTitle>{company?.company_name ?? ''}</SheetTitle>
          <SheetDescription>{contact ? `${contact.name} · ${contact.title}` : ''}</SheetDescription>
        </SheetHeader>

        <SheetBody className="flex flex-col gap-4">
          <div className="space-y-1.5">
            <label className="text-muted-foreground text-xs font-medium">To</label>
            <Input
              value={toEmail}
              onChange={(e) => setToEmail(e.target.value)}
              placeholder="No email found"
              type="email"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-muted-foreground text-xs font-medium">Subject</label>
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              disabled={generating}
              placeholder={generating ? 'Generating...' : ''}
            />
          </div>

          <div className="flex flex-1 flex-col space-y-1.5">
            <label className="text-muted-foreground text-xs font-medium">Body</label>
            <Textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="min-h-52 flex-1 resize-none"
              disabled={generating}
              placeholder={generating ? 'Generating personalized email...' : ''}
            />
          </div>

          {sendResult && (
            <p
              className={`text-sm ${
                sendResult.type === 'success' ? 'text-primary' : 'text-destructive'
              }`}
            >
              {sendResult.message}
            </p>
          )}
        </SheetBody>

        <SheetFooter className="flex-row border-t">
          <Button variant="outline" size="sm" onClick={handleRegenerate} disabled={generating}>
            {generating ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <RefreshCw className="size-3.5" />
            )}
            {generating ? 'Generating...' : 'Regenerate'}
          </Button>
          <Button variant="outline" size="sm" onClick={handleCopy} disabled={generating}>
            {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
            {copied ? 'Copied' : 'Copy'}
          </Button>
          <div className="ml-auto flex items-center gap-2">
            {gmailChecked && !gmailConnected && (
              <button
                type="button"
                onClick={() => useProfileStore.getState().openProfile('connections')}
                className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-xs transition-colors"
              >
                <Link2 className="size-3" />
                Connect Gmail
              </button>
            )}
            <Button
              size="sm"
              onClick={handleSend}
              disabled={!gmailConnected || !toEmail || generating || sending}
              title={!gmailConnected ? 'Connect Gmail in Settings to send' : undefined}
            >
              {sending ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Send className="size-3.5" />
              )}
              {sending ? 'Sending...' : 'Send'}
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
