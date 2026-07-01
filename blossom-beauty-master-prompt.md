# MASTER PROMPT — Blossom Beauty Room Redesign
*(Paste this entire document as-is into Google Antigravity)*

---

## ROLE & OBJECTIVE

You are an Elite Frontend Developer and World-Class UI/UX Designer specializing in ultra-premium, luxurious Next.js/React applications. You have been given the current codebase for **Blossom Beauty Room**, a beauty-salon website (Next.js 15, App Router, Tailwind CSS v4, Framer Motion, with an Express/Mongoose/JWT admin backend), plus the brand logo.

Your objective: redesign the frontend into a **multi-page, ultra-premium, architecturally sharp luxury experience**, while preserving all existing backend functionality (admin panel, appointments, gallery, offers, services — all backed by the Express API).

Do not start writing full production code immediately. Work in two phases, described at the end of this document.

---

## CRITICAL CONSTRAINT — DO NOT BREAK THE BACKEND

This project is **not just a static frontend**. It has a working Express + Mongoose + JWT backend at `/backend` with models and routes for Appointments, Clients, GalleryImage, HeroSettings/HeroSlide, Offer, ServiceCategory, and Admin auth. The frontend currently consumes this through an in-app AdminPanel (accessible via `#admin`, `?admin`, or Ctrl+Shift+A) and public-facing components (Hero, Gallery, SpecialOffers, Services, Booking, etc.) that presumably fetch from these routes.

Rules:
- Do **not** delete, rewrite, or disconnect any backend routes, models, or controllers.
- Any component you redesign (Hero, Gallery, SpecialOffers, Services, Booking) must keep pulling from the same data sources/endpoints it currently uses — only the visual layer changes.
- The admin panel and its sub-managers (`AppointmentManager`, `GalleryManager`, `OfflineClients`, `Reminders`) must remain fully functional; you may restyle them to match the new design system, but the logic/data flow stays intact.
- Before touching any component, check whether it fetches from the backend and trace that dependency so it isn't silently broken during the page split.

## HOUSEKEEPING ISSUE TO RESOLVE FIRST

The current repo has **two parallel component trees**: `/components/*` and `/src/components/*`, seemingly duplicates. Before any redesign work:
1. Diff both trees, determine which one is actually imported by `app/*` (check import paths like `@/components/...`).
2. Consolidate into a single source of truth (keep whichever `app/page.tsx` and other pages actually reference — currently that's the root-level `/components` per existing imports).
3. Delete or clearly archive the unused duplicate tree so future edits don't diverge.
4. Flag this to me in your Phase 1 proposal — confirm which tree you're keeping before deleting anything.

---

## BRAND IDENTITY (extracted directly from the attached logo — do not invent a new palette)

The logo is a hand-illustrated floral wreath framing a woman's profile, with "Blossom" in a rose-bronze cursive script and "BEAUTY ROOM" in a wide-tracked serif/small-caps below it.

**Colors (sampled directly from the logo file, not estimated):**
| Role | Hex | Source |
|---|---|---|
| Primary / Brand ink (script text, ring outline) | `#A9524A` – `#B4544A` (rose-bronze/terracotta) | Sampled from "Blossom" script |
| Deep accent (shadow tones in script) | `#8C3E32` | Darker script shadow pixels |
| Warm blush | `#F0B4A8` | Rose/peony petals |
| Soft peach | `#F0A890` | Peony petals |
| Dusty lavender | `#B4A0D2` (approx, from lavender sprigs) | Floral wreath |
| Cream / background | `#FDF9F5` – `#FFFFFF` | Logo background, matches existing `bg-cream` |
| Near-black / ink for body text | `#241A17` or similar warm charcoal, NOT pure black | Keep luxury warmth, avoid stark #000 |

Do not use gold/yellow-gold (`#D4AF37` etc.) as the primary accent — the actual logo ink is rose-bronze/terracotta, not gold. Use the warm blush/peach/lavender tones only as secondary floral accents (e.g. subtle background washes, divider icons), never as dominant UI color — the interface itself should stay restrained and let the logo's florals be the only "decorative" element.

**Typography:**
The project already loads Great Vibes (script), Cormorant Garamond (serif), and Montserrat (sans) via `next/font/google` — these already match the logo's cursive "Blossom" + small-caps "BEAUTY ROOM" pairing closely. Keep this trio rather than introducing new fonts:
- **Great Vibes** — used sparingly, only for the logo wordmark itself or one accent word per page (e.g. a section eyebrow), never for body copy or buttons.
- **Cormorant Garamond** — primary display serif for headings (h1–h3).
- **Montserrat** — body copy, navigation, buttons, labels, all UI chrome.

---

## THE SHARP EDGE RULE (non-negotiable, but confirm before applying broadly)

Set `border-radius: 0` globally. Every button, image container, card, input, and section container gets razor-sharp square edges — no rounded corners anywhere in the UI shell.

**Flag for me in Phase 1, don't just assume silently:** the logo itself is entirely soft/organic (watercolor florals, curved script). A fully sharp-edged interface is a deliberate *contrast* choice — architectural minimalism framing organic brand imagery — which can look excellent (this is a real luxury-design technique) but is a stylistic bet. State this contrast explicitly in your proposal and show me one example mockup/description of how a sharp-edged card looks with a soft floral accent before we lock it in for the whole site.

---

## DESIGN REFERENCES

- **Structural/layout inspiration:** `https://relux-nextjs.vercel.app/` — study its page rhythm, section pacing, and multi-page navigation flow.
- **Aesthetic/vibe inspiration:** `https://www.monabeautystudios.com/` — study its restraint, photography treatment, and how it balances whitespace with a professional beauty-studio feel.
- **Vibe in one sentence:** high-end spa/clinic — minimalist, architectural, quietly confident. Never cartoonish, bouncy, or playful.

---

## MULTI-PAGE ARCHITECTURE (you decide final structure — this is a starting proposal)

Break the current single-page (`app/page.tsx`) into dedicated routes under the App Router. Suggested starting point, but you have creative control over exact content distribution:

- `/` — Home: Hero, a condensed "About" teaser, Special Offers strip, a 3-service teaser, testimonials strip, booking CTA
- `/about` — Full About + Why Choose Us
- `/services` — Full Services/pricing breakdown
- `/gallery` — Full Gallery
- `/testimonials` — (or folded into About/Home — your call, justify it)
- `/booking` — Dedicated Booking flow
- `/contact` — Contact + location/hours
- `/admin/*` — leave existing admin routes structurally as-is, just restyle to match new design system

For each page, specify in your proposal:
- What content/components live there
- What's new vs. reused from existing components
- What specific scroll effects, hover states, and entrance animations you're proposing for that page (keep transitions in the 0.4s–0.6s range, deliberate and "expensive," never bouncy/spring-heavy easing)

Global elements (Navbar, Footer, FloatingPetals, BackToTop, MobileBookingBar) become part of a shared layout rather than page-level imports — restructure via `app/layout.tsx` and/or nested layouts as appropriate.

---

## UI/UX REQUIREMENTS

- **Whitespace:** generous padding/margins; content must breathe despite the sharp-edge/architectural direction — sharp edges ≠ cramped.
- **Animations:** subtle, buttery micro-animations only — gentle fade/slide-ins on scroll (Framer Motion, already installed), elegant hover states (color inversion, subtle image scale within the sharp container, underline draws). No bounce, no overshoot easing.
- **Responsiveness:** pixel-perfect across mobile/tablet/desktop. Test the sharp-edge cards and nav especially closely on mobile where dense square edges can feel harsh — adjust spacing accordingly.
- **No emojis anywhere in copy or UI.**
- **Accessibility:** maintain proper contrast ratios given the warm charcoal-on-cream palette; don't sacrifice legibility for aesthetics.

---

## EXECUTION WORKFLOW — TWO PHASES

### Phase 1 — Proposal (do this first, wait for approval)
Deliver, without writing full production code:
1. Confirmation of which component tree (`/components` vs `/src/components`) you're keeping, and your plan for backend-dependency tracing so nothing breaks.
2. Your finalized multi-page structure with per-page content/animation breakdown.
3. Final color palette (hex codes, confirmed from the values above) and typography usage rules.
4. A short worked example (description or a single sample component mock) showing how the sharp-edge rule looks in practice against the soft logo — flag any places you'd recommend a deliberate exception (e.g. the logo image itself, or a single hero portrait) and why.
5. A note on folder structure for the new multi-page setup (route groups, shared layout, where new page-specific components live).

### Phase 2 — Code (only after I reply "Approved")
Once approved, produce complete, production-ready code page by page, preserving all backend integrations, in the sharp-edge/rose-bronze/cream design system confirmed in Phase 1.

---

Confirm you understand these instructions, including the backend-preservation constraint and the sharp-edge contrast question, and provide your Phase 1 proposal.
