---
version: 1
slug: reader-library
primary_target: src/pages/library/CataloguePage.tsx
related_targets: [src/pages/library/CatalogueBookPage.tsx, src/pages/library/MyLoansPage.tsx, src/pages/library/LoanRequestsPage.tsx, src/pages/RegisterPage.tsx]
---

# Reader library and administrator requests

Mode: Operate. This extends the accepted Berea design system; preserve its palette, fonts, emblem, controls and work surfaces. No replacement world, random direction or image comp is needed.

Anonymous visitors browse the real book catalogue and details. Signing up creates only a member account. Readers request a loan and see only their own requests and loans. Only the admin role sees the existing management app, now at /admin, and the request review queue. Existing librarian accounts use the reader experience.

The public shell uses the same Parchment frame, white working sheet and emblem with a compact horizontal navigation. Collection search, filters, count and covers lead the screen. Detail pages explain availability and the request process. The reader's loans and request statuses are explicit, including cancellation and declined notes. The admin queue presents book, reader, request and approval/decline actions with readable phone layouts. Approval creates a real checkout atomically; submitting a request does not reserve a copy.

Registration and login preserve the branded split form and carry safe local book destinations across authentication. Every mutation has pending, success and error feedback. Verify with the real local Laravel API, role/ownership tests and responsive browser captures. Keep all fixtures in isolated test databases.
