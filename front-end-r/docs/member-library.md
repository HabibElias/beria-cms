# Reader and admin experiences

The public application and existing admin workspace share the accepted Berea identity and one API client.

- `/` and `/books`: browse, search by title/author, filter categories/availability, and paginate without signing in.
- `/books/:id`: read public book details. An anonymous reader can sign in or create an account before requesting a loan. The intended book survives that transition.
- `/register`: create a regular member account and sign in immediately. There is no public role selector.
- `/my-loans`: see only the signed-in reader's current loans, due dates and request history. Pending requests can be cancelled with confirmation; declined requests show the library's note.
- `/account`: edit own profile/password and theme.
- `/admin`: the existing management app, restricted to the admin role.
- `/admin/loan-requests`: search/filter the queue, approve with a due date and note, or decline. Approval creates a real checkout and updates book availability. Existing checkout return controls complete the same loan lifecycle.

Only the admin role has management access. Existing librarian-role accounts use the reader experience. The backend independently enforces these permissions and ownership, omits private inventory fields from public responses, and prevents duplicate requests or issuing one copy twice.

All forms retain visible validation and pending/success/error feedback. New account passwords require 12–72 characters with confirmation; admin-created members now need an explicit password too. Public login does not display admin demo credentials. Login returns to a safe intended book or to the appropriate role's home.

Existing admin member lists, searchable reader pickers and checkout/return lists load every server page in batches of 100. New registrations and older loans remain searchable instead of disappearing beyond the first ten records. Catalogue card availability remains visible to assistive technology alongside the title and author.

Reader requests and current loans refresh every 30 seconds while visible and when the tab regains focus. No email notification or password-recovery email is promised. Shelf/condition defaults from the starter seed do not establish physical ownership.

The API contract and additive database migration live in [the deployed backend repository](https://github.com/HabibElias/beria-cms-back/blob/main/docs/member-library.md). Render must deploy that code with `RUN_MIGRATIONS=true` before the frontend release. The production API URL stays `https://beria-cms-back.onrender.com/api`.

Verification uses real Laravel requests against an isolated local database, including separate anonymous, member and admin browser sessions. It covers sign-up, safe redirects, permission denial, request/cancellation, approval, return and decline. Responsive and dark-mode captures cover the new reader screens and request queue. External cover requests are deliberately aborted in browser checks to exercise the existing title-led fallback; live cover-host availability is not asserted.
