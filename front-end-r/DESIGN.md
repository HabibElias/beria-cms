---
name: Berea library
description: A welcoming, well-kept church library, rooted in the Word and shared with everyone.
colors:
  covenant-blue: "#044592"
  midnight: "#03224A"
  radiant-gold: "#F0B122"
  soft-gold: "#FECA71"
  parchment: "#FEFBE9"
  paper: "#FFFFFF"
  ink: "#152E4C"
  secondary: "#F5EED8"
  secondary-ink: "#153B64"
  muted: "#F5F5EE"
  muted-ink: "#596878"
  blue-tint: "#EDF3FA"
  destructive: "#B71921"
  cross-red: "#CF1418"
  red-tint: "#FFF0EF"
  gold-tint: "#FFF4D8"
  gold-ink: "#785510"
  border: "#E6E8E5"
  input: "#C9D2D9"
  nav-accent: "#E9EFF5"
  nav-border: "#E7E3D5"
  chart-blue: "#7A9BC3"
  dark-paper: "#102D53"
  dark-secondary: "#223B50"
  dark-muted: "#18334E"
  dark-muted-ink: "#AFC2D5"
  dark-accent: "#1B3C60"
  dark-destructive: "#FF9C99"
  dark-border: "#2A4058"
  dark-input: "#526B83"
  dark-gold-tint: "#3B3422"
  dark-red-tint: "#3B252E"
typography:
  display:
    fontFamily: '"Nunito Variable", "Noto Sans Ethiopic Variable", sans-serif'
    fontSize: "64px"
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: "-0.035em"
  auth-title:
    fontFamily: '"Nunito Variable", "Noto Sans Ethiopic Variable", sans-serif'
    fontSize: "34px"
    fontWeight: 850
    letterSpacing: "-0.03em"
  headline:
    fontFamily: '"Nunito Variable", "Noto Sans Ethiopic Variable", sans-serif'
    fontSize: "28px"
    fontWeight: 800
    lineHeight: 1.25
    letterSpacing: "-0.025em"
  title:
    fontFamily: '"Nunito Variable", "Noto Sans Ethiopic Variable", sans-serif'
    fontSize: "17px"
    fontWeight: 800
    lineHeight: 1.5
    letterSpacing: "-0.015em"
  body:
    fontFamily: '"Nunito Variable", "Noto Sans Ethiopic Variable", sans-serif'
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: '"Nunito Variable", "Noto Sans Ethiopic Variable", sans-serif'
    fontSize: "13px"
    fontWeight: 700
    lineHeight: 1.5
  caption:
    fontFamily: '"Nunito Variable", "Noto Sans Ethiopic Variable", sans-serif'
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.5
  metric:
    fontFamily: '"Nunito Variable", "Noto Sans Ethiopic Variable", sans-serif'
    fontSize: "30px"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "-0.035em"
rounded:
  sm: "8px"
  md: "10px"
  lg: "12px"
  xl: "16px"
  nav: "9px"
  status: "5px"
  cover: "3px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "20px"
  2xl: "24px"
  3xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.covenant-blue}"
    textColor: "{colors.paper}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
    height: "40px"
  button-primary-dark:
    backgroundColor: "{colors.soft-gold}"
    textColor: "{colors.midnight}"
  button-outline:
    backgroundColor: "{colors.parchment}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    height: "40px"
  button-secondary:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.secondary-ink}"
    rounded: "{rounded.md}"
    height: "40px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    height: "40px"
  button-link:
    backgroundColor: "transparent"
    textColor: "{colors.covenant-blue}"
    height: "40px"
  button-destructive:
    backgroundColor: "{colors.cross-red}"
    textColor: "{colors.paper}"
    rounded: "{rounded.md}"
    height: "40px"
  input:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "8px 12px"
    height: "40px"
  nav-active:
    backgroundColor: "{colors.nav-accent}"
    textColor: "{colors.covenant-blue}"
    rounded: "{rounded.nav}"
    padding: "10px 12px"
  status:
    backgroundColor: "{colors.blue-tint}"
    textColor: "{colors.covenant-blue}"
    rounded: "{rounded.status}"
    padding: "3px 7px"
  status-gold:
    backgroundColor: "{colors.gold-tint}"
    textColor: "{colors.gold-ink}"
  status-red:
    backgroundColor: "{colors.red-tint}"
    textColor: "{colors.destructive}"
  book-card:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
  workspace:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.xl}"
---

# Design System: Berea library

## Overview

**Creative North Star: "The Word, held open."**

A welcoming, well-kept church library. The supplied Berea identity makes the workspace reverent, warm, clear and rooted: a Parchment frame around a white working sheet, rounded Nunito type, Covenant Blue actions and a little Gold. Books and readers carry the content; restrained borders and compact lists keep recurring library work easy to scan.

The identity comes from the supplied 2026 brand guidelines, as recorded in [PRODUCT.md](PRODUCT.md) and [brand-assets.md](docs/brand-assets.md). Latin and Amharic share one font stack. The icon-only emblem retains its blue background and gold ring. `public/brand/berea-icon.svg` is a path-based conversion from the PDF's raster emblem, without a wordmark; it is not the original vector master. The separate shared ChatGPT logo link remains inaccessible and its artwork unverified.

**Key Characteristics:**
- A labelled navigation frame and one continuous working sheet.
- Clear blue actions, warm gold attention and meaningful status text.
- Friendly, heavy headings with quiet supporting information.
- Title-led fallback book jackets and compact circulation records.

This records the implemented CSS and shared components, with desktop and mobile review captures as visual evidence. The frontmatter owns extracted values; the sidecar adds theme-aware previews, motion, elevation and breakpoints. Synthesized tonal ramps in the sidecar are swatch previews, not additional application tokens.

## Colors

The palette follows the supplied identity: a strong blue anchored by Midnight, warmed by Parchment and restrained Gold.

### Primary
- **Covenant Blue:** Light-theme primary actions, links, focus and collection data; also the login brand field.
- **Midnight:** The exact dark-theme frame and sidebar, plus dark text on Soft Gold actions.

### Secondary
- **Radiant Gold / Soft Gold:** Attention, loans and the emblem; Soft Gold becomes the dark-theme primary action and focus color.
- **Cross Red / Destructive:** Cross Red is the explicit destructive-button fill. The deeper semantic Destructive token supplies readable light-theme errors and overdue text. Their sources intentionally differ; do not replace one by assuming they are aliases.

### Neutral
- **Parchment / Paper:** Outer frame and sidebar / working sheet and fields.
- **Ink / Muted Ink:** Main information / secondary explanations, metadata and inactive navigation.
- **Muted / Border / Input:** Grouped content, quiet separators and a stronger field boundary.
- **Blue Tint / Gold Tint / Red Tint:** Text-backed status and attention surfaces; Gold Ink supplies the darker foreground on warm light surfaces.
- **Dark Paper / Dark Muted / Dark Accent:** Lifted work surfaces, quiet grouped content and selected states within Midnight. Dark Paper also fills popovers; it is a tonal lift from the frame.
- **Dark Ink:** The dark theme reuses Blue Tint for main text and Parchment for warm foregrounds; Dark Muted Ink supplies secondary text. Dark Destructive is the readable error/overdue foreground.
- **Navigation Accent / Navigation Border:** The light sidebar's selected row and divider. Chart Blue is an existing secondary data-series color.

**The Meaning Before Color Rule.** Every availability, loan and overdue state has a readable text label. Color reinforces that label; it does not replace it.

## Typography

**Display and Body Font:** Self-hosted Nunito Variable, followed by self-hosted Noto Sans Ethiopic Variable and a sans-serif fallback.

**Character:** Rounded letterforms and confident weights make the library welcoming without weakening task hierarchy. No separate display or monospace family is introduced. Headings use balanced wrapping; numerical counts and table cells use tabular figures.

### Hierarchy
- **Display:** The brand statement on desktop login. It reduces to (54px) at the navigation breakpoint and disappears with the desktop brand panel on mobile.
- **Auth title:** The sign-in heading, reduced to (29px) below (768px).
- **Headline:** Page titles, reduced to (25px) below (768px).
- **Title:** Section headings. Book-card titles use (15px, 800) and become (13px) on mobile.
- **Body:** Standard application copy. Form fields use (16px) below (768px) and (14px) from that point upward.
- **Label / Caption:** Form labels and actions / dates, authors, secondary record details and statuses. Status text uses the caption size at (700).
- **Metric:** Dashboard totals, reduced to (27px) below (768px).

**The Shared Script Rule.** Retain the Nunito / Noto Sans Ethiopic stack on controls and content so Latin and Amharic remain part of the same interface.

## Layout

The desktop shell has a fixed labelled sidebar (232px), a header (72px) and a bordered working sheet with a (16px) outside gutter and rounded corners. The sheet begins beside the sidebar and caps at (1500px) on viewports of at least (1600px). Page headers use (30px 32px 0); content uses (32px) horizontal padding and recurring (24px) gaps. The spacing vocabulary is mostly multiples of four, with compact text and navigation adjustments where the source uses them.

Below (1200px), books and categories use two columns, the header breadcrumb hides, and member/checkout tables become actionable cards. Below (1024px), the sidebar becomes a dialog-backed navigation sheet (280px, capped at viewport width minus 36px); the header becomes (64px). Below (768px), the working sheet reaches the viewport edges, page padding becomes (20px), member/category/checkout cards stack, and dashboard totals use a two-by-two strip. The book grid remains two columns with smaller jackets and (12px) gaps. Settings and book details become single-column layouts.

Login uses a two-column brand/form composition on desktop. Its form has a maximum width of (380px). Below (768px), a compact emblem and name sit above the single-column form; the large brand field is hidden.

**The Framed Workspace Rule.** Keep page titles, filters and records inside the shared sheet. Reduce the frame at the observed responsive breakpoints and keep row actions available when records become cards.

## Elevation & Depth

The main workspace is flat at rest: tonal layering, one-pixel borders and whitespace establish depth. Cards and book jackets do not float on shadows. Menus, selects and popovers use the shared medium shadow; dialogs use the large shadow above a black half-opacity overlay. Exact inherited shadow values are recorded in the sidecar. Focus is a state cue, not permanent elevation.

State transitions are brief: navigation colors use (150ms) with CSS's default ease; shared controls use the inherited (150ms) cubic-bezier transition; dialogs use (200ms) fade/scale transitions. Reduced-motion preference collapses animation and transition duration to (0.01ms).

## Shapes

The frame is softly squared: working sheet and generic form cards use the largest recurring corner; book, member, checkout, category and grouped settings surfaces use the large corner; controls use the medium corner. Navigation has its own slightly tighter rounding and status labels use compact rounded rectangles, not pills. Initial avatars and the emblem are circular.

Book covers are upright rectangles. Generated jackets use subtly asymmetric spine/page corners (2px 5px 5px 2px) and a one-pixel left edge. Real cover images preserve their aspect ratio with `object-fit: contain`.

## Components

### Buttons

Confident, compact and sentence-led. Default buttons are (40px) high with (14px, 700) type; small, large and icon variants use (32px), (44px) and a (36px) square. Default horizontal padding is (16px), reduced to (12px) when a direct SVG is present. Login's submit control has a (46px) minimum height.

Primary fills follow the theme's primary/foreground pair and reduce fill opacity to 90% on hover. Outline uses a one-pixel border and the frame surface, changing to Accent on hover. Secondary uses its warm surface at 80% on hover. Ghost inherits text and gains Accent on hover; Link uses Primary and an underline on hover. Destructive uses Cross Red, a darker hover (#B71117) and a dark-theme fill (#AC242B). Disabled controls block pointer interaction and use half opacity. Shared buttons and inputs receive a (3px) half-opacity focus ring; invalid fields receive the destructive boundary and tinted ring.

### Inputs / Fields

Readable, outlined fields on the card surface, with the stronger Input border and muted placeholders. Shared height is (40px); sign-in fields are (46px). Labels sit above the field, with errors beneath it. Icon fields reserve left padding and password fields reserve right padding for the reveal control. The source dark input uses the Input color at 30% opacity; login overrides its background to Card. Keep visible labels and associate errors with their inputs.

### Navigation

Text labels accompany (18px) outline SVG icons. Rows have a (44px) minimum height, (12px) icon/text gap and medium-weight muted text. Active rows use Navigation Accent with Primary text and (800) weight; dark active rows use Dark Accent and Parchment. Hover blends the sidebar accent at 65%. The labelled destinations are Overview, Book collection, Members, Checkouts & returns, Categories and Reports, with Settings in the footer. The mobile sheet preserves the same labels, closes on navigation and has explicit open/close controls. The header search has its own compact bordered field and a keyboard shortcut.

### Chips / Status Labels

Small, noninteractive captions describe actual state. Blue marks available/returned or a member role; Gold marks a book with a reader and attention reminders; Red marks due/overdue states. Their normal states use tinted surfaces and (3px 7px) padding. They have no invented hover behavior. The shared Badge primitive also exists for linked or bordered variants, with control-style focus treatment when interactive.

### Cards / Containers

Book cards place a jacket on a Muted art field, followed by title, author, category/shelf metadata and actions separated by a fine rule. Their desktop art height is (195px), body padding (18px); mobile uses (172px) and (12px). Member, checkout and category cards use (22px) padding. Generic form cards use the largest corner with (24px) vertical and content padding. Tables use quiet row rules, muted headers and a half-opacity Muted hover surface; cell padding is (16px 12px).

### Book Jackets and Collection Status

Use a provided book cover when available. Missing or failed images produce a title-led jacket using one of the three implemented blue, warm paper or Covenant Blue treatments. Normal jackets show title and author; small record jackets show an outline open-book SVG. Do not imply that generated jackets are publisher artwork.

The collection availability strip shares real book/loan totals with the overview. Blue denotes books on the shelves and Gold denotes books with a reader, with explicit legend text and an accessible summary. Its dark available segment uses a lighter blue (#88B8EF) for visibility.

Reports reuse the same metric strip, compact book rows and availability strip. The export action sits in the page header; it is disabled while data is unavailable. A snapshot timestamp, this month’s returned-book context and separate loading, empty and error treatments make the scope of the report visible. Historical trends are not represented.

## Do's and Don'ts

### Do:
- **Do** use the supplied Berea palette and self-hosted Nunito / Noto Sans Ethiopic stack.
- **Do** preserve the icon-only emblem's blue background, gold ring and internal artwork.
- **Do** use the shared shell, meaningful status labels and visible focus treatment across routes.
- **Do** let actual records drive totals, availability, empty states and error states.
- **Do** preserve visible record actions when tables become cards below the compact-layout breakpoint.

### Don't:
- **Don't** add a wordmark to the requested icon asset or describe its PDF conversion as an original vector master.
- **Don't** claim the inaccessible shared ChatGPT artwork has been matched or verified.
- **Don't** introduce decorative stock imagery, invented statistics or illustrative publisher covers.
- **Don't** turn the flat workspace cards into floating shadow stacks; reserve the existing shadows for overlays.
- **Don't** rely on color alone for a circulation state or replace the supplied Parchment with an unrelated generic palette.
