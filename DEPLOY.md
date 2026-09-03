# Deploying worlds

Vite + React frontend, Vercel serverless functions in /api, Neon Postgres via
Drizzle, Clerk auth, Resend email, PostHog analytics. One repo, one deploy.
Budget an hour end to end.

## 1. Vercel project

1. Push this repo to GitHub (private is fine).
2. In Vercel: Add New Project, import the repo. Framework auto detects as Vite.
   Build command `npm run build`, output directory `dist`. The build runs
   `scripts/guardrails.mjs` as its last step; it fails the deploy if private
   key material or banned language reaches the bundle. That is intentional.
3. `vercel.json` already routes every non /api path to the SPA.
4. Node runtime: functions run on the project default. Set Project Settings,
   Node.js Version, 20.x.

## 2. Environment variables

Copy `.env.example`. In Vercel, Project Settings, Environment Variables, add:

| Name | Notes |
| --- | --- |
| VITE_CLERK_PUBLISHABLE_KEY | Clerk, API Keys, Publishable key |
| CLERK_SECRET_KEY | Clerk, API Keys, Secret key. Server only |
| DATABASE_URL | Neon connection string with sslmode=require |
| TWINLAB_SIGNING_KEY | Output of the keypair script, single line |
| RESEND_API_KEY | Resend dashboard, API Keys |
| VITE_POSTHOG_KEY | PostHog project API key |
| VITE_POSTHOG_HOST | https://us.i.posthog.com or https://eu.i.posthog.com |
| BILLING_ENABLED | false |
| ADMIN_EMAILS | Comma list. Gates /admin/claims |

The site runs without any of them: auth pages show a configuration notice,
analytics no ops, and database endpoints return 503 until configured.

## 3. Clerk

1. Create an application at dashboard.clerk.com.
2. User and Authentication, Email, Phone, Username: enable Email address with
   Email verification link (magic link). Disable Password.
3. User and Authentication, Social Connections: enable GitHub, Google, and
   Microsoft. For each, Clerk's dev keys work immediately; for production add
   your own OAuth app credentials per Clerk's per provider instructions.
4. Copy the publishable and secret keys into the env vars above.
5. Paths are configured in code: /sign-in, /sign-up, first sign up lands on
   /welcome.

## 4. Neon and migrations

1. Create a project at neon.tech, copy the connection string into DATABASE_URL.
2. Run migrations (also works locally with the env var set):

    npm run db:migrate

3. Seed the worlds table from the catalog data:

    DATABASE_URL=... node scripts/seed-worlds.mjs

   live=true is set for stripe only. Schema changes: edit drizzle/schema.js,
   then `npm run db:generate` and commit the new SQL in /drizzle.

## 5. Signing keypair

    node scripts/generate-keypair.mjs

Writes the public key to `src/data/publicKey.ts` (commit it) and prints the
private key once. Set the printed value as TWINLAB_SIGNING_KEY. It is never
written to disk and must never be committed.

Rotation: rerun the script, update the env var, redeploy, and keep the old
public key available to verifiers until every token signed with it has
expired (30 days plus 7 grace).

## 6. Resend

1. Create an API key at resend.com and set RESEND_API_KEY.
2. Verify the sending domain usesparta.co: Resend, Domains, Add Domain, then
   create the DKIM CNAME records and the SPF TXT record Resend lists at your
   DNS provider. Sender identity is arya@usesparta.co.
3. Without a key, emails queue in the events_outbox table with sent_at null.

## 7. PostHog

1. Create a project, copy the API key and host into the env vars.
2. Autocapture is off; every event is explicit (src/lib/analytics.ts). The
   verify endpoint also captures report_verified server side.
3. Configure two funnels by hand in PostHog:
   - Watch to Act: walkthrough_fail_seen, cta_test_your_agent_clicked,
     signup_completed, world_claimed, key_copied.
   - Expand: world_claimed, patchnotes_viewed, pricing_viewed, upgrade_clicked.
4. The activation metric of record (a business assertion edited) is off
   platform and arrives later via CLI telemetry opt in. Do not proxy it with a
   web event.

## 8. Local development

    npm install
    npx vercel dev

`vercel dev` serves the SPA and /api together. Plain `npm run dev` serves the
frontend only (API calls will 404).
