# Berea library

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Berea church library administrators and librarians manage the collection, members, loans and returns. The existing application also stores ordinary member accounts. The precise frequency of use is not specified; the design supports recurring administrative work on desktop and mobile.

## Product Purpose

Help the Berea church community in Addis Ababa care for a shared library: keep books discoverable, connect books with readers, and track their return.

## Operating Context

This is an existing React/TypeScript library application. The frontend is hosted on Vercel and connects to the separate Laravel API at https://beria-cms-back.onrender.com/api. The user manages Render and the Turso database. This redesign updates the existing library application; a public church website is outside the scope. The user confirmed a full redesign of the library app.

## Capabilities and Constraints

Preserve authenticated login and logout, response toasts, book search and filtering, book details and editing, member management, categories, checkout and return flows, profile and password changes, and theme selection. Reports expose current API totals and this month's recorded returns, with a CSV summary export; historical trends are unavailable. Keep working routes and API contracts. Dashboard and report information comes from the API; do not add invented trends, statistics, congregation photographs or testimonials. The current backend has no functional email password-recovery route; account help must not promise an email was sent.

## Brand Commitments

The user supplied Berea_Brand_Guidelines.pdf and explicitly requested a redesign based on it. Use Covenant Blue #044592, Midnight #03224A, Radiant Gold #F0B122, Soft Gold #FECA71, Parchment #FEFBE9, and Cross Red #CF1418 sparingly. Use Nunito for Latin text and Noto Sans Ethiopic for Amharic. The voice is reverent, warm, clear and rooted. The brand essence is “The Word, held open to everyone.”

The user requests an SVG logo containing only the icon and its background, without the logo wordmark. The provided PDF contains the emblem with its blue background and gold ring. The shared ChatGPT logo link is inaccessible from this environment; the exact linked artwork remains unverified and a direct attachment has been requested. Do not claim that a raster embedded in an SVG wrapper is a vector logo.

## Evidence on Hand

The attached 2026 Berea brand guidelines, the existing frontend and backend source, and the existing API data contracts. Browser verification uses clearly isolated synthetic test fixtures; those fixtures are not part of the production UI or production database.

## Product Principles

- Make the next library task clear and accessible.
- Display real data and distinguish an empty library from an unavailable API.
- Carry the supplied identity consistently through every page and state.
- Preserve the community's records and existing application behavior.
