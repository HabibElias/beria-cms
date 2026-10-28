# Berea library frontend

The React/TypeScript application for Berea Church's library: public discovery, member borrowing and an admin workspace, using the supplied Berea brand identity.

**Live:** https://beriabooks.vercel.app

**API:** https://beria-cms-back.onrender.com/api

**Backend source:** [HabibElias/beria-cms-back](https://github.com/HabibElias/beria-cms-back)

## Stack and structure

React 19, TypeScript, Vite 7, Tailwind CSS 4, React Router, TanStack Query/Table, Axios, React Hook Form/Zod and Radix-based shared components. Feedback uses Sonner toasts. Nunito Variable and Noto Sans Ethiopic Variable are self-hosted through Fontsource.

| Path | Purpose |
| --- | --- |
| `src/pages/library/` | Public catalogue, book detail, personal loans and admin request queue |
| `src/pages/Book/`, `Member/`, `checkouts/`, `categories/` | Existing management screens |
| `src/provider/AuthProvider.tsx` | JWT-backed account state |
| `src/hooks/useLibrary.ts` | Catalogue, member loans and request actions |
| `src/services/Apiclient.ts` | Shared API address, JSON requests and timeout |
| `src/services/paginated.ts` | Load all management member/checkout pages |
| `src/components/` | Public/admin frames, forms and shared controls |
| `public/brand/`, `public/fonts/` | SVG emblem and font licenses |
| `public/downloads/` | Portable portfolio ZIP and checksum |
| `DESIGN.md`, `PRODUCT.md` | Accepted design system and product constraints |

## Run locally

Start the current [standalone Laravel backend](https://github.com/HabibElias/beria-cms-back#readme) on port 8001. The `../back-end` directory is an older copy and does not provide the complete current API.

Use Node.js 22.12+ or Node.js 24; this cloud environment was verified with Node.js 24.

```sh
npm ci
test -f .env.local || cp .env.example .env.local
npm run dev
```

Set this public value in `.env.local`:

```dotenv
VITE_APP_BASE_URL=http://localhost:8001/api
```

Vite normally serves on port 5173. Keep the backend's `FRONT_END_URL`/CORS configuration aligned if the development origin changes.

| Command | Purpose |
| --- | --- |
| `npm run dev` | Local Vite development server |
| `npm run build` | TypeScript check and production build in `dist` |
| `npm run preview` | Preview a built frontend locally |
| `npm run lint` | Repository ESLint checks; legacy findings may remain |

## Screens and permissions

| Route | Experience |
| --- | --- |
| `/`, `/books` | Anonymous catalogue: title/author search, category and availability filters, pagination |
| `/books/:id` | Public book details; sign-in/account link or member loan-request form |
| `/register` | Member registration and automatic sign-in |
| `/login` | Shared login, with role-aware destination |
| `/forgot-password` | Account-help screen; does not send password-reset email |
| `/my-loans` | Own current loans, due dates and request history |
| `/account` | Own profile, password and theme |
| `/admin` | Admin overview |
| `/admin/books` | Book collection, details, add and edit |
| `/admin/members` | Member management |
| `/admin/checkouts` | Checkouts, renewals and returns |
| `/admin/loan-requests` | Request review, approval and decline |
| `/admin/categories`, `/admin/reports`, `/admin/settings` | Library organization, current reports and settings |
| `/admin/profile` | Administrator's own profile |

Only `admin` accounts enter management. Members and existing `librarian` accounts use the reader interface. Laravel independently enforces these permissions and own-record access.

Safe local `next` destinations preserve a book through registration/login. Admins otherwise land at `/admin`; readers land at `/my-loans`. Old management links redirect into the admin routes. The public login does not expose administrator demo credentials.

Registration requires name, email, phone and a confirmed 12–72 character password within the bcrypt byte limit. Public registration cannot select a role. Admin-created members also require an explicit confirmed password. Existing passwords are preserved.

## Connected loan workflow

1. A visitor browses freely and opens a book.
2. After registration or login, the member requests an available book with an optional note.
3. The request appears in the reader's history and the admin review queue.
4. An admin approves with a due date and optional note, or declines. Approval creates a real checkout atomically.
5. The reader sees the decision and current loan. An admin records its return through circulation controls.

Pending requests can be cancelled with confirmation and do not reserve copies. A reader can submit a new request only while active loans plus pending requests total fewer than three. Approval also checks the three-active-loan limit and current availability. The backend prevents duplicate requests and conflicting checkouts.

Requests and current loans refresh every 30 seconds while visible and when the tab regains focus. Member and checkout lists load all server pages in batches of 100 so newly registered readers and older loans stay searchable.

Login and the new registration/request/review flows have pending, success and error feedback. Validation remains visible beside fields. Failed or missing external covers use the application's title-led fallback. Catalogue availability is exposed to assistive technology alongside the title and author.

[Full reader/admin integration notes](docs/member-library.md).

## Deploy on Vercel

Use the existing `HabibElias/beria-cms` repository; a frontend-only repository is not needed.

| Project setting | Value |
| --- | --- |
| Root directory | `front-end-r` |
| Framework | Vite |
| Install | `npm ci` |
| Build | `npm run build` |
| Output | `dist` |
| Production API variable | `VITE_APP_BASE_URL=https://beria-cms-back.onrender.com/api` |

Deploy the standalone backend's migrations first with `RUN_MIGRATIONS=true`. Keep Render's `FRONT_END_URL=https://beriabooks.vercel.app`, or add exact preview origins explicitly.

The production API value is also recorded in `.env.production`. Vite variables are compiled into the browser bundle: changing the address requires rebuilding/redeploying. Only the public API address belongs here; database, JWT and image-provider secrets belong on the backend.

`vercel.json` provides SPA deep-link fallback, preserves asset/download requests, and serves the portfolio ZIP with an attachment filename and ZIP content type.

## Design and tooling

The redesign covers the login and all library management screens, extended with public/member pages. It uses Covenant Blue `#044592`, Midnight `#03224A`, Radiant Gold `#F0B122`, Soft Gold `#FECA71`, Parchment `#FEFBE9` and Cross Red `#CF1418`, with responsive light/dark layouts.

The icon-only SVG retains the emblem's background and contains vector paths without an embedded bitmap. It is traced from the supplied PDF's artwork, not the original vector master. The separate shared logo link was inaccessible.

- [Design system](DESIGN.md), [product definition](PRODUCT.md), [brand and font provenance](docs/brand-assets.md).
- [Installed Impeccable and Taste skills](../.agents/README.md), including versions, sources, licenses and cloud adaptations.
- [Original redesign verification](docs/redesign-verification.md).

## Portfolio assets

**[Download the complete screenshot pack](https://beriabooks.vercel.app/downloads/Berea-Portfolio-Pack.zip)**

Included: 21 screenshots at 2× resolution, four 3200 × 2000 boards, a four-page PDF, editable HTML and case-study copy. Member and circulation records are fictional, captured using the actual app and an isolated local API/database.

The pack is committed under `public/downloads/`, making it available in other checkouts and through the public URL. [Download and checksum instructions](docs/portfolio-assets.md).

## Validation and current limits

The implementation passed a TypeScript/Vite build, targeted ESLint, responsive/dark/state review and the isolated real-Laravel browser workflow for registration, requests, approvals, returns, decline and ownership. The standalone backend recorded 31 passing tests with 670 assertions. These are recorded release checks, not a claim that the entire legacy lint baseline is clean.

Live HTTPS checks confirmed route/asset delivery, API configuration, the 16-book public catalogue, CORS and the downloadable ZIP's integrity. Live account browser automation was not completed because the cloud browser encountered a certificate-trust error.

Cloudinary upload code remains in the older local backend copy. The deployed standalone API lacks `POST /api/book-images`, so the frontend upload control is not a completed production integration. Existing cover URLs/fallbacks work; old image files have not been transferred.

Email verification, mail notifications and password-reset emails are not implemented. Reports use current API totals and this month's recorded returns with CSV export; historical trends are unavailable.
