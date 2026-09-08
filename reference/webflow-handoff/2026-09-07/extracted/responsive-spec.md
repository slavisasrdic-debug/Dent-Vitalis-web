# Responsive source specification

All conditions below are literal source conditions, not simplified viewport buckets. Declaration order and affected properties are in `styles-and-cascade.json`; all rule IDs are linked by `breakpoints.json`. Native base declarations do not represent computed desktop values.

- `media screen and (max-width: 767px)`: 152 declaration rules; source references in JSON.
- `media screen and (max-width: 991px)`: 232 declaration rules; source references in JSON.
- `media (prefers-reduced-motion: reduce)`: 2 declaration rules; source references in JSON.
- `media screen and (min-width: 768px)`: 5 declaration rules; source references in JSON.
- `media (max-width: 767px)`: 32 declaration rules; source references in JSON.
- `media (min-width: 992px)`: 3 declaration rules; source references in JSON.
- `media (max-width: 359px)`: 3 declaration rules; source references in JSON.
- `media (min-width: 768px)`: 9 declaration rules; source references in JSON.
- `media screen and (max-width:767px)`: 8 declaration rules; source references in JSON.
- `media screen and (min-width: 992px)`: 4 declaration rules; source references in JSON.
- `media (min-width:992px)`: 2 declaration rules; source references in JSON.
- `media screen and (max-width: 479px)`: 179 declaration rules; source references in JSON.
- `media screen and (min-width: 1280px)`: 22 declaration rules; source references in JSON.
- `media screen and (min-width: 1440px)`: 19 declaration rules; source references in JSON.
- `media screen and (min-width: 1920px)`: 33 declaration rules; source references in JSON.
- `js-matchMedia (min-width: 992px)`: 0 declaration rules; source references in JSON.

Test each numeric boundary immediately below, at and above it, plus the representative widths in breakpoints.json. Preserve min-width/max-width inclusivity; do not merge 767/768 or 991/992 into invented ranges.

Fluid expressions (%/vw/vh/calc/clamp) remain literal. All orientation/pointer/reduced-motion conditions actually found are listed; empty categories are not invented. Browser orientation and safe-area checks remain required.
