# Library redesign verification

This records the original brand redesign checks. Current public/member/admin integration checks are described in [member-library.md](member-library.md).

The frontend uses the supplied Berea palette, self-hosted Nunito and Noto Sans Ethiopic, and the icon-only vector conversion described in [brand-assets.md](brand-assets.md).

## Checks performed

- Production TypeScript/Vite build passed. Vite still reports the existing large JavaScript chunk advisory.
- Rendered all 15 application routes at 1440px, 768px and 390px. Checked headings, loaded fonts, browser exceptions and document overflow.
- Checked dark mode, empty collections, loading and API failure states. Dark frame and navigation use exact Midnight; lighter panels keep controls distinct.
- Verified collection filtering, pagination, Amharic titles, global search, member search, checkout creation, safe return confirmations, dashboard refresh after returns, profile changes, password validation and mobile keyboard navigation.
- Verified login success and failure feedback, including invalid credentials, validation, permission errors, rate limits, server/network errors, incomplete responses and the request timeout.
- Confirmed member and checkout actions stay inside the working area at 390px, 768px, 1024px and 1200px. Confirmed missing and failed book covers use the title-led fallback and a selected upload displays its preview.
- Verified Reports navigation, current API totals and CSV download. The export preserves Unicode, quotes fields and treats spreadsheet formulas in titles as text. It reports current totals and this month's recorded returns; historical trends are unavailable.
- Targeted ESLint checks on the final changed screens/components and `git diff --check` passed. This is not a claim that the legacy repository-wide lint baseline is clean.

Browser checks used isolated synthetic API fixtures, without creating or modifying production records. These checks do not establish that a production account can sign in or that the separate Render service accepts cover uploads.

## Deployment

The public API base URL remains `https://beria-cms-back.onrender.com/api`. Deploy from `front-end-r` to the existing Vercel project at `https://beriabooks.vercel.app`. No backend/database change is required for this frontend redesign.
