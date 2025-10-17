SMB SiteBuilder – MVP

Stack
- Next.js (App Router, TypeScript, Tailwind)
- Clerk (auth)
- Convex (backend; schema/functions to be wired after secrets)
- Vercel AI SDK with provider abstraction (OpenAI/Anthropic)

Getting Started
1) Copy `.env.example` to `.env.local` and set values:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`
   - `AI_PROVIDER` (openai|anthropic), `AI_MODEL`, and the corresponding API key
   - (Optional) `NEXT_PUBLIC_CONVEX_URL` once Convex is provisioned
2) Install deps and run dev:
```bash
npm install
npm run dev
```

Routes
- `/` Marketing landing
- `/sign-in`, `/sign-up` Auth
- `/dashboard` Authenticated hub
- `/generate` Create a site by summary → calls `/api/generate`
- `/preview/[siteId]` Renders site schema

APIs
- `POST /api/generate` Generate schema via AI (stores in-memory, replace with Convex soon)
- `POST /api/import` Stub endpoint to queue scraping
- `GET /api/sites/[siteId]` Returns stored schema (in-memory)

Convex Setup
- After you deploy and set secrets, run:
```bash
npx convex dev
```
This will create `convex/` and `convex.json`. Then update `NEXT_PUBLIC_CONVEX_URL` and swap the in-memory store with Convex queries/mutations.

Provider Switching
- Set `AI_PROVIDER` and `AI_MODEL` in env; supported: OpenAI, Anthropic.

Notes
- Preview storage is in-memory only in development. Do not use in production until Convex functions are added.
