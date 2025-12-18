## Lead Qualifier + Auto Follow-up

MVP web app for qualifying inbound commercial real estate leads and generating AI-assisted follow-up copy for a broker (J.L. Cortez Commercial, Pittsburgh, PA).

- **Public intake** at `{ROUTE_PREFIX}/` (default `/`) collects lead details and triggers AI enrichment.
- **Admin area** at `{ROUTE_PREFIX}/admin` shows leads, AI summaries/scores, and copyable email/text drafts.
- **Tech stack**: Next.js (App Router, TypeScript), TailwindCSS, Prisma, SQLite (dev) / Postgres (prod), OpenAI Responses API, zod.

---

## 1) Environment variables

Create a `.env` file in the project root:

```bash
DATABASE_URL="file:./dev.db"

OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4.1-mini

ADMIN_PASSWORD=choose-a-strong-password

APP_URL=https://leads.jlcortez.com
ROUTE_PREFIX=        # leave empty for subdomain hosting
```

- **`DATABASE_URL`**
  - For local dev, use `file:./dev.db` (SQLite).
  - For production (Vercel), use a Postgres connection string.
- **`OPENAI_API_KEY`**
  - Required in any environment where AI enrichment should run.
  - Never expose this on the client; it is read only on the server.
- **`ROUTE_PREFIX`**
  - `""` (empty string): app is served at the root of the domain/subdomain (e.g. `https://leads.jlcortez.com/`).
  - `"/leads"`: advanced option for path-based hosting (see section 4).

---

## 2) Local development (SQLite)

Prerequisites:

- Node.js 18+ (LTS recommended)
- npm (comes with Node)

Install dependencies:

```bash
npm install
```

Run Prisma migrations and generate the client (SQLite):

```bash
set DATABASE_URL=file:./dev.db    # Windows PowerShell / cmd style
npx prisma migrate dev --name init
```

Start the dev server:

```bash
npm run dev
```

Then open:

- Public intake: `http://localhost:3000/`
- Admin login: `http://localhost:3000/auth/login`
- Admin leads: `http://localhost:3000/admin`

Use the `ADMIN_PASSWORD` you set in `.env` to sign in.

---

## 3) Deploying to Vercel

1. **Push code to Git** (GitHub, GitLab, or Bitbucket).
2. **Create a new project on Vercel**:
   - Import this repository.
   - Framework preset: **Next.js** (detected automatically).
3. **Environment variables (Vercel dashboard → Project → Settings → Environment Variables)**:
   - `DATABASE_URL` = your Postgres connection string (from Vercel Postgres, Neon, Supabase, etc.).
   - `OPENAI_API_KEY` = your OpenAI key.
   - `OPENAI_MODEL` = `gpt-4.1-mini` (or your preferred Responses-compatible model).
   - `ADMIN_PASSWORD` = strong admin password.
   - `APP_URL` = `https://leads.jlcortez.com`
   - `ROUTE_PREFIX` = (empty string).
4. **Deploy**:
   - Trigger a deployment from Vercel (it will build and deploy automatically).

After the build finishes, Vercel will give you a production URL (e.g. `https://lead-qualifier.vercel.app`). You will point your `leads.jlcortez.com` subdomain at this project in the next step.

---

## 4) Connecting `leads.jlcortez.com` via GoDaddy DNS (CNAME)

Goal: host the app on `https://leads.jlcortez.com` without replacing your existing `jlcortez.com` GoDaddy site.

### A. Add the domain in Vercel

1. In your Vercel project, go to **Settings → Domains**.
2. Add `leads.jlcortez.com` as a domain for this project.
3. Vercel will show a **CNAME target** (often something like `cname.vercel-dns.com` but use the exact value Vercel shows).

### B. Create CNAME in GoDaddy

1. Log in to your GoDaddy account.
2. Go to **My Products → Domains → DNS** for `jlcortez.com`.
3. Under **DNS Records**, click **Add**:
   - **Type**: `CNAME`
   - **Name / Host**: `leads`
   - **Value / Points to**: the CNAME target from Vercel (e.g. `cname.vercel-dns.com`, but use the exact value Vercel displays).
   - **TTL**: leave default (e.g. 1 hour).
4. Save the record.

> **Note:** GoDaddy notes DNS changes can take **up to 48 hours** to fully propagate, though it often updates much faster.

Once DNS is propagated, Vercel should show the domain as **configured**, and the app will be live at:

- `https://leads.jlcortez.com/` (public intake)
- `https://leads.jlcortez.com/auth/login` (admin login)
- `https://leads.jlcortez.com/admin` (admin area)

---

## 5) Optional advanced mode: hosting under `/leads`

This is **optional** and only recommended if your hosting environment (e.g. a custom server / reverse proxy) supports proper proxying.

Target: `https://www.jlcortez.com/leads` should serve this app, while the main site remains on GoDaddy or another host.

Important notes:

- **Do not assume** GoDaddy Website Builder can do this.
- This typically requires something like Nginx/Apache/Cloudflare Workers/other reverse proxy in front.

### A. Configure ROUTE_PREFIX

1. In the environment where you will serve under a path:
   - Set `ROUTE_PREFIX=/leads`.
2. The app uses a helper that prefixes internal links with `ROUTE_PREFIX`, so:
   - Public intake is effectively `/leads/`.
   - Admin is `/leads/admin`.

### B. Example reverse proxy (Nginx-style, conceptual)

> This is **just an example** for a custom server, **not** something you can paste into GoDaddy Website Builder.

```nginx
location /leads/ {
  proxy_pass https://your-vercel-deployment-url/;
  proxy_set_header Host $host;
  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  proxy_set_header X-Forwarded-Proto $scheme;
}
```

- Ensure the proxy:
  - Preserves the `/leads` prefix when forwarding.
  - Forwards headers like `Host` and `X-Forwarded-For`.
- On the Vercel side, `ROUTE_PREFIX=/leads` must be set so all internal links and redirects honor that prefix.

---

## 6) App overview and safety notes

- **Public intake (`/`)**
  - Multi-step form collecting: name, email, phone, company, persona, request type, location, property details, size, budget, timeline, notes.
  - Basic anti-spam:
    - Hidden honeypot field (`website`) that should stay empty.
    - In-memory per-IP rate limiting on the API (sufficient for MVP).
  - On submit:
    - Lead is stored in the database.
    - A server-only OpenAI Responses call enriches the lead and stores AI fields on the record.
  - The public user **never sees** the AI-generated follow-up content.

- **Admin area (`/admin`)**
  - Password-only gate using `ADMIN_PASSWORD`; session is stored via HTTP-only cookie (no domain hard-coding, works on subdomain).
  - Leads table:
    - Newest first.
    - Search by name/email.
    - Filter by persona and request type.
  - Lead detail:
    - Raw intake fields.
    - AI lead type, score, summary bullets (as text), missing info questions, recommended next step.
    - Follow-up email subject/body and SMS-style text, each with **Copy** buttons.
  - CSV export:
    - `/api/leads/export` (linked from admin UI), CSV download of all leads.

- **AI + security**
  - All OpenAI calls happen **server-side only**; the client never sees `OPENAI_API_KEY`.
  - The AI response is constrained via a **structured JSON schema** to the exact fields used in the database.
  - Compliance notes field gives extra context for the broker to stay within fair housing and other guidelines.

---

## 7) Scripts

- **`npm run dev`** – start Next.js dev server.
- **`npm run build`** – build for production.
- **`npm start`** – start production server.
- **`npm run prisma:migrate`** – `prisma migrate dev`.
- **`npm run prisma:studio`** – open Prisma Studio (inspect DB).
