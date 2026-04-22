---
name: Civic Authority
colors:
  surface: '#f8f9ff'
  surface-dim: '#ccdbf3'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e6eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d5e3fc'
  on-surface: '#0d1c2e'
  on-surface-variant: '#434655'
  inverse-surface: '#233144'
  inverse-on-surface: '#eaf1ff'
  outline: '#747686'
  outline-variant: '#c4c5d7'
  surface-tint: '#2151da'
  primary: '#0037b0'
  on-primary: '#ffffff'
  primary-container: '#1d4ed8'
  on-primary-container: '#cad3ff'
  inverse-primary: '#b7c4ff'
  secondary: '#565e74'
  on-secondary: '#ffffff'
  secondary-container: '#dae2fd'
  on-secondary-container: '#5c647a'
  tertiary: '#004f35'
  on-tertiary: '#ffffff'
  tertiary-container: '#006948'
  on-tertiary-container: '#76eab6'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dce1ff'
  primary-fixed-dim: '#b7c4ff'
  on-primary-fixed: '#001551'
  on-primary-fixed-variant: '#0039b5'
  secondary-fixed: '#dae2fd'
  secondary-fixed-dim: '#bec6e0'
  on-secondary-fixed: '#131b2e'
  on-secondary-fixed-variant: '#3f465c'
  tertiary-fixed: '#85f8c4'
  tertiary-fixed-dim: '#68dba9'
  on-tertiary-fixed: '#002114'
  on-tertiary-fixed-variant: '#005137'
  background: '#f8f9ff'
  on-background: '#0d1c2e'
  surface-variant: '#d5e3fc'
typography:
  headline-xl:
    fontFamily: Public Sans
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Public Sans
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Public Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  data-mono:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  container-max: 1280px
  gutter: 24px
  margin-page: 40px
  stack-xs: 4px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 24px
  stack-xl: 48px
---

## Brand & Style

This design system is built on the principles of **Institutional Clarity** and **Data Transparency**. It bridges the gap between the functional utility of UK government services and the high-density precision of modern developer tools like Stripe and Linear. The aesthetic is strictly "Data-Forward," prioritizing the legibility of civic metrics and legislative progress over decorative flair.

The personality is authoritative yet accessible, using a "Flat-Plus" approach: purely flat surfaces defined by structural 1px borders, punctuated by subtle shadows only to indicate interactive elevation or critical modal focus. It avoids all trends of glassmorphism or organic gradients, opting instead for a systematic, grid-based layout that conveys stability and public trust.

## Colors

The palette is anchored by a deep "Civic Blue" (`#1D4ED8`), chosen for its association with official duty and digital accessibility. 

- **Primary & Action:** The primary blue is used for directional cues and primary actions. It is paired with a high-contrast hover state (`#1E40AF`) to ensure clear feedback.
- **Surface Strategy:** We utilize a three-tier grayscale system. `Surface-1` is for primary content cards; `Surface-2` provides soft contrast for background layouts; `Surface-3` is reserved for recessed elements like search bars or inactive status wells.
- **Typography & Borders:** Text uses a high-density Slate palette (`#0F172A`) to maintain readability against stark white backgrounds. Borders are used structurally—`#E2E8F0` for standard containment and `#CBD5E1` for defining interactive boundaries or header separations.

## Typography

The typographic system uses a dual-font strategy to balance institutional authority with technical precision. 

- **Public Sans** is the headline face. It carries the "Governmental" weight required for a civic platform, offering high legibility and a neutral, trustworthy tone.
- **Inter** handles the heavy lifting for UI controls, body copy, and secondary metadata. It is chosen for its systematic clarity at small sizes.
- **JetBrains Mono** is strictly reserved for "Data-Forward" elements: ID numbers, budgetary figures, timestamps, and coordinates. This monospaced intervention signals to the user that they are viewing raw, un-manipulated civic data.

## Layout & Spacing

This design system employs a **Fixed-Fluid Hybrid Grid**. The main content area is capped at `1280px` to maintain line-length readability, while the background surfaces extend to the viewport edges. 

The vertical rhythm is based on a 4px baseline grid. 
- **Purposeful Whitespace:** Significant breathing room (`48px+`) is used between major sections (e.g., "Active Proposals" vs. "Completed Projects") to prevent cognitive overload.
- **Sidebar:** A fixed-width sidebar (`280px`) using the `--sidebar-bg` palette provides a persistent anchor for navigation, influenced by the high-efficiency layouts of modern SaaS dashboards.
- **Density:** While layout margins are generous, internal component spacing is tight and efficient, allowing for high data density within cards and tables.

## Elevation & Depth

Hierarchy is established primarily through **Tonal Layering** and **Structural Borders** rather than dramatic shadows.

- **Level 0 (Background):** The base layer uses `--surface-2` (#F8FAFC) to create a subtle canvas.
- **Level 1 (Cards/Content):** Primary content containers use `--surface` (#FFFFFF) with a 1px border (`--border`). This creates a crisp, physical separation.
- **Level 2 (Interactive/Floating):** Subtle shadows are used only for components that physically sit "above" the layout, such as dropdown menus or hover states on cards. The shadow profile is: `0 4px 6px -1px rgba(15, 23, 42, 0.05), 0 2px 4px -2px rgba(15, 23, 42, 0.05)`.
- **Level 3 (Modals):** A soft backdrop blur (2px) on a 40% opacity Slate overlay is used to focus the user on critical governance tasks.

## Shapes

The shape language is conservative and disciplined. We avoid fully circular buttons (except for icon-only toggles) to maintain a professional, "standard-issue" feel.

- **sm (6px):** Used for small inputs, checkboxes, and nested status chips.
- **md (10px):** The standard radius for primary buttons and input fields.
- **lg (14px):** Used for standard content cards and dashboard widgets.
- **xl (20px):** Reserved for large modal containers and prominent call-to-action sections.

Borders are strictly 1px for standard elements, increasing to 2px only for focus states or to differentiate "pinned" content.

## Components

- **Buttons:** Use solid `--primary` for "Act" (e.g., File a Report). Use outlined borders with `--text-secondary` for "Review" (e.g., View Archive). Buttons have a distinct 2px focus ring of `--primary-light` when tabbed.
- **Data Tables:** Highly inspired by the India Stack and Stripe. Use `JetBrains Mono` for numeric cells. Header rows use `--surface-3` with `label-caps` typography. Row separators are 1px `--border`.
- **Status Chips:** High-contrast text on low-saturation backgrounds (e.g., Success: `#059669` text on `#ECFDF5` bg). Chips use the `sm` radius (6px).
- **Sidebar Items:** Items utilize a 3px vertical accent bar on the left edge when active (`--sidebar-active`). Backgrounds are dark (`#0F172A`) with text in `#CBD5E1`.
- **Input Fields:** Use a 1px `--border-strong` default. On focus, the border shifts to `--primary` with a soft glow. Labels sit strictly above the input, never as placeholders.
- **Civic Progress Cards:** A specialized component featuring a 2px border, a progress bar using semantic colors, and a "Data Footer" that displays timestamps in monospaced font.