# DentVitalis Webflow Source Handoff

Snapshot `dentvitalis-20260907T072711Z`. Project **Dentvitalis33**, site `695e1eeeb10c5fb8eeaba87d`, verified against **https://dentvitalis33.webflow.io/**.

Extraction: **2026-09-07T09:27:11+02:00 to 2026-09-07T10:20:14.554714+02:00**, Europe/Zagreb. Read-only. No Webflow changes or publishing; no forms submitted or patient submissions accessed.

## Start Here

1. Read `manifest.json`, `coverage.csv` and `missing-data.md` before implementation.
2. Use `content/it.json` and native page/component trees as current source; published HTML/CSS/JS are separately labelled visual-reference sources.
3. Use `variables.raw.json`, `typography.json`, `breakpoints.json`, `navigation-declarations.json` and `styles-and-cascade.json` for exact original names, units, selectors and ordered overrides.
4. Read `interactions-summary.md`, then `interaction-recipes.json`, `interaction-targets.csv` and `interaction-parameters.csv`. Do not apply page-specific fade overrides to Home.
5. Compare the new Astro implementation in the browser. This task intentionally did not perform screenshots, computed measurements or implementation.

## Scope

- 28 current Italian pages; all page-content pagination, all 28 page trees and 28 component trees captured.
- 11 native variables; 454 native base styles; 1665 distinct source CSS rules plus inline styles.
- 238 registered project assets, all 238 public master files included. Exact responsive derivatives and other-project/external resources are listed separately; do not assume those are all physically included.
- 276 IX2 events and 14 action lists. 194 events have static published targets; 82 have none. These counts describe source configuration, not confirmed active effects.
- 18 unique custom inline scripts; 18 CSS effect rules; 3 unique keyframes; 139 widget/media instances; 15 before/after comparisons. 465 source-linked recipe records include an explicit sticky-CTA timeline.
- Original scroll offset formulas and per-frame smoothing semantics were derived from exact captured runtime excerpts. No invented IntersectionObserver threshold or duration is substituted.
- Webflow runtime files are evidence only, not a requirement for the new Astro site.

## Languages

**Croatian has not been created yet.** The user explicitly corrected the initial request. `content/hr.json` records `not-present`, not a completed empty translation. Existing HR/DE/EN/SI links point to the old production website. Do not import those as the completed new content.

Planned paths: Italian `/`, Croatian `/hr`, German `/de`, English `/en`, Slovenian `/si` with language/hreflang `sl`.

## Font and Responsive Evidence

WebFont requests **Montserrat** and **Inter Tight** with the exact weights/styles in `typography.json`. The registry also contains the original custom family **3 B 19 Cb 4818 Cacb 8 C 8 A 21515464 Fc 1167**. Webflow icon font is embedded in CSS. Declared system/generic fallbacks are preserved, not substituted.

Discovered CSS/JS width boundaries: **359, 479, 767, 768, 991, 992, 1280, 1440, 1920 CSS px**. Exact min/max conditions, media order, reduced-motion rules and IX2 media keys are in `breakpoints.json`. Test B-1/B/B+1; do not collapse distinct source conditions.

## Source Consistency

No source metadata change was detected during extraction. All 28 public HTML pages and 9 external script/style resources had unchanged hashes at recheck. All 86 checked current custom-code blocks match published HTML after newline normalization.

The site last-updated timestamp is slightly later than last publication. No unpublished divergence was established by those checks, but unavailable Designer settings/interaction authoring state cannot be declared identical. Native and public sources are kept separate.

## Explicit Gaps

CMS collection schema/items, native utility-page inventory, authoring breakpoint/state IDs, unpublished interaction graph, and existing redirect settings are not available through the current approved read interfaces. Exact evidence and recovery steps are in `missing-data.md`. Registered-but-not-applied code is separately listed; registered does not mean active.

No standard Webflow export ZIP was supplied. Its contents have not been compared with this handoff. Localization, CMS, native metadata, external resources, redirects and form backends must not be assumed to be covered by that future ZIP.

## Placement and Integrity

Upload this package under `reference/webflow-handoff/2026-09-07/`. Keep the future original Webflow ZIP under `source-assets/webflow-export/2026-09-07/`. This task did not modify that repository.

All JSON is parsed during final checks; CSV uses UTF-8 and escaped cells; original text, nonbreaking spaces and manual line breaks are retained. `manifest.json` lists file sizes and SHA-256 hashes. `validation.json` records structural checks. ZIP contents are then checked against every manifest hash.

