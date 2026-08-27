# Supabase production setup

The application code is ready for Supabase, but the database migration and
environment values must exist in the same Supabase and Vercel projects before
the production member portal can accept data.

## 1. Apply the database migration

In the Supabase dashboard, open **SQL Editor**, paste the contents of
`supabase/migrations/202608270001_portal_schema.sql`, and run it once.

The migration creates the private tables for:

- interest submissions;
- authorized member accounts and roles;
- announcements;
- discussion threads; and
- discussion replies.

It enables Row Level Security and removes direct `anon` and `authenticated`
table access. Only the application's server-side Supabase secret can access
these records. A GitHub integration may detect the migration, but verify the
tables in Supabase before relying on that integration to apply production
changes.

## 2. Configure Google authentication

Follow the [Supabase Google provider guide](https://supabase.com/docs/guides/auth/social-login/auth-google):

1. Create a Google OAuth web client.
2. Add Supabase's callback URL to **Authorized redirect URIs**:
   `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`.
3. Paste the Google client ID and secret into **Supabase → Authentication →
   Sign In / Providers → Google**.
4. In **Supabase → Authentication → URL Configuration**, set the Site URL to
   the production website URL.
5. Add these redirect URLs:
   - `https://YOUR_PRODUCTION_DOMAIN/auth/callback`
   - `http://localhost:3000/auth/callback`

Add explicitly trusted Vercel preview callback URLs only if preview-deployment
authentication is required. Supabase documents preview URL patterns in its
[redirect URL guide](https://supabase.com/docs/guides/auth/redirect-urls).

## 3. Add Vercel environment variables

In **Vercel → Project → Settings → Environment Variables**, add:

| Variable | Value | Exposure |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL from Supabase API settings | Browser-safe |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable key | Browser-safe |
| `SUPABASE_SECRET_KEY` | Supabase secret key | Server only |
| `PORTAL_SUPER_ADMIN_EMAILS` | Comma-separated approved site-admin emails | Server only |
| `NEXT_PUBLIC_SITE_URL` | Full production origin, such as `https://example.org` | Browser-safe |

For this project, add `atlankinlogs@gmail.com` to
`PORTAL_SUPER_ADMIN_EMAILS`. The first successful Google sign-in with an email
in that list creates or promotes its member record to `super_admin`. Do not
prefix the secret key with `NEXT_PUBLIC_`, store it in source control, or expose
it to the browser. Supabase's [RLS documentation](https://supabase.com/docs/guides/database/postgres/row-level-security)
explains why service-role and secret credentials must remain server-side.

Use the production values for the Vercel **Production** environment. Add them
to **Preview** only when preview deployments should connect to this database.
After saving the variables, redeploy the current `main` commit.

Legacy projects can use `NEXT_PUBLIC_SUPABASE_ANON_KEY` and
`SUPABASE_SERVICE_ROLE_KEY`; the code accepts both, but the newer publishable
and secret keys are preferred.

## 4. Configure local development

Create an ignored `.env.local` file or pull the Vercel development values:

```powershell
vercel env pull .env.local
npm run dev
```

Never commit `.env.local`. Without Supabase values, the public site still runs,
but forms show a controlled unavailable message and the member portal shows its
configuration state instead of accessing production data.

## 5. Production verification

After redeploying:

1. Submit `/join` and confirm a row appears in `public.interests`.
2. Open `/members`, choose **Continue with Google**, and use the approved admin
   email.
3. Confirm the account appears in `public.members` with role `super_admin`.
4. Open `/members/admin`, move the interest submission to another stage, and
   add a test member.
5. Publish an announcement and create a discussion/reply.
6. Sign in with an unapproved Google email and confirm private content is not
   shown.
7. Remove test records from Supabase only after confirming the exact rows.

The migration creates a fresh schema; it does not copy records from the former
local Cloudflare D1 database. If production D1 ever received real submissions,
export and migrate them separately before retiring that database.

## Optional notification follow-up

Interest records are immediately available in the officer administration
queue. Email notification can be added later with a Supabase Database Webhook
and Edge Function after the fraternity chooses its official destination inbox
and email provider.
