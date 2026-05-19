# AgriPilot

AI-powered agriculture planning platform for beginner farmers.

## Tech Stack

Next.js · TypeScript · Tailwind CSS · Shadcn UI · Supabase · React Hook Form · Zod · Three.js

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Demo Login

Go to `/login` and click **Enter as demo user** — no credentials required.

## Environment Variables

Copy `.env.example` to `.env.local` and adjust per environment. **No URL is hardcoded** — every backend call goes through `NEXT_PUBLIC_API_URL`, so you can point the same build at local, staging, or production by changing one variable.

```
# Required — base URL of the FastAPI backend (no trailing slash)
NEXT_PUBLIC_API_URL=http://localhost:5000

# Optional — Supabase connection (app uses demo data when blank)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
AI_PROVIDER_API_KEY=
```

For Vercel/Docker deployments, set `NEXT_PUBLIC_API_URL` in the host's environment settings — do **not** edit the source. The single source of truth is `src/lib/env.ts`.

## Key Pages

| Route | Description |
|---|---|
| `/dashboard` | All projects overview |
| `/projects/new` | Create a project |
| `/projects/[id]/onboarding` | Multi-step land questionnaire |
| `/projects/[id]/plan` | AI-generated farming plan |
| `/projects/[id]/progress` | Step-by-step task tracker |
| `/projects/[id]/visualization` | 3D farm layout |
| `/projects/[id]/troubleshooting` | AI chat assistant |

## Branching Strategy

```
main          — stable, always deployable
develop       — integration branch, merge PRs here
feature/*     — one feature per dev, branched from develop
fix/*         — bug fixes, branched from develop
```

Each dev works on their own `feature/*` branch and opens a PR into `develop`. No one pushes directly to `main` or `develop`.

## Commit Guide

**Format:** `type: short description` (max 72 chars)

| Type | When to use |
|---|---|
| `feat` | New feature or page |
| `fix` | Bug fix |
| `refactor` | Code change with no behaviour change |
| `style` | Formatting, spacing, class names only |
| `chore` | Config, deps, tooling |
| `docs` | README or comment updates |

**Examples:**

```
feat: add multi-step onboarding wizard
fix: resolve dashboard query error on empty projects
refactor: extract ProjectCard into feature folder
chore: add allowedDevOrigins to next.config
```

**Rules:**
- Use lowercase, no period at the end
- Keep commits small and focused — one concern per commit
- Run `npm run typecheck && npm run build` before opening a PR
- Squash fixup commits before merging into `develop`

## Scripts

```bash
npm run dev        # Start dev server
npm run build      # Production build
npm run typecheck  # TypeScript check
npm run lint       # ESLint check
```
