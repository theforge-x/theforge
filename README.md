# The Forge

The Forge is a full-stack growth studio application with a conversion-focused
public marketing site, an authenticated client portal, and a role-protected
admin workspace. The public site includes growth-audit booking, broad contact
enquiries, case studies, field notes, and an interactive website prompt builder.

## Stack

- Next.js 16.2 App Router, React 19, and TypeScript
- Better Auth with email/password sessions and `admin`, `sales`, and `client` roles
- PostgreSQL with Drizzle ORM and generated SQL migrations
- Stripe Checkout and Paystack Redirect Checkout
- Tailwind CSS 4, Radix UI, Recharts, Lucide, and Sonner
- Biome for linting and formatting
- Vercel Analytics, dynamic metadata, `robots.txt`, and `sitemap.xml` support

## Local setup

Requirements: Node.js 20.9+, npm, and PostgreSQL 14+ (or Docker).

1. Install dependencies and create the local environment file.

   ```bash
   npm ci
   cp .env.example .env.local
   ```

2. Replace the placeholder secrets in `.env.local`. Generate the Better Auth
   secret with a cryptographically secure random value of at least 32
   characters.

3. Start PostgreSQL. The included Compose service is optional:

   ```bash
   docker compose up -d postgres
   ```

4. Apply the checked-in migration and create the initial data/accounts:

   ```bash
   npm run db:migrate
   npm run db:bootstrap
   ```

   The bootstrap command is idempotent for the included business records. It
   creates the initial admin and client credential accounts from the
   `BOOTSTRAP_*` variables and links the client account to Onyx Legal Group.
   Remove those bootstrap passwords from the deployed environment afterward.

5. Start the application:

   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string used by the app and Drizzle |
| `BETTER_AUTH_SECRET` | Session signing/encryption secret (minimum 32 random characters) |
| `BETTER_AUTH_URL` | Canonical Better Auth origin |
| `NEXT_PUBLIC_APP_URL` | Public origin used for checkout return URLs |
| `STRIPE_SECRET_KEY` | Server-side Stripe API key |
| `STRIPE_WEBHOOK_SECRET` | Signing secret for the Stripe webhook endpoint |
| `PAYSTACK_SECRET_KEY` | Server-side Paystack API and webhook signing key |
| `ZOOM_ACCOUNT_ID`, `ZOOM_CLIENT_ID`, `ZOOM_CLIENT_SECRET` | Zoom Server-to-Server OAuth credentials used when an admin approves an appointment |
| `BOOTSTRAP_*` | One-time initial admin/client names, emails, and passwords |

Never expose provider secret keys through `NEXT_PUBLIC_*` variables.

## Public marketing experience

The public marketing site includes:

- A homepage hero, client logo carousel, predictable-growth narrative, process, services, case studies, pricing, testimonials, and CTA sections;
- a multi-step website prompt builder at `/services` that generates a copyable HTML-site brief for Claude, ChatGPT, or another AI coding agent;
- recent published blog posts displayed on the homepage and linked to `/blog/[slug]`;
- team, values, and studio-history sections on `/about`;
- a broad enquiry flow at `/contact` with service categories, fit guidance, and FAQs; and
- a dedicated growth-audit booking flow at `/book` with audit-specific preparation guidance and FAQs.

The contact form does not automatically promise a growth audit. General enquiries are reviewed and routed to the most useful next conversation, while `/book` is reserved for growth-audit requests.

## Search engine optimization

The root metadata defines the site URL, title template, descriptions, Open Graph and Twitter cards, keywords, and crawler directives. The App Router exposes:

- `/robots.txt`, which allows public pages and blocks private application, API, sales, proposal, and demo routes;
- `/sitemap.xml`, which includes the public marketing routes plus published blog posts and case studies; and
- article and case-study metadata generated from their SEO title, description, and featured image fields.

Set `NEXT_PUBLIC_APP_URL` to the production origin so metadata, robots, sitemap, and provider return URLs use the correct domain.

## Authentication and roles

Better Auth is mounted at `/api/auth/[...all]`. Public registration is
disabled; an authenticated administrator creates accounts from
`/admin/users`.

- `proxy.ts` performs an optimistic cookie check for `/admin/*`, `/sales/*`,
  and `/portal/*` requests.
- Both protected layouts validate the complete server-side session and role.
- Admins can create users, assign `admin`, `sales`, or `client` roles, and map
  client users to a workspace. Sales representatives only see their own CRM
  records, quotes, and demos; administrators can see the complete pipeline.
- Admins can also edit account details and passwords, ban or restore access,
  and remove accounts other than their own.
- Client queries derive organization access from the signed-in user's
  `client_members` record. Client IDs are not trusted from the browser.
- Signing out invalidates the Better Auth session before returning to login.

Application roles and client membership are separate: a role controls which
surface a user can enter, while membership controls which organization's data
a client can read and pay for.

## Persistence

The schema in `lib/db/schema.ts` contains:

- Better Auth users, sessions, credential accounts, and verification records;
- clients and client memberships;
- projects, reports, invoices, and monthly metrics;
- recurring availability, blocked dates, and appointments;
- sales leads, quotes, and reusable website demos;
- provider-neutral payment attempts; and
- idempotency records for processed Stripe and Paystack webhooks.

Portal and admin dashboards query PostgreSQL through `lib/data-access.ts`.
`lib/data.ts` remains as bootstrap fixture data and marketing content.

Database commands:

| Command | Purpose |
| --- | --- |
| `npm run db:generate` | Generate a migration after a schema change |
| `npm run db:migrate` | Apply pending migrations |
| `npm run db:studio` | Open Drizzle Studio |
| `npm run db:bootstrap` | Insert starter business data and initial users |

The initial migration is checked into `drizzle/`.

## Billing

Open invoices in `/portal/invoices` can be paid with Stripe or Paystack. The
server re-reads the invoice and membership before creating checkout, so the
browser cannot choose the amount, currency, or client.

### Stripe

Configure this webhook destination in Stripe:

```text
POST /api/billing/stripe/webhook
```

Subscribe to `checkout.session.completed` and `checkout.session.expired`.
During local development, Stripe CLI can forward events to the route and
provide the `STRIPE_WEBHOOK_SECRET`.

### Paystack

Configure this webhook URL in the Paystack dashboard:

```text
POST /api/billing/paystack/webhook
```

Paystack returns customers through `/api/billing/paystack/callback`, where the
server verifies the transaction again. The webhook validates the raw request
with the `x-paystack-signature` HMAC-SHA512 value.

Both integrations compare provider amount/currency values with the stored
payment before marking an invoice paid. Webhook event IDs are unique and
processed transactionally so retries do not fulfill an invoice twice.

## Routes

| Area | Routes |
| --- | --- |
| Marketing | `/`, `/services`, `/work`, `/about`, `/contact`, `/book`, `/blog`, `/blog/[slug]`, `/work/[slug]` |
| SEO | `/robots.txt`, `/sitemap.xml` |
| Authentication | `/login`, `/api/auth/[...all]` |
| Client | `/portal`, `/portal/projects`, `/portal/reports`, `/portal/invoices`, `/portal/settings` |
| Admin | `/admin`, `/admin/clients`, `/admin/clients/[id]`, `/admin/enquiries`, `/admin/appointments`, `/admin/users`, `/admin/projects`, `/admin/content`, `/admin/settings` |
| Sales | `/sales`, `/sales/leads`, `/sales/quotes`, `/sales/demos` |
| Shared sales assets | `/proposal/[token]`, `/demo/[token]` |
| Billing API | `/api/billing/checkout`, `/api/billing/stripe/webhook`, `/api/billing/paystack/webhook`, `/api/billing/paystack/callback` |

## Deployment

The app is compatible with Vercel and Neon PostgreSQL. Vercel detects the Next.js application automatically. Configure `DATABASE_URL` with the Neon pooled connection string, then apply the checked-in migrations before serving production traffic:

```bash
npm run db:migrate
npx vercel --prod
```

Set `BETTER_AUTH_URL` and `NEXT_PUBLIC_APP_URL` to the deployed origin. Provider webhook URLs must also use that origin. Remove one-time `BOOTSTRAP_*` passwords from the deployed environment after initial setup.

## Sidebar behavior

On desktop, the portal/admin sidebar reserves its own layout width while the
panel remains fixed to the viewport. Collapsing it removes labels and user
details from layout, leaving centered icons without overflow. On smaller
screens it becomes an off-canvas sheet.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Turbopack development server |
| `npm run build` | Create a production build |
| `npm start` | Serve the production build |
| `npm run lint` | Run Biome checks |
| `npm run format` | Format supported files with Biome |

## Appointments and media

Appointment requests are offered only inside administrator-defined recurring
availability, excluding blocked periods and existing bookings. Overlapping
active slots are rejected transactionally. Approving a request creates a Zoom
meeting, so Zoom Server-to-Server OAuth credentials must be configured first.

The sales workspace combines a lightweight lead pipeline, guided quote
builder, shareable/printable proposals, and block-based website demo builder.
Demos support reusable templates, responsive preview, private share links,
duplication, and standalone HTML export. Featured images can be stored as a
URL or uploaded into the post record; object storage is recommended for large
production media libraries. Report downloads still require a real `file_url`.
