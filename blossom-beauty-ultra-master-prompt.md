# ULTRA MASTER PROMPT — Blossom Beauty Room Complete Redesign
*(Paste this entire document into Google Antigravity as one message)*

---

## 0. ROLE & OBJECTIVE

You are an Elite Frontend Developer and World-Class UI/UX Designer specializing in ultra-premium, luxurious Next.js/React applications for the beauty/wellness industry. You are given the full existing codebase for **Blossom Beauty Room** (Next.js 15, App Router, TypeScript, Tailwind CSS v4, Framer Motion, Swiper, react-icons, with a working Express + Mongoose + JWT admin backend), plus the brand logo image.

**Your mission:** completely redesign the frontend into a multi-page, ultra-premium, architecturally sharp-edged luxury experience — inspired structurally by `https://relux-nextjs.vercel.app/` and aesthetically by `https://www.monabeautystudios.com/` — while keeping every existing backend integration alive and functional.

You will work in **three phases** (defined in section 12). Do not skip ahead to full code before Phase 1 is approved.

---

## 1. CRITICAL CONSTRAINT — PRESERVE THE BACKEND, DO NOT BREAK DATA FLOW

This is not a static site. There is a real backend at `/backend`:
- **Stack:** Express 5, Mongoose 9, JWT auth (`bcryptjs`, `jsonwebtoken`), CORS, dotenv.
- **Models:** Admin, Appointment, Client, GalleryImage, HeroSettings, HeroSlide, Offer, ServiceCategory.
- **Routes:** appointmentRoutes, authRoutes, clientRoutes, galleryRoutes, heroRoutes, offerRoutes, serviceRoutes.
- **Controllers:** matching controllers for each of the above, plus auth middleware.

On the frontend, at minimum the following already consume this backend dynamically (confirm exact fetch calls by reading each file before editing):
- `Hero.tsx` — pulls `slides` and `settings` (autoplay delay, effect) via state, almost certainly from `heroRoutes` — it also renders a **Swiper carousel** with multiple effect modules (`fade`, `cube`, `coverflow`, `flip`) already imported. Preserve the dynamic slide-fetching behavior; you may simplify to a single elegant effect (recommend `fade` only, for the premium feel — cube/coverflow/flip read as playful, not luxury) but the data source stays dynamic.
- `Gallery.tsx` — has its own loading state and fetches images (`imgs`), plus category filtering (`filter` state) and a lightbox — almost certainly wired to `galleryRoutes` / `GalleryImage` model.
- `SpecialOffers.tsx` — has an `iconMap` keyed by string names (`FaStar`, `FaTag`, `FaGift`, `FaBolt`) which strongly implies offer data (including which icon to render) comes from the backend (`offerRoutes` / `Offer` model) — the icon name is stored as a string and mapped client-side. Preserve this pattern exactly if you keep react-icons, or provide an equivalent icon-key mapping if you switch icon libraries.
- `Services.tsx` — currently has **hardcoded** category/service data in the file (`categories: Cat[]` array) with Pexels stock photo URLs. Check whether `serviceRoutes`/`ServiceCategory` model is meant to back this — if the backend model exists but the frontend isn't using it, flag this discrepancy in your Phase 1 report rather than silently leaving it hardcoded or silently wiring it up.
- `Booking.tsx` — has a large hardcoded `serviceOptions` array (grouped with `--- Category ---` separator strings) — this almost certainly posts to `appointmentRoutes` / `Appointment` model on submit. Preserve the submission logic entirely; only restyle the form.
- `AdminPanel.tsx` and `components/admin/*` (`AppointmentManager`, `GalleryManager`, `OfflineClients`, `Reminders`) — the entire admin CRUD surface. Restyle to match the new design system but do not touch data logic, auth checks, or API calls.
- `Contact.tsx` — has hardcoded `hours` array; confirm whether this should also move to a backend-managed setting or stay static (ask me if unclear rather than assuming).

**Rule: before modifying any component, grep/read it fully to find every `fetch`, `axios`, or API call, note the endpoint it hits, and confirm your redesign still calls that same endpoint with the same payload shape.** Do not change API contracts (request/response shapes) unless you flag a specific reason and I approve it.

Also preserve the existing **admin-access mechanism** found in `app/page.tsx`: opening via `#admin` hash, `?admin` query param (which self-cleans the URL), and the `Ctrl+Shift+A` keyboard shortcut. When you split `app/page.tsx` into multiple routes, decide where this logic now lives (likely in the shared root layout) and confirm it still works from every page, not just `/`.

---

## 2. HOUSEKEEPING — RESOLVE BEFORE ANY REDESIGN WORK

The repo currently contains **two parallel, seemingly duplicate component trees**: `/components/*` and `/src/components/*` (both have identical filenames: About, AdminPanel, BackToTop, Booking, Contact, FloatingPetals, Footer, Gallery, Hero, MobileBookingBar, Navbar, Services, SpecialOffers, Testimonials, WhyChooseUs, plus the admin/ subfolder).

Steps:
1. Check every import in `app/*.tsx` — they currently use `@/components/...` (root-level), so that is the live tree.
2. Diff both trees to confirm they're actually identical (not diverged copies with different fixes).
3. Delete or clearly archive the unused `/src/components` tree so nobody edits a dead copy by mistake.
4. Report this finding and your action in Phase 1 — do not silently delete without confirming in the proposal.

---

## 3. BRAND IDENTITY — EXTRACTED DIRECTLY FROM THE LOGO (do not invent new colors)

The logo is a hand-illustrated floral wreath framing a woman's profile in soft watercolor florals, with **"Blossom"** in rose-bronze cursive script and **"BEAUTY ROOM"** below it in wide-tracked serif small-caps, separated by a thin rule and a small heart glyph.

### 3.1 Colors sampled directly from the logo pixels (not estimated)

| Token | Hex | Where sampled |
|---|---|---|
| `--color-ink` (primary brand color — script text, ring outline) | `#A9524A` | "Blossom" script main stroke |
| `--color-ink-deep` (shadow/depth tone within script) | `#8C3E32` | Darker script shadow pixels |
| `--color-blush` | `#F0B4A8` | Rose/peony petals |
| `--color-peach` | `#F0A890` | Peony petals |
| `--color-lavender` | `#B4A0D2` (approx) | Lavender sprigs in wreath |
| `--color-cream` | `#FDF9F5` | Logo background |
| `--color-cream-alt` | `#FFFFFF` | Pure white areas |
| `--color-charcoal` (body text ink) | `#241A17` | Recommended warm near-black — never pure `#000` |

### 3.2 Mapping from CURRENT theme tokens (in `app/globals.css`) to NEW tokens

The current `@theme` block defines a much more saturated pastel-salon palette (`--color-blush: #F8D7E3`, `--color-rose: #B76E79`, `--color-gold: #D4A574`, `--color-lavender: #CDB4DB`, `--color-emerald: #6BAF8D`, `--color-dark: #000000`, etc.). This palette is **too candy/pastel and too playful** for the ultra-premium direction — it must be replaced, not layered on top of.

You must:
1. Rewrite the `@theme` block in `globals.css` with the new restrained rose-bronze/cream/charcoal system above.
2. Search the entire codebase for every usage of the old token names (`bg-blush`, `text-rose`, `from-rose/80`, `to-accent`, `bg-gold`, `text-lavender`, `bg-emerald`, `text-dark`, etc. — these appear extensively, e.g. in `Services.tsx`'s `color: 'from-rose/80 to-accent'` category gradients, and `WhyChooseUs.tsx`'s `color: 'from-blush to-accent/25'` reason cards) and replace with the new tokens or remove the gradient-heavy treatment entirely in favor of flat, restrained color blocks (gradients read as "salon website," not "luxury clinic").
3. Do not leave any orphaned references to old token names — a full-project search is required, not just the obvious files.

### 3.3 Color usage discipline

- The interface itself (buttons, nav, cards, backgrounds) stays almost entirely in cream / charcoal / one accent (`--color-ink`), used sparingly and deliberately.
- Blush, peach, and lavender are **decoration-only** — thin dividers, a single small floral/line-art accent icon per section, subtle background washes at low opacity. Never a dominant button color, never a full-section background flood.
- No gold/yellow-gold. The current `--color-gold: #D4A574` token must be removed — it doesn't match the logo's actual rose-bronze ink and reads as a generic "luxury template" cliché.

### 3.4 Typography

Keep the existing font trio already loaded via `next/font/google` in `app/layout.tsx` — they already suit the logo:
- **Great Vibes** (`--font-script`) — cursive, used ONLY for: the wordmark/logo text if rendered as text, and at most one short accent word per page (e.g. a small italic-feeling eyebrow label above a heading like *"our story"* rendered in script). Never for body copy, never for buttons, never for more than a few words at a time.
- **Cormorant Garamond** (`--font-serif`) — primary display serif for all headings h1–h3. Use generous letter-spacing on eyebrow/label text set in this font at small sizes.
- **Montserrat** (`--font-sans`) — all body copy, navigation, buttons, form labels, badges, footer text.

**Type scale (define as Tailwind config / utility classes, apply consistently across every page):**

| Role | Font | Size (desktop / mobile) | Weight | Letter-spacing | Line-height |
|---|---|---|---|---|---|
| H1 (hero headline) | Cormorant Garamond | 72px / 40px | 500 | normal | 1.05 |
| H2 (section title) | Cormorant Garamond | 48px / 32px | 500 | normal | 1.1 |
| H3 (subsection/card title) | Cormorant Garamond | 28px / 22px | 500 | normal | 1.2 |
| Eyebrow/label | Montserrat | 12px / 11px | 600 | 0.2em (wide tracking, uppercase) | 1.4 |
| Body | Montserrat | 16px / 15px | 400 | normal | 1.7 |
| Button/nav label | Montserrat | 13px / 13px | 500 | 0.08em, uppercase | 1 |
| Script accent | Great Vibes | 36px / 28px | 400 | normal | 1 |

---

## 4. THE SHARP-EDGE RULE — NON-NEGOTIABLE, BUT SHOW ME ONE EXAMPLE FIRST

Set `border-radius: 0` globally in the design system — every button, card, image container, input field, modal, and section container gets razor-sharp square edges. This is a deliberate architectural-luxury choice: sharp minimalist chrome framing the logo's organic watercolor florals as contrast, not clash.

**Before rolling this out project-wide, in Phase 1 show me one concrete example** — a described or mocked service card / testimonial card using the sharp-edge rule next to a soft floral accent — and flag any single deliberate exception you'd recommend (e.g. the circular logo mark itself should probably stay circular since that's literally how the brand asset is drawn; a single hero portrait image might warrant a soft edge to feel human rather than clinical). Get my confirmation before applying it to all ~15 components.

Practical implementation notes for when this is approved:
- Buttons: sharp rectangle, no radius, with a **hover state that inverts colors** (e.g. charcoal-outline-on-cream → fills to charcoal-on-cream text, or similar restrained inversion) rather than any shadow/lift trick.
- Cards: sharp rectangle, thin 1px hairline border in a muted tone (not the accent color) rather than a drop shadow, OR a very subtle low-opacity shadow only — no heavy card shadows anywhere, they read as generic template UI.
- Inputs (Booking form, Contact form): sharp rectangle, underline-style or thin full-border, no rounded corners, focus state = border color shifts to `--color-ink`, not a glow/ring.
- Images: sharp rectangle crops; where the current code uses Pexels stock photography (`Services.tsx`) or local assets (`public/images/*` — `about-bg.jpg`, `hero-bg.jpg`, `hero-main.jpg`, `hero-realistic.png`, `room-9.png`, etc.), keep them sharp-edged, no rounded masks.

---

## 5. SPACING, GRID & LAYOUT SYSTEM

- Base spacing unit: 8px. All padding/margin values should be multiples of 8 (or 4 for fine adjustments) — no arbitrary values.
- Container max-width: 1280px desktop, with 24px side padding on mobile, 48px tablet, 80px+ desktop gutters.
- Section vertical padding: minimum 96px top/bottom on desktop, 56px on mobile — luxury design lives on generous negative space; do not compress this even with the sharp-edge rule.
- Grid: 12-column on desktop, collapsing to a single column with generous stacked spacing on mobile — define explicit breakpoint behavior per page section in Phase 1, not just "it's responsive."

**Breakpoints to design and test against explicitly:**
| Name | Width |
|---|---|
| Mobile | 375px–639px |
| Tablet | 640px–1023px |
| Desktop | 1024px–1439px |
| Large desktop | 1440px+ |

---

## 6. COMPONENT DESIGN SYSTEM (define once, reuse everywhere — do not restyle each component ad hoc)

Before writing page code, produce a small shared UI kit (e.g. `components/ui/`) containing at minimum:
- `Button` — variants: primary (solid charcoal/ink), secondary (outline), ghost/text-link. States: default, hover, active, disabled, loading.
- `Card` — base sharp-edge card with hairline border, used for services, testimonials, offers, gallery tiles.
- `SectionHeading` — standardized eyebrow (Montserrat, wide-tracked, uppercase) + H2 (Cormorant Garamond) + optional short supporting line, used identically at the top of every section across every page.
- `Input` / `Select` / `Textarea` — for Booking and Contact forms, sharp-edge, consistent focus states.
- `Badge` — for "Popular" tags (Services currently has a `popular` boolean per service) and offer tags.
- `Divider` — replacing the current `section-divider` class; keep it minimal (a thin line, optionally with a small centered floral or heart glyph echoing the logo's heart icon, not a heavy graphic).

Icon library note: the project currently mixes `react-icons/fa` (Font Awesome — quite busy/rounded/informal glyphs) and `react-icons/hi` (Heroicons). For a premium feel, **recommend consolidating to a single, refined line-icon set** (e.g. Phosphor Icons or Lucide, both light/thin-line styles) instead of Font Awesome's default filled/rounded icons — propose this in Phase 1 with a couple of example icon swaps (e.g. `FaCalendarAlt` → a thin-line calendar icon) rather than doing a silent mass-replace.

---

## 7. ANIMATION SPEC (Framer Motion — already installed, use it consistently)

Define these as reusable motion variants, not one-off inline objects scattered per component:

- **Entrance (default for most content):** fade + 24px translate-Y, `duration: 0.5–0.6s`, `ease: [0.22, 1, 0.36, 1]` (expensive, decelerating ease — no spring/bounce).
- **Stagger children** (e.g. service cards, gallery grid, testimonial cards): 0.08–0.12s stagger delay between siblings, same base entrance.
- **Hover on cards/images:** subtle scale to `1.02–1.03` on the inner image only (not the whole sharp-edge card frame), `duration: 0.4s`, plus a color-inversion or border-color shift on the card frame — never a shadow-pop or bounce.
- **Buttons:** color inversion transition `0.3–0.4s ease`, no scale-on-hover (scale reads as playful/app-like, not luxury).
- **Page transitions:** since this becomes multi-page, implement a shared subtle transition (e.g. fade-through or a slim horizontal wipe in the `--color-ink` tone) between route changes — keep it under 0.5s so navigation still feels snappy, not sluggish.
- **Preloader/loader** (if you keep or introduce one — check if the current build has any loading state beyond `Gallery.tsx`'s local `loading`): a minimal 2–3 second refined loader using the logo mark or wordmark, not a generic spinner.
- **Scroll parallax:** use sparingly, at most on the Hero and one hero-style banner per page — do not parallax every section, it becomes noisy.
- **`FloatingPetals.tsx`:** currently animates floating petal shapes across the viewport using the elaborate keyframes already defined in `globals.css` (`float-petal`, `float-petal-reverse`, `hero-petal-drop`). Decide in Phase 1 whether this survives the redesign — it may read as too "cute/salon" for the new architectural direction versus being a nice subtle brand touch at low opacity. Propose a recommendation rather than silently keeping or cutting it.

---

## 8. DESIGN REFERENCES

- **Structural/layout inspiration:** `https://relux-nextjs.vercel.app/` — study page rhythm, section pacing, multi-page nav pattern, how it handles a sticky/transparent-to-solid navbar on scroll.
- **Aesthetic/vibe inspiration:** `https://www.monabeautystudios.com/` — study restraint, photography treatment, whitespace-to-content ratio typical of a professional beauty studio (not a generic spa template).
- One-sentence vibe target: **high-end spa/clinic — minimalist, architectural, quietly confident.** Never cartoonish, bouncy, candy-colored, or emoji-decorated.

---

## 9. MULTI-PAGE ARCHITECTURE — DETAILED, PAGE BY PAGE

Break `app/page.tsx` (currently a single client component stacking `FloatingPetals, Navbar, Hero, SpecialOffers, About, Services, WhyChooseUs, Gallery, Testimonials, Booking, Contact, Footer, BackToTop, MobileBookingBar, AdminPanel`) into the following routes. You have creative control over final content distribution, but justify any deviation from this starting structure in Phase 1.

### `/` — Home
- Hero (full-viewport, Swiper-driven dynamic slides from backend, single restrained transition effect)
- Special Offers — condensed strip (2–3 featured offers max, "View all offers" link if you add a dedicated offers section elsewhere, or keep full list here — your call, justify it)
- About — condensed teaser (short intro + the animated stat counters already built via the `Counter` component, e.g. years in business, clients served — keep this, it's a nice premium touch) with a "Learn more" link to `/about`
- 3-service teaser (pick 3 hero categories from the full Services list) linking to `/services`
- Why Choose Us — condensed
- Testimonials — condensed strip
- Final booking CTA banner linking to `/booking`

### `/about`
- Full About content (currently in `About.tsx`) — brand story, certifications, values, full stat counters
- Why Choose Us (full version, currently `WhyChooseUs.tsx`'s full reasons grid) — folds in here rather than living standalone, since it's thematically "why us," same as About. Justify or override this in Phase 1.

### `/services`
- Full `Services.tsx` category/service breakdown with pricing. Flag the hardcoded-vs-backend discrepancy noted in section 1.
- Each category should link/scroll to a `/booking` pre-filled with that service where feasible (check `Booking.tsx`'s `serviceOptions` structure for how to pass a pre-selected value, e.g. via query param).

### `/gallery`
- Full `Gallery.tsx` — grid + filter + lightbox, backend-driven images preserved exactly.

### `/testimonials` (optional — decide and justify)
- Either its own page, or folded into `/about` or `/`. If you fold it in, make sure the standalone version isn't lost — it currently has its own dedicated section with Google review branding (`FaGoogle` icon usage suggests a Google-reviews tie-in — check for a real integration vs. static content).

### `/booking`
- Full `Booking.tsx` dedicated page — the form, service picker (grouped `--- Category ---` options), and submission logic preserved exactly, restyled to the new sharp-edge input system.

### `/contact`
- Full `Contact.tsx` — hours, map/location, social links, contact form if present.

### `/admin/*`
- Leave route structure as-is (`app/admin/appointments`, `/gallery`, `/hero`, `/login`, `/offers`, `/page.tsx`, `/settings`, `/users`, plus `layout.tsx`) — restyle visually to match the new sharp-edge/rose-bronze system for internal consistency, but do not touch auth logic, data fetching, or CRUD operations.

### Global / shared across all pages
- `Navbar` — becomes part of shared layout; must work identically across all routes, not just `/`. Currently uses hash-anchor links (`#hero`, `#about`, etc.) — these must become real route links (`/`, `/about`, etc.) once split into multi-page, with anchor-scroll only where a link points to a section within the current page.
- `Footer`, `BackToTop`, `MobileBookingBar` — move into `app/layout.tsx` (or a client-side shared wrapper) so they persist across every route.
- Admin-access mechanism (`#admin`, `?admin`, `Ctrl+Shift+A`) — must be re-implemented at the shared-layout level, confirmed working from every public route.

For **every** page above, your Phase 1 proposal must specify:
1. Exact section order.
2. Which existing component(s) map into it (reused as-is / reused with restyling / net-new).
3. Specific entrance/hover animation choices per section (referencing the motion spec in section 7 — don't just say "fade in").
4. Any backend dependency that section relies on, and confirmation it stays wired correctly.

---

## 10. SEO & METADATA

Currently `app/layout.tsx` defines a single site-wide `metadata` object ("Blossom Beauty Room | Premium Beauty Salon in Douglasville, GA" — note the real location, keep this and don't genericize it). Once split into multiple pages:
- Give each route its own `metadata` export (or `generateMetadata`) with a unique title/description tailored to that page's content, keeping the Douglasville, GA location context and the existing keyword focus (lash extensions, facials, waxing, threading).
- Keep the existing Open Graph fields, extend per-page where sensible (e.g. `/gallery` could reference a representative OG image).
- Preserve the existing favicon/icon reference (`/images/logo.png`).

---

## 11. PERFORMANCE & ACCESSIBILITY CHECKLIST

- Confirm every image uses `next/image` (already used in several components) — including any newly added images; no raw `<img>` tags.
- `Services.tsx` currently pulls images from external Pexels URLs — evaluate whether to keep external stock, replace with the real local assets already in `public/images/` (`entryway.png`, `room-9.png`, `section-flowers.png`, etc.), or source new premium photography direction — flag your recommendation.
- Lazy-load below-the-fold sections/images; keep Hero and the first visible section eager.
- Maintain warm-charcoal-on-cream contrast ratios meeting at least WCAG AA for body text.
- Keep `scroll-behavior: smooth` and existing reduced-motion consideration — add a `prefers-reduced-motion` check to the new Framer Motion variants so entrance/hover animations respect user OS settings (not currently handled, worth adding).
- Form fields (Booking, Contact) need proper `label`/`aria-label` associations, visible focus states matching the new focus-border treatment from section 4.

---

## 12. THREE-PHASE EXECUTION WORKFLOW

### Phase 1 — Proposal (mandatory first step, do NOT write full production code yet)
Deliver:
1. Confirmation of the `/components` vs `/src/components` cleanup (section 2) and how you verified it's safe to remove the duplicate.
2. Full backend-dependency map: a table of every component that calls the backend, which endpoint, and confirmation your redesign plan preserves it (section 1).
3. Finalized multi-page structure with the per-page detail required in section 9, including your recommendation on the `/testimonials` and `WhyChooseUs`-placement open questions.
4. Final confirmed color token table (replacing `globals.css`'s `@theme` block) and typography usage rules (section 3), plus a list of every old token name you found in use across the codebase that needs replacing.
5. One worked example applying the sharp-edge rule (section 4) with your recommended exception(s), for my sign-off before it's applied everywhere.
6. Your recommendation on the icon library question (Font Awesome vs. a refined line-icon set) and the `FloatingPetals` keep/cut question (section 7), each with a one-line rationale.
7. Proposed folder structure for the new multi-page app (route groups if used, where new shared UI components in section 6 live, where the shared layout logic for Navbar/Footer/admin-access goes).

### Phase 2 — Code (only after I reply "Approved")
Produce complete, production-ready TypeScript code, page by page, in the order: shared design tokens/UI kit → shared layout (Navbar/Footer/admin-access) → Home → Services → Booking → Gallery → About → Contact → remaining pages → admin restyle pass. For each page, confirm before moving to the next if I flag changes.

### Phase 3 — QA pass (after all pages delivered)
Before calling it done, walk through and confirm:
- Every backend-dependent feature still works end-to-end (Hero slides load, Gallery images/filter/lightbox work, Offers render with correct icons, Booking submits successfully, Admin CRUD panels function).
- No orphaned references to old color tokens or the deleted duplicate component tree remain anywhere in the codebase.
- Full responsive pass across the four breakpoints in section 5.
- Animations respect `prefers-reduced-motion`.
- Metadata is correct and unique per page.

---

Confirm you understand this entire brief — especially the backend-preservation constraint, the duplicate-folder cleanup, and the sharp-edge contrast question — and then deliver your **Phase 1 proposal** in full, addressing every numbered item in section 12's Phase 1 list.
