# Missing data and exact recovery steps

This is a source handoff, not a claim of finished browser equivalence. Unknown values are null with a reason. Action-level errors and successful retry evidence are recorded in `raw/access-outcomes.json`.

## Native styles

Native responsive/state reader unavailable; published responsive CSS fully retained. Evidence: `raw/mcp/styles-detail.json`.

## Breakpoint conditions

Native authoring IDs unavailable; all captured CSS and JS media rules retained. Evidence: `breakpoints.json`.

## Fonts

Exact registry, CSS and downloaded font files; browser-selected subset and license audit not performed. Evidence: `typography.json`.

## Interaction target mapping

82 configurations have no static target; dynamic/computed activation needs browser comparison. Evidence: `interaction-targets.csv`.

## Independent interaction recipes

No identical-reproduction readiness claim; exact raw params and derived scroll/smoothing formulas retained; computed outcomes and widget defaults need validation. Evidence: `interaction-recipes.json`.

## CMS schema/items

Read action schema unavailable. Evidence: `cms.json`.

## Existing redirects

Enterprise-only endpoint. Evidence: `existing-redirects.csv`.

## Utility/404 Designer records

Not exposed by available page inventory. Evidence: `pages.json`.

## Standard Webflow ZIP comparison

No standard Webflow export ZIP supplied. Evidence: `missing-data.md`.

## Browser visual/keyboard measurement

User assigns this to Codespaces agent. Evidence: `accessibility-findings.md`.

## Recovery

1. Connect Designer read capabilities or provide a native export for unavailable authoring breakpoint/state IDs, utility pages and interaction graph. Do not change primary locale.
2. Provide CMS read access or user-exported collection definitions and CSVs with locale IDs and references. An inaccessible endpoint does not prove no CMS exists.
3. Provide existing redirect settings export or a read-capable Enterprise endpoint. Do not create guessed redirects.
4. In Codespaces compare every breakpoint B-1/B/B+1, source initial/active/reverse states, fast scrolling, repeated clicks, resize, reduced motion, no-JS and keyboard/focus behavior. Preserve exact source formulas instead of generic thresholds.
5. Supply the original Webflow export under `source-assets/webflow-export/2026-09-07/`; compare it against this manifest. This handoff belongs under `reference/webflow-handoff/2026-09-07/`.
6. Croatian is not missing from an existing new locale: the user confirmed it has not yet been authored. Build it later; do not import old /hr as completed new content.

## Standard export scope

No standard ZIP was received, so its actual contents are unverified. Do not assume it contains localization data, CMS schema/items, native variable/component metadata, redirects, form backend configuration, externally hosted resources, registered-but-unused scripts, or all master originals. Compare the delivered handoff against an actual standard export before stating specific files are missing.



## Public sitemap endpoint

`not-present` at https://dentvitalis33.webflow.io/sitemap.xml (HTTP 404). This is separate from unavailable authoring sitemap settings (403). Legacy production sitemap was retrieved for URL context; legacy robots URL returned 404. Exact HTTP evidence is retained in raw status records.

