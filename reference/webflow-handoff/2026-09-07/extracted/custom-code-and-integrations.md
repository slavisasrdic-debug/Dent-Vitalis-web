# Custom code and integrations

Read-only extraction. No forms submitted, no patient data read. Exact head/footer/page blocks: `raw/mcp/site-code.json`, `raw/mcp/all-page-code.json`. Localized reads used primary Italian locale ID. No secondary locale exists. Source script order/async/defer/module attributes: `pages.json` and `raw/published/pages.json`.

## Scripts and styles

- `raw/published/resources/2ae2f8951fc8-dentvitalis33.shared.f8a4284a1.css`: https://cdn.prod.website-files.com/695e1eeeb10c5fb8eeaba87d/css/dentvitalis33.shared.f8a4284a1.css (extracted).
- `raw/published/resources/012e56dad079-webfont.js`: https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js (extracted).
- `raw/published/resources/fe9250a476b2-jquery-3.5.1.min.dc5e7f18c8.js`: https://d3e54v103j8qbb.cloudfront.net/js/jquery-3.5.1.min.dc5e7f18c8.js?site=695e1eeeb10c5fb8eeaba87d (extracted).
- `raw/published/resources/f371fe00363e-dentvitalis33.schunk.36b8fb49256177c8.js`: https://cdn.prod.website-files.com/695e1eeeb10c5fb8eeaba87d/js/dentvitalis33.schunk.36b8fb49256177c8.js (extracted).
- `raw/published/resources/03c1fa8b77cf-dentvitalis33.schunk.6ecbf8a934abc739.js`: https://cdn.prod.website-files.com/695e1eeeb10c5fb8eeaba87d/js/dentvitalis33.schunk.6ecbf8a934abc739.js (extracted).
- `raw/published/resources/c130e984d36e-dentvitalis33.23e6bee8.86c7244e98bc98ff.js`: https://cdn.prod.website-files.com/695e1eeeb10c5fb8eeaba87d/js/dentvitalis33.23e6bee8.86c7244e98bc98ff.js (extracted).
- `raw/published/resources/99424c93bbfe-typed.min.js`: https://cdnjs.cloudflare.com/ajax/libs/typed.js/2.0.10/typed.min.js (extracted).
- `raw/published/resources/257db839790f-before-after-slider.min.js`: https://cdn.jsdelivr.net/npm/@flowbase-co/boosters-before-after-slider@1.0.1/dist/before-after-slider.min.js (extracted).
- `raw/published/resources/b164419c10dd-dentvitalis33.d85bd56a.9afbf81cf71e5adc.js`: https://cdn.prod.website-files.com/695e1eeeb10c5fb8eeaba87d/js/dentvitalis33.d85bd56a.9afbf81cf71e5adc.js (extracted).

## Registered scripts

Registry inventory and site/page application read outcomes: `raw/mcp/registered-applied-scripts-read.json`. Registered does not mean applied. A 404 for the custom-code block is preserved separately from freeform head/footer code that is present.

## Runtime responsibilities

- Webflow IX2/widget runtime is included solely as source evidence, not required for the Astro implementation.
- Shared form factory and modal behavior, hidden source fields, file validation, privacy links and source attribution are in `forms.json`. Public submission endpoint/configuration is source, not proof of backend delivery.
- WhatsApp, phone/email, YouTube/video, lightboxes, before/after library and maps: exact URLs/parameters and usage in `videos-and-embeds.json`, `asset-instance-usage.json`, `pages.json`.
- Typed.js options and only-if-target-exists guards are recorded; do not assume all loaded scripts produce visible effects.
- Google/WebFont font loader and exact CSS/font files are retained in `typography.json`.
- Analytics IDs and consent-related site settings come from the current site record. No new tracking integration is proposed as existing.

## Independent implementation proposal

`proposed`: replace Webflow runtime with scoped native controllers and semantic components only after applying the exact source timings, media conditions and target relationships. Form backend and consent behavior need explicit deployment configuration; never copy private credentials into source.
