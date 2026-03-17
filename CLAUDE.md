# Signal — CLAUDE.md

## Project Overview

Signal is an AI-powered outbound sales platform for SMBs. It monitors the web for behavioral buying signals (job postings, hiring patterns, funding rounds, tech stack changes), finds the right contact, and generates hyper-personalized outreach emails.

**Stack:** Next.js App Router · TypeScript · Tailwind · shadcn/ui · Supabase · Inngest · Parallel.ai · Anthropic API · Stripe

## File Structure

- `/app` is routing only — no logic, no `'use client'`, minimal JSX
- All components in `@/components` organized by feature domain (e.g. `pipeline/`, `dashboard/`) — never by type
- Colocate: `<component>.tsx`, `.types.ts`, `.test.tsx`, `.utils.ts`

## SSR / Client Boundary — STRICT

- **Never** put `'use client'` in `page.tsx`, `layout.tsx`, or anything in `/app`
- **Never** mix server and client logic in the same file
- Interactivity → extract to `<Name>.client.tsx` in `@/components`, import into the server component
- `page.tsx` hard limit: **40 lines**. Composition only — no fetching, no logic, no conditionals
- Fetch in server components, pass as props. Use `loading.tsx` / `error.tsx` for streaming/errors

**Pre-file checklist:**

- In `/app`? → Server component. Zero `'use client'`.
- Needs interactivity? → `.client.tsx` in `@/components`
- `page.tsx` doing anything besides composing? → Wrong. Extract it.
- JSX pattern used 2+ times? → Make it a component now.

## TypeScript

- No `as` casting — use type guards or proper inference
- No `enum` — use `as const`:
  ```ts
  const Status = { Active: 'active', Paused: 'paused' } as const;
  type Status = (typeof Status)[keyof typeof Status];
  ```
- No `any` — use `unknown` with narrowing or a proper interface
- `interface` for object shapes, `type` for unions/intersections/primitives
- Annotate return types on all public functions and hooks
- Non-trivial component types → `<component>.types.ts`. Simple inline types OK if under ~2 lines

## Tailwind

- Canonical classes over arbitrary values — `w-16` not `w-[64px]`
- Semantic color tokens (`bg-primary`, `text-muted-foreground`) — never raw hex/rgb
- No token? → Add CSS variable pair to `globals.css` (`:root` + `.dark`)
- No inline `style` props for anything Tailwind can express
- Responsive variants (`md:flex`) over conditional class logic in JS

## Components

- Prefer `shadcn/ui` — run `npx shadcn@latest add <component>` before writing custom primitives
- All styling must be themeable — no hardcoded colors, radii, shadows, or spacing
- Server components: `async/await` for data fetching, not `useEffect` + `useState`
- Extract repeated JSX after the second duplication — not the third

## Core Principles

- **Simplicity first** — smallest change possible, touch only what's necessary
- **No laziness** — find root causes, no temp fixes, senior engineer standards
- **No side effects** — changes must not introduce regressions. Diff your impact.
- Run `npx prettier --write .` after every response with code changes

## Workflow

**Planning:** Enter plan mode for any task with 3+ steps or architectural decisions. If something goes sideways, stop and re-plan — don't push through.

**Subagents:** Use liberally. Offload research, exploration, and parallel analysis. One task per subagent. Keep main context clean.

**Verification:** Never mark complete without proving it works. Ask: "Would a staff engineer approve this?"

**Elegance:** For non-trivial changes, pause and ask "is there a more elegant way?" Skip for simple, obvious fixes.

**Bugs:** When given a bug report, just fix it. Point at logs/errors, resolve them. No hand-holding needed.

## Guardrails

Do not modify anything in this file except the Lessons section.

## Lessons

- **MISTAKE:** Created a giant `page.tsx` with `'use client'` and all logic colocated. **RULE:** `page.tsx` is a shell — 40 lines max, composition only, never `'use client'`. Extract all logic and interactive pieces into named components.
