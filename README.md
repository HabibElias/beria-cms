# Berea library · Beria CMS

A community library application for Berea Church in Addis Ababa. Visitors discover books, members request loans and follow their borrowing, and administrators manage the collection and circulation.

## Live application and source

| Component | Location |
| --- | --- |
| Public library | https://beriabooks.vercel.app |
| Create a member account | https://beriabooks.vercel.app/register |
| Reader loans and requests | https://beriabooks.vercel.app/my-loans |
| Admin workspace | https://beriabooks.vercel.app/admin |
| Production API | https://beria-cms-back.onrender.com/api |
| Database health | https://beria-cms-back.onrender.com/api/health |
| Frontend source | [`front-end-r/`](front-end-r/README.md) in this repository |
| Deployed backend source | [HabibElias/beria-cms-back](https://github.com/HabibElias/beria-cms-back) |

The browser loads React from Vercel and calls the Laravel API on Render directly. The API stores production records in remote Turso (SQLite/libSQL). This keeps records independent of Render's ephemeral local filesystem.

A separate frontend-only repository is unnecessary: Vercel uses `front-end-r` as its project root. Render currently deploys the separate `beria-cms-back` repository, with that repository's root as its service root. The older [`back-end/` copy](back-end/README.md) here is not the current production backend and is not synchronized with the reader/admin features.

## What has been implemented

### Public library and member accounts

- Anonymous browsing, title/author search, categories, availability filters and pagination.
- Public book details with external cover URLs and title-led fallback jackets.
- Registration, immediate member sign-in, login/logout and safe redirects back to the intended book.
- A personal area for active loans, due dates and request history.
- Loan requests with optional notes, cancellation of pending requests and reader-visible administrator decisions.
- Own-profile and password settings, with visible validation and request feedback.

### Library administration

- An admin-only workspace for books, categories, members, checkouts, renewals, returns, reports and settings.
- A searchable request queue with approval, decline, return dates and optional notes to readers.
- Approval creates a checkout and claims the available copy in one transaction. Returns restore availability.
- Shared borrowing rules for manual checkouts and approved requests, with duplicate-request and competing-checkout protection.
- Complete member and checkout pagination, so later records remain searchable and returnable.
- Current library totals and a CSV summary export; historical trend reporting is not implemented.

### Permissions and account rules

Only the `admin` role has management access. Regular `user` accounts and existing `librarian` accounts use the reader experience. Both frontend guards and backend authorization enforce this separation.

Public registration always creates a regular member; it cannot assign an admin role. Readers can access only their own loan/request history. Public catalogue responses omit internal notes, shelf locations, condition and storage paths.

New registration, admin-created member passwords and password changes require 12–72 characters within the bcrypt byte limit, with confirmation. Existing passwords were not automatically reset. The public login page does not advertise administrator demo credentials. Account emails are normalized and checked for case-insensitive uniqueness.

A pending request does not reserve a copy. A reader can submit a new request only when active loans plus pending requests total fewer than three. Approval also checks the three-active-loan limit. See the [frontend flow guide](front-end-r/docs/member-library.md) and [backend API contract](https://github.com/HabibElias/beria-cms-back/blob/main/docs/member-library.md).

## Local development

Use the standalone backend when developing the current frontend:

1. Clone [`HabibElias/beria-cms-back`](https://github.com/HabibElias/beria-cms-back) beside this repository.
2. Follow its [README](https://github.com/HabibElias/beria-cms-back#readme) to install PHP/Composer dependencies, configure SQLite or Turso, generate local keys, migrate and create an administrator.
3. Run that API on port 8001.
4. Start the frontend:

```sh
cd front-end-r
npm ci
test -f .env.local || cp .env.example .env.local
npm run dev
```

The local frontend setting is:

```dotenv
VITE_APP_BASE_URL=http://localhost:8001/api
```

Use Node.js 22.12+ or Node.js 24; this cloud workspace was verified with Node.js 24. The backend requires PHP 8.3+, Composer, FFI for libSQL, and the appropriate PDO extension for local SQLite or PostgreSQL. Fresh workspaces must install dependencies and start services again; workspace-local runtime helpers and processes are not repository guarantees.

## Production deployment

| Setting | Frontend on Vercel | Backend on Render |
| --- | --- | --- |
| Repository | `HabibElias/beria-cms` | `HabibElias/beria-cms-back` |
| Root | `front-end-r` | Repository root |
| Runtime | Vite / Node.js | Docker / PHP 8.3 Apache |
| Build | `npm ci`, then `npm run build` | Repository `Dockerfile` |
| Output / health | `dist` | `/api/health` |
| Public connection | `VITE_APP_BASE_URL=https://beria-cms-back.onrender.com/api` | `FRONT_END_URL=https://beriabooks.vercel.app` |

Vite embeds the API address at build time, so changing it requires a new frontend deployment. Vercel's route fallback supports direct application links and leaves `/downloads/` files untouched.

Render uses `DB_CONNECTION=libsql`, `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN`. Keep the service's existing `APP_KEY` and `JWT_SECRET`. Set `RUN_MIGRATIONS=true` for schema updates, including the additive loan-request migration. The backend's CORS list includes the production frontend; extra exact origins can be added through comma-separated `FRONT_END_URL` values.

See the backend's [Render/Turso instructions](https://github.com/HabibElias/beria-cms-back/blob/main/docs/render-database.md) for the complete environment table, first administrator, seed flags and database migration boundaries. Switching database variables does not transfer existing PostgreSQL data.

## Accounts and real-book seeding

The deployed backend supports targeted startup seeds:

- `SEED_ADMIN=true` creates the administrator described by `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME` and `ADMIN_PHONE`. Existing accounts and passwords are preserved. After successful setup, disable the flag and remove `ADMIN_PASSWORD`.
- `SEED_BOOKS=true` adds the sourced starter catalogue: 16 real Christian books and five categories. It preserves exact matching title/author records, their edits and loan state, and creates no member accounts or sample loans. Disable the flag after import.

Use `AdminSeeder` and `BookSeeder` individually for production setup. The default development seeder includes public demo accounts and is not a production setup command. Database resets such as `migrate:fresh` are not part of deployment.

The catalogue's bibliographic sources, separate data license and inventory defaults are documented [with the backend data](https://github.com/HabibElias/beria-cms-back/blob/main/database/data/README.md). Seeded shelf/condition/availability values do not establish that physical copies have been audited.

## Berea identity and design work

The full library interface was redesigned around the supplied Berea Brand Guidelines, including login, management screens and the later public/member experience.

| Brand color | Value |
| --- | --- |
| Covenant Blue | `#044592` |
| Midnight | `#03224A` |
| Radiant Gold | `#F0B122` |
| Soft Gold | `#FECA71` |
| Parchment | `#FEFBE9` |
| Cross Red | `#CF1418` |

The app uses self-hosted Nunito Variable and Noto Sans Ethiopic Variable, responsive layouts, and light/dark themes. The SVG logo contains the icon and its background, without a wordmark or embedded bitmap. It was traced from the supplied PDF; it is not the original vector master. The separate shared logo link could not be verified.

- [Design system](front-end-r/DESIGN.md) and [product definition](front-end-r/PRODUCT.md).
- [Brand asset provenance and font licenses](front-end-r/docs/brand-assets.md).
- [Impeccable and Taste installation, usage and sources](.agents/README.md).
- [Original redesign verification](front-end-r/docs/redesign-verification.md).

## Portfolio and sharing between workspaces

**[Download the Berea Portfolio Pack](https://beriabooks.vercel.app/downloads/Berea-Portfolio-Pack.zip)**

The pack includes 21 screenshots at 2× resolution, four 3200 × 2000 presentation boards, a four-page PDF, editable HTML layouts and case-study copy. All member/circulation records shown are fictional; captures use the implemented app with an isolated local API/database.

The ZIP and its checksum are committed under `front-end-r/public/downloads/`, so another workspace can either clone this repository or download the public file. [Download and checksum instructions](front-end-r/docs/portfolio-assets.md).

## Verification recorded for this release

- Backend: 31 tests, 670 assertions passed, including the native libSQL adapter, seeding, passwords, CORS, ownership, permissions and transactional borrowing.
- Frontend: TypeScript/Vite production build and targeted lint checks passed.
- Isolated real-API browser workflow: browsing, search, registration, safe redirects, requests, cancellation, approval, decline, return, ownership and logout passed.
- Responsive/dark/state captures and admin regression checks covered the implemented interfaces.
- Production HTTPS checks confirmed application routes/assets, the correct Render API, the 16-book public catalogue, the allowed frontend origin and unauthenticated admin rejection.
- The public portfolio download was checked against the original SHA-256 checksum and ZIP integrity.

These checks do not establish a clean legacy repository-wide lint baseline or production account browser testing. The live browser runner encountered a workspace certificate-trust error; production checks used normally verified HTTPS requests instead.

## Remaining integration boundaries

- Cloudinary upload/cleanup code was prepared in the older local `back-end` copy. The deployed standalone API does not contain `POST /api/book-images` or that integration. The frontend has an upload control, but end-to-end production cover upload remains pending. Setting Cloudinary variables alone does not add the missing implementation, and existing image files have not been migrated.
- Email verification, mail notifications and password-reset email delivery are not implemented.
- Reports show available current totals, not invented historical trends.
- Render free services may sleep. Local SQLite files on a free Render service are not durable; production uses remote Turso.
