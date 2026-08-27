# Pi Gamma Omicron Fraternity

The official digital experience and private operating portal for Pi Gamma
Omicron, founded at The Ohio State University in 1905.

The project combines a cinematic public history experience with a role-based
members area for announcements, member administration, interest submissions,
and fraternal discussion.

## Live site

[pi-gamma-omicron-1905.atlankinlogs.chatgpt.site](https://pi-gamma-omicron-1905.atlankinlogs.chatgpt.site/)

## Requirements

- Node.js 22.13 or newer
- npm 10 or newer
- Git

Check your installed versions:

```powershell
node --version
npm --version
git --version
```

## Run the site locally

Open PowerShell in the project folder and run:

```powershell
npm ci
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

The first installation may take a few minutes. Keep the PowerShell window open
while presenting the site. Stop the server with `Ctrl+C` when finished.

### Local members-area access

Complete [the Supabase setup](docs/supabase-production-setup.md), then open
[http://localhost:3000/members](http://localhost:3000/members) to demo:

- the member dashboard;
- announcements;
- the fraternal directory;
- the Brotherhood Board; and
- member and applicant administration.

The Mystery School entry transition plays after member login and every time the
Overview page is opened. Return to
[http://localhost:3000/members](http://localhost:3000/members) to replay it
during a presentation.

When Supabase values are not present, local development uses a safe preview
identity but does not fabricate or write member data. Pull the approved Vercel
development values into an ignored `.env.local` file to use the complete portal.

## Suggested live-demo route

1. Start at the homepage and let the opening sequence complete.
2. Scroll through the 1905 founding story and historical record.
3. Show the renewal scene, chapters, pillars, and leadership.
4. Open `/join` to show the interest experience.
5. Open `/members` and demonstrate administration, announcements, and the
   Brotherhood Board.

## Verify before presenting

```powershell
npm run lint
npm test
```

`npm test` creates a production build and verifies the public and protected
routes.

## Create the GitHub repository

Create a new **private** repository on GitHub named
`pi-gamma-omicron-1905`. Leave it empty: do not add a README, `.gitignore`, or
license on GitHub.

Then run these commands from this project folder, replacing `YOUR-USERNAME`:

```powershell
git remote add origin https://github.com/YOUR-USERNAME/pi-gamma-omicron-1905.git
git push -u origin main
```

If GitHub asks you to authenticate, complete its browser sign-in and repeat the
push command.

## Clone it onto another computer

```powershell
git clone https://github.com/YOUR-USERNAME/pi-gamma-omicron-1905.git
cd pi-gamma-omicron-1905
npm ci
npm run dev
```

## Useful commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the live local development server |
| `npm run lint` | Check source quality |
| `npm run build` | Create a production build |
| `npm test` | Build and verify key routes |
| `npm run db:generate` | Generate a migration after database schema changes |

## Architecture

- Vinext, React 19, and TypeScript
- Vercel server output with a Cloudflare-compatible development path
- Supabase Postgres persistence with server-only data access
- Google authentication through Supabase Auth
- Role-based access for super administrators, national officers, chapter
  officers, brothers, alumni, and applicants

Production setup and verification are documented in
[`docs/supabase-production-setup.md`](docs/supabase-production-setup.md).

## Important files

- `app/page.tsx` — public homepage content
- `app/components/LegacyExperience.tsx` — cinematic scroll experience
- `app/members/` — protected member portal
- `app/api/` — interest, member, announcement, and discussion APIs
- `supabase/migrations/` — production Postgres schema and access controls
- `lib/portal-data.ts` — server-only portal data repository
- `app/globals.css` — visual system and responsive behavior

## Privacy

Do not commit `.env` files, private credentials, exported member data, or
applicant information. The repository's `.gitignore` already excludes local
environment files, build output, dependencies, and local database state.
