# Interactions: source parameters and page/element map

`extracted` = source configuration. `derived` = static DOM target matching or stated formula conversion. No browser/computed state was measured in this task.
IX2: 276 events, 14 action lists. 194 events have static DOM matches; 82 do not. Also 18 unique inline scripts, 18 CSS animation/transition rules, 3 unique keyframes, 139 widget/media instances.

## Reading the handoff

- `interaction-targets.csv`: one page/element/role occurrence per row; source selector and native identity evidence where available.
- `interaction-recipes.json`: every IX2 event, custom script, CSS effect and widget/media occurrence. Exact event delay is separate from timeline offsets.
- `interactions.json`: complete raw action lists and event configs, keyframes and attributes. All units, easing, stop links and continuous keyframes remain intact.
- `raw/published/custom-script-analysis.json`: original expressions, assignments, listeners and named functions with source ranges. Runtime expressions were not executed.
- Static matches do not prove visibility or activation. CSS `!important`, page-specific custom controllers, responsive visibility, removed `data-w-id`, and dynamic DOM changes can override native effects.
- Missing runtime defaults, browser equivalence of extracted IX2 scroll formulas/smoothing, rapid-scroll interruption, focus tests and no-JS computed results remain explicit Codespaces checks. No guessed thresholds or timings.

## Page-specific fade controllers

Home uses native scroll action lists; the shared directory override is guarded to the three directory pages; do not apply the directory page override globally. Su di noi and Informazioni use viewport midpoint checks in their page scripts. Prestazioni uses a 24px card-top check. Opacity is 600ms and transform is 900ms, both cubic-bezier(0.45, 0, 0.55, 1), in those three page scripts. Shared scripts may run first and also write to the same targets; preserve load order and inspect both before choosing the final Astro controller.

## Native events by page

### /condizioni-di-utilizzo

| Event | Action list | Trigger target | Source trigger parameters | Media |
|---|---|---|---|---|
| e-15 | a-2 | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846<br>wf:31ceb2a2-0ab3-5832-6e6c-056646482e59<br>wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-34 | a | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846<br>wf:31ceb2a2-0ab3-5832-6e6c-056646482e59<br>wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-37 | a | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-38 | a-2 | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-39 | a | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-40 | a-4 | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-117 | a-8 | wf:511a527c-0818-f243-94fb-c91d2b84e762 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-118 | a-9 | wf:511a527c-0818-f243-94fb-c91d2b84e762 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-119 | a-9 | wf:511a527c-0818-f243-94fb-c91d2b84e753 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-121 | growIn | dom:body:nth-of-type(1)>section:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1) | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":200,"direction":null,"effectIn":true} | main, medium, small, tiny |
| e-131 | a-11 | wf:1b710e68-38ef-1a3b-db46-5efe98f74eeb | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-137 | a-11 | wf:15ecb568-2be4-e312-298d-bf6af4efc643 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-194 | slideInBottom | wf:b3f8e1d2-757e-d6a0-6dbb-b11ab1a23dd0 | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":400,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-196 | slideInBottom | wf:b3f8e1d2-757e-d6a0-6dbb-b11ab1a23dca | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-200 | slideInBottom | wf:b3f8e1d2-757e-d6a0-6dbb-b11ab1a23dcc | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-208 | growIn | dom:body:nth-of-type(1)>section:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(2)>div:nth-of-type(2)>form:nth-of-type(1)>div:nth-of-type(4)>a:nth-of-type(1) | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":600,"direction":null,"effectIn":true} | main, medium, small, tiny |
| e-226 | slideInBottom | dom:body:nth-of-type(1)>section:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1) | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-320 | a | wf:31ceb2a2-0ab3-5832-6e6c-056646482e59 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-321 | a-4 | wf:31ceb2a2-0ab3-5832-6e6c-056646482e59 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-322 | a | wf:31ceb2a2-0ab3-5832-6e6c-056646482e59 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-323 | a-2 | wf:31ceb2a2-0ab3-5832-6e6c-056646482e59 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-324 | a | wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-325 | a-4 | wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-326 | a | wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-327 | a-2 | wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-421 | slideInBottom | dom:body:nth-of-type(1)>div:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(2)>a:nth-of-type(1)<br>dom:body:nth-of-type(1)>div:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(2)>a:nth-of-type(2) | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-927 | growIn | dom:body:nth-of-type(1)>section:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(2)>div:nth-of-type(2)>form:nth-of-type(1)>div:nth-of-type(4)>a:nth-of-type(1) | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":600,"direction":null,"effectIn":true} | main, medium, small, tiny |

### /informativa-sulla-privacy

| Event | Action list | Trigger target | Source trigger parameters | Media |
|---|---|---|---|---|
| e-15 | a-2 | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846<br>wf:31ceb2a2-0ab3-5832-6e6c-056646482e59<br>wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-34 | a | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846<br>wf:31ceb2a2-0ab3-5832-6e6c-056646482e59<br>wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-37 | a | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-38 | a-2 | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-39 | a | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-40 | a-4 | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-117 | a-8 | wf:511a527c-0818-f243-94fb-c91d2b84e762 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-118 | a-9 | wf:511a527c-0818-f243-94fb-c91d2b84e762 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-119 | a-9 | wf:511a527c-0818-f243-94fb-c91d2b84e753 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-121 | growIn | dom:body:nth-of-type(1)>section:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1) | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":200,"direction":null,"effectIn":true} | main, medium, small, tiny |
| e-131 | a-11 | wf:1b710e68-38ef-1a3b-db46-5efe98f74eeb | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-137 | a-11 | wf:15ecb568-2be4-e312-298d-bf6af4efc643 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-194 | slideInBottom | wf:b3f8e1d2-757e-d6a0-6dbb-b11ab1a23dd0 | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":400,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-196 | slideInBottom | wf:b3f8e1d2-757e-d6a0-6dbb-b11ab1a23dca | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-200 | slideInBottom | wf:b3f8e1d2-757e-d6a0-6dbb-b11ab1a23dcc | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-208 | growIn | dom:body:nth-of-type(1)>section:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(2)>div:nth-of-type(2)>form:nth-of-type(1)>div:nth-of-type(4)>a:nth-of-type(1) | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":600,"direction":null,"effectIn":true} | main, medium, small, tiny |
| e-226 | slideInBottom | dom:body:nth-of-type(1)>section:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1) | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-320 | a | wf:31ceb2a2-0ab3-5832-6e6c-056646482e59 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-321 | a-4 | wf:31ceb2a2-0ab3-5832-6e6c-056646482e59 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-322 | a | wf:31ceb2a2-0ab3-5832-6e6c-056646482e59 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-323 | a-2 | wf:31ceb2a2-0ab3-5832-6e6c-056646482e59 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-324 | a | wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-325 | a-4 | wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-326 | a | wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-327 | a-2 | wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-421 | slideInBottom | dom:body:nth-of-type(1)>div:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(2)>a:nth-of-type(1)<br>dom:body:nth-of-type(1)>div:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(2)>a:nth-of-type(2) | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-927 | growIn | dom:body:nth-of-type(1)>section:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(2)>div:nth-of-type(2)>form:nth-of-type(1)>div:nth-of-type(4)>a:nth-of-type(1) | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":600,"direction":null,"effectIn":true} | main, medium, small, tiny |

### /informazioni-per-pazienti

| Event | Action list | Trigger target | Source trigger parameters | Media |
|---|---|---|---|---|
| e-15 | a-2 | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846<br>wf:31ceb2a2-0ab3-5832-6e6c-056646482e59<br>wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-34 | a | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846<br>wf:31ceb2a2-0ab3-5832-6e6c-056646482e59<br>wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-37 | a | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-38 | a-2 | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-39 | a | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-40 | a-4 | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-117 | a-8 | wf:511a527c-0818-f243-94fb-c91d2b84e762 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-118 | a-9 | wf:511a527c-0818-f243-94fb-c91d2b84e762 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-119 | a-9 | wf:511a527c-0818-f243-94fb-c91d2b84e753 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-121 | growIn | dom:body:nth-of-type(1)>section:nth-of-type(2)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1) | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":200,"direction":null,"effectIn":true} | main, medium, small, tiny |
| e-131 | a-11 | wf:1b710e68-38ef-1a3b-db46-5efe98f74eeb | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-137 | a-11 | wf:15ecb568-2be4-e312-298d-bf6af4efc643 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-194 | slideInBottom | wf:b3f8e1d2-757e-d6a0-6dbb-b11ab1a23dd0 | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":400,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-196 | slideInBottom | wf:b3f8e1d2-757e-d6a0-6dbb-b11ab1a23dca | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-200 | slideInBottom | wf:b3f8e1d2-757e-d6a0-6dbb-b11ab1a23dcc | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-208 | growIn | dom:body:nth-of-type(1)>section:nth-of-type(2)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(2)>div:nth-of-type(2)>form:nth-of-type(1)>div:nth-of-type(4)>a:nth-of-type(1) | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":600,"direction":null,"effectIn":true} | main, medium, small, tiny |
| e-226 | slideInBottom | dom:body:nth-of-type(1)>section:nth-of-type(2)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1) | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-320 | a | wf:31ceb2a2-0ab3-5832-6e6c-056646482e59 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-321 | a-4 | wf:31ceb2a2-0ab3-5832-6e6c-056646482e59 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-322 | a | wf:31ceb2a2-0ab3-5832-6e6c-056646482e59 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-323 | a-2 | wf:31ceb2a2-0ab3-5832-6e6c-056646482e59 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-324 | a | wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-325 | a-4 | wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-326 | a | wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-327 | a-2 | wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-927 | growIn | dom:body:nth-of-type(1)>section:nth-of-type(2)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(2)>div:nth-of-type(2)>form:nth-of-type(1)>div:nth-of-type(4)>a:nth-of-type(1) | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":600,"direction":null,"effectIn":true} | main, medium, small, tiny |
| e-1116 | slideInBottom | dom:body:nth-of-type(1)>section:nth-of-type(1)>div:nth-of-type(2)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(2)<br>dom:body:nth-of-type(1)>section:nth-of-type(1)>div:nth-of-type(2)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(2)>div:nth-of-type(2)<br>dom:body:nth-of-type(1)>section:nth-of-type(1)>div:nth-of-type(2)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(3)>div:nth-of-type(2)<br>dom:body:nth-of-type(1)>section:nth-of-type(1)>div:nth-of-type(2)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(4)>div:nth-of-type(2)<br>dom:body:nth-of-type(1)>section:nth-of-type(1)>div:nth-of-type(2)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(5)>div:nth-of-type(2)<br>dom:body:nth-of-type(1)>section:nth-of-type(1)>div:nth-of-type(2)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(6)>div:nth-of-type(2)<br>dom:body:nth-of-type(1)>section:nth-of-type(1)>div:nth-of-type(2)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(7)>div:nth-of-type(2) | {"loop":false,"playInReverse":false,"scrollOffsetValue":15,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | medium, small, tiny |

### /chi-siamo

| Event | Action list | Trigger target | Source trigger parameters | Media |
|---|---|---|---|---|
| e-15 | a-2 | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846<br>wf:31ceb2a2-0ab3-5832-6e6c-056646482e59<br>wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-34 | a | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846<br>wf:31ceb2a2-0ab3-5832-6e6c-056646482e59<br>wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-37 | a | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-38 | a-2 | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-39 | a | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-40 | a-4 | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-117 | a-8 | wf:511a527c-0818-f243-94fb-c91d2b84e762 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-118 | a-9 | wf:511a527c-0818-f243-94fb-c91d2b84e762 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-119 | a-9 | wf:511a527c-0818-f243-94fb-c91d2b84e753 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-121 | growIn | dom:body:nth-of-type(1)>section:nth-of-type(2)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1) | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":200,"direction":null,"effectIn":true} | main, medium, small, tiny |
| e-131 | a-11 | wf:1b710e68-38ef-1a3b-db46-5efe98f74eeb | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-137 | a-11 | wf:15ecb568-2be4-e312-298d-bf6af4efc643 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-194 | slideInBottom | wf:b3f8e1d2-757e-d6a0-6dbb-b11ab1a23dd0 | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":400,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-196 | slideInBottom | wf:b3f8e1d2-757e-d6a0-6dbb-b11ab1a23dca | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-200 | slideInBottom | wf:b3f8e1d2-757e-d6a0-6dbb-b11ab1a23dcc | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-208 | growIn | dom:body:nth-of-type(1)>section:nth-of-type(2)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(2)>div:nth-of-type(2)>form:nth-of-type(1)>div:nth-of-type(4)>a:nth-of-type(1) | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":600,"direction":null,"effectIn":true} | main, medium, small, tiny |
| e-226 | slideInBottom | dom:body:nth-of-type(1)>section:nth-of-type(2)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1) | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-320 | a | wf:31ceb2a2-0ab3-5832-6e6c-056646482e59 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-321 | a-4 | wf:31ceb2a2-0ab3-5832-6e6c-056646482e59 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-322 | a | wf:31ceb2a2-0ab3-5832-6e6c-056646482e59 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-323 | a-2 | wf:31ceb2a2-0ab3-5832-6e6c-056646482e59 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-324 | a | wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-325 | a-4 | wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-326 | a | wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-327 | a-2 | wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-927 | growIn | dom:body:nth-of-type(1)>section:nth-of-type(2)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(2)>div:nth-of-type(2)>form:nth-of-type(1)>div:nth-of-type(4)>a:nth-of-type(1) | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":600,"direction":null,"effectIn":true} | main, medium, small, tiny |
| e-1116 | slideInBottom | dom:body:nth-of-type(1)>section:nth-of-type(1)>div:nth-of-type(2)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(2)<br>dom:body:nth-of-type(1)>section:nth-of-type(1)>div:nth-of-type(2)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(2)>div:nth-of-type(2)<br>dom:body:nth-of-type(1)>section:nth-of-type(1)>div:nth-of-type(2)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(3)>div:nth-of-type(2)<br>dom:body:nth-of-type(1)>section:nth-of-type(1)>div:nth-of-type(2)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(4)>div:nth-of-type(2)<br>dom:body:nth-of-type(1)>section:nth-of-type(1)>div:nth-of-type(2)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(5)>div:nth-of-type(2)<br>dom:body:nth-of-type(1)>section:nth-of-type(1)>div:nth-of-type(2)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(6)>div:nth-of-type(2) | {"loop":false,"playInReverse":false,"scrollOffsetValue":15,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | medium, small, tiny |

### /prestazioni-dentali

| Event | Action list | Trigger target | Source trigger parameters | Media |
|---|---|---|---|---|
| e-15 | a-2 | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846<br>wf:31ceb2a2-0ab3-5832-6e6c-056646482e59<br>wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-34 | a | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846<br>wf:31ceb2a2-0ab3-5832-6e6c-056646482e59<br>wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-37 | a | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-38 | a-2 | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-39 | a | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-40 | a-4 | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-117 | a-8 | wf:511a527c-0818-f243-94fb-c91d2b84e762 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-118 | a-9 | wf:511a527c-0818-f243-94fb-c91d2b84e762 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-119 | a-9 | wf:511a527c-0818-f243-94fb-c91d2b84e753 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-121 | growIn | dom:body:nth-of-type(1)>section:nth-of-type(2)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1) | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":200,"direction":null,"effectIn":true} | main, medium, small, tiny |
| e-131 | a-11 | wf:1b710e68-38ef-1a3b-db46-5efe98f74eeb | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-137 | a-11 | wf:15ecb568-2be4-e312-298d-bf6af4efc643 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-194 | slideInBottom | wf:b3f8e1d2-757e-d6a0-6dbb-b11ab1a23dd0 | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":400,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-196 | slideInBottom | wf:b3f8e1d2-757e-d6a0-6dbb-b11ab1a23dca | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-200 | slideInBottom | wf:b3f8e1d2-757e-d6a0-6dbb-b11ab1a23dcc | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-208 | growIn | dom:body:nth-of-type(1)>section:nth-of-type(2)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(2)>div:nth-of-type(2)>form:nth-of-type(1)>div:nth-of-type(4)>a:nth-of-type(1) | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":600,"direction":null,"effectIn":true} | main, medium, small, tiny |
| e-226 | slideInBottom | dom:body:nth-of-type(1)>section:nth-of-type(2)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1) | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-320 | a | wf:31ceb2a2-0ab3-5832-6e6c-056646482e59 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-321 | a-4 | wf:31ceb2a2-0ab3-5832-6e6c-056646482e59 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-322 | a | wf:31ceb2a2-0ab3-5832-6e6c-056646482e59 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-323 | a-2 | wf:31ceb2a2-0ab3-5832-6e6c-056646482e59 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-324 | a | wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-325 | a-4 | wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-326 | a | wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-327 | a-2 | wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-927 | growIn | dom:body:nth-of-type(1)>section:nth-of-type(2)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(2)>div:nth-of-type(2)>form:nth-of-type(1)>div:nth-of-type(4)>a:nth-of-type(1) | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":600,"direction":null,"effectIn":true} | main, medium, small, tiny |
| e-1116 | slideInBottom | dom:body:nth-of-type(1)>section:nth-of-type(1)>div:nth-of-type(2)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(2)<br>dom:body:nth-of-type(1)>section:nth-of-type(1)>div:nth-of-type(2)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(2)>div:nth-of-type(2)<br>dom:body:nth-of-type(1)>section:nth-of-type(1)>div:nth-of-type(2)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(3)>div:nth-of-type(2)<br>dom:body:nth-of-type(1)>section:nth-of-type(1)>div:nth-of-type(2)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(4)>div:nth-of-type(2)<br>dom:body:nth-of-type(1)>section:nth-of-type(1)>div:nth-of-type(2)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(5)>div:nth-of-type(2) | {"loop":false,"playInReverse":false,"scrollOffsetValue":15,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | medium, small, tiny |

### /informazioni/trasporto

| Event | Action list | Trigger target | Source trigger parameters | Media |
|---|---|---|---|---|
| e-15 | a-2 | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846<br>wf:31ceb2a2-0ab3-5832-6e6c-056646482e59<br>wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-34 | a | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846<br>wf:31ceb2a2-0ab3-5832-6e6c-056646482e59<br>wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-37 | a | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-38 | a-2 | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-39 | a | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-40 | a-4 | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-117 | a-8 | wf:511a527c-0818-f243-94fb-c91d2b84e762 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-118 | a-9 | wf:511a527c-0818-f243-94fb-c91d2b84e762 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-119 | a-9 | wf:511a527c-0818-f243-94fb-c91d2b84e753 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-121 | growIn | dom:body:nth-of-type(1)>section:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1) | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":200,"direction":null,"effectIn":true} | main, medium, small, tiny |
| e-131 | a-11 | wf:1b710e68-38ef-1a3b-db46-5efe98f74eeb | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-137 | a-11 | wf:15ecb568-2be4-e312-298d-bf6af4efc643 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-194 | slideInBottom | wf:b3f8e1d2-757e-d6a0-6dbb-b11ab1a23dd0 | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":400,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-196 | slideInBottom | wf:b3f8e1d2-757e-d6a0-6dbb-b11ab1a23dca | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-200 | slideInBottom | wf:b3f8e1d2-757e-d6a0-6dbb-b11ab1a23dcc | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-208 | growIn | dom:body:nth-of-type(1)>section:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(2)>div:nth-of-type(2)>form:nth-of-type(1)>div:nth-of-type(4)>a:nth-of-type(1) | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":600,"direction":null,"effectIn":true} | main, medium, small, tiny |
| e-226 | slideInBottom | dom:body:nth-of-type(1)>section:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1) | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-320 | a | wf:31ceb2a2-0ab3-5832-6e6c-056646482e59 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-321 | a-4 | wf:31ceb2a2-0ab3-5832-6e6c-056646482e59 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-322 | a | wf:31ceb2a2-0ab3-5832-6e6c-056646482e59 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-323 | a-2 | wf:31ceb2a2-0ab3-5832-6e6c-056646482e59 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-324 | a | wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-325 | a-4 | wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-326 | a | wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-327 | a-2 | wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-421 | slideInBottom | dom:body:nth-of-type(1)>div:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(1)>a:nth-of-type(1)<br>dom:body:nth-of-type(1)>div:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(1)>a:nth-of-type(2)<br>dom:body:nth-of-type(1)>div:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(1)>a:nth-of-type(3)<br>dom:body:nth-of-type(1)>div:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(1)>a:nth-of-type(4)<br>dom:body:nth-of-type(1)>div:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(1)>a:nth-of-type(5)<br>dom:body:nth-of-type(1)>div:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(1)>a:nth-of-type(6)<br>dom:body:nth-of-type(1)>div:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(1)>a:nth-of-type(7) | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-749 | slideInBottom | wf:01415f8e-f1dc-065f-6696-5928ab24121b | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":1000,"direction":"BOTTOM","effectIn":true} | main |
| e-927 | growIn | dom:body:nth-of-type(1)>section:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(2)>div:nth-of-type(2)>form:nth-of-type(1)>div:nth-of-type(4)>a:nth-of-type(1) | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":600,"direction":null,"effectIn":true} | main, medium, small, tiny |
| e-1110 | slideInBottom | wf:ceaf9077-2c86-156e-5eed-f59a10b94659 | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":400,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-1112 | slideInBottom | wf:ceaf9077-2c86-156e-5eed-f59a10b9465b | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":600,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-1114 | fadeIn | wf:ceaf9077-2c86-156e-5eed-f59a10b9464f | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":200,"direction":null,"effectIn":true} | main, medium, small, tiny |

### /informazioni/alloggio

| Event | Action list | Trigger target | Source trigger parameters | Media |
|---|---|---|---|---|
| e-15 | a-2 | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846<br>wf:31ceb2a2-0ab3-5832-6e6c-056646482e59<br>wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-34 | a | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846<br>wf:31ceb2a2-0ab3-5832-6e6c-056646482e59<br>wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-37 | a | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-38 | a-2 | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-39 | a | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-40 | a-4 | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-117 | a-8 | wf:511a527c-0818-f243-94fb-c91d2b84e762 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-118 | a-9 | wf:511a527c-0818-f243-94fb-c91d2b84e762 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-119 | a-9 | wf:511a527c-0818-f243-94fb-c91d2b84e753 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-121 | growIn | dom:body:nth-of-type(1)>section:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1) | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":200,"direction":null,"effectIn":true} | main, medium, small, tiny |
| e-131 | a-11 | wf:1b710e68-38ef-1a3b-db46-5efe98f74eeb | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-137 | a-11 | wf:15ecb568-2be4-e312-298d-bf6af4efc643 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-194 | slideInBottom | wf:b3f8e1d2-757e-d6a0-6dbb-b11ab1a23dd0 | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":400,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-196 | slideInBottom | wf:b3f8e1d2-757e-d6a0-6dbb-b11ab1a23dca | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-200 | slideInBottom | wf:b3f8e1d2-757e-d6a0-6dbb-b11ab1a23dcc | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-208 | growIn | dom:body:nth-of-type(1)>section:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(2)>div:nth-of-type(2)>form:nth-of-type(1)>div:nth-of-type(4)>a:nth-of-type(1) | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":600,"direction":null,"effectIn":true} | main, medium, small, tiny |
| e-226 | slideInBottom | dom:body:nth-of-type(1)>section:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1) | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-320 | a | wf:31ceb2a2-0ab3-5832-6e6c-056646482e59 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-321 | a-4 | wf:31ceb2a2-0ab3-5832-6e6c-056646482e59 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-322 | a | wf:31ceb2a2-0ab3-5832-6e6c-056646482e59 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-323 | a-2 | wf:31ceb2a2-0ab3-5832-6e6c-056646482e59 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-324 | a | wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-325 | a-4 | wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-326 | a | wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-327 | a-2 | wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-421 | slideInBottom | dom:body:nth-of-type(1)>div:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(1)>a:nth-of-type(1)<br>dom:body:nth-of-type(1)>div:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(1)>a:nth-of-type(2)<br>dom:body:nth-of-type(1)>div:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(1)>a:nth-of-type(3)<br>dom:body:nth-of-type(1)>div:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(1)>a:nth-of-type(4)<br>dom:body:nth-of-type(1)>div:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(1)>a:nth-of-type(5)<br>dom:body:nth-of-type(1)>div:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(1)>a:nth-of-type(6)<br>dom:body:nth-of-type(1)>div:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(1)>a:nth-of-type(7) | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-749 | slideInBottom | wf:01415f8e-f1dc-065f-6696-5928ab24121b | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":1000,"direction":"BOTTOM","effectIn":true} | main |
| e-927 | growIn | dom:body:nth-of-type(1)>section:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(2)>div:nth-of-type(2)>form:nth-of-type(1)>div:nth-of-type(4)>a:nth-of-type(1) | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":600,"direction":null,"effectIn":true} | main, medium, small, tiny |
| e-1098 | slideInBottom | wf:ceaf9077-2c86-156e-5eed-f59a10b94659 | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":400,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-1100 | slideInBottom | wf:ceaf9077-2c86-156e-5eed-f59a10b9465b | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":600,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-1102 | fadeIn | wf:ceaf9077-2c86-156e-5eed-f59a10b9464f | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":200,"direction":null,"effectIn":true} | main, medium, small, tiny |

### /testimonianze

| Event | Action list | Trigger target | Source trigger parameters | Media |
|---|---|---|---|---|
| e-15 | a-2 | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846<br>wf:31ceb2a2-0ab3-5832-6e6c-056646482e59<br>wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-34 | a | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846<br>wf:31ceb2a2-0ab3-5832-6e6c-056646482e59<br>wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-37 | a | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-38 | a-2 | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-39 | a | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-40 | a-4 | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-117 | a-8 | wf:511a527c-0818-f243-94fb-c91d2b84e762 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-118 | a-9 | wf:511a527c-0818-f243-94fb-c91d2b84e762 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-119 | a-9 | wf:511a527c-0818-f243-94fb-c91d2b84e753 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-121 | growIn | dom:body:nth-of-type(1)>section:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1) | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":200,"direction":null,"effectIn":true} | main, medium, small, tiny |
| e-131 | a-11 | wf:1b710e68-38ef-1a3b-db46-5efe98f74eeb | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-137 | a-11 | wf:15ecb568-2be4-e312-298d-bf6af4efc643 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-194 | slideInBottom | wf:b3f8e1d2-757e-d6a0-6dbb-b11ab1a23dd0 | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":400,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-196 | slideInBottom | wf:b3f8e1d2-757e-d6a0-6dbb-b11ab1a23dca | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-200 | slideInBottom | wf:b3f8e1d2-757e-d6a0-6dbb-b11ab1a23dcc | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-208 | growIn | dom:body:nth-of-type(1)>section:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(2)>div:nth-of-type(2)>form:nth-of-type(1)>div:nth-of-type(4)>a:nth-of-type(1) | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":600,"direction":null,"effectIn":true} | main, medium, small, tiny |
| e-226 | slideInBottom | dom:body:nth-of-type(1)>section:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1) | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-320 | a | wf:31ceb2a2-0ab3-5832-6e6c-056646482e59 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-321 | a-4 | wf:31ceb2a2-0ab3-5832-6e6c-056646482e59 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-322 | a | wf:31ceb2a2-0ab3-5832-6e6c-056646482e59 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-323 | a-2 | wf:31ceb2a2-0ab3-5832-6e6c-056646482e59 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-324 | a | wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-325 | a-4 | wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-326 | a | wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-327 | a-2 | wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-421 | slideInBottom | dom:body:nth-of-type(1)>div:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(1)>a:nth-of-type(1)<br>dom:body:nth-of-type(1)>div:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(1)>a:nth-of-type(2)<br>dom:body:nth-of-type(1)>div:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(1)>a:nth-of-type(3) | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-927 | growIn | dom:body:nth-of-type(1)>section:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(2)>div:nth-of-type(2)>form:nth-of-type(1)>div:nth-of-type(4)>a:nth-of-type(1) | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":600,"direction":null,"effectIn":true} | main, medium, small, tiny |
| e-1066 | slideInBottom | wf:01415f8e-f1dc-065f-6696-5928ab24123a | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":1000,"direction":"BOTTOM","effectIn":true} | main |
| e-1068 | slideInBottom | wf:fd0dd5f7-eaa7-0dfe-a44f-83835a842031 | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":400,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-1070 | slideInBottom | wf:fd0dd5f7-eaa7-0dfe-a44f-83835a842033 | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":600,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-1072 | fadeIn | wf:fd0dd5f7-eaa7-0dfe-a44f-83835a842027 | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":200,"direction":null,"effectIn":true} | main, medium, small, tiny |

### /contatti

| Event | Action list | Trigger target | Source trigger parameters | Media |
|---|---|---|---|---|
| e-15 | a-2 | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846<br>wf:31ceb2a2-0ab3-5832-6e6c-056646482e59<br>wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-34 | a | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846<br>wf:31ceb2a2-0ab3-5832-6e6c-056646482e59<br>wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-37 | a | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-38 | a-2 | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-39 | a | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-40 | a-4 | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-117 | a-8 | wf:511a527c-0818-f243-94fb-c91d2b84e762 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-118 | a-9 | wf:511a527c-0818-f243-94fb-c91d2b84e762 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-119 | a-9 | wf:511a527c-0818-f243-94fb-c91d2b84e753 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-121 | growIn | dom:body:nth-of-type(1)>section:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1) | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":200,"direction":null,"effectIn":true} | main, medium, small, tiny |
| e-131 | a-11 | wf:1b710e68-38ef-1a3b-db46-5efe98f74eeb | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-137 | a-11 | wf:15ecb568-2be4-e312-298d-bf6af4efc643 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-194 | slideInBottom | wf:b3f8e1d2-757e-d6a0-6dbb-b11ab1a23dd0 | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":400,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-196 | slideInBottom | wf:b3f8e1d2-757e-d6a0-6dbb-b11ab1a23dca | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-200 | slideInBottom | wf:b3f8e1d2-757e-d6a0-6dbb-b11ab1a23dcc | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-208 | growIn | dom:body:nth-of-type(1)>section:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(2)>div:nth-of-type(2)>form:nth-of-type(1)>div:nth-of-type(4)>a:nth-of-type(1) | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":600,"direction":null,"effectIn":true} | main, medium, small, tiny |
| e-226 | slideInBottom | dom:body:nth-of-type(1)>section:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1) | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-320 | a | wf:31ceb2a2-0ab3-5832-6e6c-056646482e59 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-321 | a-4 | wf:31ceb2a2-0ab3-5832-6e6c-056646482e59 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-322 | a | wf:31ceb2a2-0ab3-5832-6e6c-056646482e59 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-323 | a-2 | wf:31ceb2a2-0ab3-5832-6e6c-056646482e59 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-324 | a | wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-325 | a-4 | wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-326 | a | wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-327 | a-2 | wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-913 | slideInBottom | wf:01415f8e-f1dc-065f-6696-5928ab24123a | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":1000,"direction":"BOTTOM","effectIn":true} | main |
| e-927 | growIn | dom:body:nth-of-type(1)>section:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(2)>div:nth-of-type(2)>form:nth-of-type(1)>div:nth-of-type(4)>a:nth-of-type(1) | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":600,"direction":null,"effectIn":true} | main, medium, small, tiny |
| e-1086 | slideInBottom | wf:dc9cd1c4-b996-4961-5277-8739c1dbc8e6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":400,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-1088 | slideInBottom | wf:dc9cd1c4-b996-4961-5277-8739c1dbc8e8 | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":600,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-1090 | fadeIn | wf:dc9cd1c4-b996-4961-5277-8739c1dbc8dc | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":200,"direction":null,"effectIn":true} | main, medium, small, tiny |

### /faq

| Event | Action list | Trigger target | Source trigger parameters | Media |
|---|---|---|---|---|
| e-15 | a-2 | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846<br>wf:31ceb2a2-0ab3-5832-6e6c-056646482e59<br>wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-34 | a | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846<br>wf:31ceb2a2-0ab3-5832-6e6c-056646482e59<br>wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-37 | a | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-38 | a-2 | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-39 | a | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-40 | a-4 | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-117 | a-8 | wf:511a527c-0818-f243-94fb-c91d2b84e762 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-118 | a-9 | wf:511a527c-0818-f243-94fb-c91d2b84e762 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-119 | a-9 | wf:511a527c-0818-f243-94fb-c91d2b84e753 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-121 | growIn | dom:body:nth-of-type(1)>section:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1) | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":200,"direction":null,"effectIn":true} | main, medium, small, tiny |
| e-131 | a-11 | wf:1b710e68-38ef-1a3b-db46-5efe98f74eeb | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-137 | a-11 | wf:15ecb568-2be4-e312-298d-bf6af4efc643 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-178 | growIn | wf:b82ac382-4f30-6ace-ac70-42794b8fd6ee<br>wf:5b60e369-e996-1e02-8082-42a8f203aa0d<br>wf:ede54a38-38e5-f2ac-2b27-d5b67e55bac2<br>wf:56bb328c-ad49-0f13-ffc3-a737ebbc8c3e<br>wf:56bb328c-ad49-0f13-ffc3-a737ebbc8c49<br>wf:56bb328c-ad49-0f13-ffc3-a737ebbc8c57<br>wf:d662f44d-7866-c624-c762-41c19d608bd5<br>wf:d662f44d-7866-c624-c762-41c19d608be0<br>wf:d662f44d-7866-c624-c762-41c19d608beb<br>wf:e8f38d3e-9e62-87de-61bd-abf0ee33054d<br>wf:834838b5-f067-6a4d-8691-239e4a44e090<br>wf:834838b5-f067-6a4d-8691-239e4a44e0a1<br>wf:834838b5-f067-6a4d-8691-239e4a44e0af<br>wf:834838b5-f067-6a4d-8691-239e4a44e0ba<br>wf:f714cd7e-de5d-650e-c5e1-124797876fed<br>wf:e5103d78-d202-96a9-90bf-8a44e99db3f9<br>wf:71b50ba3-1bf0-0d9f-a616-ed163ded61b8<br>wf:261abbcd-4762-17a0-fd3d-b45304f324ba | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":300,"direction":null,"effectIn":true} | main, medium, small, tiny |
| e-194 | slideInBottom | wf:b3f8e1d2-757e-d6a0-6dbb-b11ab1a23dd0 | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":400,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-196 | slideInBottom | wf:b3f8e1d2-757e-d6a0-6dbb-b11ab1a23dca | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-200 | slideInBottom | wf:b3f8e1d2-757e-d6a0-6dbb-b11ab1a23dcc | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-208 | growIn | dom:body:nth-of-type(1)>section:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(2)>div:nth-of-type(2)>form:nth-of-type(1)>div:nth-of-type(4)>a:nth-of-type(1) | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":600,"direction":null,"effectIn":true} | main, medium, small, tiny |
| e-226 | slideInBottom | dom:body:nth-of-type(1)>section:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1) | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-320 | a | wf:31ceb2a2-0ab3-5832-6e6c-056646482e59 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-321 | a-4 | wf:31ceb2a2-0ab3-5832-6e6c-056646482e59 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-322 | a | wf:31ceb2a2-0ab3-5832-6e6c-056646482e59 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-323 | a-2 | wf:31ceb2a2-0ab3-5832-6e6c-056646482e59 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-324 | a | wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-325 | a-4 | wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-326 | a | wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-327 | a-2 | wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-421 | slideInBottom | dom:body:nth-of-type(1)>div:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(1)>a:nth-of-type(1)<br>dom:body:nth-of-type(1)>div:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(1)>a:nth-of-type(2)<br>dom:body:nth-of-type(1)>div:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(1)>a:nth-of-type(3)<br>dom:body:nth-of-type(1)>div:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(1)>a:nth-of-type(4) | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-863 | slideInBottom | wf:01415f8e-f1dc-065f-6696-5928ab24123a | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":1000,"direction":"BOTTOM","effectIn":true} | main |
| e-865 | a-13 | wf:b82ac382-4f30-6ace-ac70-42794b8fd6ee | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-866 | a-14 | wf:b82ac382-4f30-6ace-ac70-42794b8fd6ee | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-867 | a-13 | wf:5b60e369-e996-1e02-8082-42a8f203aa0d | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-868 | a-14 | wf:5b60e369-e996-1e02-8082-42a8f203aa0d | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-869 | a-13 | wf:ede54a38-38e5-f2ac-2b27-d5b67e55bac2 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-870 | a-14 | wf:ede54a38-38e5-f2ac-2b27-d5b67e55bac2 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-871 | a-13 | wf:56bb328c-ad49-0f13-ffc3-a737ebbc8c3e | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-872 | a-14 | wf:56bb328c-ad49-0f13-ffc3-a737ebbc8c3e | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-873 | a-13 | wf:56bb328c-ad49-0f13-ffc3-a737ebbc8c49 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-874 | a-14 | wf:56bb328c-ad49-0f13-ffc3-a737ebbc8c49 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-875 | a-13 | wf:56bb328c-ad49-0f13-ffc3-a737ebbc8c57 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-876 | a-14 | wf:56bb328c-ad49-0f13-ffc3-a737ebbc8c57 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-877 | a-13 | wf:d662f44d-7866-c624-c762-41c19d608bd5 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-878 | a-14 | wf:d662f44d-7866-c624-c762-41c19d608bd5 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-879 | a-13 | wf:d662f44d-7866-c624-c762-41c19d608be0 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-880 | a-14 | wf:d662f44d-7866-c624-c762-41c19d608be0 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-881 | a-13 | wf:d662f44d-7866-c624-c762-41c19d608beb | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-882 | a-14 | wf:d662f44d-7866-c624-c762-41c19d608beb | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-883 | a-13 | wf:e8f38d3e-9e62-87de-61bd-abf0ee33054d | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-884 | a-14 | wf:e8f38d3e-9e62-87de-61bd-abf0ee33054d | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-885 | a-13 | wf:834838b5-f067-6a4d-8691-239e4a44e090 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-886 | a-14 | wf:834838b5-f067-6a4d-8691-239e4a44e090 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-887 | a-13 | wf:834838b5-f067-6a4d-8691-239e4a44e0a1 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-888 | a-14 | wf:834838b5-f067-6a4d-8691-239e4a44e0a1 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-889 | a-13 | wf:834838b5-f067-6a4d-8691-239e4a44e0af | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-890 | a-14 | wf:834838b5-f067-6a4d-8691-239e4a44e0af | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-891 | a-13 | wf:834838b5-f067-6a4d-8691-239e4a44e0ba | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-892 | a-14 | wf:834838b5-f067-6a4d-8691-239e4a44e0ba | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-893 | a-13 | wf:f714cd7e-de5d-650e-c5e1-124797876fed | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-894 | a-14 | wf:f714cd7e-de5d-650e-c5e1-124797876fed | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-895 | a-13 | wf:e5103d78-d202-96a9-90bf-8a44e99db3f9 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-896 | a-14 | wf:e5103d78-d202-96a9-90bf-8a44e99db3f9 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-897 | a-13 | wf:71b50ba3-1bf0-0d9f-a616-ed163ded61b8 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-898 | a-14 | wf:71b50ba3-1bf0-0d9f-a616-ed163ded61b8 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-899 | a-13 | wf:261abbcd-4762-17a0-fd3d-b45304f324ba | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-900 | a-14 | wf:261abbcd-4762-17a0-fd3d-b45304f324ba | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-927 | growIn | dom:body:nth-of-type(1)>section:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(2)>div:nth-of-type(2)>form:nth-of-type(1)>div:nth-of-type(4)>a:nth-of-type(1) | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":600,"direction":null,"effectIn":true} | main, medium, small, tiny |
| e-1074 | slideInBottom | wf:2ca746b2-65d4-3dd3-3ea8-c688b597a254 | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":400,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-1076 | slideInBottom | wf:2ca746b2-65d4-3dd3-3ea8-c688b597a256 | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":600,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-1078 | fadeIn | wf:2ca746b2-65d4-3dd3-3ea8-c688b597a24a | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":200,"direction":null,"effectIn":true} | main, medium, small, tiny |

### /domande-e-risposte

| Event | Action list | Trigger target | Source trigger parameters | Media |
|---|---|---|---|---|
| e-15 | a-2 | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846<br>wf:31ceb2a2-0ab3-5832-6e6c-056646482e59<br>wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-34 | a | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846<br>wf:31ceb2a2-0ab3-5832-6e6c-056646482e59<br>wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-37 | a | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-38 | a-2 | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-39 | a | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-40 | a-4 | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-117 | a-8 | wf:511a527c-0818-f243-94fb-c91d2b84e762 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-118 | a-9 | wf:511a527c-0818-f243-94fb-c91d2b84e762 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-119 | a-9 | wf:511a527c-0818-f243-94fb-c91d2b84e753 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-121 | growIn | dom:body:nth-of-type(1)>section:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1) | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":200,"direction":null,"effectIn":true} | main, medium, small, tiny |
| e-131 | a-11 | wf:1b710e68-38ef-1a3b-db46-5efe98f74eeb | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-137 | a-11 | wf:15ecb568-2be4-e312-298d-bf6af4efc643 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-194 | slideInBottom | wf:b3f8e1d2-757e-d6a0-6dbb-b11ab1a23dd0 | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":400,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-196 | slideInBottom | wf:b3f8e1d2-757e-d6a0-6dbb-b11ab1a23dca | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-200 | slideInBottom | wf:b3f8e1d2-757e-d6a0-6dbb-b11ab1a23dcc | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-208 | growIn | dom:body:nth-of-type(1)>section:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(2)>div:nth-of-type(2)>form:nth-of-type(1)>div:nth-of-type(4)>a:nth-of-type(1) | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":600,"direction":null,"effectIn":true} | main, medium, small, tiny |
| e-226 | slideInBottom | dom:body:nth-of-type(1)>section:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1) | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-320 | a | wf:31ceb2a2-0ab3-5832-6e6c-056646482e59 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-321 | a-4 | wf:31ceb2a2-0ab3-5832-6e6c-056646482e59 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-322 | a | wf:31ceb2a2-0ab3-5832-6e6c-056646482e59 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-323 | a-2 | wf:31ceb2a2-0ab3-5832-6e6c-056646482e59 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-324 | a | wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-325 | a-4 | wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-326 | a | wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-327 | a-2 | wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-421 | slideInBottom | dom:body:nth-of-type(1)>div:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(1)>a:nth-of-type(1)<br>dom:body:nth-of-type(1)>div:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(1)>a:nth-of-type(2)<br>dom:body:nth-of-type(1)>div:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(1)>a:nth-of-type(3) | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-813 | slideInBottom | wf:01415f8e-f1dc-065f-6696-5928ab24123a | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":1000,"direction":"BOTTOM","effectIn":true} | main |
| e-927 | growIn | dom:body:nth-of-type(1)>section:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(2)>div:nth-of-type(2)>form:nth-of-type(1)>div:nth-of-type(4)>a:nth-of-type(1) | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":600,"direction":null,"effectIn":true} | main, medium, small, tiny |
| e-1080 | slideInBottom | wf:602f985d-a999-3d0f-cbf8-03435109136a | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":400,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-1082 | slideInBottom | wf:602f985d-a999-3d0f-cbf8-03435109136c | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":600,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-1084 | fadeIn | wf:602f985d-a999-3d0f-cbf8-034351091360 | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":200,"direction":null,"effectIn":true} | main, medium, small, tiny |

### /informazioni/listino-prezzi

| Event | Action list | Trigger target | Source trigger parameters | Media |
|---|---|---|---|---|
| e-15 | a-2 | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846<br>wf:31ceb2a2-0ab3-5832-6e6c-056646482e59<br>wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-34 | a | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846<br>wf:31ceb2a2-0ab3-5832-6e6c-056646482e59<br>wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-37 | a | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-38 | a-2 | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-39 | a | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-40 | a-4 | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-117 | a-8 | wf:511a527c-0818-f243-94fb-c91d2b84e762 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-118 | a-9 | wf:511a527c-0818-f243-94fb-c91d2b84e762 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-119 | a-9 | wf:511a527c-0818-f243-94fb-c91d2b84e753 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-121 | growIn | dom:body:nth-of-type(1)>section:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1) | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":200,"direction":null,"effectIn":true} | main, medium, small, tiny |
| e-131 | a-11 | wf:1b710e68-38ef-1a3b-db46-5efe98f74eeb | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-137 | a-11 | wf:15ecb568-2be4-e312-298d-bf6af4efc643 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-194 | slideInBottom | wf:b3f8e1d2-757e-d6a0-6dbb-b11ab1a23dd0 | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":400,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-196 | slideInBottom | wf:b3f8e1d2-757e-d6a0-6dbb-b11ab1a23dca | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-200 | slideInBottom | wf:b3f8e1d2-757e-d6a0-6dbb-b11ab1a23dcc | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-208 | growIn | dom:body:nth-of-type(1)>section:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(2)>div:nth-of-type(2)>form:nth-of-type(1)>div:nth-of-type(4)>a:nth-of-type(1) | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":600,"direction":null,"effectIn":true} | main, medium, small, tiny |
| e-226 | slideInBottom | dom:body:nth-of-type(1)>section:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1) | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-320 | a | wf:31ceb2a2-0ab3-5832-6e6c-056646482e59 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-321 | a-4 | wf:31ceb2a2-0ab3-5832-6e6c-056646482e59 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-322 | a | wf:31ceb2a2-0ab3-5832-6e6c-056646482e59 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-323 | a-2 | wf:31ceb2a2-0ab3-5832-6e6c-056646482e59 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-324 | a | wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-325 | a-4 | wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-326 | a | wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-327 | a-2 | wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-421 | slideInBottom | dom:body:nth-of-type(1)>div:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(1)>a:nth-of-type(1)<br>dom:body:nth-of-type(1)>div:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(1)>a:nth-of-type(2)<br>dom:body:nth-of-type(1)>div:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(1)>a:nth-of-type(3)<br>dom:body:nth-of-type(1)>div:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(1)>a:nth-of-type(4)<br>dom:body:nth-of-type(1)>div:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(1)>a:nth-of-type(5)<br>dom:body:nth-of-type(1)>div:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(1)>a:nth-of-type(6)<br>dom:body:nth-of-type(1)>div:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(1)>a:nth-of-type(7) | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-749 | slideInBottom | wf:01415f8e-f1dc-065f-6696-5928ab24121b | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":1000,"direction":"BOTTOM","effectIn":true} | main |
| e-927 | growIn | dom:body:nth-of-type(1)>section:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(2)>div:nth-of-type(2)>form:nth-of-type(1)>div:nth-of-type(4)>a:nth-of-type(1) | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":600,"direction":null,"effectIn":true} | main, medium, small, tiny |
| e-1048 | slideInBottom | wf:57af09ad-a99b-4c4f-9c3f-0e8a9a294983 | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":400,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-1050 | slideInBottom | wf:57af09ad-a99b-4c4f-9c3f-0e8a9a294985 | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":600,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-1052 | fadeIn | wf:57af09ad-a99b-4c4f-9c3f-0e8a9a294979 | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":200,"direction":null,"effectIn":true} | main, medium, small, tiny |

### /informazioni/garanzie

| Event | Action list | Trigger target | Source trigger parameters | Media |
|---|---|---|---|---|
| e-15 | a-2 | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846<br>wf:31ceb2a2-0ab3-5832-6e6c-056646482e59<br>wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-34 | a | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846<br>wf:31ceb2a2-0ab3-5832-6e6c-056646482e59<br>wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-37 | a | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-38 | a-2 | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-39 | a | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-40 | a-4 | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-117 | a-8 | wf:511a527c-0818-f243-94fb-c91d2b84e762 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-118 | a-9 | wf:511a527c-0818-f243-94fb-c91d2b84e762 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-119 | a-9 | wf:511a527c-0818-f243-94fb-c91d2b84e753 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-121 | growIn | dom:body:nth-of-type(1)>section:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1) | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":200,"direction":null,"effectIn":true} | main, medium, small, tiny |
| e-131 | a-11 | wf:1b710e68-38ef-1a3b-db46-5efe98f74eeb | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-137 | a-11 | wf:15ecb568-2be4-e312-298d-bf6af4efc643 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-194 | slideInBottom | wf:b3f8e1d2-757e-d6a0-6dbb-b11ab1a23dd0 | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":400,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-196 | slideInBottom | wf:b3f8e1d2-757e-d6a0-6dbb-b11ab1a23dca | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-200 | slideInBottom | wf:b3f8e1d2-757e-d6a0-6dbb-b11ab1a23dcc | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-208 | growIn | dom:body:nth-of-type(1)>section:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(2)>div:nth-of-type(2)>form:nth-of-type(1)>div:nth-of-type(4)>a:nth-of-type(1) | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":600,"direction":null,"effectIn":true} | main, medium, small, tiny |
| e-226 | slideInBottom | dom:body:nth-of-type(1)>section:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1) | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-320 | a | wf:31ceb2a2-0ab3-5832-6e6c-056646482e59 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-321 | a-4 | wf:31ceb2a2-0ab3-5832-6e6c-056646482e59 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-322 | a | wf:31ceb2a2-0ab3-5832-6e6c-056646482e59 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-323 | a-2 | wf:31ceb2a2-0ab3-5832-6e6c-056646482e59 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-324 | a | wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-325 | a-4 | wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-326 | a | wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-327 | a-2 | wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-421 | slideInBottom | dom:body:nth-of-type(1)>div:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(1)>a:nth-of-type(1)<br>dom:body:nth-of-type(1)>div:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(1)>a:nth-of-type(2)<br>dom:body:nth-of-type(1)>div:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(1)>a:nth-of-type(3)<br>dom:body:nth-of-type(1)>div:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(1)>a:nth-of-type(4)<br>dom:body:nth-of-type(1)>div:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(1)>a:nth-of-type(5)<br>dom:body:nth-of-type(1)>div:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(1)>a:nth-of-type(6)<br>dom:body:nth-of-type(1)>div:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(1)>a:nth-of-type(7) | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-749 | slideInBottom | wf:01415f8e-f1dc-065f-6696-5928ab24121b | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":1000,"direction":"BOTTOM","effectIn":true} | main |
| e-927 | growIn | dom:body:nth-of-type(1)>section:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(2)>div:nth-of-type(2)>form:nth-of-type(1)>div:nth-of-type(4)>a:nth-of-type(1) | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":600,"direction":null,"effectIn":true} | main, medium, small, tiny |
| e-1042 | slideInBottom | wf:fc0849d0-fa9f-787a-a054-62f7b32aeb03 | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":400,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-1044 | slideInBottom | wf:fc0849d0-fa9f-787a-a054-62f7b32aeb05 | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":600,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-1046 | fadeIn | wf:fc0849d0-fa9f-787a-a054-62f7b32aeaf9 | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":200,"direction":null,"effectIn":true} | main, medium, small, tiny |

### /informazioni/pagamento-flessibile

| Event | Action list | Trigger target | Source trigger parameters | Media |
|---|---|---|---|---|
| e-15 | a-2 | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846<br>wf:31ceb2a2-0ab3-5832-6e6c-056646482e59<br>wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-34 | a | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846<br>wf:31ceb2a2-0ab3-5832-6e6c-056646482e59<br>wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-37 | a | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-38 | a-2 | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-39 | a | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-40 | a-4 | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-117 | a-8 | wf:511a527c-0818-f243-94fb-c91d2b84e762 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-118 | a-9 | wf:511a527c-0818-f243-94fb-c91d2b84e762 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-119 | a-9 | wf:511a527c-0818-f243-94fb-c91d2b84e753 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-121 | growIn | dom:body:nth-of-type(1)>section:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1) | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":200,"direction":null,"effectIn":true} | main, medium, small, tiny |
| e-131 | a-11 | wf:1b710e68-38ef-1a3b-db46-5efe98f74eeb | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-137 | a-11 | wf:15ecb568-2be4-e312-298d-bf6af4efc643 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-194 | slideInBottom | wf:b3f8e1d2-757e-d6a0-6dbb-b11ab1a23dd0 | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":400,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-196 | slideInBottom | wf:b3f8e1d2-757e-d6a0-6dbb-b11ab1a23dca | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-200 | slideInBottom | wf:b3f8e1d2-757e-d6a0-6dbb-b11ab1a23dcc | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-208 | growIn | dom:body:nth-of-type(1)>section:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(2)>div:nth-of-type(2)>form:nth-of-type(1)>div:nth-of-type(4)>a:nth-of-type(1) | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":600,"direction":null,"effectIn":true} | main, medium, small, tiny |
| e-226 | slideInBottom | dom:body:nth-of-type(1)>section:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1) | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-320 | a | wf:31ceb2a2-0ab3-5832-6e6c-056646482e59 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-321 | a-4 | wf:31ceb2a2-0ab3-5832-6e6c-056646482e59 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-322 | a | wf:31ceb2a2-0ab3-5832-6e6c-056646482e59 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-323 | a-2 | wf:31ceb2a2-0ab3-5832-6e6c-056646482e59 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-324 | a | wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-325 | a-4 | wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-326 | a | wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-327 | a-2 | wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-421 | slideInBottom | dom:body:nth-of-type(1)>div:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(1)>a:nth-of-type(1)<br>dom:body:nth-of-type(1)>div:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(1)>a:nth-of-type(2)<br>dom:body:nth-of-type(1)>div:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(1)>a:nth-of-type(3)<br>dom:body:nth-of-type(1)>div:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(1)>a:nth-of-type(4)<br>dom:body:nth-of-type(1)>div:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(1)>a:nth-of-type(5)<br>dom:body:nth-of-type(1)>div:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(1)>a:nth-of-type(6)<br>dom:body:nth-of-type(1)>div:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(1)>a:nth-of-type(7) | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-749 | slideInBottom | wf:01415f8e-f1dc-065f-6696-5928ab24121b | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":1000,"direction":"BOTTOM","effectIn":true} | main |
| e-927 | growIn | dom:body:nth-of-type(1)>section:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(2)>div:nth-of-type(2)>form:nth-of-type(1)>div:nth-of-type(4)>a:nth-of-type(1) | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":600,"direction":null,"effectIn":true} | main, medium, small, tiny |
| e-1036 | slideInBottom | wf:dca34dd2-4bec-05d2-81b1-f6dc3d1c5dd3 | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":400,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-1038 | slideInBottom | wf:dca34dd2-4bec-05d2-81b1-f6dc3d1c5dd5 | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":600,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-1040 | fadeIn | wf:dca34dd2-4bec-05d2-81b1-f6dc3d1c5dc9 | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":200,"direction":null,"effectIn":true} | main, medium, small, tiny |

### /informazioni/tempi-del-trattamento

| Event | Action list | Trigger target | Source trigger parameters | Media |
|---|---|---|---|---|
| e-15 | a-2 | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846<br>wf:31ceb2a2-0ab3-5832-6e6c-056646482e59<br>wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-34 | a | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846<br>wf:31ceb2a2-0ab3-5832-6e6c-056646482e59<br>wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-37 | a | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-38 | a-2 | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-39 | a | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-40 | a-4 | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-117 | a-8 | wf:511a527c-0818-f243-94fb-c91d2b84e762 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-118 | a-9 | wf:511a527c-0818-f243-94fb-c91d2b84e762 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-119 | a-9 | wf:511a527c-0818-f243-94fb-c91d2b84e753 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-121 | growIn | dom:body:nth-of-type(1)>section:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1) | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":200,"direction":null,"effectIn":true} | main, medium, small, tiny |
| e-131 | a-11 | wf:1b710e68-38ef-1a3b-db46-5efe98f74eeb | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-137 | a-11 | wf:15ecb568-2be4-e312-298d-bf6af4efc643 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-194 | slideInBottom | wf:b3f8e1d2-757e-d6a0-6dbb-b11ab1a23dd0 | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":400,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-196 | slideInBottom | wf:b3f8e1d2-757e-d6a0-6dbb-b11ab1a23dca | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-200 | slideInBottom | wf:b3f8e1d2-757e-d6a0-6dbb-b11ab1a23dcc | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-208 | growIn | dom:body:nth-of-type(1)>section:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(2)>div:nth-of-type(2)>form:nth-of-type(1)>div:nth-of-type(4)>a:nth-of-type(1) | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":600,"direction":null,"effectIn":true} | main, medium, small, tiny |
| e-226 | slideInBottom | dom:body:nth-of-type(1)>section:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1) | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-320 | a | wf:31ceb2a2-0ab3-5832-6e6c-056646482e59 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-321 | a-4 | wf:31ceb2a2-0ab3-5832-6e6c-056646482e59 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-322 | a | wf:31ceb2a2-0ab3-5832-6e6c-056646482e59 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-323 | a-2 | wf:31ceb2a2-0ab3-5832-6e6c-056646482e59 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-324 | a | wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-325 | a-4 | wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-326 | a | wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-327 | a-2 | wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-421 | slideInBottom | dom:body:nth-of-type(1)>div:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(1)>a:nth-of-type(1)<br>dom:body:nth-of-type(1)>div:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(1)>a:nth-of-type(2)<br>dom:body:nth-of-type(1)>div:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(1)>a:nth-of-type(3)<br>dom:body:nth-of-type(1)>div:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(1)>a:nth-of-type(4)<br>dom:body:nth-of-type(1)>div:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(1)>a:nth-of-type(5)<br>dom:body:nth-of-type(1)>div:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(1)>a:nth-of-type(6)<br>dom:body:nth-of-type(1)>div:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(1)>a:nth-of-type(7) | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-749 | slideInBottom | wf:01415f8e-f1dc-065f-6696-5928ab24121b | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":1000,"direction":"BOTTOM","effectIn":true} | main |
| e-927 | growIn | dom:body:nth-of-type(1)>section:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(2)>div:nth-of-type(2)>form:nth-of-type(1)>div:nth-of-type(4)>a:nth-of-type(1) | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":600,"direction":null,"effectIn":true} | main, medium, small, tiny |
| e-1030 | slideInBottom | wf:586bea81-623d-139e-5a22-37fcdaf9ab19 | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":400,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-1032 | slideInBottom | wf:586bea81-623d-139e-5a22-37fcdaf9ab1b | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":600,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-1034 | fadeIn | wf:586bea81-623d-139e-5a22-37fcdaf9ab0f | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":200,"direction":null,"effectIn":true} | main, medium, small, tiny |

### /informazioni/prima-visita-gratuita

| Event | Action list | Trigger target | Source trigger parameters | Media |
|---|---|---|---|---|
| e-15 | a-2 | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846<br>wf:31ceb2a2-0ab3-5832-6e6c-056646482e59<br>wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-34 | a | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846<br>wf:31ceb2a2-0ab3-5832-6e6c-056646482e59<br>wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-37 | a | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-38 | a-2 | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-39 | a | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-40 | a-4 | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-117 | a-8 | wf:511a527c-0818-f243-94fb-c91d2b84e762 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-118 | a-9 | wf:511a527c-0818-f243-94fb-c91d2b84e762 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-119 | a-9 | wf:511a527c-0818-f243-94fb-c91d2b84e753 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-121 | growIn | dom:body:nth-of-type(1)>section:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1) | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":200,"direction":null,"effectIn":true} | main, medium, small, tiny |
| e-131 | a-11 | wf:1b710e68-38ef-1a3b-db46-5efe98f74eeb | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-137 | a-11 | wf:15ecb568-2be4-e312-298d-bf6af4efc643 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-194 | slideInBottom | wf:b3f8e1d2-757e-d6a0-6dbb-b11ab1a23dd0 | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":400,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-196 | slideInBottom | wf:b3f8e1d2-757e-d6a0-6dbb-b11ab1a23dca | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-200 | slideInBottom | wf:b3f8e1d2-757e-d6a0-6dbb-b11ab1a23dcc | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-208 | growIn | dom:body:nth-of-type(1)>section:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(2)>div:nth-of-type(2)>form:nth-of-type(1)>div:nth-of-type(4)>a:nth-of-type(1) | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":600,"direction":null,"effectIn":true} | main, medium, small, tiny |
| e-226 | slideInBottom | dom:body:nth-of-type(1)>section:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1) | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-320 | a | wf:31ceb2a2-0ab3-5832-6e6c-056646482e59 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-321 | a-4 | wf:31ceb2a2-0ab3-5832-6e6c-056646482e59 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-322 | a | wf:31ceb2a2-0ab3-5832-6e6c-056646482e59 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-323 | a-2 | wf:31ceb2a2-0ab3-5832-6e6c-056646482e59 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-324 | a | wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-325 | a-4 | wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-326 | a | wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-327 | a-2 | wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-421 | slideInBottom | dom:body:nth-of-type(1)>div:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(1)>a:nth-of-type(1)<br>dom:body:nth-of-type(1)>div:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(1)>a:nth-of-type(2)<br>dom:body:nth-of-type(1)>div:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(1)>a:nth-of-type(3)<br>dom:body:nth-of-type(1)>div:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(1)>a:nth-of-type(4)<br>dom:body:nth-of-type(1)>div:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(1)>a:nth-of-type(5)<br>dom:body:nth-of-type(1)>div:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(1)>a:nth-of-type(6)<br>dom:body:nth-of-type(1)>div:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(1)>a:nth-of-type(7) | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-749 | slideInBottom | wf:01415f8e-f1dc-065f-6696-5928ab24121b | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":1000,"direction":"BOTTOM","effectIn":true} | main |
| e-927 | growIn | dom:body:nth-of-type(1)>section:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(2)>div:nth-of-type(2)>form:nth-of-type(1)>div:nth-of-type(4)>a:nth-of-type(1) | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":600,"direction":null,"effectIn":true} | main, medium, small, tiny |
| e-1024 | slideInBottom | wf:ceaf9077-2c86-156e-5eed-f59a10b94659 | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":400,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-1026 | slideInBottom | wf:ceaf9077-2c86-156e-5eed-f59a10b9465b | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":600,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-1028 | fadeIn | wf:ceaf9077-2c86-156e-5eed-f59a10b9464f | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":200,"direction":null,"effectIn":true} | main, medium, small, tiny |

### /prestazioni/sedazione-cosciente

| Event | Action list | Trigger target | Source trigger parameters | Media |
|---|---|---|---|---|
| e-15 | a-2 | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846<br>wf:31ceb2a2-0ab3-5832-6e6c-056646482e59<br>wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-34 | a | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846<br>wf:31ceb2a2-0ab3-5832-6e6c-056646482e59<br>wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-37 | a | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-38 | a-2 | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-39 | a | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-40 | a-4 | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-117 | a-8 | wf:511a527c-0818-f243-94fb-c91d2b84e762 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-118 | a-9 | wf:511a527c-0818-f243-94fb-c91d2b84e762 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-119 | a-9 | wf:511a527c-0818-f243-94fb-c91d2b84e753 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-121 | growIn | dom:body:nth-of-type(1)>section:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1) | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":200,"direction":null,"effectIn":true} | main, medium, small, tiny |
| e-131 | a-11 | wf:1b710e68-38ef-1a3b-db46-5efe98f74eeb | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-137 | a-11 | wf:15ecb568-2be4-e312-298d-bf6af4efc643 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-194 | slideInBottom | wf:b3f8e1d2-757e-d6a0-6dbb-b11ab1a23dd0 | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":400,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-196 | slideInBottom | wf:b3f8e1d2-757e-d6a0-6dbb-b11ab1a23dca | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-200 | slideInBottom | wf:b3f8e1d2-757e-d6a0-6dbb-b11ab1a23dcc | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-208 | growIn | dom:body:nth-of-type(1)>section:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(2)>div:nth-of-type(2)>form:nth-of-type(1)>div:nth-of-type(4)>a:nth-of-type(1) | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":600,"direction":null,"effectIn":true} | main, medium, small, tiny |
| e-226 | slideInBottom | dom:body:nth-of-type(1)>section:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1) | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-320 | a | wf:31ceb2a2-0ab3-5832-6e6c-056646482e59 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-321 | a-4 | wf:31ceb2a2-0ab3-5832-6e6c-056646482e59 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-322 | a | wf:31ceb2a2-0ab3-5832-6e6c-056646482e59 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-323 | a-2 | wf:31ceb2a2-0ab3-5832-6e6c-056646482e59 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-324 | a | wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-325 | a-4 | wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-326 | a | wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-327 | a-2 | wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-421 | slideInBottom | dom:body:nth-of-type(1)>div:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(1)>a:nth-of-type(1)<br>dom:body:nth-of-type(1)>div:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(1)>a:nth-of-type(2)<br>dom:body:nth-of-type(1)>div:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(1)>a:nth-of-type(3)<br>dom:body:nth-of-type(1)>div:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(1)>a:nth-of-type(4)<br>dom:body:nth-of-type(1)>div:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(1)>a:nth-of-type(5) | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-927 | growIn | dom:body:nth-of-type(1)>section:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(2)>div:nth-of-type(2)>form:nth-of-type(1)>div:nth-of-type(4)>a:nth-of-type(1) | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":600,"direction":null,"effectIn":true} | main, medium, small, tiny |
| e-1018 | slideInBottom | wf:ad8c4667-3a92-20a1-5322-75fc265796b4 | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":400,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-1020 | slideInBottom | wf:ad8c4667-3a92-20a1-5322-75fc265796b6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":600,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-1022 | fadeIn | wf:ad8c4667-3a92-20a1-5322-75fc265796aa | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":200,"direction":null,"effectIn":true} | main, medium, small, tiny |

### /su-di-noi/impianti-di-nuova-generazione

| Event | Action list | Trigger target | Source trigger parameters | Media |
|---|---|---|---|---|
| e-15 | a-2 | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846<br>wf:31ceb2a2-0ab3-5832-6e6c-056646482e59<br>wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-34 | a | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846<br>wf:31ceb2a2-0ab3-5832-6e6c-056646482e59<br>wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-37 | a | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-38 | a-2 | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-39 | a | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-40 | a-4 | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-117 | a-8 | wf:511a527c-0818-f243-94fb-c91d2b84e762 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-118 | a-9 | wf:511a527c-0818-f243-94fb-c91d2b84e762 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-119 | a-9 | wf:511a527c-0818-f243-94fb-c91d2b84e753 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-121 | growIn | dom:body:nth-of-type(1)>section:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1) | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":200,"direction":null,"effectIn":true} | main, medium, small, tiny |
| e-131 | a-11 | wf:1b710e68-38ef-1a3b-db46-5efe98f74eeb | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-137 | a-11 | wf:15ecb568-2be4-e312-298d-bf6af4efc643 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-194 | slideInBottom | wf:b3f8e1d2-757e-d6a0-6dbb-b11ab1a23dd0 | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":400,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-196 | slideInBottom | wf:b3f8e1d2-757e-d6a0-6dbb-b11ab1a23dca | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-200 | slideInBottom | wf:b3f8e1d2-757e-d6a0-6dbb-b11ab1a23dcc | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-208 | growIn | dom:body:nth-of-type(1)>section:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(2)>div:nth-of-type(2)>form:nth-of-type(1)>div:nth-of-type(4)>a:nth-of-type(1) | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":600,"direction":null,"effectIn":true} | main, medium, small, tiny |
| e-226 | slideInBottom | dom:body:nth-of-type(1)>section:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1) | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-320 | a | wf:31ceb2a2-0ab3-5832-6e6c-056646482e59 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-321 | a-4 | wf:31ceb2a2-0ab3-5832-6e6c-056646482e59 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-322 | a | wf:31ceb2a2-0ab3-5832-6e6c-056646482e59 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-323 | a-2 | wf:31ceb2a2-0ab3-5832-6e6c-056646482e59 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-324 | a | wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-325 | a-4 | wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-326 | a | wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-327 | a-2 | wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-421 | slideInBottom | dom:body:nth-of-type(1)>div:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(1)>a:nth-of-type(1)<br>dom:body:nth-of-type(1)>div:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(1)>a:nth-of-type(2)<br>dom:body:nth-of-type(1)>div:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(1)>a:nth-of-type(3)<br>dom:body:nth-of-type(1)>div:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(1)>a:nth-of-type(4)<br>dom:body:nth-of-type(1)>div:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(1)>a:nth-of-type(5)<br>dom:body:nth-of-type(1)>div:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(1)>a:nth-of-type(6) | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-667 | slideInBottom | wf:12779da6-57f4-1edc-0b0f-c14d7c69e8c1 | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":1000,"direction":"BOTTOM","effectIn":true} | main |
| e-927 | growIn | dom:body:nth-of-type(1)>section:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(2)>div:nth-of-type(2)>form:nth-of-type(1)>div:nth-of-type(4)>a:nth-of-type(1) | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":600,"direction":null,"effectIn":true} | main, medium, small, tiny |
| e-1012 | slideInBottom | wf:32a9e7bd-d9cd-ad00-44d7-831ad10ba37c | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":400,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-1014 | slideInBottom | wf:32a9e7bd-d9cd-ad00-44d7-831ad10ba37e | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":600,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-1016 | fadeIn | wf:32a9e7bd-d9cd-ad00-44d7-831ad10ba372 | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":200,"direction":null,"effectIn":true} | main, medium, small, tiny |

### /su-di-noi/materiali-e-apparecchiature

| Event | Action list | Trigger target | Source trigger parameters | Media |
|---|---|---|---|---|
| e-15 | a-2 | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846<br>wf:31ceb2a2-0ab3-5832-6e6c-056646482e59<br>wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-34 | a | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846<br>wf:31ceb2a2-0ab3-5832-6e6c-056646482e59<br>wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-37 | a | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-38 | a-2 | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-39 | a | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-40 | a-4 | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-117 | a-8 | wf:511a527c-0818-f243-94fb-c91d2b84e762 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-118 | a-9 | wf:511a527c-0818-f243-94fb-c91d2b84e762 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-119 | a-9 | wf:511a527c-0818-f243-94fb-c91d2b84e753 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-121 | growIn | dom:body:nth-of-type(1)>section:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1) | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":200,"direction":null,"effectIn":true} | main, medium, small, tiny |
| e-131 | a-11 | wf:1b710e68-38ef-1a3b-db46-5efe98f74eeb | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-137 | a-11 | wf:15ecb568-2be4-e312-298d-bf6af4efc643 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-194 | slideInBottom | wf:b3f8e1d2-757e-d6a0-6dbb-b11ab1a23dd0 | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":400,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-196 | slideInBottom | wf:b3f8e1d2-757e-d6a0-6dbb-b11ab1a23dca | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-200 | slideInBottom | wf:b3f8e1d2-757e-d6a0-6dbb-b11ab1a23dcc | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-208 | growIn | dom:body:nth-of-type(1)>section:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(2)>div:nth-of-type(2)>form:nth-of-type(1)>div:nth-of-type(4)>a:nth-of-type(1) | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":600,"direction":null,"effectIn":true} | main, medium, small, tiny |
| e-226 | slideInBottom | dom:body:nth-of-type(1)>section:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1) | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-320 | a | wf:31ceb2a2-0ab3-5832-6e6c-056646482e59 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-321 | a-4 | wf:31ceb2a2-0ab3-5832-6e6c-056646482e59 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-322 | a | wf:31ceb2a2-0ab3-5832-6e6c-056646482e59 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-323 | a-2 | wf:31ceb2a2-0ab3-5832-6e6c-056646482e59 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-324 | a | wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-325 | a-4 | wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-326 | a | wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-327 | a-2 | wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-421 | slideInBottom | dom:body:nth-of-type(1)>div:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(1)>a:nth-of-type(1)<br>dom:body:nth-of-type(1)>div:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(1)>a:nth-of-type(2)<br>dom:body:nth-of-type(1)>div:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(1)>a:nth-of-type(3)<br>dom:body:nth-of-type(1)>div:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(1)>a:nth-of-type(4)<br>dom:body:nth-of-type(1)>div:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(1)>a:nth-of-type(5)<br>dom:body:nth-of-type(1)>div:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(1)>a:nth-of-type(6) | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-667 | slideInBottom | wf:12779da6-57f4-1edc-0b0f-c14d7c69e8c1 | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":1000,"direction":"BOTTOM","effectIn":true} | main |
| e-927 | growIn | dom:body:nth-of-type(1)>section:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(2)>div:nth-of-type(2)>form:nth-of-type(1)>div:nth-of-type(4)>a:nth-of-type(1) | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":600,"direction":null,"effectIn":true} | main, medium, small, tiny |
| e-1006 | slideInBottom | wf:e4fc113d-6585-ed5b-aa0d-195901ede0bb | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":400,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-1008 | slideInBottom | wf:e4fc113d-6585-ed5b-aa0d-195901ede0bd | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":600,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-1010 | fadeIn | wf:e4fc113d-6585-ed5b-aa0d-195901ede0b1 | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":200,"direction":null,"effectIn":true} | main, medium, small, tiny |

### /su-di-noi/laboratorio-odontotecnico

| Event | Action list | Trigger target | Source trigger parameters | Media |
|---|---|---|---|---|
| e-15 | a-2 | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846<br>wf:31ceb2a2-0ab3-5832-6e6c-056646482e59<br>wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-34 | a | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846<br>wf:31ceb2a2-0ab3-5832-6e6c-056646482e59<br>wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-37 | a | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-38 | a-2 | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-39 | a | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-40 | a-4 | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-117 | a-8 | wf:511a527c-0818-f243-94fb-c91d2b84e762 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-118 | a-9 | wf:511a527c-0818-f243-94fb-c91d2b84e762 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-119 | a-9 | wf:511a527c-0818-f243-94fb-c91d2b84e753 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-121 | growIn | dom:body:nth-of-type(1)>section:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1) | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":200,"direction":null,"effectIn":true} | main, medium, small, tiny |
| e-131 | a-11 | wf:1b710e68-38ef-1a3b-db46-5efe98f74eeb | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-137 | a-11 | wf:15ecb568-2be4-e312-298d-bf6af4efc643 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-194 | slideInBottom | wf:b3f8e1d2-757e-d6a0-6dbb-b11ab1a23dd0 | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":400,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-196 | slideInBottom | wf:b3f8e1d2-757e-d6a0-6dbb-b11ab1a23dca | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-200 | slideInBottom | wf:b3f8e1d2-757e-d6a0-6dbb-b11ab1a23dcc | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-208 | growIn | dom:body:nth-of-type(1)>section:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(2)>div:nth-of-type(2)>form:nth-of-type(1)>div:nth-of-type(4)>a:nth-of-type(1) | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":600,"direction":null,"effectIn":true} | main, medium, small, tiny |
| e-226 | slideInBottom | dom:body:nth-of-type(1)>section:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1) | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-320 | a | wf:31ceb2a2-0ab3-5832-6e6c-056646482e59 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-321 | a-4 | wf:31ceb2a2-0ab3-5832-6e6c-056646482e59 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-322 | a | wf:31ceb2a2-0ab3-5832-6e6c-056646482e59 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-323 | a-2 | wf:31ceb2a2-0ab3-5832-6e6c-056646482e59 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-324 | a | wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-325 | a-4 | wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-326 | a | wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-327 | a-2 | wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-421 | slideInBottom | dom:body:nth-of-type(1)>div:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(1)>a:nth-of-type(1)<br>dom:body:nth-of-type(1)>div:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(1)>a:nth-of-type(2)<br>dom:body:nth-of-type(1)>div:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(1)>a:nth-of-type(3)<br>dom:body:nth-of-type(1)>div:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(1)>a:nth-of-type(4)<br>dom:body:nth-of-type(1)>div:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(1)>a:nth-of-type(5)<br>dom:body:nth-of-type(1)>div:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(1)>a:nth-of-type(6) | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-667 | slideInBottom | wf:12779da6-57f4-1edc-0b0f-c14d7c69e8c1 | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":1000,"direction":"BOTTOM","effectIn":true} | main |
| e-927 | growIn | dom:body:nth-of-type(1)>section:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(2)>div:nth-of-type(2)>form:nth-of-type(1)>div:nth-of-type(4)>a:nth-of-type(1) | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":600,"direction":null,"effectIn":true} | main, medium, small, tiny |
| e-1000 | slideInBottom | wf:2b29b01a-7d1d-647d-66c1-47f79e91c4e7 | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":400,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-1002 | slideInBottom | wf:2b29b01a-7d1d-647d-66c1-47f79e91c4e9 | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":600,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-1004 | fadeIn | wf:2b29b01a-7d1d-647d-66c1-47f79e91c4dd | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":200,"direction":null,"effectIn":true} | main, medium, small, tiny |

### /su-di-noi/come-raggiungerci

| Event | Action list | Trigger target | Source trigger parameters | Media |
|---|---|---|---|---|
| e-15 | a-2 | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846<br>wf:31ceb2a2-0ab3-5832-6e6c-056646482e59<br>wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-34 | a | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846<br>wf:31ceb2a2-0ab3-5832-6e6c-056646482e59<br>wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-37 | a | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-38 | a-2 | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-39 | a | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-40 | a-4 | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-117 | a-8 | wf:511a527c-0818-f243-94fb-c91d2b84e762 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-118 | a-9 | wf:511a527c-0818-f243-94fb-c91d2b84e762 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-119 | a-9 | wf:511a527c-0818-f243-94fb-c91d2b84e753 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-121 | growIn | dom:body:nth-of-type(1)>section:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1) | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":200,"direction":null,"effectIn":true} | main, medium, small, tiny |
| e-131 | a-11 | wf:1b710e68-38ef-1a3b-db46-5efe98f74eeb | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-137 | a-11 | wf:15ecb568-2be4-e312-298d-bf6af4efc643 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-194 | slideInBottom | wf:b3f8e1d2-757e-d6a0-6dbb-b11ab1a23dd0 | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":400,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-196 | slideInBottom | wf:b3f8e1d2-757e-d6a0-6dbb-b11ab1a23dca | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-200 | slideInBottom | wf:b3f8e1d2-757e-d6a0-6dbb-b11ab1a23dcc | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-208 | growIn | dom:body:nth-of-type(1)>section:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(2)>div:nth-of-type(2)>form:nth-of-type(1)>div:nth-of-type(4)>a:nth-of-type(1) | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":600,"direction":null,"effectIn":true} | main, medium, small, tiny |
| e-226 | slideInBottom | dom:body:nth-of-type(1)>section:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1) | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-320 | a | wf:31ceb2a2-0ab3-5832-6e6c-056646482e59 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-321 | a-4 | wf:31ceb2a2-0ab3-5832-6e6c-056646482e59 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-322 | a | wf:31ceb2a2-0ab3-5832-6e6c-056646482e59 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-323 | a-2 | wf:31ceb2a2-0ab3-5832-6e6c-056646482e59 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-324 | a | wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-325 | a-4 | wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-326 | a | wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-327 | a-2 | wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-421 | slideInBottom | dom:body:nth-of-type(1)>div:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(1)>a:nth-of-type(1)<br>dom:body:nth-of-type(1)>div:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(1)>a:nth-of-type(2)<br>dom:body:nth-of-type(1)>div:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(1)>a:nth-of-type(3)<br>dom:body:nth-of-type(1)>div:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(1)>a:nth-of-type(4)<br>dom:body:nth-of-type(1)>div:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(1)>a:nth-of-type(5)<br>dom:body:nth-of-type(1)>div:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(1)>a:nth-of-type(6) | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-667 | slideInBottom | wf:12779da6-57f4-1edc-0b0f-c14d7c69e8c1 | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":1000,"direction":"BOTTOM","effectIn":true} | main |
| e-927 | growIn | dom:body:nth-of-type(1)>section:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(2)>div:nth-of-type(2)>form:nth-of-type(1)>div:nth-of-type(4)>a:nth-of-type(1) | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":600,"direction":null,"effectIn":true} | main, medium, small, tiny |
| e-994 | slideInBottom | wf:16d7fccc-bcba-2654-d5a1-45df58a85386 | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":400,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-996 | slideInBottom | wf:16d7fccc-bcba-2654-d5a1-45df58a85388 | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":600,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-998 | fadeIn | wf:16d7fccc-bcba-2654-d5a1-45df58a8537c | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":200,"direction":null,"effectIn":true} | main, medium, small, tiny |

### /su-di-noi/tutto-in-un-unico-luogo

| Event | Action list | Trigger target | Source trigger parameters | Media |
|---|---|---|---|---|
| e-15 | a-2 | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846<br>wf:31ceb2a2-0ab3-5832-6e6c-056646482e59<br>wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-34 | a | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846<br>wf:31ceb2a2-0ab3-5832-6e6c-056646482e59<br>wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-37 | a | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-38 | a-2 | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-39 | a | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-40 | a-4 | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-117 | a-8 | wf:511a527c-0818-f243-94fb-c91d2b84e762 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-118 | a-9 | wf:511a527c-0818-f243-94fb-c91d2b84e762 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-119 | a-9 | wf:511a527c-0818-f243-94fb-c91d2b84e753 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-121 | growIn | dom:body:nth-of-type(1)>section:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1) | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":200,"direction":null,"effectIn":true} | main, medium, small, tiny |
| e-131 | a-11 | wf:1b710e68-38ef-1a3b-db46-5efe98f74eeb | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-137 | a-11 | wf:15ecb568-2be4-e312-298d-bf6af4efc643 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-194 | slideInBottom | wf:b3f8e1d2-757e-d6a0-6dbb-b11ab1a23dd0 | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":400,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-196 | slideInBottom | wf:b3f8e1d2-757e-d6a0-6dbb-b11ab1a23dca | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-200 | slideInBottom | wf:b3f8e1d2-757e-d6a0-6dbb-b11ab1a23dcc | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-208 | growIn | dom:body:nth-of-type(1)>section:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(2)>div:nth-of-type(2)>form:nth-of-type(1)>div:nth-of-type(4)>a:nth-of-type(1) | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":600,"direction":null,"effectIn":true} | main, medium, small, tiny |
| e-226 | slideInBottom | dom:body:nth-of-type(1)>section:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1) | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-320 | a | wf:31ceb2a2-0ab3-5832-6e6c-056646482e59 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-321 | a-4 | wf:31ceb2a2-0ab3-5832-6e6c-056646482e59 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-322 | a | wf:31ceb2a2-0ab3-5832-6e6c-056646482e59 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-323 | a-2 | wf:31ceb2a2-0ab3-5832-6e6c-056646482e59 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-324 | a | wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-325 | a-4 | wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-326 | a | wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-327 | a-2 | wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-421 | slideInBottom | dom:body:nth-of-type(1)>div:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(1)>a:nth-of-type(1)<br>dom:body:nth-of-type(1)>div:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(1)>a:nth-of-type(2)<br>dom:body:nth-of-type(1)>div:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(1)>a:nth-of-type(3)<br>dom:body:nth-of-type(1)>div:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(1)>a:nth-of-type(4)<br>dom:body:nth-of-type(1)>div:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(1)>a:nth-of-type(5)<br>dom:body:nth-of-type(1)>div:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(1)>a:nth-of-type(6) | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-667 | slideInBottom | wf:12779da6-57f4-1edc-0b0f-c14d7c69e8c1 | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":1000,"direction":"BOTTOM","effectIn":true} | main |
| e-927 | growIn | dom:body:nth-of-type(1)>section:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(2)>div:nth-of-type(2)>form:nth-of-type(1)>div:nth-of-type(4)>a:nth-of-type(1) | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":600,"direction":null,"effectIn":true} | main, medium, small, tiny |
| e-988 | slideInBottom | wf:0d637b1a-7f15-be10-2c2d-9552949a0f59 | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":400,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-990 | slideInBottom | wf:0d637b1a-7f15-be10-2c2d-9552949a0f5b | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":600,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-992 | fadeIn | wf:0d637b1a-7f15-be10-2c2d-9552949a0f4f | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":200,"direction":null,"effectIn":true} | main, medium, small, tiny |

### /su-di-noi/i-nostri-specialisti

| Event | Action list | Trigger target | Source trigger parameters | Media |
|---|---|---|---|---|
| e-15 | a-2 | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846<br>wf:31ceb2a2-0ab3-5832-6e6c-056646482e59<br>wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-34 | a | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846<br>wf:31ceb2a2-0ab3-5832-6e6c-056646482e59<br>wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-37 | a | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-38 | a-2 | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-39 | a | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-40 | a-4 | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-117 | a-8 | wf:511a527c-0818-f243-94fb-c91d2b84e762 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-118 | a-9 | wf:511a527c-0818-f243-94fb-c91d2b84e762 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-119 | a-9 | wf:511a527c-0818-f243-94fb-c91d2b84e753 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-121 | growIn | dom:body:nth-of-type(1)>section:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1) | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":200,"direction":null,"effectIn":true} | main, medium, small, tiny |
| e-131 | a-11 | wf:1b710e68-38ef-1a3b-db46-5efe98f74eeb | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-137 | a-11 | wf:15ecb568-2be4-e312-298d-bf6af4efc643 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-194 | slideInBottom | wf:b3f8e1d2-757e-d6a0-6dbb-b11ab1a23dd0 | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":400,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-196 | slideInBottom | wf:b3f8e1d2-757e-d6a0-6dbb-b11ab1a23dca | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-200 | slideInBottom | wf:b3f8e1d2-757e-d6a0-6dbb-b11ab1a23dcc | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-208 | growIn | dom:body:nth-of-type(1)>section:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(2)>div:nth-of-type(2)>form:nth-of-type(1)>div:nth-of-type(4)>a:nth-of-type(1) | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":600,"direction":null,"effectIn":true} | main, medium, small, tiny |
| e-226 | slideInBottom | dom:body:nth-of-type(1)>section:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1) | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-320 | a | wf:31ceb2a2-0ab3-5832-6e6c-056646482e59 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-321 | a-4 | wf:31ceb2a2-0ab3-5832-6e6c-056646482e59 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-322 | a | wf:31ceb2a2-0ab3-5832-6e6c-056646482e59 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-323 | a-2 | wf:31ceb2a2-0ab3-5832-6e6c-056646482e59 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-324 | a | wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-325 | a-4 | wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-326 | a | wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-327 | a-2 | wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-421 | slideInBottom | dom:body:nth-of-type(1)>div:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(1)>a:nth-of-type(1)<br>dom:body:nth-of-type(1)>div:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(1)>a:nth-of-type(2)<br>dom:body:nth-of-type(1)>div:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(1)>a:nth-of-type(3)<br>dom:body:nth-of-type(1)>div:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(1)>a:nth-of-type(4)<br>dom:body:nth-of-type(1)>div:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(1)>a:nth-of-type(5)<br>dom:body:nth-of-type(1)>div:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(1)>a:nth-of-type(6) | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-667 | slideInBottom | wf:12779da6-57f4-1edc-0b0f-c14d7c69e8c1 | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":1000,"direction":"BOTTOM","effectIn":true} | main |
| e-927 | growIn | dom:body:nth-of-type(1)>section:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(2)>div:nth-of-type(2)>form:nth-of-type(1)>div:nth-of-type(4)>a:nth-of-type(1) | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":600,"direction":null,"effectIn":true} | main, medium, small, tiny |
| e-982 | slideInBottom | wf:a6032e27-ce92-d019-ecdc-67cf9d1fdaef | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":400,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-984 | slideInBottom | wf:a6032e27-ce92-d019-ecdc-67cf9d1fdaf1 | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":600,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-986 | fadeIn | wf:a6032e27-ce92-d019-ecdc-67cf9d1fdae5 | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":200,"direction":null,"effectIn":true} | main, medium, small, tiny |

### /prestazioni/corone-faccette-ponti-e-protesi

| Event | Action list | Trigger target | Source trigger parameters | Media |
|---|---|---|---|---|
| e-15 | a-2 | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846<br>wf:31ceb2a2-0ab3-5832-6e6c-056646482e59<br>wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-34 | a | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846<br>wf:31ceb2a2-0ab3-5832-6e6c-056646482e59<br>wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-37 | a | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-38 | a-2 | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-39 | a | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-40 | a-4 | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-71 | slideInBottom | id:w-node-d430cc2c-555c-6d7a-ff18-8922771fa88e-771fa88e<br>id:w-node-_11f7cd79-d19d-6f76-04ff-ce57e5706c5a-e5706c5a<br>id:w-node-_9db036bc-9bac-25ca-e571-158aa48dd517-a48dd517<br>id:w-node-_80120cd6-e65f-28c3-91c4-db8ef46ae663-f46ae663 | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-117 | a-8 | wf:511a527c-0818-f243-94fb-c91d2b84e762 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-118 | a-9 | wf:511a527c-0818-f243-94fb-c91d2b84e762 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-119 | a-9 | wf:511a527c-0818-f243-94fb-c91d2b84e753 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-121 | growIn | dom:body:nth-of-type(1)>section:nth-of-type(2)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1) | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":200,"direction":null,"effectIn":true} | main, medium, small, tiny |
| e-131 | a-11 | wf:1b710e68-38ef-1a3b-db46-5efe98f74eeb | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-137 | a-11 | wf:15ecb568-2be4-e312-298d-bf6af4efc643 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-194 | slideInBottom | wf:b3f8e1d2-757e-d6a0-6dbb-b11ab1a23dd0 | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":400,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-196 | slideInBottom | wf:b3f8e1d2-757e-d6a0-6dbb-b11ab1a23dca | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-200 | slideInBottom | wf:b3f8e1d2-757e-d6a0-6dbb-b11ab1a23dcc | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-208 | growIn | dom:body:nth-of-type(1)>section:nth-of-type(2)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(2)>div:nth-of-type(2)>form:nth-of-type(1)>div:nth-of-type(4)>a:nth-of-type(1) | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":600,"direction":null,"effectIn":true} | main, medium, small, tiny |
| e-226 | slideInBottom | dom:body:nth-of-type(1)>section:nth-of-type(2)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1) | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-320 | a | wf:31ceb2a2-0ab3-5832-6e6c-056646482e59 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-321 | a-4 | wf:31ceb2a2-0ab3-5832-6e6c-056646482e59 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-322 | a | wf:31ceb2a2-0ab3-5832-6e6c-056646482e59 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-323 | a-2 | wf:31ceb2a2-0ab3-5832-6e6c-056646482e59 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-324 | a | wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-325 | a-4 | wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-326 | a | wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-327 | a-2 | wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-409 | slideInBottom | dom:body:nth-of-type(1)>div:nth-of-type(3)>div:nth-of-type(2)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1) | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-421 | slideInBottom | dom:body:nth-of-type(1)>div:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(1)>a:nth-of-type(1)<br>dom:body:nth-of-type(1)>div:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(1)>a:nth-of-type(2)>div:nth-of-type(1)<br>dom:body:nth-of-type(1)>div:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(1)>a:nth-of-type(3)<br>dom:body:nth-of-type(1)>div:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(1)>a:nth-of-type(4)<br>id:prednost | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-425 | slideInBottom | wf:47933700-bb97-b61f-e191-7a4f486d24bd | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | medium, small, tiny |
| e-650 | slideInBottom | wf:47933700-bb97-b61f-e191-7a4f486d24bd | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":1000,"direction":"BOTTOM","effectIn":true} | main |
| e-925 | slideInBottom | id:w-node-d430cc2c-555c-6d7a-ff18-8922771fa88e-771fa88e<br>id:w-node-_11f7cd79-d19d-6f76-04ff-ce57e5706c5a-e5706c5a<br>id:w-node-_9db036bc-9bac-25ca-e571-158aa48dd517-a48dd517<br>id:w-node-_80120cd6-e65f-28c3-91c4-db8ef46ae663-f46ae663 | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-927 | growIn | dom:body:nth-of-type(1)>section:nth-of-type(2)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(2)>div:nth-of-type(2)>form:nth-of-type(1)>div:nth-of-type(4)>a:nth-of-type(1) | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":600,"direction":null,"effectIn":true} | main, medium, small, tiny |
| e-976 | slideInBottom | wf:61a35851-d3c5-53bb-891c-a1a10d687995 | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":400,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-978 | slideInBottom | wf:61a35851-d3c5-53bb-891c-a1a10d687997 | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":600,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-980 | fadeIn | wf:61a35851-d3c5-53bb-891c-a1a10d68798b | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":200,"direction":null,"effectIn":true} | main, medium, small, tiny |

### /prestazioni/sbiancamento-dei-denti

| Event | Action list | Trigger target | Source trigger parameters | Media |
|---|---|---|---|---|
| e-15 | a-2 | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846<br>wf:31ceb2a2-0ab3-5832-6e6c-056646482e59<br>wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-34 | a | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846<br>wf:31ceb2a2-0ab3-5832-6e6c-056646482e59<br>wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-37 | a | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-38 | a-2 | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-39 | a | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-40 | a-4 | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-71 | slideInBottom | id:w-node-d430cc2c-555c-6d7a-ff18-8922771fa88e-771fa88e<br>id:w-node-_11f7cd79-d19d-6f76-04ff-ce57e5706c5a-e5706c5a<br>id:w-node-_1d7ffbd5-8dbd-bf93-8a74-9fdeb3200f80-b3200f80<br>id:w-node-_80120cd6-e65f-28c3-91c4-db8ef46ae663-f46ae663 | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-117 | a-8 | wf:511a527c-0818-f243-94fb-c91d2b84e762 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-118 | a-9 | wf:511a527c-0818-f243-94fb-c91d2b84e762 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-119 | a-9 | wf:511a527c-0818-f243-94fb-c91d2b84e753 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-121 | growIn | dom:body:nth-of-type(1)>section:nth-of-type(2)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1) | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":200,"direction":null,"effectIn":true} | main, medium, small, tiny |
| e-131 | a-11 | wf:1b710e68-38ef-1a3b-db46-5efe98f74eeb | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-137 | a-11 | wf:15ecb568-2be4-e312-298d-bf6af4efc643 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-194 | slideInBottom | wf:b3f8e1d2-757e-d6a0-6dbb-b11ab1a23dd0 | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":400,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-196 | slideInBottom | wf:b3f8e1d2-757e-d6a0-6dbb-b11ab1a23dca | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-200 | slideInBottom | wf:b3f8e1d2-757e-d6a0-6dbb-b11ab1a23dcc | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-208 | growIn | dom:body:nth-of-type(1)>section:nth-of-type(2)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(2)>div:nth-of-type(2)>form:nth-of-type(1)>div:nth-of-type(4)>a:nth-of-type(1) | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":600,"direction":null,"effectIn":true} | main, medium, small, tiny |
| e-226 | slideInBottom | dom:body:nth-of-type(1)>section:nth-of-type(2)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1) | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-320 | a | wf:31ceb2a2-0ab3-5832-6e6c-056646482e59 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-321 | a-4 | wf:31ceb2a2-0ab3-5832-6e6c-056646482e59 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-322 | a | wf:31ceb2a2-0ab3-5832-6e6c-056646482e59 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-323 | a-2 | wf:31ceb2a2-0ab3-5832-6e6c-056646482e59 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-324 | a | wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-325 | a-4 | wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-326 | a | wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-327 | a-2 | wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-409 | slideInBottom | dom:body:nth-of-type(1)>div:nth-of-type(3)>div:nth-of-type(2)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1) | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-421 | slideInBottom | dom:body:nth-of-type(1)>div:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(2)<br>dom:body:nth-of-type(1)>div:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(3)<br>dom:body:nth-of-type(1)>div:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(4)<br>dom:body:nth-of-type(1)>div:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(5)<br>dom:body:nth-of-type(1)>div:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(6)<br>id:prednost | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-425 | slideInBottom | wf:47933700-bb97-b61f-e191-7a4f486d24bd | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | medium, small, tiny |
| e-575 | slideInBottom | wf:47933700-bb97-b61f-e191-7a4f486d24bd | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":1000,"direction":"BOTTOM","effectIn":true} | main |
| e-925 | slideInBottom | id:w-node-d430cc2c-555c-6d7a-ff18-8922771fa88e-771fa88e<br>id:w-node-_11f7cd79-d19d-6f76-04ff-ce57e5706c5a-e5706c5a<br>id:w-node-_1d7ffbd5-8dbd-bf93-8a74-9fdeb3200f80-b3200f80<br>id:w-node-_80120cd6-e65f-28c3-91c4-db8ef46ae663-f46ae663 | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-927 | growIn | dom:body:nth-of-type(1)>section:nth-of-type(2)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(2)>div:nth-of-type(2)>form:nth-of-type(1)>div:nth-of-type(4)>a:nth-of-type(1) | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":600,"direction":null,"effectIn":true} | main, medium, small, tiny |
| e-970 | slideInBottom | wf:40db17d3-bb4c-400e-5f45-1c86386aa915 | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":400,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-972 | slideInBottom | wf:40db17d3-bb4c-400e-5f45-1c86386aa917 | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":600,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-974 | fadeIn | wf:40db17d3-bb4c-400e-5f45-1c86386aa90b | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":200,"direction":null,"effectIn":true} | main, medium, small, tiny |

### /prestazioni/premium-ponte-fisso-su-impianti

| Event | Action list | Trigger target | Source trigger parameters | Media |
|---|---|---|---|---|
| e-15 | a-2 | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846<br>wf:31ceb2a2-0ab3-5832-6e6c-056646482e59<br>wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-34 | a | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846<br>wf:31ceb2a2-0ab3-5832-6e6c-056646482e59<br>wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-37 | a | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-38 | a-2 | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-39 | a | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-40 | a-4 | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-71 | slideInBottom | id:w-node-d430cc2c-555c-6d7a-ff18-8922771fa88e-771fa88e<br>id:w-node-_9db036bc-9bac-25ca-e571-158aa48dd517-a48dd517<br>id:w-node-_1d7ffbd5-8dbd-bf93-8a74-9fdeb3200f80-b3200f80<br>id:w-node-_80120cd6-e65f-28c3-91c4-db8ef46ae663-f46ae663 | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-117 | a-8 | wf:511a527c-0818-f243-94fb-c91d2b84e762 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-118 | a-9 | wf:511a527c-0818-f243-94fb-c91d2b84e762 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-119 | a-9 | wf:511a527c-0818-f243-94fb-c91d2b84e753 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-121 | growIn | dom:body:nth-of-type(1)>section:nth-of-type(2)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1) | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":200,"direction":null,"effectIn":true} | main, medium, small, tiny |
| e-131 | a-11 | wf:1b710e68-38ef-1a3b-db46-5efe98f74eeb | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-137 | a-11 | wf:15ecb568-2be4-e312-298d-bf6af4efc643 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-194 | slideInBottom | wf:b3f8e1d2-757e-d6a0-6dbb-b11ab1a23dd0 | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":400,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-196 | slideInBottom | wf:b3f8e1d2-757e-d6a0-6dbb-b11ab1a23dca | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-200 | slideInBottom | wf:b3f8e1d2-757e-d6a0-6dbb-b11ab1a23dcc | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-208 | growIn | dom:body:nth-of-type(1)>section:nth-of-type(2)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(2)>div:nth-of-type(2)>form:nth-of-type(1)>div:nth-of-type(4)>a:nth-of-type(1) | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":600,"direction":null,"effectIn":true} | main, medium, small, tiny |
| e-226 | slideInBottom | dom:body:nth-of-type(1)>section:nth-of-type(2)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1) | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-320 | a | wf:31ceb2a2-0ab3-5832-6e6c-056646482e59 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-321 | a-4 | wf:31ceb2a2-0ab3-5832-6e6c-056646482e59 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-322 | a | wf:31ceb2a2-0ab3-5832-6e6c-056646482e59 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-323 | a-2 | wf:31ceb2a2-0ab3-5832-6e6c-056646482e59 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-324 | a | wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-325 | a-4 | wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-326 | a | wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-327 | a-2 | wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-409 | slideInBottom | dom:body:nth-of-type(1)>div:nth-of-type(3)>div:nth-of-type(2)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1) | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-421 | slideInBottom | dom:body:nth-of-type(1)>div:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(2)<br>dom:body:nth-of-type(1)>div:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(3)<br>dom:body:nth-of-type(1)>div:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(4)<br>dom:body:nth-of-type(1)>div:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(5)<br>dom:body:nth-of-type(1)>div:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(6)<br>dom:body:nth-of-type(1)>div:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(7)<br>dom:body:nth-of-type(1)>div:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(8)<br>id:prednost | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-425 | slideInBottom | wf:47933700-bb97-b61f-e191-7a4f486d24bd | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | medium, small, tiny |
| e-500 | slideInBottom | wf:47933700-bb97-b61f-e191-7a4f486d24bd | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":1000,"direction":"BOTTOM","effectIn":true} | main |
| e-925 | slideInBottom | id:w-node-d430cc2c-555c-6d7a-ff18-8922771fa88e-771fa88e<br>id:w-node-_9db036bc-9bac-25ca-e571-158aa48dd517-a48dd517<br>id:w-node-_1d7ffbd5-8dbd-bf93-8a74-9fdeb3200f80-b3200f80<br>id:w-node-_80120cd6-e65f-28c3-91c4-db8ef46ae663-f46ae663 | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-927 | growIn | dom:body:nth-of-type(1)>section:nth-of-type(2)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(2)>div:nth-of-type(2)>form:nth-of-type(1)>div:nth-of-type(4)>a:nth-of-type(1) | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":600,"direction":null,"effectIn":true} | main, medium, small, tiny |
| e-964 | slideInBottom | wf:5a2b2d6d-230a-9146-dc80-a8115fff807a | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":400,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-966 | slideInBottom | wf:5a2b2d6d-230a-9146-dc80-a8115fff807c | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":600,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-968 | fadeIn | wf:5a2b2d6d-230a-9146-dc80-a8115fff8070 | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":200,"direction":null,"effectIn":true} | main, medium, small, tiny |

### /prestazioni/protesi-definitiva-ancorata-su-4-impianti

| Event | Action list | Trigger target | Source trigger parameters | Media |
|---|---|---|---|---|
| e-15 | a-2 | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846<br>wf:31ceb2a2-0ab3-5832-6e6c-056646482e59<br>wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-34 | a | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846<br>wf:31ceb2a2-0ab3-5832-6e6c-056646482e59<br>wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-37 | a | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-38 | a-2 | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-39 | a | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-40 | a-4 | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-71 | slideInBottom | id:w-node-_11f7cd79-d19d-6f76-04ff-ce57e5706c5a-e5706c5a<br>id:w-node-_9db036bc-9bac-25ca-e571-158aa48dd517-a48dd517<br>id:w-node-_1d7ffbd5-8dbd-bf93-8a74-9fdeb3200f80-b3200f80<br>id:w-node-_80120cd6-e65f-28c3-91c4-db8ef46ae663-f46ae663 | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-117 | a-8 | wf:511a527c-0818-f243-94fb-c91d2b84e762 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-118 | a-9 | wf:511a527c-0818-f243-94fb-c91d2b84e762 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-119 | a-9 | wf:511a527c-0818-f243-94fb-c91d2b84e753 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-121 | growIn | dom:body:nth-of-type(1)>section:nth-of-type(2)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1) | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":200,"direction":null,"effectIn":true} | main, medium, small, tiny |
| e-131 | a-11 | wf:1b710e68-38ef-1a3b-db46-5efe98f74eeb | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-137 | a-11 | wf:15ecb568-2be4-e312-298d-bf6af4efc643 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-194 | slideInBottom | wf:b3f8e1d2-757e-d6a0-6dbb-b11ab1a23dd0 | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":400,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-196 | slideInBottom | wf:b3f8e1d2-757e-d6a0-6dbb-b11ab1a23dca | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-200 | slideInBottom | wf:b3f8e1d2-757e-d6a0-6dbb-b11ab1a23dcc | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-208 | growIn | dom:body:nth-of-type(1)>section:nth-of-type(2)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(2)>div:nth-of-type(2)>form:nth-of-type(1)>div:nth-of-type(4)>a:nth-of-type(1) | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":600,"direction":null,"effectIn":true} | main, medium, small, tiny |
| e-226 | slideInBottom | dom:body:nth-of-type(1)>section:nth-of-type(2)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1) | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-320 | a | wf:31ceb2a2-0ab3-5832-6e6c-056646482e59 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-321 | a-4 | wf:31ceb2a2-0ab3-5832-6e6c-056646482e59 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-322 | a | wf:31ceb2a2-0ab3-5832-6e6c-056646482e59 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-323 | a-2 | wf:31ceb2a2-0ab3-5832-6e6c-056646482e59 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-324 | a | wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-325 | a-4 | wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-326 | a | wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-327 | a-2 | wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-409 | slideInBottom | dom:body:nth-of-type(1)>div:nth-of-type(3)>div:nth-of-type(2)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1) | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-417 | slideInBottom | wf:47933700-bb97-b61f-e191-7a4f486d24bd | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":1000,"direction":"BOTTOM","effectIn":true} | main |
| e-421 | slideInBottom | dom:body:nth-of-type(1)>div:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(2)<br>dom:body:nth-of-type(1)>div:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(3)<br>dom:body:nth-of-type(1)>div:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(4)<br>dom:body:nth-of-type(1)>div:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(5)<br>dom:body:nth-of-type(1)>div:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(6)<br>dom:body:nth-of-type(1)>div:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(7)<br>dom:body:nth-of-type(1)>div:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(8)<br>dom:body:nth-of-type(1)>div:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(9)<br>id:prednost | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-425 | slideInBottom | wf:47933700-bb97-b61f-e191-7a4f486d24bd | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | medium, small, tiny |
| e-925 | slideInBottom | id:w-node-_11f7cd79-d19d-6f76-04ff-ce57e5706c5a-e5706c5a<br>id:w-node-_9db036bc-9bac-25ca-e571-158aa48dd517-a48dd517<br>id:w-node-_1d7ffbd5-8dbd-bf93-8a74-9fdeb3200f80-b3200f80<br>id:w-node-_80120cd6-e65f-28c3-91c4-db8ef46ae663-f46ae663 | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-927 | growIn | dom:body:nth-of-type(1)>section:nth-of-type(2)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(2)>div:nth-of-type(2)>form:nth-of-type(1)>div:nth-of-type(4)>a:nth-of-type(1) | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":600,"direction":null,"effectIn":true} | main, medium, small, tiny |
| e-958 | slideInBottom | wf:b529a6c9-65db-e4e1-0fb7-85794f6f9d56 | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":400,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-960 | slideInBottom | wf:b529a6c9-65db-e4e1-0fb7-85794f6f9d58 | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":600,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-962 | fadeIn | wf:b529a6c9-65db-e4e1-0fb7-85794f6f9d4c | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":200,"direction":null,"effectIn":true} | main, medium, small, tiny |

### /

| Event | Action list | Trigger target | Source trigger parameters | Media |
|---|---|---|---|---|
| e-15 | a-2 | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846<br>wf:31ceb2a2-0ab3-5832-6e6c-056646482e59<br>wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-34 | a | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846<br>wf:31ceb2a2-0ab3-5832-6e6c-056646482e59<br>wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-37 | a | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-38 | a-2 | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-39 | a | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-40 | a-4 | wf:82b2ce1d-fc74-8408-a46c-893c2f6ef846 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-65 | growIn | dom:body:nth-of-type(1)>section:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(2)>div:nth-of-type(1)>div:nth-of-type(1)<br>dom:body:nth-of-type(1)>section:nth-of-type(6)>section:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(2)>div:nth-of-type(1)>div:nth-of-type(2) | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":200,"direction":null,"effectIn":true} | main, medium, small, tiny |
| e-71 | slideInBottom | id:w-node-_4e75e80f-18e3-7eb0-519d-3b33dc5a3c68-dc5a3c5c<br>id:w-node-_4e75e80f-18e3-7eb0-519d-3b33dc5a3c6f-dc5a3c5c<br>id:w-node-_4e75e80f-18e3-7eb0-519d-3b33dc5a3c77-dc5a3c5c<br>id:w-node-_4e75e80f-18e3-7eb0-519d-3b33dc5a3c7e-dc5a3c5c<br>id:w-node-_4e75e80f-18e3-7eb0-519d-3b33dc5a3c85-dc5a3c5c<br>id:w-node-_4e75e80f-18e3-7eb0-519d-3b33dc5a3c8c-dc5a3c5c<br>id:w-node-_4e75e80f-18e3-7eb0-519d-3b33dc5a3c93-dc5a3c5c<br>id:w-node-_4e75e80f-18e3-7eb0-519d-3b33dc5a3c9a-dc5a3c5c | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-90 | slideInBottom | dom:body:nth-of-type(1)>section:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(2)>div:nth-of-type(2)>div:nth-of-type(1)>div:nth-of-type(2)>div:nth-of-type(1)<br>dom:body:nth-of-type(1)>section:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(2)>div:nth-of-type(2)>div:nth-of-type(1)>div:nth-of-type(2)>div:nth-of-type(2)<br>dom:body:nth-of-type(1)>section:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(2)>div:nth-of-type(2)>div:nth-of-type(1)>div:nth-of-type(2)>div:nth-of-type(3)<br>dom:body:nth-of-type(1)>section:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(2)>div:nth-of-type(2)>div:nth-of-type(1)>div:nth-of-type(2)>div:nth-of-type(4) | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-91 | growIn | wf:c5b4d3d6-9300-613f-7c22-f4b3d5b0c369 | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":400,"direction":null,"effectIn":true} | main, medium, small, tiny |
| e-98 | slideInBottom | wf:c5b4d3d6-9300-613f-7c22-f4b3d5b0c365 | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-117 | a-8 | wf:511a527c-0818-f243-94fb-c91d2b84e762 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-118 | a-9 | wf:511a527c-0818-f243-94fb-c91d2b84e762 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-119 | a-9 | wf:511a527c-0818-f243-94fb-c91d2b84e753 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-121 | growIn | dom:body:nth-of-type(1)>div:nth-of-type(2)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)<br>dom:body:nth-of-type(1)>section:nth-of-type(5)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)<br>dom:body:nth-of-type(1)>section:nth-of-type(6)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)<br>dom:body:nth-of-type(1)>section:nth-of-type(7)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)<br>dom:body:nth-of-type(1)>section:nth-of-type(8)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)<br>dom:body:nth-of-type(1)>section:nth-of-type(9)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1) | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":200,"direction":null,"effectIn":true} | main, medium, small, tiny |
| e-123 | slideInBottom | wf:6eb75b0e-231b-7e70-8326-eb772b8c8d35 | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-131 | a-11 | wf:1b710e68-38ef-1a3b-db46-5efe98f74eeb | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-137 | a-11 | wf:15ecb568-2be4-e312-298d-bf6af4efc643 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-143 | slideInBottom | wf:48eb149b-bbbd-805c-69ed-1266a6343387 | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-145 | slideInBottom | wf:48eb149b-bbbd-805c-69ed-1266a6343389 | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-160 | slideInBottom | wf:587b085b-0eb5-6f0e-763d-212fecd904e8 | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-162 | growIn | wf:587b085b-0eb5-6f0e-763d-212fecd904ec | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":400,"direction":null,"effectIn":true} | main, medium, small, tiny |
| e-164 | slideInBottom | wf:587b085b-0eb5-6f0e-763d-212fecd904f1 | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-166 | slideInBottom | wf:587b085b-0eb5-6f0e-763d-212fecd904f3 | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":400,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-178 | growIn | wf:2218f1d9-b81b-56c5-3884-620b224831ba<br>wf:2218f1d9-b81b-56c5-3884-620b224831c7<br>wf:2218f1d9-b81b-56c5-3884-620b224831d5<br>wf:2218f1d9-b81b-56c5-3884-620b224831e2<br>wf:2218f1d9-b81b-56c5-3884-620b224831ef<br>wf:2218f1d9-b81b-56c5-3884-620b224831ff | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":300,"direction":null,"effectIn":true} | main, medium, small, tiny |
| e-194 | slideInBottom | wf:b3f8e1d2-757e-d6a0-6dbb-b11ab1a23dd0 | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":400,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-196 | slideInBottom | wf:b3f8e1d2-757e-d6a0-6dbb-b11ab1a23dca | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-200 | slideInBottom | wf:b3f8e1d2-757e-d6a0-6dbb-b11ab1a23dcc | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-208 | growIn | dom:body:nth-of-type(1)>section:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(2)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>a:nth-of-type(1)<br>dom:body:nth-of-type(1)>section:nth-of-type(2)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>a:nth-of-type(1)<br>dom:body:nth-of-type(1)>section:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(2)>div:nth-of-type(2)>div:nth-of-type(1)>a:nth-of-type(1)<br>wf:c5b4d3d6-9300-613f-7c22-f4b3d5b0c394<br>wf:c5b4d3d6-9300-613f-7c22-f4b3d5b0c39b<br>dom:body:nth-of-type(1)>section:nth-of-type(7)>div:nth-of-type(2)>div:nth-of-type(9)>a:nth-of-type(1)<br>dom:body:nth-of-type(1)>section:nth-of-type(8)>div:nth-of-type(2)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(2)>div:nth-of-type(1)>a:nth-of-type(1)<br>dom:body:nth-of-type(1)>section:nth-of-type(9)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(2)>div:nth-of-type(2)>form:nth-of-type(1)>div:nth-of-type(4)>a:nth-of-type(1) | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":600,"direction":null,"effectIn":true} | main, medium, small, tiny |
| e-216 | slideInBottom | wf:9c53a310-f6d3-5353-2e81-56655663a8fc | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-226 | slideInBottom | dom:body:nth-of-type(1)>div:nth-of-type(2)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)<br>dom:body:nth-of-type(1)>section:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(2)>div:nth-of-type(2)>div:nth-of-type(1)>div:nth-of-type(1)<br>dom:body:nth-of-type(1)>section:nth-of-type(5)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)<br>dom:body:nth-of-type(1)>section:nth-of-type(6)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)<br>dom:body:nth-of-type(1)>section:nth-of-type(7)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)<br>dom:body:nth-of-type(1)>section:nth-of-type(8)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)<br>dom:body:nth-of-type(1)>section:nth-of-type(9)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1) | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-248 | growIn | wf:c5b4d3d6-9300-613f-7c22-f4b3d5b0c394 | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":600,"direction":null,"effectIn":true} | main, medium, small, tiny |
| e-250 | growIn | wf:c5b4d3d6-9300-613f-7c22-f4b3d5b0c39b | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":600,"direction":null,"effectIn":true} | main, medium, small, tiny |
| e-266 | slideInBottom | wf:587b085b-0eb5-6f0e-763d-212fecd904fc | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-276 | slideInBottom | wf:c5b4d3d6-9300-613f-7c22-f4b3d5b0c359 | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-278 | slideInBottom | wf:c5b4d3d6-9300-613f-7c22-f4b3d5b0c35b | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-292 | slideInBottom | wf:4e75e80f-18e3-7eb0-519d-3b33dc5a3c63 | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-294 | slideInBottom | wf:4e75e80f-18e3-7eb0-519d-3b33dc5a3c65 | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-304 | fadeIn | wf:0a90ab12-2281-4c83-4a74-98b853ac0d7c | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":800,"direction":null,"effectIn":true} | main, medium, small, tiny |
| e-309 | slideInBottom | wf:0a90ab12-2281-4c83-4a74-98b853ac0d77 | {"loop":false,"playInReverse":false,"scrollOffsetValue":15,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-310 | fadeIn | wf:0a90ab12-2281-4c83-4a74-98b853ac0d88 | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":1200,"direction":null,"effectIn":true} | main, medium, small, tiny |
| e-311 | fadeIn | wf:0a90ab12-2281-4c83-4a74-98b853ac0d84 | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":1200,"direction":null,"effectIn":true} | main, medium, small, tiny |
| e-312 | fadeIn | wf:0a90ab12-2281-4c83-4a74-98b853ac0d80 | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":1000,"direction":null,"effectIn":true} | main, medium, small, tiny |
| e-320 | a | wf:31ceb2a2-0ab3-5832-6e6c-056646482e59 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-321 | a-4 | wf:31ceb2a2-0ab3-5832-6e6c-056646482e59 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-322 | a | wf:31ceb2a2-0ab3-5832-6e6c-056646482e59 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-323 | a-2 | wf:31ceb2a2-0ab3-5832-6e6c-056646482e59 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-324 | a | wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-325 | a-4 | wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-326 | a | wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-327 | a-2 | wf:4c3fd33f-e263-1f21-639c-f87aaf2ae9c6 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | medium, small, tiny |
| e-610 | a-13 | wf:2218f1d9-b81b-56c5-3884-620b224831ef | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-611 | a-14 | wf:2218f1d9-b81b-56c5-3884-620b224831ef | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-612 | a-13 | wf:2218f1d9-b81b-56c5-3884-620b224831ba | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-613 | a-14 | wf:2218f1d9-b81b-56c5-3884-620b224831ba | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-614 | a-13 | wf:2218f1d9-b81b-56c5-3884-620b224831d5 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-615 | a-14 | wf:2218f1d9-b81b-56c5-3884-620b224831d5 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-616 | a-13 | wf:2218f1d9-b81b-56c5-3884-620b224831e2 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-617 | a-14 | wf:2218f1d9-b81b-56c5-3884-620b224831e2 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-618 | a-13 | wf:2218f1d9-b81b-56c5-3884-620b224831c7 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-619 | a-14 | wf:2218f1d9-b81b-56c5-3884-620b224831c7 | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-632 | slideInBottom | wf:2218f1d9-b81b-56c5-3884-620b224831b0 | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-642 | a-13 | wf:2218f1d9-b81b-56c5-3884-620b224831ff | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-643 | a-14 | wf:2218f1d9-b81b-56c5-3884-620b224831ff | {"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null} | main, medium, small, tiny |
| e-652 | a-16 | wf:d3e4039d-1047-196a-d5e2-3d7716c973dc | [{"continuousParameterGroupId":"a-16-p","smoothing":80,"startsEntering":true,"addStartOffset":false,"addOffsetValue":50,"startsExiting":false,"addEndOffset":false,"endOffsetValue":50}] | main |
| e-653 | slideInBottom | wf:d3e4039d-1047-196a-d5e2-3d7716c973dc | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-919 | slideInBottom | wf:7513ce3d-bbc6-d394-0a6f-1c43fb6f7e96 | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-921 | slideInBottom | wf:7513ce3d-bbc6-d394-0a6f-1c43fb6f7e9a | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":400,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-925 | slideInBottom | id:w-node-_4e75e80f-18e3-7eb0-519d-3b33dc5a3c68-dc5a3c5c<br>id:w-node-_4e75e80f-18e3-7eb0-519d-3b33dc5a3c6f-dc5a3c5c<br>id:w-node-_4e75e80f-18e3-7eb0-519d-3b33dc5a3c77-dc5a3c5c<br>id:w-node-_4e75e80f-18e3-7eb0-519d-3b33dc5a3c7e-dc5a3c5c<br>id:w-node-_4e75e80f-18e3-7eb0-519d-3b33dc5a3c85-dc5a3c5c<br>id:w-node-_4e75e80f-18e3-7eb0-519d-3b33dc5a3c8c-dc5a3c5c<br>id:w-node-_4e75e80f-18e3-7eb0-519d-3b33dc5a3c93-dc5a3c5c<br>id:w-node-_4e75e80f-18e3-7eb0-519d-3b33dc5a3c9a-dc5a3c5c | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-927 | growIn | dom:body:nth-of-type(1)>section:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(2)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>a:nth-of-type(1)<br>dom:body:nth-of-type(1)>section:nth-of-type(2)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>a:nth-of-type(1)<br>dom:body:nth-of-type(1)>section:nth-of-type(4)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(2)>div:nth-of-type(2)>div:nth-of-type(1)>a:nth-of-type(1)<br>wf:c5b4d3d6-9300-613f-7c22-f4b3d5b0c394<br>wf:c5b4d3d6-9300-613f-7c22-f4b3d5b0c39b<br>dom:body:nth-of-type(1)>section:nth-of-type(7)>div:nth-of-type(2)>div:nth-of-type(9)>a:nth-of-type(1)<br>dom:body:nth-of-type(1)>section:nth-of-type(8)>div:nth-of-type(2)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(2)>div:nth-of-type(1)>a:nth-of-type(1)<br>dom:body:nth-of-type(1)>section:nth-of-type(9)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(2)>div:nth-of-type(2)>form:nth-of-type(1)>div:nth-of-type(4)>a:nth-of-type(1) | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":600,"direction":null,"effectIn":true} | main, medium, small, tiny |
| e-931 | fadeIn | wf:dc68493e-aa1d-3b37-c87e-efe2df3b57ab | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":800,"direction":null,"effectIn":true} | main, medium, small, tiny |
| e-933 | fadeIn | wf:dc68493e-aa1d-3b37-c87e-efe2df3b57af | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":1000,"direction":null,"effectIn":true} | main, medium, small, tiny |
| e-935 | fadeIn | wf:dc68493e-aa1d-3b37-c87e-efe2df3b57b3 | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":1200,"direction":null,"effectIn":true} | main, medium, small, tiny |
| e-937 | fadeIn | wf:dc68493e-aa1d-3b37-c87e-efe2df3b57b7 | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":1200,"direction":null,"effectIn":true} | main, medium, small, tiny |
| e-947 | fadeIn | wf:e3771198-23d7-48e1-2650-8d42f0d8a432 | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":800,"direction":null,"effectIn":true} | main, medium, small, tiny |
| e-949 | fadeIn | wf:e4c130a8-d368-e266-6b81-b0bc0dfdf816 | {"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":800,"direction":null,"effectIn":true} | main, medium, small, tiny |
| e-955 | a-17 | wf:0d5b0362-fcf9-1bb1-7bac-eb8ab173c653 | [{"continuousParameterGroupId":"a-17-p","smoothing":80,"startsEntering":true,"addStartOffset":false,"addOffsetValue":50,"startsExiting":false,"addEndOffset":false,"endOffsetValue":50}] | main |
| e-956 | slideInBottom | wf:0d5b0362-fcf9-1bb1-7bac-eb8ab173c653 | {"loop":false,"playInReverse":false,"scrollOffsetValue":10,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | main, medium, small, tiny |
| e-1116 | slideInBottom | dom:body:nth-of-type(1)>section:nth-of-type(3)>div:nth-of-type(2)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(2)<br>dom:body:nth-of-type(1)>section:nth-of-type(3)>div:nth-of-type(2)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(2)>div:nth-of-type(2)<br>dom:body:nth-of-type(1)>section:nth-of-type(3)>div:nth-of-type(2)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(3)>div:nth-of-type(2)<br>dom:body:nth-of-type(1)>section:nth-of-type(3)>div:nth-of-type(2)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(4)>div:nth-of-type(2)<br>dom:body:nth-of-type(1)>section:nth-of-type(5)>div:nth-of-type(2)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(2)<br>dom:body:nth-of-type(1)>section:nth-of-type(5)>div:nth-of-type(2)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(2)>div:nth-of-type(2)<br>dom:body:nth-of-type(1)>section:nth-of-type(5)>div:nth-of-type(2)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(3)>div:nth-of-type(2)<br>dom:body:nth-of-type(1)>section:nth-of-type(5)>div:nth-of-type(2)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(1)>div:nth-of-type(4)>div:nth-of-type(2) | {"loop":false,"playInReverse":false,"scrollOffsetValue":15,"scrollOffsetUnit":"%","delay":200,"direction":"BOTTOM","effectIn":true} | medium, small, tiny |

## Retained native configurations without static targets

- e-28 SCROLL_INTO_VIEW: `{"selector":".spacing-system-column","originalId":"695e1eeeb10c5fb8eeaba881|85b7818f-2251-a2bd-9de5-014812409507","appliesTo":"CLASS"}`
- e-57 SCROLL_INTO_VIEW: `{"selector":".naslov","originalId":"68e77742102a5915346dff84|0f6b029b-39c5-d212-ef8b-70e234a425f9","appliesTo":"CLASS"}`
- e-63 SCROLL_INTO_VIEW: `{"selector":".tekst-u-kartici","originalId":"695e1eeeb10c5fb8eeaba87c|588d95ef-dfa9-8f9c-6270-345450147b64","appliesTo":"CLASS"}`
- e-111 SCROLL_INTO_VIEW: `{"id":"a6383e85-b972-e425-5602-e5554d54c93d","appliesTo":"ELEMENT","styleBlockIds":[]}`
- e-113 SCROLL_INTO_VIEW: `{"id":"a6383e85-b972-e425-5602-e5554d54c941","appliesTo":"ELEMENT","styleBlockIds":[]}`
- e-115 SCROLL_INTO_VIEW: `{"id":"a6383e85-b972-e425-5602-e5554d54c945","appliesTo":"ELEMENT","styleBlockIds":[]}`
- e-129 MOUSE_CLICK: `{"id":"1b710e68-38ef-1a3b-db46-5efe98f74ee9","appliesTo":"ELEMENT","styleBlockIds":[]}`
- e-150 SCROLL_INTO_VIEW: `{"id":"695e1eeeb10c5fb8eeaba87c|5a3aae98-5b9b-d6e9-bb59-5512352ea155","appliesTo":"ELEMENT","styleBlockIds":[]}`
- e-152 SCROLL_INTO_VIEW: `{"id":"695e1eeeb10c5fb8eeaba87c|5a3aae98-5b9b-d6e9-bb59-5512352ea157","appliesTo":"ELEMENT","styleBlockIds":[]}`
- e-154 SCROLL_INTO_VIEW: `{"id":"695e1eeeb10c5fb8eeaba87c|5a3aae98-5b9b-d6e9-bb59-5512352ea15c","appliesTo":"ELEMENT","styleBlockIds":[]}`
- e-158 SCROLL_INTO_VIEW: `{"selector":".teaser-copy","originalId":"695e1eeeb10c5fb8eeaba87c|cdae8d47-2a28-0931-4ea6-1d7dbfdd80df","appliesTo":"CLASS"}`
- e-214 SCROLL_INTO_VIEW: `{"id":"cc408a31-c8ce-0e91-fda7-d347bbe4af46","appliesTo":"ELEMENT","styleBlockIds":[]}`
- e-224 SCROLL_INTO_VIEW: `{"selector":".primary-button-2","originalId":"587b085b-0eb5-6f0e-763d-212fecd9051c","appliesTo":"CLASS"}`
- e-230 SCROLL_INTO_VIEW: `{"selector":".testimonials-card-icon","originalId":"68e77a361a6b6c9df88dc2fa|b45722eb-4bdf-f1e2-4655-34878ad3fc83","appliesTo":"CLASS"}`
- e-234 SCROLL_INTO_VIEW: `{"selector":".client-name-wrapper.testimonials-page","originalId":"68e77a361a6b6c9df88dc2fa|e7034e34-2638-7ce5-37da-134a59bf4df9","appliesTo":"CLASS"}`
- e-308 SCROLL_INTO_VIEW: `{"selector":".primary-button-3","originalId":"6900ef60cb81226fff65126e|70df9349-97df-0337-3b60-d3ed6dc5cbba","appliesTo":"CLASS"}`
- e-357 SCROLL_INTO_VIEW: `{"id":"695e1eeeb10c5fb8eeaba882|5a3aae98-5b9b-d6e9-bb59-5512352ea155","appliesTo":"ELEMENT","styleBlockIds":[]}`
- e-359 SCROLL_INTO_VIEW: `{"id":"695e1eeeb10c5fb8eeaba882|5a3aae98-5b9b-d6e9-bb59-5512352ea157","appliesTo":"ELEMENT","styleBlockIds":[]}`
- e-361 SCROLL_INTO_VIEW: `{"id":"695e1eeeb10c5fb8eeaba882|5a3aae98-5b9b-d6e9-bb59-5512352ea15c","appliesTo":"ELEMENT","styleBlockIds":[]}`
- e-446 SCROLL_INTO_VIEW: `{"id":"695e1eeeb10c5fb8eeaba884|5a3aae98-5b9b-d6e9-bb59-5512352ea155","appliesTo":"ELEMENT","styleBlockIds":[]}`
- e-448 SCROLL_INTO_VIEW: `{"id":"695e1eeeb10c5fb8eeaba884|5a3aae98-5b9b-d6e9-bb59-5512352ea157","appliesTo":"ELEMENT","styleBlockIds":[]}`
- e-450 SCROLL_INTO_VIEW: `{"id":"695e1eeeb10c5fb8eeaba884|5a3aae98-5b9b-d6e9-bb59-5512352ea15c","appliesTo":"ELEMENT","styleBlockIds":[]}`
- e-521 SCROLL_INTO_VIEW: `{"id":"695e1eeeb10c5fb8eeaba885|5a3aae98-5b9b-d6e9-bb59-5512352ea155","appliesTo":"ELEMENT","styleBlockIds":[]}`
- e-523 SCROLL_INTO_VIEW: `{"id":"695e1eeeb10c5fb8eeaba885|5a3aae98-5b9b-d6e9-bb59-5512352ea157","appliesTo":"ELEMENT","styleBlockIds":[]}`
- e-525 SCROLL_INTO_VIEW: `{"id":"695e1eeeb10c5fb8eeaba885|5a3aae98-5b9b-d6e9-bb59-5512352ea15c","appliesTo":"ELEMENT","styleBlockIds":[]}`
- e-596 SCROLL_INTO_VIEW: `{"id":"695e1eeeb10c5fb8eeaba886|5a3aae98-5b9b-d6e9-bb59-5512352ea155","appliesTo":"ELEMENT","styleBlockIds":[]}`
- e-598 SCROLL_INTO_VIEW: `{"id":"695e1eeeb10c5fb8eeaba886|5a3aae98-5b9b-d6e9-bb59-5512352ea157","appliesTo":"ELEMENT","styleBlockIds":[]}`
- e-600 SCROLL_INTO_VIEW: `{"id":"695e1eeeb10c5fb8eeaba886|5a3aae98-5b9b-d6e9-bb59-5512352ea15c","appliesTo":"ELEMENT","styleBlockIds":[]}`
- e-655 SCROLL_INTO_VIEW: `{"id":"695e1eeeb10c5fb8eeaba888|5a3aae98-5b9b-d6e9-bb59-5512352ea155","appliesTo":"ELEMENT","styleBlockIds":[]}`
- e-657 SCROLL_INTO_VIEW: `{"id":"695e1eeeb10c5fb8eeaba888|5a3aae98-5b9b-d6e9-bb59-5512352ea157","appliesTo":"ELEMENT","styleBlockIds":[]}`
- e-659 SCROLL_INTO_VIEW: `{"id":"695e1eeeb10c5fb8eeaba888|5a3aae98-5b9b-d6e9-bb59-5512352ea15c","appliesTo":"ELEMENT","styleBlockIds":[]}`
- e-669 SCROLL_INTO_VIEW: `{"id":"695e1eeeb10c5fb8eeaba889|5a3aae98-5b9b-d6e9-bb59-5512352ea155","appliesTo":"ELEMENT","styleBlockIds":[]}`
- e-671 SCROLL_INTO_VIEW: `{"id":"695e1eeeb10c5fb8eeaba889|5a3aae98-5b9b-d6e9-bb59-5512352ea157","appliesTo":"ELEMENT","styleBlockIds":[]}`
- e-673 SCROLL_INTO_VIEW: `{"id":"695e1eeeb10c5fb8eeaba889|5a3aae98-5b9b-d6e9-bb59-5512352ea15c","appliesTo":"ELEMENT","styleBlockIds":[]}`
- e-683 SCROLL_INTO_VIEW: `{"id":"695e1eeeb10c5fb8eeaba88a|5a3aae98-5b9b-d6e9-bb59-5512352ea155","appliesTo":"ELEMENT","styleBlockIds":[]}`
- e-685 SCROLL_INTO_VIEW: `{"id":"695e1eeeb10c5fb8eeaba88a|5a3aae98-5b9b-d6e9-bb59-5512352ea157","appliesTo":"ELEMENT","styleBlockIds":[]}`
- e-687 SCROLL_INTO_VIEW: `{"id":"695e1eeeb10c5fb8eeaba88a|5a3aae98-5b9b-d6e9-bb59-5512352ea15c","appliesTo":"ELEMENT","styleBlockIds":[]}`
- e-697 SCROLL_INTO_VIEW: `{"id":"695e1eeeb10c5fb8eeaba88b|5a3aae98-5b9b-d6e9-bb59-5512352ea155","appliesTo":"ELEMENT","styleBlockIds":[]}`
- e-699 SCROLL_INTO_VIEW: `{"id":"695e1eeeb10c5fb8eeaba88b|5a3aae98-5b9b-d6e9-bb59-5512352ea157","appliesTo":"ELEMENT","styleBlockIds":[]}`
- e-701 SCROLL_INTO_VIEW: `{"id":"695e1eeeb10c5fb8eeaba88b|5a3aae98-5b9b-d6e9-bb59-5512352ea15c","appliesTo":"ELEMENT","styleBlockIds":[]}`
- e-711 SCROLL_INTO_VIEW: `{"id":"695e1eeeb10c5fb8eeaba88c|5a3aae98-5b9b-d6e9-bb59-5512352ea155","appliesTo":"ELEMENT","styleBlockIds":[]}`
- e-713 SCROLL_INTO_VIEW: `{"id":"695e1eeeb10c5fb8eeaba88c|5a3aae98-5b9b-d6e9-bb59-5512352ea157","appliesTo":"ELEMENT","styleBlockIds":[]}`
- e-715 SCROLL_INTO_VIEW: `{"id":"695e1eeeb10c5fb8eeaba88c|5a3aae98-5b9b-d6e9-bb59-5512352ea15c","appliesTo":"ELEMENT","styleBlockIds":[]}`
- e-725 SCROLL_INTO_VIEW: `{"id":"695e1eeeb10c5fb8eeaba88d|5a3aae98-5b9b-d6e9-bb59-5512352ea155","appliesTo":"ELEMENT","styleBlockIds":[]}`
- e-727 SCROLL_INTO_VIEW: `{"id":"695e1eeeb10c5fb8eeaba88d|5a3aae98-5b9b-d6e9-bb59-5512352ea157","appliesTo":"ELEMENT","styleBlockIds":[]}`
- e-729 SCROLL_INTO_VIEW: `{"id":"695e1eeeb10c5fb8eeaba88d|5a3aae98-5b9b-d6e9-bb59-5512352ea15c","appliesTo":"ELEMENT","styleBlockIds":[]}`
- e-737 SCROLL_INTO_VIEW: `{"id":"695e1eeeb10c5fb8eeaba890|5a3aae98-5b9b-d6e9-bb59-5512352ea155","appliesTo":"ELEMENT","styleBlockIds":[]}`
- e-739 SCROLL_INTO_VIEW: `{"id":"695e1eeeb10c5fb8eeaba890|5a3aae98-5b9b-d6e9-bb59-5512352ea157","appliesTo":"ELEMENT","styleBlockIds":[]}`
- e-741 SCROLL_INTO_VIEW: `{"id":"695e1eeeb10c5fb8eeaba890|5a3aae98-5b9b-d6e9-bb59-5512352ea15c","appliesTo":"ELEMENT","styleBlockIds":[]}`
- e-751 SCROLL_INTO_VIEW: `{"id":"695e1eeeb10c5fb8eeaba891|5a3aae98-5b9b-d6e9-bb59-5512352ea155","appliesTo":"ELEMENT","styleBlockIds":[]}`
- e-753 SCROLL_INTO_VIEW: `{"id":"695e1eeeb10c5fb8eeaba891|5a3aae98-5b9b-d6e9-bb59-5512352ea157","appliesTo":"ELEMENT","styleBlockIds":[]}`
- e-755 SCROLL_INTO_VIEW: `{"id":"695e1eeeb10c5fb8eeaba891|5a3aae98-5b9b-d6e9-bb59-5512352ea15c","appliesTo":"ELEMENT","styleBlockIds":[]}`
- e-763 SCROLL_INTO_VIEW: `{"id":"695e1eeeb10c5fb8eeaba892|5a3aae98-5b9b-d6e9-bb59-5512352ea155","appliesTo":"ELEMENT","styleBlockIds":[]}`
- e-765 SCROLL_INTO_VIEW: `{"id":"695e1eeeb10c5fb8eeaba892|5a3aae98-5b9b-d6e9-bb59-5512352ea157","appliesTo":"ELEMENT","styleBlockIds":[]}`
- e-767 SCROLL_INTO_VIEW: `{"id":"695e1eeeb10c5fb8eeaba892|5a3aae98-5b9b-d6e9-bb59-5512352ea15c","appliesTo":"ELEMENT","styleBlockIds":[]}`
- e-775 SCROLL_INTO_VIEW: `{"id":"695e1eeeb10c5fb8eeaba893|5a3aae98-5b9b-d6e9-bb59-5512352ea155","appliesTo":"ELEMENT","styleBlockIds":[]}`
- e-777 SCROLL_INTO_VIEW: `{"id":"695e1eeeb10c5fb8eeaba893|5a3aae98-5b9b-d6e9-bb59-5512352ea157","appliesTo":"ELEMENT","styleBlockIds":[]}`
- e-779 SCROLL_INTO_VIEW: `{"id":"695e1eeeb10c5fb8eeaba893|5a3aae98-5b9b-d6e9-bb59-5512352ea15c","appliesTo":"ELEMENT","styleBlockIds":[]}`
- e-787 SCROLL_INTO_VIEW: `{"id":"695e1eeeb10c5fb8eeaba894|5a3aae98-5b9b-d6e9-bb59-5512352ea155","appliesTo":"ELEMENT","styleBlockIds":[]}`
- e-789 SCROLL_INTO_VIEW: `{"id":"695e1eeeb10c5fb8eeaba894|5a3aae98-5b9b-d6e9-bb59-5512352ea157","appliesTo":"ELEMENT","styleBlockIds":[]}`
- e-791 SCROLL_INTO_VIEW: `{"id":"695e1eeeb10c5fb8eeaba894|5a3aae98-5b9b-d6e9-bb59-5512352ea15c","appliesTo":"ELEMENT","styleBlockIds":[]}`
- e-801 SCROLL_INTO_VIEW: `{"id":"695e1eeeb10c5fb8eeaba896|5a3aae98-5b9b-d6e9-bb59-5512352ea155","appliesTo":"ELEMENT","styleBlockIds":[]}`
- e-803 SCROLL_INTO_VIEW: `{"id":"695e1eeeb10c5fb8eeaba896|5a3aae98-5b9b-d6e9-bb59-5512352ea157","appliesTo":"ELEMENT","styleBlockIds":[]}`
- e-805 SCROLL_INTO_VIEW: `{"id":"695e1eeeb10c5fb8eeaba896|5a3aae98-5b9b-d6e9-bb59-5512352ea15c","appliesTo":"ELEMENT","styleBlockIds":[]}`
- e-851 SCROLL_INTO_VIEW: `{"id":"695e1eeeb10c5fb8eeaba897|5a3aae98-5b9b-d6e9-bb59-5512352ea155","appliesTo":"ELEMENT","styleBlockIds":[]}`
- e-853 SCROLL_INTO_VIEW: `{"id":"695e1eeeb10c5fb8eeaba897|5a3aae98-5b9b-d6e9-bb59-5512352ea157","appliesTo":"ELEMENT","styleBlockIds":[]}`
- e-855 SCROLL_INTO_VIEW: `{"id":"695e1eeeb10c5fb8eeaba897|5a3aae98-5b9b-d6e9-bb59-5512352ea15c","appliesTo":"ELEMENT","styleBlockIds":[]}`
- e-901 SCROLL_INTO_VIEW: `{"id":"695e1eeeb10c5fb8eeaba898|5a3aae98-5b9b-d6e9-bb59-5512352ea155","appliesTo":"ELEMENT","styleBlockIds":[]}`
- e-903 SCROLL_INTO_VIEW: `{"id":"695e1eeeb10c5fb8eeaba898|5a3aae98-5b9b-d6e9-bb59-5512352ea157","appliesTo":"ELEMENT","styleBlockIds":[]}`
- e-905 SCROLL_INTO_VIEW: `{"id":"695e1eeeb10c5fb8eeaba898|5a3aae98-5b9b-d6e9-bb59-5512352ea15c","appliesTo":"ELEMENT","styleBlockIds":[]}`
- e-941 SCROLL_INTO_VIEW: `{"id":"9451505b-5015-c534-40e8-5413c82b75a6","appliesTo":"ELEMENT","styleBlockIds":[]}`
- e-943 SCROLL_INTO_VIEW: `{"id":"9451505b-5015-c534-40e8-5413c82b75a8","appliesTo":"ELEMENT","styleBlockIds":[]}`
- e-945 SCROLL_INTO_VIEW: `{"id":"9451505b-5015-c534-40e8-5413c82b759c","appliesTo":"ELEMENT","styleBlockIds":[]}`
- e-1054 SCROLL_INTO_VIEW: `{"id":"69679710d4037ebd0cbb9df2|5a3aae98-5b9b-d6e9-bb59-5512352ea155","appliesTo":"ELEMENT","styleBlockIds":[]}`
- e-1056 SCROLL_INTO_VIEW: `{"id":"69679710d4037ebd0cbb9df2|5a3aae98-5b9b-d6e9-bb59-5512352ea157","appliesTo":"ELEMENT","styleBlockIds":[]}`
- e-1058 SCROLL_INTO_VIEW: `{"id":"69679710d4037ebd0cbb9df2|5a3aae98-5b9b-d6e9-bb59-5512352ea15c","appliesTo":"ELEMENT","styleBlockIds":[]}`
- e-1092 SCROLL_INTO_VIEW: `{"id":"696f49d7f343717fcadfcf28|5a3aae98-5b9b-d6e9-bb59-5512352ea155","appliesTo":"ELEMENT","styleBlockIds":[]}`
- e-1094 SCROLL_INTO_VIEW: `{"id":"696f49d7f343717fcadfcf28|5a3aae98-5b9b-d6e9-bb59-5512352ea157","appliesTo":"ELEMENT","styleBlockIds":[]}`
- e-1096 SCROLL_INTO_VIEW: `{"id":"696f49d7f343717fcadfcf28|5a3aae98-5b9b-d6e9-bb59-5512352ea15c","appliesTo":"ELEMENT","styleBlockIds":[]}`
- e-1104 SCROLL_INTO_VIEW: `{"id":"696f4a9a3d82954cb43ac683|5a3aae98-5b9b-d6e9-bb59-5512352ea155","appliesTo":"ELEMENT","styleBlockIds":[]}`
- e-1106 SCROLL_INTO_VIEW: `{"id":"696f4a9a3d82954cb43ac683|5a3aae98-5b9b-d6e9-bb59-5512352ea157","appliesTo":"ELEMENT","styleBlockIds":[]}`
- e-1108 SCROLL_INTO_VIEW: `{"id":"696f4a9a3d82954cb43ac683|5a3aae98-5b9b-d6e9-bb59-5512352ea15c","appliesTo":"ELEMENT","styleBlockIds":[]}`

## Custom behavior inventory

### custom-4636102d3da36a4b

Library/font or feature detection initialization.

Source: `raw/published/inline/6a97db25519800ebff25b9f2-script-2.js`. Pages: /condizioni-di-utilizzo, /informativa-sulla-privacy, /informazioni-per-pazienti, /chi-siamo, /prestazioni-dentali, /informazioni/trasporto, /informazioni/alloggio, /testimonianze, /contatti, /faq, /domande-e-risposte, /informazioni/listino-prezzi, /informazioni/garanzie, /informazioni/pagamento-flessibile, /informazioni/tempi-del-trattamento, /informazioni/prima-visita-gratuita, /prestazioni/sedazione-cosciente, /su-di-noi/impianti-di-nuova-generazione, /su-di-noi/materiali-e-apparecchiature, /su-di-noi/laboratorio-odontotecnico, /su-di-noi/come-raggiungerci, /su-di-noi/tutto-in-un-unico-luogo, /su-di-noi/i-nostri-specialisti, /prestazioni/corone-faccette-ponti-e-protesi, /prestazioni/sbiancamento-dei-denti, /prestazioni/premium-ponte-fisso-su-impianti, /prestazioni/protesi-definitiva-ancorata-su-4-impianti, /.

### custom-9a37601d1f5a5f2f

Library/font or feature detection initialization.

Source: `raw/published/inline/6a97db25519800ebff25b9f2-script-3.js`. Pages: /condizioni-di-utilizzo, /informativa-sulla-privacy, /informazioni-per-pazienti, /chi-siamo, /prestazioni-dentali, /informazioni/trasporto, /informazioni/alloggio, /testimonianze, /contatti, /faq, /domande-e-risposte, /informazioni/listino-prezzi, /informazioni/garanzie, /informazioni/pagamento-flessibile, /informazioni/tempi-del-trattamento, /informazioni/prima-visita-gratuita, /prestazioni/sedazione-cosciente, /su-di-noi/impianti-di-nuova-generazione, /su-di-noi/materiali-e-apparecchiature, /su-di-noi/laboratorio-odontotecnico, /su-di-noi/come-raggiungerci, /su-di-noi/tutto-in-un-unico-luogo, /su-di-noi/i-nostri-specialisti, /prestazioni/corone-faccette-ponti-e-protesi, /prestazioni/sbiancamento-dei-denti, /prestazioni/premium-ponte-fisso-su-impianti, /prestazioni/protesi-definitiva-ancorata-su-4-impianti, /.

### custom-cc9ece71d2318662

Logo subtitle width synchronization after DOMContentLoaded/load/font readiness and resize; not a fade animation.

Source: `raw/published/inline/6a97db25519800ebff25b9f2-script-16.js`. Pages: /condizioni-di-utilizzo, /informativa-sulla-privacy, /informazioni-per-pazienti, /chi-siamo, /prestazioni-dentali, /informazioni/trasporto, /informazioni/alloggio, /testimonianze, /contatti, /faq, /domande-e-risposte, /informazioni/listino-prezzi, /informazioni/garanzie, /informazioni/pagamento-flessibile, /informazioni/tempi-del-trattamento, /informazioni/prima-visita-gratuita, /prestazioni/sedazione-cosciente, /su-di-noi/impianti-di-nuova-generazione, /su-di-noi/materiali-e-apparecchiature, /su-di-noi/laboratorio-odontotecnico, /su-di-noi/come-raggiungerci, /su-di-noi/tutto-in-un-unico-luogo, /su-di-noi/i-nostri-specialisti, /prestazioni/corone-faccette-ponti-e-protesi, /prestazioni/sbiancamento-dei-denti, /prestazioni/premium-ponte-fisso-su-impianti, /prestazioni/protesi-definitiva-ancorata-su-4-impianti, /.

- Function `syncLogoSubtitle`, line 3; complete function source and formulas in recipe.
- Function `scheduleLogoSubtitleSync`, line 29; complete function source and formulas in recipe.
### custom-2c943ef35289dd83

File hint text replacement after DOMContentLoaded and a delayed retry.

Source: `raw/published/inline/6a97db25519800ebff25b9f2-script-18.js`. Pages: /condizioni-di-utilizzo, /informativa-sulla-privacy, /informazioni-per-pazienti, /chi-siamo, /prestazioni-dentali, /informazioni/trasporto, /informazioni/alloggio, /testimonianze, /contatti, /faq, /domande-e-risposte, /informazioni/listino-prezzi, /informazioni/garanzie, /informazioni/pagamento-flessibile, /informazioni/tempi-del-trattamento, /informazioni/prima-visita-gratuita, /prestazioni/sedazione-cosciente, /su-di-noi/impianti-di-nuova-generazione, /su-di-noi/materiali-e-apparecchiature, /su-di-noi/laboratorio-odontotecnico, /su-di-noi/come-raggiungerci, /su-di-noi/tutto-in-un-unico-luogo, /su-di-noi/i-nostri-specialisti, /prestazioni/corone-faccette-ponti-e-protesi, /prestazioni/sbiancamento-dei-denti, /prestazioni/premium-ponte-fisso-su-impianti, /prestazioni/protesi-definitiva-ancorata-su-4-impianti, /.

- Function `setFileUploadHintCopy`, line 3; complete function source and formulas in recipe.
### custom-91f2afe50b022979

Privacy link normalization, including added DOM nodes.

Source: `raw/published/inline/6a97db25519800ebff25b9f2-script-19.js`. Pages: /condizioni-di-utilizzo, /informativa-sulla-privacy, /informazioni-per-pazienti, /chi-siamo, /prestazioni-dentali, /informazioni/trasporto, /informazioni/alloggio, /testimonianze, /contatti, /faq, /domande-e-risposte, /informazioni/listino-prezzi, /informazioni/garanzie, /informazioni/pagamento-flessibile, /informazioni/tempi-del-trattamento, /informazioni/prima-visita-gratuita, /prestazioni/sedazione-cosciente, /su-di-noi/impianti-di-nuova-generazione, /su-di-noi/materiali-e-apparecchiature, /su-di-noi/laboratorio-odontotecnico, /su-di-noi/come-raggiungerci, /su-di-noi/tutto-in-un-unico-luogo, /su-di-noi/i-nostri-specialisti, /prestazioni/corone-faccette-ponti-e-protesi, /prestazioni/sbiancamento-dei-denti, /prestazioni/premium-ponte-fisso-su-impianti, /prestazioni/protesi-definitiva-ancorata-su-4-impianti, /.

- Function `updatePrivacyLink`, line 5; complete function source and formulas in recipe.
- Function `updatePrivacyLinks`, line 15; complete function source and formulas in recipe.
- Function `start`, line 25; complete function source and formulas in recipe.
### custom-4826905c26d397d0

Fallback image alt injection on ready and DOM mutation; HTML alt and injected alt must remain distinct.

Source: `raw/published/inline/6a97db25519800ebff25b9f2-script-21.js`. Pages: /condizioni-di-utilizzo, /informativa-sulla-privacy, /informazioni-per-pazienti, /chi-siamo, /prestazioni-dentali, /informazioni/trasporto, /informazioni/alloggio, /testimonianze, /contatti, /faq, /domande-e-risposte, /informazioni/listino-prezzi, /informazioni/garanzie, /informazioni/pagamento-flessibile, /informazioni/tempi-del-trattamento, /informazioni/prima-visita-gratuita, /prestazioni/sedazione-cosciente, /su-di-noi/impianti-di-nuova-generazione, /su-di-noi/materiali-e-apparecchiature, /su-di-noi/laboratorio-odontotecnico, /su-di-noi/come-raggiungerci, /su-di-noi/tutto-in-un-unico-luogo, /su-di-noi/i-nostri-specialisti, /prestazioni/corone-faccette-ponti-e-protesi, /prestazioni/sbiancamento-dei-denti, /prestazioni/premium-ponte-fisso-su-impianti, /prestazioni/protesi-definitiva-ancorata-su-4-impianti, /.

- Function `updateImageAlt`, line 29; complete function source and formulas in recipe.
- Function `updateImageAlts`, line 40; complete function source and formulas in recipe.
- Function `start`, line 50; complete function source and formulas in recipe.
### custom-105a3595ba3c4f7b

Shared inquiry form factory, modal open/close/focus/scroll-lock, and scoped directory-image fade controller. Named functions below separate these behaviors.

Source: `raw/published/inline/6a97db25519800ebff25b9f2-script-28.js`. Pages: /condizioni-di-utilizzo, /informativa-sulla-privacy, /informazioni-per-pazienti, /chi-siamo, /prestazioni-dentali, /informazioni/trasporto, /informazioni/alloggio, /testimonianze, /contatti, /faq, /domande-e-risposte, /informazioni/listino-prezzi, /informazioni/garanzie, /informazioni/pagamento-flessibile, /informazioni/tempi-del-trattamento, /informazioni/prima-visita-gratuita, /prestazioni/sedazione-cosciente, /su-di-noi/impianti-di-nuova-generazione, /su-di-noi/materiali-e-apparecchiature, /su-di-noi/laboratorio-odontotecnico, /su-di-noi/come-raggiungerci, /su-di-noi/tutto-in-un-unico-luogo, /su-di-noi/i-nostri-specialisti, /prestazioni/corone-faccette-ponti-e-protesi, /prestazioni/sbiancamento-dei-denti, /prestazioni/premium-ponte-fisso-su-impianti, /prestazioni/protesi-definitiva-ancorata-su-4-impianti, /.

- Function `createNativeForm`, line 1; complete function source and formulas in recipe.
- Function `configureField`, line 1; complete function source and formulas in recipe.
- Function `updateSourceFields`, line 1; complete function source and formulas in recipe.
- Function `initDentVitalisInquiryModal`, line 1; complete function source and formulas in recipe.
- Function `openModal`, line 1; complete function source and formulas in recipe.
- Function `closeModal`, line 1; complete function source and formulas in recipe.
- Function `isVisibleDesktopImage`, line 1; complete function source and formulas in recipe.
- Function `initSection`, line 1; complete function source and formulas in recipe.
- Function `getCards`, line 1; complete function source and formulas in recipe.
- Function `getAllImages`, line 1; complete function source and formulas in recipe.
- Function `clearFade`, line 1; complete function source and formulas in recipe.
- Function `syncCardLayout`, line 1; complete function source and formulas in recipe.
- Function `sync`, line 1; complete function source and formulas in recipe.
- Function `requestSync`, line 1; complete function source and formulas in recipe.
- Function `init`, line 1; complete function source and formulas in recipe.
### custom-27f1cf02a5729fe0

Language switcher open/close synchronization.

Source: `raw/published/inline/6a97db25519800ebff25b9f2-script-29.js`. Pages: /condizioni-di-utilizzo, /informativa-sulla-privacy, /informazioni-per-pazienti, /chi-siamo, /prestazioni-dentali, /informazioni/trasporto, /informazioni/alloggio, /testimonianze, /contatti, /faq, /domande-e-risposte, /informazioni/listino-prezzi, /informazioni/garanzie, /informazioni/pagamento-flessibile, /informazioni/tempi-del-trattamento, /informazioni/prima-visita-gratuita, /prestazioni/sedazione-cosciente, /su-di-noi/impianti-di-nuova-generazione, /su-di-noi/materiali-e-apparecchiature, /su-di-noi/laboratorio-odontotecnico, /su-di-noi/come-raggiungerci, /su-di-noi/tutto-in-un-unico-luogo, /su-di-noi/i-nostri-specialisti, /prestazioni/corone-faccette-ponti-e-protesi, /prestazioni/sbiancamento-dei-denti, /prestazioni/premium-ponte-fisso-su-impianti, /prestazioni/protesi-definitiva-ancorata-su-4-impianti, /.

- Function `initLanguageSwitchers`, line 1; complete function source and formulas in recipe.
- Function `syncMenu`, line 1; complete function source and formulas in recipe.
### custom-74537df6bde2f7d5

Mobile inquiry form single-column layout on ready, resize and orientationchange.

Source: `raw/published/inline/6a97db25519800ebff25b9f2-script-33.js`. Pages: /condizioni-di-utilizzo, /informativa-sulla-privacy, /informazioni-per-pazienti, /chi-siamo, /prestazioni-dentali, /informazioni/trasporto, /informazioni/alloggio, /testimonianze, /contatti, /faq, /domande-e-risposte, /informazioni/listino-prezzi, /informazioni/garanzie, /informazioni/pagamento-flessibile, /informazioni/tempi-del-trattamento, /informazioni/prima-visita-gratuita, /prestazioni/sedazione-cosciente, /su-di-noi/impianti-di-nuova-generazione, /su-di-noi/materiali-e-apparecchiature, /su-di-noi/laboratorio-odontotecnico, /su-di-noi/come-raggiungerci, /su-di-noi/tutto-in-un-unico-luogo, /su-di-noi/i-nostri-specialisti, /prestazioni/corone-faccette-ponti-e-protesi, /prestazioni/sbiancamento-dei-denti, /prestazioni/premium-ponte-fisso-su-impianti, /prestazioni/protesi-definitiva-ancorata-su-4-impianti, /.

- Function `s`, line 1; complete function source and formulas in recipe.
- Function `i`, line 1; complete function source and formulas in recipe.
### custom-f7e1415588d86612

Hidden source-field creation and refresh on form submission; not submission data extraction.

Source: `raw/published/inline/6a97db25519800ebff25b9f2-script-34.js`. Pages: /condizioni-di-utilizzo, /informativa-sulla-privacy, /informazioni-per-pazienti, /chi-siamo, /prestazioni-dentali, /informazioni/trasporto, /informazioni/alloggio, /testimonianze, /contatti, /faq, /domande-e-risposte, /informazioni/listino-prezzi, /informazioni/garanzie, /informazioni/pagamento-flessibile, /informazioni/tempi-del-trattamento, /informazioni/prima-visita-gratuita, /prestazioni/sedazione-cosciente, /su-di-noi/impianti-di-nuova-generazione, /su-di-noi/materiali-e-apparecchiature, /su-di-noi/laboratorio-odontotecnico, /su-di-noi/come-raggiungerci, /su-di-noi/tutto-in-un-unico-luogo, /su-di-noi/i-nostri-specialisti, /prestazioni/corone-faccette-ponti-e-protesi, /prestazioni/sbiancamento-dei-denti, /prestazioni/premium-ponte-fisso-su-impianti, /prestazioni/protesi-definitiva-ancorata-su-4-impianti, /.

- Function `ensureField`, line 1; complete function source and formulas in recipe.
- Function `getPlacement`, line 1; complete function source and formulas in recipe.
- Function `updateSourceFields`, line 1; complete function source and formulas in recipe.
- Function `bindForm`, line 1; complete function source and formulas in recipe.
- Function `init`, line 1; complete function source and formulas in recipe.
### custom-896f368c3ad22587

See exact query/event and function source; source callback retained without guessed semantics.

Source: `raw/published/inline/6a97db25519800ebff25b9f2-script-36.js`. Pages: /condizioni-di-utilizzo, /informativa-sulla-privacy, /informazioni-per-pazienti, /chi-siamo, /prestazioni-dentali, /informazioni/trasporto, /informazioni/alloggio, /testimonianze, /contatti, /faq, /domande-e-risposte, /informazioni/listino-prezzi, /informazioni/garanzie, /informazioni/pagamento-flessibile, /informazioni/tempi-del-trattamento, /informazioni/prima-visita-gratuita, /prestazioni/sedazione-cosciente, /su-di-noi/impianti-di-nuova-generazione, /su-di-noi/materiali-e-apparecchiature, /su-di-noi/laboratorio-odontotecnico, /su-di-noi/come-raggiungerci, /su-di-noi/tutto-in-un-unico-luogo, /su-di-noi/i-nostri-specialisti, /prestazioni/corone-faccette-ponti-e-protesi, /prestazioni/sbiancamento-dei-denti, /prestazioni/premium-ponte-fisso-su-impianti, /prestazioni/protesi-definitiva-ancorata-su-4-impianti, /.

### custom-03e7e83cf1ed6cb3

Responsive image sizes attribute synchronization.

Source: `raw/published/inline/6a97db25519800ebff25b9f2-script-37.js`. Pages: /condizioni-di-utilizzo, /informativa-sulla-privacy, /informazioni-per-pazienti, /chi-siamo, /prestazioni-dentali, /informazioni/trasporto, /informazioni/alloggio, /testimonianze, /contatti, /faq, /domande-e-risposte, /informazioni/listino-prezzi, /informazioni/garanzie, /informazioni/pagamento-flessibile, /informazioni/tempi-del-trattamento, /informazioni/prima-visita-gratuita, /prestazioni/sedazione-cosciente, /su-di-noi/impianti-di-nuova-generazione, /su-di-noi/materiali-e-apparecchiature, /su-di-noi/laboratorio-odontotecnico, /su-di-noi/come-raggiungerci, /su-di-noi/tutto-in-un-unico-luogo, /su-di-noi/i-nostri-specialisti, /prestazioni/corone-faccette-ponti-e-protesi, /prestazioni/sbiancamento-dei-denti, /prestazioni/premium-ponte-fisso-su-impianti, /prestazioni/protesi-definitiva-ancorata-su-4-impianti, /.

- Function `updateSizing`, line 1; complete function source and formulas in recipe.
### custom-10e10c2088200947

Desktop parent-menu links navigate at min-width 992px; mobile retains dropdown activation.

Source: `raw/published/inline/6a97db25519800ebff25b9f2-script-39.js`. Pages: /condizioni-di-utilizzo, /informativa-sulla-privacy, /informazioni-per-pazienti, /chi-siamo, /prestazioni-dentali, /informazioni/trasporto, /informazioni/alloggio, /testimonianze, /contatti, /faq, /domande-e-risposte, /informazioni/listino-prezzi, /informazioni/garanzie, /informazioni/pagamento-flessibile, /informazioni/tempi-del-trattamento, /informazioni/prima-visita-gratuita, /prestazioni/sedazione-cosciente, /su-di-noi/impianti-di-nuova-generazione, /su-di-noi/materiali-e-apparecchiature, /su-di-noi/laboratorio-odontotecnico, /su-di-noi/come-raggiungerci, /su-di-noi/tutto-in-un-unico-luogo, /su-di-noi/i-nostri-specialisti, /prestazioni/corone-faccette-ponti-e-protesi, /prestazioni/sbiancamento-dei-denti, /prestazioni/premium-ponte-fisso-su-impianti, /prestazioni/protesi-definitiva-ancorata-su-4-impianti, /.

- Function `stopDesktopArrowToggle`, line 10; complete function source and formulas in recipe.
- Function `bindParentLinks`, line 16; complete function source and formulas in recipe.
### custom-773b49ee02f4f36e

Informazioni directory photo transitions matched to scroll position of text cards; only this page.

Source: `raw/published/inline/6a8d7da66a4b3462ca3f0a23-script-43.js`. Pages: /informazioni-per-pazienti.

- Function `mergeDirectorySections`, line 5; complete function source and formulas in recipe.
- Function `visible`, line 41; complete function source and formulas in recipe.
- Function `updateSizing`, line 47; complete function source and formulas in recipe.
- Function `clearImages`, line 58; complete function source and formulas in recipe.
- Function `update`, line 69; complete function source and formulas in recipe.
- Function `requestUpdate`, line 102; complete function source and formulas in recipe.
### custom-97af64f39692e8c9

Su di noi directory photo transitions matched to scroll position of text cards; only this page.

Source: `raw/published/inline/6a8d7da585ba860c0b521829-script-44.js`. Pages: /chi-siamo.

- Function `mergeDirectorySections`, line 5; complete function source and formulas in recipe.
- Function `visible`, line 42; complete function source and formulas in recipe.
- Function `updateSizing`, line 48; complete function source and formulas in recipe.
- Function `clearImages`, line 59; complete function source and formulas in recipe.
- Function `update`, line 70; complete function source and formulas in recipe.
- Function `requestUpdate`, line 103; complete function source and formulas in recipe.
### custom-83a190ef0e8e203d

Prestazioni directory photo transitions; distinct 24px card-top trigger, not viewport-center trigger.

Source: `raw/published/inline/6a8d7da5fff15c0449d670e2-script-44.js`. Pages: /prestazioni-dentali.

- Function `visible`, line 15; complete function source and formulas in recipe.
- Function `updateSizing`, line 21; complete function source and formulas in recipe.
- Function `clearImages`, line 32; complete function source and formulas in recipe.
- Function `update`, line 42; complete function source and formulas in recipe.
- Function `requestUpdate`, line 72; complete function source and formulas in recipe.
### custom-657306fbc334bb73

Typed text setup: literal options captured, initialized only when target exists.

Source: `raw/published/inline/696f4a9a3d82954cb43ac683-script-42.js`. Pages: /informazioni/trasporto, /informazioni/alloggio, /testimonianze, /contatti, /domande-e-risposte, /informazioni/listino-prezzi, /informazioni/garanzie, /informazioni/pagamento-flessibile, /informazioni/tempi-del-trattamento, /informazioni/prima-visita-gratuita, /prestazioni/sedazione-cosciente, /su-di-noi/impianti-di-nuova-generazione, /su-di-noi/materiali-e-apparecchiature, /su-di-noi/laboratorio-odontotecnico, /su-di-noi/come-raggiungerci, /su-di-noi/tutto-in-un-unico-luogo, /su-di-noi/i-nostri-specialisti, /prestazioni/corone-faccette-ponti-e-protesi, /prestazioni/sbiancamento-dei-denti, /prestazioni/premium-ponte-fisso-su-impianti, /prestazioni/protesi-definitiva-ancorata-su-4-impianti, /.

### custom-b0716a8bcd457b32

Home-only responsive image sizes adjustment, not the directory fade controller.

Source: `raw/published/inline/695e1eeeb10c5fb8eeaba87c-script-43.js`. Pages: /.

- Function `updateSizing`, line 8; complete function source and formulas in recipe.

## CSS keyframes

### dv-sticky-cta-load-fade

```css
@keyframes dv-sticky-cta-load-fade {
  0%,
  50%,
  100% {
    opacity: 1;
  }
  25%,
  75% {
    opacity: .12;
  }
}
```

### dv-sticky-cta-content-fade

```css
@keyframes dv-sticky-cta-content-fade {
  0%,
  52%,
  70%,
  88%,
  100% {
    opacity: 1;
  }
  61%,
  79% {
    opacity: .12;
  }
}
```

### spin

```css
@keyframes spin {
  0% {
    transform: rotate(0);
  }

  100% {
    transform: rotate(360deg);
  }
}
```

Sticky CTA rule: `.fiksni-kontakti-mobile .gumb-upit > .icon-embed-xxsmall,
  .fiksni-kontakti-mobile .gumb-upit > .text-block-13`, [{"type":"media","condition":"screen and (max-width: 991px)","source":"raw/published/inline/695e1eeeb10c5fb8eeaba87c-style-13.css","line":2}]. `[{"property":"animation","value":"dv-sticky-cta-load-fade 1.8s ease-in-out both,\n      dv-sticky-cta-content-fade 5s ease-in-out 2s infinite","important":false,"line":18,"column":5}]`.


## Detailed source parameter tables

`interaction-parameters.csv` has every native timeline step and continuous keyframe with event/page mapping, source properties, units, easing, event/item delays and breakpoints.

### Sticky CTA current timing

At <=991px, only the icon and text fade. Initial sequence: 1.8 seconds, opacity 1 -> .12 -> 1 -> .12 -> 1 at 0/450/900/1350/1800ms. Repeated animation starts after 2 seconds and has a 5-second total cycle; its two fades occur between 2600-4400ms within each cycle. This source is not five seconds of pause after the two fades. Reduced-motion CSS disables it.

### Shared directory controller precedence

The shared native-form/directory script also sets image opacity with `!important`, activating the last card whose entry top has reached the viewport bottom. Page-specific scripts use different thresholds and additionally set scale. Their combined cascade is not one generic slider. Preserve exact page guards and script order.

### Before/after comparison

Found 15 comparison instances. Each instance page/node is in interaction-targets.csv and each source parameter set is in interaction-recipes.json. Initial split is 50%, horizontal in current attributes. Drag updates range 0-100 and clip-path. Before/After labels animate to 100/0% for 300ms and remove transition after 300ms.

### Action-list parameters

#### a-2 Nav Dropdown Closes

Initial group enabled: `False`. Exact source: `raw/published/resources/03c1fa8b77cf-dentvitalis33.schunk.6ecbf8a934abc739.js`.

- Group 0, STYLE_SIZE: `{"delay":0,"easing":"","duration":300,"target":{"useEventTarget":"CHILDREN","selector":".nav-dropdown-list","selectorGuids":["e6e85a02-c3d6-08eb-5df3-a2c1c099f23a"]},"heightValue":0,"widthUnit":"PX","heightUnit":"px","locked":false}`.
- Group 0, TRANSFORM_ROTATE: `{"delay":0,"easing":"","duration":200,"target":{"useEventTarget":"CHILDREN","selector":".nav-dropdown-icon","selectorGuids":["e6e85a02-c3d6-08eb-5df3-a2c1c099f20b"]},"zValue":0,"xUnit":"DEG","yUnit":"DEG","zUnit":"deg"}`.

#### a Nav Dropdown Opens

Initial group enabled: `True`. Exact source: `raw/published/resources/03c1fa8b77cf-dentvitalis33.schunk.6ecbf8a934abc739.js`.

- Group 0, TRANSFORM_ROTATE: `{"delay":0,"easing":"","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".nav-dropdown-icon","selectorGuids":["e6e85a02-c3d6-08eb-5df3-a2c1c099f20b"]},"zValue":0,"xUnit":"DEG","yUnit":"DEG","zUnit":"deg"}`.
- Group 0, STYLE_SIZE: `{"delay":0,"easing":"","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".nav-dropdown-list","selectorGuids":["e6e85a02-c3d6-08eb-5df3-a2c1c099f23a"]},"heightValue":0,"widthUnit":"PX","heightUnit":"px","locked":false}`.
- Group 1, TRANSFORM_ROTATE: `{"delay":0,"easing":"","duration":200,"target":{"useEventTarget":"CHILDREN","selector":".nav-dropdown-icon","selectorGuids":["e6e85a02-c3d6-08eb-5df3-a2c1c099f20b"]},"zValue":-180,"xUnit":"DEG","yUnit":"DEG","zUnit":"deg"}`.
- Group 1, STYLE_SIZE: `{"delay":0,"easing":"","duration":300,"target":{"useEventTarget":"CHILDREN","selector":".nav-dropdown-list","selectorGuids":["e6e85a02-c3d6-08eb-5df3-a2c1c099f23a"]},"widthUnit":"PX","heightUnit":"AUTO","locked":false}`.

#### a-4 Nav Dropdown Hover Out

Initial group enabled: `False`. Exact source: `raw/published/resources/03c1fa8b77cf-dentvitalis33.schunk.6ecbf8a934abc739.js`.

- Group 0, TRANSFORM_ROTATE: `{"delay":0,"easing":"","duration":200,"target":{"selector":".nav-arrow-wrap","selectorGuids":["e6e85a02-c3d6-08eb-5df3-a2c1c099f24a"]},"zValue":0,"xUnit":"DEG","yUnit":"DEG","zUnit":"deg"}`.

#### a-8 Whatsapp-open

Initial group enabled: `True`. Exact source: `raw/published/resources/03c1fa8b77cf-dentvitalis33.schunk.6ecbf8a934abc739.js`.

- Group 0, STYLE_OPACITY: `{"delay":0,"easing":"","duration":500,"target":{"useEventTarget":"SIBLINGS","selector":".whatsapp-chat","selectorGuids":["83f2cc56-3a29-3903-e59c-0711f389e2d9"]},"value":0,"unit":""}`.
- Group 0, TRANSFORM_MOVE: `{"delay":0,"easing":"","duration":500,"target":{"useEventTarget":"SIBLINGS","selector":".whatsapp-chat","selectorGuids":["83f2cc56-3a29-3903-e59c-0711f389e2d9"]},"yValue":20,"xUnit":"PX","yUnit":"px","zUnit":"PX"}`.
- Group 0, STYLE_OPACITY: `{"delay":0,"easing":"","duration":500,"target":{"selector":".chat-block","selectorGuids":["83f2cc56-3a29-3903-e59c-0711f389e2ca"]},"value":0,"unit":""}`.
- Group 0, TRANSFORM_MOVE: `{"delay":0,"easing":"","duration":500,"target":{"selector":".chat-block","selectorGuids":["83f2cc56-3a29-3903-e59c-0711f389e2ca"]},"xValue":20,"xUnit":"px","yUnit":"PX","zUnit":"PX"}`.
- Group 1, GENERAL_DISPLAY: `{"delay":0,"easing":"","duration":0,"target":{"useEventTarget":"SIBLINGS","selector":".whatsapp-chat","selectorGuids":["83f2cc56-3a29-3903-e59c-0711f389e2d9"]},"value":"flex"}`.
- Group 1, STYLE_OPACITY: `{"delay":0,"easing":"outQuart","duration":800,"target":{"useEventTarget":"SIBLINGS","selector":".whatsapp-chat","selectorGuids":["83f2cc56-3a29-3903-e59c-0711f389e2d9"]},"value":1,"unit":""}`.
- Group 1, TRANSFORM_MOVE: `{"delay":0,"easing":"inOutQuart","duration":500,"target":{"useEventTarget":"SIBLINGS","selector":".whatsapp-chat","selectorGuids":["83f2cc56-3a29-3903-e59c-0711f389e2d9"]},"yValue":0,"xUnit":"PX","yUnit":"px","zUnit":"PX"}`.
- Group 1, STYLE_OPACITY: `{"delay":800,"easing":"inOutQuart","duration":500,"target":{"selector":".chat-block","selectorGuids":["83f2cc56-3a29-3903-e59c-0711f389e2ca"]},"value":1,"unit":""}`.
- Group 1, TRANSFORM_MOVE: `{"delay":800,"easing":"inOutQuart","duration":500,"target":{"selector":".chat-block","selectorGuids":["83f2cc56-3a29-3903-e59c-0711f389e2ca"]},"xValue":0,"xUnit":"px","yUnit":"PX","zUnit":"PX"}`.

#### a-9 Whatsapp-Close

Initial group enabled: `False`. Exact source: `raw/published/resources/03c1fa8b77cf-dentvitalis33.schunk.6ecbf8a934abc739.js`.

- Group 0, TRANSFORM_MOVE: `{"delay":0,"easing":"","duration":500,"target":{"selector":".chat-block","selectorGuids":["83f2cc56-3a29-3903-e59c-0711f389e2ca"]},"xValue":20,"xUnit":"px","yUnit":"PX","zUnit":"PX"}`.
- Group 0, TRANSFORM_MOVE: `{"delay":0,"easing":"","duration":500,"target":{"useEventTarget":"SIBLINGS","selector":".whatsapp-chat","selectorGuids":["83f2cc56-3a29-3903-e59c-0711f389e2d9"]},"yValue":20,"xUnit":"PX","yUnit":"px","zUnit":"PX"}`.
- Group 0, STYLE_OPACITY: `{"delay":0,"easing":"inOutQuart","duration":800,"target":{"useEventTarget":"SIBLINGS","selector":".whatsapp-chat","selectorGuids":["83f2cc56-3a29-3903-e59c-0711f389e2d9"]},"value":0,"unit":""}`.
- Group 0, STYLE_OPACITY: `{"delay":0,"easing":"inOutQuart","duration":800,"target":{"selector":".chat-block","selectorGuids":["83f2cc56-3a29-3903-e59c-0711f389e2ca"]},"value":0,"unit":""}`.
- Group 0, GENERAL_DISPLAY: `{"delay":0,"easing":"","duration":0,"target":{"useEventTarget":"SIBLINGS","selector":".whatsapp-chat","selectorGuids":["83f2cc56-3a29-3903-e59c-0711f389e2d9"]},"value":"none"}`.

#### a-10 Popup Open - kalendar

Initial group enabled: `True`. Exact source: `raw/published/resources/03c1fa8b77cf-dentvitalis33.schunk.6ecbf8a934abc739.js`.

- Group 0, STYLE_OPACITY: `{"delay":0,"easing":"","duration":500,"target":{},"value":0,"unit":""}`.
- Group 0, GENERAL_DISPLAY: `{"delay":0,"easing":"","duration":0,"target":{},"value":"none"}`.
- Group 1, GENERAL_DISPLAY: `{"delay":0,"easing":"","duration":0,"target":{},"value":"flex"}`.
- Group 1, STYLE_OPACITY: `{"delay":0,"easing":"ease","duration":600,"target":{},"value":1,"unit":""}`.

#### a-11 Popup Open 2

Initial group enabled: `True`. Exact source: `raw/published/resources/03c1fa8b77cf-dentvitalis33.schunk.6ecbf8a934abc739.js`.

- Group 0, STYLE_OPACITY: `{"delay":0,"easing":"","duration":500,"target":{},"value":0,"unit":""}`.
- Group 0, GENERAL_DISPLAY: `{"delay":0,"easing":"","duration":0,"target":{},"value":"none"}`.
- Group 1, GENERAL_DISPLAY: `{"delay":0,"easing":"","duration":0,"target":{},"value":"flex"}`.
- Group 1, STYLE_OPACITY: `{"delay":0,"easing":"ease","duration":600,"target":{},"value":1,"unit":""}`.

#### a-13 FAQ Accordion Opens

Initial group enabled: `True`. Exact source: `raw/published/resources/03c1fa8b77cf-dentvitalis33.schunk.6ecbf8a934abc739.js`.

- Group 0, STYLE_SIZE: `{"delay":0,"easing":"","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".accordion-list","selectorGuids":["571b4f22-06fa-4499-f6d0-cb8f5ffe0c7d"]},"heightValue":0,"widthUnit":"PX","heightUnit":"px","locked":false}`.
- Group 0, STYLE_TEXT_COLOR: `{"delay":0,"easing":"","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".accordion-title","selectorGuids":["571b4f22-06fa-4499-f6d0-cb8f5ffe0c6f"]},"globalSwatchId":"@var_variable-90781720-7ff3-c909-13c4-45d269bf0a2a","rValue":107,"bValue":118,"gValue":112,"aValue":1}`.
- Group 0, STYLE_BACKGROUND_COLOR: `{"delay":0,"easing":"","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".horizontal-line.primary-color","selectorGuids":["571b4f22-06fa-4499-f6d0-cb8f5ffe0c80","571b4f22-06fa-4499-f6d0-cb8f5ffe0c87"]},"globalSwatchId":"@var_variable-90781720-7ff3-c909-13c4-45d269bf0a2a","rValue":107,"bValue":118,"gValue":112,"aValue":1}`.
- Group 0, STYLE_BACKGROUND_COLOR: `{"delay":0,"easing":"","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".vertical-line.primary-color","selectorGuids":["571b4f22-06fa-4499-f6d0-cb8f5ffe0c7c","571b4f22-06fa-4499-f6d0-cb8f5ffe0c88"]},"globalSwatchId":"@var_variable-90781720-7ff3-c909-13c4-45d269bf0a2a","rValue":107,"bValue":118,"gValue":112,"aValue":1}`.
- Group 0, STYLE_OPACITY: `{"delay":0,"easing":"","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".large-paragraph-3.accordion-text","selectorGuids":["571b4f22-06fa-4499-f6d0-cb8f5ffe0c82","571b4f22-06fa-4499-f6d0-cb8f5ffe0c89"]},"value":0,"unit":""}`.
- Group 1, STYLE_SIZE: `{"delay":0,"easing":"ease","duration":400,"target":{"useEventTarget":"CHILDREN","selector":".accordion-list","selectorGuids":["571b4f22-06fa-4499-f6d0-cb8f5ffe0c7d"]},"widthUnit":"PX","heightUnit":"AUTO","locked":false}`.
- Group 1, TRANSFORM_ROTATE: `{"delay":0,"easing":"","duration":300,"target":{"useEventTarget":"CHILDREN","selector":".vertical-line.primary-color","selectorGuids":["571b4f22-06fa-4499-f6d0-cb8f5ffe0c7c","571b4f22-06fa-4499-f6d0-cb8f5ffe0c88"]},"yValue":null,"zValue":-90,"xUnit":"DEG","yUnit":"deg","zUnit":"deg"}`.
- Group 1, STYLE_TEXT_COLOR: `{"delay":0,"easing":"","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".accordion-title","selectorGuids":["571b4f22-06fa-4499-f6d0-cb8f5ffe0c6f"]},"globalSwatchId":"@var_variable-c30fbafd-c704-5f1e-e20f-7ceadfde5500","rValue":0,"bValue":0,"gValue":0,"aValue":1}`.
- Group 1, STYLE_OPACITY: `{"delay":0,"easing":"","duration":700,"target":{"useEventTarget":"CHILDREN","selector":".large-paragraph-3.accordion-text","selectorGuids":["571b4f22-06fa-4499-f6d0-cb8f5ffe0c82","571b4f22-06fa-4499-f6d0-cb8f5ffe0c89"]},"value":1,"unit":""}`.

#### a-14 FAQ Accordion Closes

Initial group enabled: `False`. Exact source: `raw/published/resources/03c1fa8b77cf-dentvitalis33.schunk.6ecbf8a934abc739.js`.

- Group 0, STYLE_SIZE: `{"delay":0,"easing":"ease","duration":400,"target":{"useEventTarget":"CHILDREN","selector":".accordion-list","selectorGuids":["571b4f22-06fa-4499-f6d0-cb8f5ffe0c7d"]},"heightValue":0,"widthUnit":"PX","heightUnit":"px","locked":false}`.
- Group 0, STYLE_TEXT_COLOR: `{"delay":0,"easing":"","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".accordion-title","selectorGuids":["571b4f22-06fa-4499-f6d0-cb8f5ffe0c6f"]},"globalSwatchId":"@var_variable-90781720-7ff3-c909-13c4-45d269bf0a2a","rValue":107,"bValue":118,"gValue":112,"aValue":1}`.
- Group 0, TRANSFORM_ROTATE: `{"delay":0,"easing":"","duration":300,"target":{"useEventTarget":"CHILDREN","selector":".vertical-line.primary-color","selectorGuids":["571b4f22-06fa-4499-f6d0-cb8f5ffe0c7c","571b4f22-06fa-4499-f6d0-cb8f5ffe0c88"]},"zValue":0,"xUnit":"DEG","yUnit":"DEG","zUnit":"deg"}`.
- Group 0, STYLE_OPACITY: `{"delay":0,"easing":"","duration":0,"target":{"useEventTarget":"CHILDREN","selector":".large-paragraph-3.accordion-text","selectorGuids":["571b4f22-06fa-4499-f6d0-cb8f5ffe0c82","571b4f22-06fa-4499-f6d0-cb8f5ffe0c89"]},"value":0,"unit":""}`.

#### a-16 Project Teaser Scroll Animation 2

Initial group enabled: `None`. Exact source: `raw/published/resources/03c1fa8b77cf-dentvitalis33.schunk.6ecbf8a934abc739.js`.

- a-16-p, progress 33%, STYLE_OPACITY: `{"delay":0,"easing":"","duration":500,"target":{"selector":".teaser-img._1","selectorGuids":["b47f39b8-b9d8-5e09-e67c-1a8e34eb5a18","b47f39b8-b9d8-5e09-e67c-1a8e34eb5a23"]},"value":1,"unit":""}`.
- a-16-p, progress 33%, TRANSFORM_SCALE: `{"delay":0,"easing":"","duration":500,"target":{"selector":".teaser-img._1","selectorGuids":["b47f39b8-b9d8-5e09-e67c-1a8e34eb5a18","b47f39b8-b9d8-5e09-e67c-1a8e34eb5a23"]},"xValue":1,"yValue":1,"locked":true}`.
- a-16-p, progress 38%, STYLE_OPACITY: `{"delay":0,"easing":"","duration":500,"target":{"selector":".teaser-img._1","selectorGuids":["b47f39b8-b9d8-5e09-e67c-1a8e34eb5a18","b47f39b8-b9d8-5e09-e67c-1a8e34eb5a23"]},"value":0,"unit":""}`.
- a-16-p, progress 38%, TRANSFORM_SCALE: `{"delay":0,"easing":"","duration":500,"target":{"selector":".teaser-img._1","selectorGuids":["b47f39b8-b9d8-5e09-e67c-1a8e34eb5a18","b47f39b8-b9d8-5e09-e67c-1a8e34eb5a23"]},"xValue":1.2,"yValue":1.2,"locked":true}`.
- a-16-p, progress 53%, STYLE_OPACITY: `{"delay":0,"easing":"","duration":500,"target":{"selector":".teaser-img._2","selectorGuids":["b47f39b8-b9d8-5e09-e67c-1a8e34eb5a18","b47f39b8-b9d8-5e09-e67c-1a8e34eb5a24"]},"value":1,"unit":""}`.
- a-16-p, progress 53%, TRANSFORM_SCALE: `{"delay":0,"easing":"","duration":500,"target":{"selector":".teaser-img._2","selectorGuids":["b47f39b8-b9d8-5e09-e67c-1a8e34eb5a18","b47f39b8-b9d8-5e09-e67c-1a8e34eb5a24"]},"xValue":1,"yValue":1,"locked":true}`.
- a-16-p, progress 58%, STYLE_OPACITY: `{"delay":0,"easing":"","duration":500,"target":{"selector":".teaser-img._2","selectorGuids":["b47f39b8-b9d8-5e09-e67c-1a8e34eb5a18","b47f39b8-b9d8-5e09-e67c-1a8e34eb5a24"]},"value":0,"unit":""}`.
- a-16-p, progress 58%, TRANSFORM_SCALE: `{"delay":0,"easing":"","duration":500,"target":{"selector":".teaser-img._2","selectorGuids":["b47f39b8-b9d8-5e09-e67c-1a8e34eb5a18","b47f39b8-b9d8-5e09-e67c-1a8e34eb5a24"]},"xValue":1.2,"yValue":1.2,"locked":true}`.
- a-16-p, progress 73%, STYLE_OPACITY: `{"delay":0,"easing":"","duration":500,"target":{"selector":".teaser-img._3","selectorGuids":["b47f39b8-b9d8-5e09-e67c-1a8e34eb5a18","b47f39b8-b9d8-5e09-e67c-1a8e34eb5a22"]},"value":1,"unit":""}`.
- a-16-p, progress 73%, TRANSFORM_SCALE: `{"delay":0,"easing":"","duration":500,"target":{"selector":".teaser-img._3","selectorGuids":["b47f39b8-b9d8-5e09-e67c-1a8e34eb5a18","b47f39b8-b9d8-5e09-e67c-1a8e34eb5a22"]},"xValue":1,"yValue":1,"locked":true}`.
- a-16-p, progress 78%, STYLE_OPACITY: `{"delay":0,"easing":"","duration":500,"target":{"selector":".teaser-img._3","selectorGuids":["b47f39b8-b9d8-5e09-e67c-1a8e34eb5a18","b47f39b8-b9d8-5e09-e67c-1a8e34eb5a22"]},"value":0,"unit":""}`.
- a-16-p, progress 78%, TRANSFORM_SCALE: `{"delay":0,"easing":"","duration":500,"target":{"selector":".teaser-img._3","selectorGuids":["b47f39b8-b9d8-5e09-e67c-1a8e34eb5a18","b47f39b8-b9d8-5e09-e67c-1a8e34eb5a22"]},"xValue":1.2,"yValue":1.2,"locked":true}`.
- a-16-p, progress 89%, TRANSFORM_SCALE: `{"delay":0,"easing":"","duration":500,"target":{"selector":".teaser-img._3","selectorGuids":["b47f39b8-b9d8-5e09-e67c-1a8e34eb5a18","b47f39b8-b9d8-5e09-e67c-1a8e34eb5a22"]},"xValue":1,"yValue":1,"locked":true}`.

#### a-17 Project Teaser Scroll Animation 3

Initial group enabled: `None`. Exact source: `raw/published/resources/03c1fa8b77cf-dentvitalis33.schunk.6ecbf8a934abc739.js`.

- a-17-p, progress 33%, STYLE_OPACITY: `{"delay":0,"easing":"","duration":500,"target":{"selector":".teaser-img._1","selectorGuids":["b47f39b8-b9d8-5e09-e67c-1a8e34eb5a18","b47f39b8-b9d8-5e09-e67c-1a8e34eb5a23"]},"value":1,"unit":""}`.
- a-17-p, progress 33%, TRANSFORM_SCALE: `{"delay":0,"easing":"","duration":500,"target":{"selector":".teaser-img._1","selectorGuids":["b47f39b8-b9d8-5e09-e67c-1a8e34eb5a18","b47f39b8-b9d8-5e09-e67c-1a8e34eb5a23"]},"xValue":1,"yValue":1,"locked":true}`.
- a-17-p, progress 38%, STYLE_OPACITY: `{"delay":0,"easing":"","duration":500,"target":{"selector":".teaser-img._1","selectorGuids":["b47f39b8-b9d8-5e09-e67c-1a8e34eb5a18","b47f39b8-b9d8-5e09-e67c-1a8e34eb5a23"]},"value":0,"unit":""}`.
- a-17-p, progress 38%, TRANSFORM_SCALE: `{"delay":0,"easing":"","duration":500,"target":{"selector":".teaser-img._1","selectorGuids":["b47f39b8-b9d8-5e09-e67c-1a8e34eb5a18","b47f39b8-b9d8-5e09-e67c-1a8e34eb5a23"]},"xValue":1.2,"yValue":1.2,"locked":true}`.
- a-17-p, progress 53%, STYLE_OPACITY: `{"delay":0,"easing":"","duration":500,"target":{"selector":".teaser-img._2","selectorGuids":["b47f39b8-b9d8-5e09-e67c-1a8e34eb5a18","b47f39b8-b9d8-5e09-e67c-1a8e34eb5a24"]},"value":1,"unit":""}`.
- a-17-p, progress 53%, TRANSFORM_SCALE: `{"delay":0,"easing":"","duration":500,"target":{"selector":".teaser-img._2","selectorGuids":["b47f39b8-b9d8-5e09-e67c-1a8e34eb5a18","b47f39b8-b9d8-5e09-e67c-1a8e34eb5a24"]},"xValue":1,"yValue":1,"locked":true}`.
- a-17-p, progress 58%, STYLE_OPACITY: `{"delay":0,"easing":"","duration":500,"target":{"selector":".teaser-img._2","selectorGuids":["b47f39b8-b9d8-5e09-e67c-1a8e34eb5a18","b47f39b8-b9d8-5e09-e67c-1a8e34eb5a24"]},"value":0,"unit":""}`.
- a-17-p, progress 58%, TRANSFORM_SCALE: `{"delay":0,"easing":"","duration":500,"target":{"selector":".teaser-img._2","selectorGuids":["b47f39b8-b9d8-5e09-e67c-1a8e34eb5a18","b47f39b8-b9d8-5e09-e67c-1a8e34eb5a24"]},"xValue":1.2,"yValue":1.2,"locked":true}`.
- a-17-p, progress 73%, STYLE_OPACITY: `{"delay":0,"easing":"","duration":500,"target":{"selector":".teaser-img._3","selectorGuids":["b47f39b8-b9d8-5e09-e67c-1a8e34eb5a18","b47f39b8-b9d8-5e09-e67c-1a8e34eb5a22"]},"value":1,"unit":""}`.
- a-17-p, progress 73%, TRANSFORM_SCALE: `{"delay":0,"easing":"","duration":500,"target":{"selector":".teaser-img._3","selectorGuids":["b47f39b8-b9d8-5e09-e67c-1a8e34eb5a18","b47f39b8-b9d8-5e09-e67c-1a8e34eb5a22"]},"xValue":1,"yValue":1,"locked":true}`.
- a-17-p, progress 78%, STYLE_OPACITY: `{"delay":0,"easing":"","duration":500,"target":{"selector":".teaser-img._3","selectorGuids":["b47f39b8-b9d8-5e09-e67c-1a8e34eb5a18","b47f39b8-b9d8-5e09-e67c-1a8e34eb5a22"]},"value":0,"unit":""}`.
- a-17-p, progress 78%, TRANSFORM_SCALE: `{"delay":0,"easing":"","duration":500,"target":{"selector":".teaser-img._3","selectorGuids":["b47f39b8-b9d8-5e09-e67c-1a8e34eb5a18","b47f39b8-b9d8-5e09-e67c-1a8e34eb5a22"]},"xValue":1.2,"yValue":1.2,"locked":true}`.
- a-17-p, progress 89%, TRANSFORM_SCALE: `{"delay":0,"easing":"","duration":500,"target":{"selector":".teaser-img._3","selectorGuids":["b47f39b8-b9d8-5e09-e67c-1a8e34eb5a18","b47f39b8-b9d8-5e09-e67c-1a8e34eb5a22"]},"xValue":1,"yValue":1,"locked":true}`.

#### fadeIn 

Initial group enabled: `True`. Exact source: `raw/published/resources/03c1fa8b77cf-dentvitalis33.schunk.6ecbf8a934abc739.js`.

- Group 0, STYLE_OPACITY: `{"delay":0,"duration":0,"target":{"id":"N/A","appliesTo":"TRIGGER_ELEMENT","useEventTarget":true},"value":0}`.
- Group 1, STYLE_OPACITY: `{"delay":0,"easing":"outQuart","duration":1000,"target":{"id":"N/A","appliesTo":"TRIGGER_ELEMENT","useEventTarget":true},"value":1}`.

#### growIn 

Initial group enabled: `True`. Exact source: `raw/published/resources/03c1fa8b77cf-dentvitalis33.schunk.6ecbf8a934abc739.js`.

- Group 0, STYLE_OPACITY: `{"delay":0,"duration":0,"target":{"id":"N/A","appliesTo":"TRIGGER_ELEMENT","useEventTarget":true},"value":0}`.
- Group 1, TRANSFORM_SCALE: `{"delay":0,"duration":0,"target":{"id":"N/A","appliesTo":"TRIGGER_ELEMENT","useEventTarget":true},"xValue":0.7500000000000001,"yValue":0.7500000000000001}`.
- Group 2, TRANSFORM_SCALE: `{"delay":0,"easing":"outQuart","duration":1000,"target":{"id":"N/A","appliesTo":"TRIGGER_ELEMENT","useEventTarget":true},"xValue":1,"yValue":1}`.
- Group 2, STYLE_OPACITY: `{"delay":0,"easing":"outQuart","duration":1000,"target":{"id":"N/A","appliesTo":"TRIGGER_ELEMENT","useEventTarget":true},"value":1}`.

#### slideInBottom 

Initial group enabled: `True`. Exact source: `raw/published/resources/03c1fa8b77cf-dentvitalis33.schunk.6ecbf8a934abc739.js`.

- Group 0, STYLE_OPACITY: `{"delay":0,"duration":0,"target":{"id":"N/A","appliesTo":"TRIGGER_ELEMENT","useEventTarget":true},"value":0}`.
- Group 1, TRANSFORM_MOVE: `{"delay":0,"duration":0,"target":{"id":"N/A","appliesTo":"TRIGGER_ELEMENT","useEventTarget":true},"xValue":0,"yValue":100,"xUnit":"PX","yUnit":"PX","zUnit":"PX"}`.
- Group 2, TRANSFORM_MOVE: `{"delay":0,"easing":"outQuart","duration":1000,"target":{"id":"N/A","appliesTo":"TRIGGER_ELEMENT","useEventTarget":true},"xValue":0,"yValue":0,"xUnit":"PX","yUnit":"PX","zUnit":"PX"}`.
- Group 2, STYLE_OPACITY: `{"delay":0,"easing":"outQuart","duration":1000,"target":{"id":"N/A","appliesTo":"TRIGGER_ELEMENT","useEventTarget":true},"value":1}`.


## Scroll geometry extracted from runtime

`derived` from exact captured runtime excerpts, not browser measurements:

- Into-view uses inclusive intersection with a viewport rectangle inset vertically by the configured offset. `%` is a percentage of root clientHeight, `PX` is literal pixels. Both top and bottom are inset; horizontal overlap is required. This is not simply an IntersectionObserver threshold percentage.
- The event runs on visibility changes (or initial visible state). With no existing auto-stop companion event and an already-triggered state, the source suppresses retriggering.
- Continuous element scroll computes entry/range from the element rectangle, viewport height, startsEntering/startsExiting and the original offset flags. Exact formulas are in each recipe.
- Smoothing is scaled by 100, then uses per-frame gain `max(1 - smoothing, 0.01)`. It is not converted to an invented number of milliseconds.
- The captured IX2 reduced-motion initialization also requires the body `data-wf-ix-vacation` attribute. Separate CSS reduced-motion rules exist and are recorded independently.

Complete excerpts and character ranges: `raw/published/runtime-semantic-excerpts.json`. Remaining uncertainties concern runtime/computed outcomes and browser equivalence, not the extracted raw scroll formulas.



