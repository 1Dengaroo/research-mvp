# Conventions

## SSR / Client Boundary

- Never `'use client'` in `/app` — not in `page.tsx`, `layout.tsx`, or any file
- Interactivity → `<Name>.client.tsx` in `@/components`
- `page.tsx` ≤ 40 lines, composition only
- Fetch in server components, pass as props

## TypeScript

- No `as`, no `enum`, no `any`
- `as const` for union types, `unknown` + narrowing for unknowns
- `interface` for objects, `type` for unions/intersections
- Return types on all public functions and hooks
- Non-trivial types → `<component>.types.ts`

## Tailwind

- Canonical classes over arbitrary values (`w-16` not `w-[64px]`)
- Semantic tokens only (`bg-primary`, `text-muted-foreground`) — no raw hex/rgb
- Missing token → add CSS variable to `globals.css`
- Responsive variants (`md:flex`) over JS conditional class logic

## Components

- `shadcn/ui` first — `npx shadcn@latest add <component>` before custom primitives
- All styling themeable — no hardcoded colors, radii, shadows
- Extract repeated JSX after second duplication
- Feature-organized (`research/`, `auth/`) — never by type
- Colocate: `.tsx`, `.types.ts`, `.test.tsx`, `.utils.ts`

## Formatting

- `npx prettier --write .` after code changes
