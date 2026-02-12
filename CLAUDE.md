# CLAUDE.md — QuiVoteQuoi

## Project Overview

QuiVoteQuoi ("Who Votes What") is a full-stack web application for analyzing French National Assembly voting records. It provides interactive hemicycle visualizations, deputy vote tracking, absence statistics, thematic rankings by political group, and full-text search over scrutins (votes).

## Tech Stack

- **Framework:** Nuxt 4 (Vue 3 + Nitro server engine), TypeScript
- **Database:** Supabase (hosted PostgreSQL) via `@supabase/supabase-js`
- **Styling:** Tailwind CSS 4 + DaisyUI 5
- **Build tool:** Vite (integrated via Nuxt)
- **Image processing:** Sharp (used in photo-fetch script)
- **Package manager:** pnpm (npm also works)

## Quick Start

```bash
# Install dependencies
pnpm install

# Copy env template and fill in Supabase credentials
cp .env.example .env

# Start dev server (default: http://localhost:3000)
pnpm dev

# Production build
pnpm build

# Preview production build
pnpm preview
```

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `SUPABASE_URL` | Yes | Supabase project URL |
| `SUPABASE_ANON_KEY` | Yes | Supabase anonymous/public key |

These are exposed as public runtime config in `nuxt.config.ts` (anon key only — safe for client-side use).

Additional variables for the photo-fetch script (`scripts/fetch-deputy-photos.js`):
- `SUPABASE_SERVICE_ROLE_KEY` — admin-level Supabase key
- `QVQ_BUCKET` — Supabase storage bucket name
- `QVQ_UA` — User-Agent string for Wikimedia requests
- `QVQ_POOL` — parallel worker count (default 3)

## Project Structure

```
QuivoteQuoi/
├── app/                        # Frontend (Nuxt app directory)
│   ├── app.vue                 # Root component (layout shell)
│   ├── components/             # Reusable Vue components
│   └── pages/                  # File-based routes
├── server/                     # Backend (Nitro)
│   ├── api/                    # API route handlers
│   └── utils/                  # Server utilities (Supabase client)
├── types/                      # Shared TypeScript types
│   ├── db.ts                   # Database table/view types
│   └── ui.ts                   # UI-specific types
├── assets/
│   └── app.css                 # Global styles (Tailwind + DaisyUI imports)
├── public/                     # Static assets served at /
│   └── branding/               # SVG logos and icons
├── scripts/                    # One-off Node.js scripts
├── nuxt.config.ts              # Nuxt configuration
├── tsconfig.json               # TypeScript config (extends .nuxt/)
├── package.json
└── .env.example
```

## Pages (Routes)

| Route | File | Description |
|---|---|---|
| `/` | `app/pages/index.vue` | Home — hemicycle visualization + latest votes |
| `/deputes` | `app/pages/deputes.vue` | Deputies list with search & group filtering |
| `/depute/:slug` | `app/pages/depute/[slug].vue` | Individual deputy profile + vote history |
| `/search` | `app/pages/search.vue` | Full-text search across scrutins |
| `/scrutin/:id` | `app/pages/scrutin/[id].vue` | Detailed vote breakdown with hemicycle |
| `/classements` | `app/pages/classements.vue` | Thematic rankings by political group |
| `/absences` | `app/pages/absences.vue` | Deputy/group absence statistics |
| `/condamnations` | `app/pages/condamnations.vue` | Deputy legal condemnation records |
| `/methodologie` | `app/pages/methodologie.vue` | Methodology documentation |
| `/sources` | `app/pages/sources.vue` | Data sources attribution |

## API Endpoints

All API routes live in `server/api/` and use the `*.get.ts` naming convention (Nitro file-based routing, GET method).

| Endpoint | File | Purpose |
|---|---|---|
| `GET /api/deputes` | `deputes.get.ts` | List deputies (filterable by group/search) |
| `GET /api/depute/:slug` | `depute/[slug].get.ts` | Single deputy details + recent votes |
| `GET /api/scrutins` | `scrutins.get.ts` | List recent scrutins |
| `GET /api/scrutins/latest` | `scrutins/latest.get.ts` | Latest scrutins with vote counts |
| `GET /api/scrutins/:id` | `scrutins/[id].get.ts` | Single scrutin detail + vote breakdown |
| `GET /api/search` | `search.get.ts` | Full-text search with pagination |
| `GET /api/hemicycle/deputies` | `hemicycle/deputies.get.ts` | Deputies for hemicycle SVG rendering |
| `GET /api/groups/hemicycle` | `groups/hemicycle.get.ts` | Political groups with seat counts |
| `GET /api/absences` | `absences.get.ts` | Absence statistics |
| `GET /api/condamnations` | `condamnations.get.ts` | Condemnation records |
| `GET /api/rankings/:slug` | `rankings/[slug].get.ts` | Thematic rankings by group |
| `GET /api/themes` | `themes.get.ts` | Available ranking themes |

## Key Components

| Component | Purpose |
|---|---|
| `Header.vue` | Sticky navigation bar with responsive mobile menu |
| `Footer.vue` | Site footer with links |
| `HeroBrand.vue` | Hero section with search controls |
| `HemicycleHomeInteractive.vue` | Interactive hemicycle visualization (home page) |
| `HemicycleScrutinInteractive.vue` | Interactive hemicycle for individual vote pages |
| `SearchControls.vue` | Reusable search form |
| `DeputyHeroCard.vue` | Deputy profile card with group affiliation |
| `DeputyItem.vue` | Deputy list item (used in listings) |
| `ScrutinCard.vue` | Vote/scrutin summary card |
| `DataSourceNotice.vue` | Data source attribution banner |

## Database Schema

The app connects to Supabase PostgreSQL. Types are defined in `types/db.ts`.

### Core Tables

- **`scrutins`** — Voting records (id, an_id, date, type, objet, legislature_id, dossier_id)
- **`dossiers`** — Legislative dossiers (titre, resume, url_an, url_legifrance)
- **`deputies`** — Deputy records (full_name, slug, circ, departement, photo_url, legislature_id)
- **`groups`** — Political groups (acronym, name, color, expected_seats)
- **`deputy_group_memberships`** — Group membership periods (from_date, to_date)
- **`votes`** — Individual votes per scrutin (deputy_id, scrutin_id, decision: POUR/CONTRE/ABSTENTION/NV)

### Database Views (used by API routes)

- `v_scrutin_stats` — Aggregated vote counts per scrutin
- `v_scrutin_group_buckets` — Group-level vote breakdown
- `v_scrutin_deputy_votes` — Individual deputy votes per scrutin
- `v_group_seats_current` — Current seat distribution
- `v_absences_deputy` / `v_absences_group` — Absence statistics
- `v_condamnations` — Condemnation records
- `v_rank_category_group` — Thematic ranking data

## Code Conventions

### General

- **Language:** All code is TypeScript. All Vue components use `<script setup lang="ts">`.
- **Vue style:** Composition API exclusively (`<script setup>`). No Options API.
- **Data fetching:** Use Nuxt's `useFetch` composable on the frontend. On the server, use the `serverSupabase()` utility from `server/utils/supabase.ts`.
- **Error handling:** Server routes use `createError()` from Nitro for HTTP error responses.
- **Styling:** Tailwind utility classes directly in templates. DaisyUI component classes (e.g., `btn`, `card`, `badge`). Custom theme defined in `assets/app.css`.

### Naming Conventions

- **Pages:** Lowercase, kebab-case filenames. Dynamic params use `[param]` syntax (e.g., `[slug].vue`, `[id].vue`).
- **API routes:** `<name>.get.ts` convention for GET handlers. Nested directories for grouped endpoints.
- **Components:** PascalCase filenames (e.g., `DeputyHeroCard.vue`).
- **Types:** Defined in `types/` directory. Database types in `db.ts`, UI types in `ui.ts`.

### Backend Patterns

- All API routes import `serverSupabase()` to get a typed Supabase client.
- Query parameters extracted via `getQuery(event)`, route params via `getRouterParam(event, 'name')`.
- Pagination done with Supabase `.range(from, to)`.
- Legislature filtering (16 or 17) is common across endpoints.
- Heavy use of Supabase views for aggregation — avoid duplicating SQL logic in API routes.

### Frontend Patterns

- Reactive state with `ref()` and `computed()`.
- URL-driven state (query params via `useRoute()` / `useRouter()`).
- Responsive layouts with Tailwind grid/flex utilities.
- Interactive hemicycle visualizations are SVG-based with Vue reactivity.

## Testing

No test framework is currently configured. If adding tests:

- Recommended: Vitest for unit/component tests, Playwright or Cypress for E2E.
- Place tests in a `tests/` directory at the root.
- Add a `test` script to `package.json`.

## Build Commands

| Command | Description |
|---|---|
| `pnpm dev` | Start development server with HMR |
| `pnpm build` | Build for production (SSR) |
| `pnpm generate` | Generate static site |
| `pnpm preview` | Preview production build locally |
| `pnpm postinstall` | Run `nuxt prepare` (auto-generates types) |

## Common Tasks

### Adding a new page

1. Create a `.vue` file in `app/pages/` (filename becomes the route).
2. Use `<script setup lang="ts">` with Composition API.
3. Fetch data with `useFetch('/api/...')`.
4. Style with Tailwind/DaisyUI classes.

### Adding a new API endpoint

1. Create a `<name>.get.ts` file in the appropriate `server/api/` subdirectory.
2. Use `defineEventHandler` and call `serverSupabase()` for database access.
3. Extract params with `getQuery(event)` or `getRouterParam(event, 'param')`.
4. Return data directly (Nitro auto-serializes to JSON).
5. Use `createError()` for error responses.

### Adding a new component

1. Create a PascalCase `.vue` file in `app/components/`.
2. Nuxt auto-imports components — no explicit import needed in templates.
3. Define props with `defineProps<{...}>()`.
