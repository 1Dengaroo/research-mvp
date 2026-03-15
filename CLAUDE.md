# Signal — CLAUDE.md

## Project Overview

- Signal is an AI-powered outbound sales platform that finds and converts high-intent leads for SMBs and growth-stage startups — without the cost of a sales hire. It monitors the web for behavioral buying signals (job postings, hiring patterns, funding rounds, tech stack changes), finds the right contact, and generates hyper-personalized emails rooted in the exact signal detected.

- Stack: Next.js App Router · TypeScript · Tailwind · shadcn/ui · Supabase · Inngest · Parallel.ai · Anthropic API · Stripe

## Architecture Rules

### File Structure

- `/app` is routing only — no logic, no `'use client'`, minimal JSX. Page files compose server components and nothing else.
- All components live in `@/components` organized by feature domain (e.g. `@/components/pipeline/`, `@/components/dashboard/`) — never by type
- Colocate component files: `<component>.tsx`, `<component>.types.ts`, `<component>.test.tsx`, `<component>.utils.ts`

### SSR / Client Boundary — STRICT RULES

- NEVER put `'use client'` in `page.tsx`, `layout.tsx`, or any file inside `/app`
- NEVER mix server and client logic in the same file
- If a component needs interactivity, extract it into `<ComponentName>.client.tsx` inside `@/components` and import it into the server component
- `page.tsx` hard limit: **40 lines**. If approaching this, stop and extract immediately
- Fetch data in server components and pass as props — no client-side fetching unless real-time interactivity requires it
- Use `loading.tsx` and `error.tsx` at route level for streaming and error boundaries

### Before Creating Any File — Run This Checklist

- Is this in `/app`? → Must be a server component. Zero `'use client'`.
- Does it need interactivity? → Extract to a `.client.tsx` file in `@/components`
- Is `page.tsx` doing anything besides composing components? → Wrong. Extract it.
- Is any logic (fetching, transforms, conditionals) inside `page.tsx`? → Wrong. Move it.
- Is this JSX pattern used more than twice? → Make it a component now.

## TypeScript

- No `as` type casting — use type guards or proper inference
- No `enum` — use `as const` objects:

```ts
const Status = { Active: 'active', Paused: 'paused' } as const;
type Status = (typeof Status)[keyof typeof Status];
```

- No `any` — use `unknown` with narrowing or a proper interface
- `interface` for object shapes, `type` for unions/intersections/primitives
- Annotate return types explicitly on all public-facing functions and hooks
- Non-trivial component types go in `<component>.types.ts` — simple single-use types can be inline if under ~2 lines

## Tailwind

- Use canonical Tailwind classes over arbitrary values — `w-16` not `w-[64px]`, `text-sm` not `text-[14px]`
- Only use arbitrary values when no standard class maps to the requirement
- Use semantic color tokens (`bg-primary`, `text-muted-foreground`) — never raw hex or rgb
- If no suitable token exists, add a CSS variable pair to `@/styles/globals.css` (`:root` + `.dark`)
- No inline `style` props for anything Tailwind can express
- Prefer responsive variants (`md:flex`, `lg:w-1/2`) over conditional class logic in JS

## Component Patterns

- Prefer `shadcn/ui` over building from scratch — run `npx shadcn@latest add <component>` before writing custom primitives
- All styling must be themeable — never hardcode colors, radii, shadows, or spacing that should vary by theme
- Prefer `async/await` in server components over `useEffect` + `useState` for data fetching
- Extract repeated JSX into a component after the second duplication — not the third

## Core Principles

- **Simplicity first** — make every change as small as possible. Touch only what's necessary.
- **No laziness** — find root causes. No temporary fixes. Senior engineer standards.
- **No side effects** — changes must not introduce regressions elsewhere. Diff your impact.
- Run `npx prettier --write .` after every response that includes code changes.

## Workflow Orchestration

### Plan Node Default

- Enter plan mode for ANY non-trivial task (3+ steps or architectural decisions)
- If something goes sideways, STOP and re-plan immediately — don't keep pushing
- Use plan mode for verification steps, not just building
- Write detailed specs upfront to reduce ambiguity

### Subagent Strategy

- Use subagents liberally to keep main context window clean
- Offload research, exploration, and parallel analysis to subagents
- For complex problems, throw more compute at it via subagents
- One task per subagent for focused execution

### Self-Improvement Loop

- After ANY correction from the user: update the Lessons section below with the pattern
- Write rules for yourself that prevent the same mistake
- Ruthlessly iterate on these lessons until mistake rate drops
- Review lessons at session start for relevant project context

### Verification Before Done

- Never mark a task complete without proving it works
- Diff behavior between main and your changes when relevant
- Ask yourself: "Would a staff engineer approve this?"
- Run tests, check logs, demonstrate correctness

### Demand Elegance (Balanced)

- For non-trivial changes: pause and ask "is there a more elegant way?"
- If a fix feels hacky: "Knowing everything I know now, implement the elegant solution"
- Skip this for simple, obvious fixes — don't over-engineer
- Challenge your own work before presenting it

### Autonomous Bug Fixing

- When given a bug report: just fix it. Don't ask for hand-holding.
- Point at logs, errors, failing tests — then resolve them
- Zero context switching required from the user
- Go fix failing CI tests without being told how

## Guardrails

- DO NOT modify anything in this file other than the Lessons section below.

## Lessons

- MISTAKE: Created a giant `page.tsx` with `'use client'` and all logic colocated. RULE: `page.tsx` is a shell, 40 lines max, composition only, never `'use client'`. Extract all logic and interactive pieces into named components.
