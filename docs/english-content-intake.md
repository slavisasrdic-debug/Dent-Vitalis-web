# English version — 23 September 2026

Scope: complete the 27-page English version using the supplied EN translation and the accepted HR component structure. Existing IT/HR/DE routes and content remain unchanged. Publish through GitHub main → Cloudflare Pages preview only; production domain, DNS and form delivery are not changed. Slovenian remains unavailable in the language selector.

## Provenance and mapping

- Immutable source: `reference/Upute za prijevode/Dentvitalis web tekstovi za prijevod_EN.docx`, SHA-256 `842ebb8b2069f975eca73caeb4f7e5280eacfc9bc719604da3295b326b6dc988`; extracted catalogue `data/translations/en-source.json`.
- `src/content/en/source.ts` reads explicit paragraph IDs. EN does not align mechanically with DE: home information cards, denture introduction, bridge/whitening subheadings, treatment duration, payment details, accommodation, FAQ answers, Google/post-treatment reviews and gallery introductions have independently mapped IDs.
- All 12 home sections, five service pages, six about pages, six information pages, three directories, FAQ, gallery, testimonials, contacts and two legal pages use existing shared components. Retained assets: five doctor portraits, 15 comparison pairs and 13 testimonial videos. Original video language is unchanged; no invented subtitles or reviews.
- The new English modules replace the incomplete generic EN adapter at the route entry point. Existing `/en/<page-id>` detail URLs are preserved. New routes follow the same flat convention; legal URLs match the current public English source. No redirects introduced.
- Navigation, sidebar, footer, form/modal labels, chat, alternative text, breadcrumbs, metadata and reciprocal IT/HR/DE/EN switches all use the English namespace. Editorial interlinks remain deferred; navigation, contact, legal and verified external research links remain functional.

## Confirmed business exceptions

- Source `t5.r0.c0.p10` repeats obsolete €330, while the supplied home and FAQ say €220. Apply the previously approved crown price from €220; preserve the original DOCX.
- Source `t15.r3.c0.p12` contains obsolete ZABAHR2X. Use the already approved Erste SWIFT ESBCHR22. IBAN, beneficiary and original PDF417 bytes are unchanged. No newly generated code or redirect service.
- English prefixed currency amounts are bound through central confirmed business values, retaining English punctuation with a non-breaking space after €.
- Clinic contacts, including it@dentvitalis.com and separate booking contacts, come from the supplied translation and central confirmed business values. Historical legal contacts remain separate.
- The exact supplied Ana Beljan research title links to the existing verified DOI. The source's dentiumeu.com mention stays as text because that old domain has no DNS record.

## Legal source

Retrieved once from the current public English site; original HTML bytes are immutable in `reference/legal-public/2026-09-23/`. `scripts/audit-legal-public.mjs --en` extracts content into `src/content/en/legal-public.json`; source HTML/CSS/JS is not shipped as application code.

- `/en/privacy-policy`: SHA-256 `af6ed857f1b978f2356f696d14188689cabc7dabe6bc673e6da7f93f256ad9cb`.
- `/en/terms-of-use`: SHA-256 `5b4cba6f28aea49c6163be9ae89afb3e68dcb749177fcea0b918060c588aefbf`.
- Preserve all wording, emphasis, source links, list nesting, ordered alphabetic markers and heading hierarchy; use our existing Montserrat styling and consistent solid unordered bullets. “Disclaimer” is a real subheading.
- The existing shared contact-link correction also applies here: public phone label `+38551371064` incorrectly targets `tel:0038550371064`; the rendered target matches its visible number. This is an explicit tested exception, not a silent change to the legal wording.

## Verification

EN completeness tests cover all 27 routes and every supplied table paragraph, plus all standalone post-treatment reviews, gallery/video/portrait inventory, working destinations and anchor IDs, required phone fields, responsive text geometry and real interactions. EN navigation tests verify all four reciprocal language pairs and actual language/menu/form/chat clicks. EN legal tests compare full text, lists, emphasis and links to immutable source HTML. Existing HR/DE and shared legal-marker tests guard regressions. Local build/check and visual QA precede GitHub publication; final public verification must match the deployed commit.

Local result: Astro check (205 files) and targeted ESLint pass; static build produces 125 pages including the unchanged 15 unadvertised Slovenian drafts and 404. The combined 43-test EN/HR/DE/legal-marker selection passes after correcting two EN-specific test expectations and rerunning an interrupted dev-server HR navigation. Additional German logo regression and English logo/form/switch checks pass. All 27 EN pages were visually inspected at 390 and 1440 px, with 82 captured hero/body views and the 1200 px navigation boundary: no console errors, document overflow or heading overflow. Source DOCX SHA-256 and Git LFS integrity pass. QA screenshots remain in `/tmp`, outside the build.
