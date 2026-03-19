# Email Workflow

End-to-end email generation, signatures, persistence, and sending.

## Email Generation

- Prompt: `lib/prompts/email-generation.ts` — `buildEmailGenerationPrompt(company, contact, icp, senderFirstName?)`
- API: `POST /api/emails/generate` — reads user's `full_name` from Supabase auth, extracts first name, passes to prompt
- Output: 3-email sequence (initial + 2 follow-ups) as `GeneratedEmailSequence`
- Sender sign-off uses real first name instead of `[Your name]` when available

## Sequence Persistence

Email sequences are persisted to avoid regeneration on editor close/reopen:

1. **Store**: `emailSequences` in `useResearchStore` — `Record<string, GeneratedEmailSequence>` keyed by `companyName::contactEmail`
2. **Session**: Saved to `research_sessions.email_sequences` (jsonb) via `saveSession()`
3. **Hydration**: Restored from session on page load via `hydrateStore()`
4. **Editor flow**: On open, checks store first. If found, loads directly (no API call). If not, generates via API and saves to store.
5. **Edits**: Persisted back to store when editor panel closes. Also saved on regenerate.

## Signatures

### Storage

- Table: `email_signatures` — `id`, `user_id`, `name`, `body`, `is_default`, timestamps
- RLS: `auth.uid() = user_id`
- API: `/api/signatures` (GET, POST), `/api/signatures/[id]` (PATCH, DELETE)
- When setting `is_default: true`, clears default on all other user signatures

### Store

`lib/store/signature-store.ts` — `useSignatureStore`:

- `loadSignatures()`, `createSignature()`, `updateSignature()`, `deleteSignature()`, `getDefault()`

### UI

- **Settings modal**: Signatures tab — list, create (inline form), edit (inline), delete, set default
- **Email editor**: Signature selector dropdown in footer. Default auto-selected on mount. On send, selected signature body is appended to email body.

## Sending

- Gmail OAuth via `lib/services/gmail.ts`
- `POST /api/emails/send` — sends via Gmail API, records in `sent_emails`, upserts `contacted_companies`
- Sent emails page shows "View Session" link when `session_id` is present
