# Earlier Beria CMS backend copy

The current production backend is **[HabibElias/beria-cms-back](https://github.com/HabibElias/beria-cms-back)**, deployed on Render at https://beria-cms-back.onrender.com/api.

This directory is an older Laravel backend copy. It is not synchronized with the standalone API's public catalogue, reader accounts, loan requests, admin-only access boundaries or current starter catalogue. Use the standalone repository for current frontend development and Render deployment.

## Repository/deployment boundary

| Application | Source | Deployment |
| --- | --- | --- |
| React frontend | `../front-end-r` | Vercel, root `front-end-r` |
| Current Laravel API | `HabibElias/beria-cms-back` | Render, repository root |
| This directory | Earlier backend copy and local preparation work | Not the deployed API source |

Do not repoint Render to this directory expecting the latest integrated reader/admin experience. The main [project README](../README.md) and [standalone backend README](https://github.com/HabibElias/beria-cms-back#readme) describe the current application.

## Work prepared in this cloud copy

Local work includes remote Turso/libSQL configuration, PHP FFI/Docker startup preparation, CORS and a Cloudinary image-upload implementation. Some of this work remains uncommitted in the cloud working copy; inspect `git status` rather than assuming a fresh clone includes every prepared file.

The prepared image flow uses:

- An admin-authorized `POST /api/book-images` endpoint.
- JPEG, PNG, WebP and GIF validation, up to 5 MiB.
- Server-held `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY` and `CLOUDINARY_API_SECRET`.
- A signed upload and the existing `book_img` / `book_path` fields for the resulting URL/public ID.
- Cleanup of replaced/deleted Cloudinary images after the corresponding record operation succeeds.

**This Cloudinary implementation has not been ported to the deployed standalone API.** The frontend upload control therefore does not establish a working production upload path. Existing cover URLs/fallback jackets work, but existing Supabase or other hosted image files have not been transferred.

Porting this work needs to preserve the standalone API's current authorization and loan features, followed by upload/replacement/deletion checks with real Cloudinary credentials. Environment variables alone cannot supply a missing endpoint or SDK.

## Current setup and database guidance

Follow the [standalone API setup](https://github.com/HabibElias/beria-cms-back#readme) for PHP 8.3+, Composer, FFI, SQLite/Turso/PostgreSQL, keys, CORS and migrations. Production uses remote Turso so Render restarts do not remove application records.

Use `RUN_MIGRATIONS=true` for outstanding production migrations. Keep existing `APP_KEY` and `JWT_SECRET`; changing database settings does not transfer existing rows.

The production API has targeted `AdminSeeder` and `BookSeeder` startup flags. Do not assume this older directory provides the same bootstrap behavior. Default development seeders contain public sample accounts and are not production setup commands; database resets such as `migrate:fresh` are not deployment steps.

## Design and portfolio

The accepted frontend identity, public/member/admin routes, validation results and remaining boundaries are documented in [the frontend README](../front-end-r/README.md). [Impeccable and Taste](../.agents/README.md) are installed as repository design tools.

The completed [portfolio pack](https://beriabooks.vercel.app/downloads/Berea-Portfolio-Pack.zip) is publicly downloadable from any workspace and uses fictional member/circulation data.

The Laravel application package declares MIT in `composer.json`; dependencies and assets retain their own licenses.
