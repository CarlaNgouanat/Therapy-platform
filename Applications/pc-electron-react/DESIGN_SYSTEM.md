# DisMesMots - Design System Reference

> **Source:** Figma "Maquette V2" - https://www.figma.com/design/ONykAq304pvltcUYyvp6Ic/Maquette-V2
>
> This document contains all design tokens, component specifications, and styling guidelines extracted from the Figma design file. Use this as the single source of truth during implementation.

---

## Table of Contents

1. [Typography](#typography)
2. [Color Palette](#color-palette)
3. [Spacing Scale](#spacing-scale)
4. [Elevation & Shadows](#elevation--shadows)
5. [Border Radius](#border-radius)
6. [Components](#components)
   - [Buttons](#buttons)
   - [Inputs](#inputs)
   - [Tables](#tables)
   - [Cards](#cards)
   - [Checkboxes](#checkboxes)
   - [Toggles](#toggles)
   - [Sidebar](#sidebar)
   - [Search Bar](#search-bar)
7. [Icons](#icons)
8. [Layout Guidelines](#layout-guidelines)

---

## Typography

### Font Family

```css
font-family: 'Roboto', sans-serif;
```

**Google Fonts Import:**

```html
<link
  href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap"
  rel="stylesheet"
/>
```

Or CSS Import:

```css
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');
```

### Type Scale

| Name               | Size (px) | Size (rem) | Weight        | Line Height | Letter Spacing | Color     |
| ------------------ | --------- | ---------- | ------------- | ----------- | -------------- | --------- |
| **Heading 1**      | 24px      | 1.5rem     | 700 (Bold)    | 100% (24px) | 0.1px          | `#000000` |
| **Heading 2**      | 20px      | 1.25rem    | 700 (Bold)    | 120% (24px) | 0.1px          | `#000000` |
| **Subtitle**       | 20px      | 1.25rem    | 500 (Medium)  | 120% (24px) | 0.1px          | `#2D2E2E` |
| **Body Primary**   | 16px      | 1rem       | 400 (Regular) | 150% (24px) | 0.1px          | `#000000` |
| **Body Secondary** | 14px      | 0.875rem   | 400 (Regular) | 150%        | 0.1px          | `#000000` |
| **Caption**        | 14px      | 0.875rem   | 400 (Regular) | 150%        | 0.1px          | `#2D2E2E` |

### CSS Variables

```css
:root {
  /* Font Family */
  --font-family: 'Roboto', sans-serif;

  /* Font Sizes */
  --text-h1: 1.5rem; /* 24px */
  --text-h2: 1.25rem; /* 20px */
  --text-subtitle: 1.25rem; /* 20px */
  --text-body: 1rem; /* 16px */
  --text-small: 0.875rem; /* 14px */

  /* Font Weights */
  --font-regular: 400;
  --font-medium: 500;
  --font-bold: 700;

  /* Letter Spacing */
  --letter-spacing: 0.1px;
}
```

---

## Color Palette

### Background Colors (Arrière-plans)

| Token      | Hex       | Usage                             |
| ---------- | --------- | --------------------------------- |
| `--bg-100` | `#FFFFFF` | Primary background, cards, inputs |
| `--bg-95`  | `#EDEEEF` | Page background, secondary areas  |
| `--bg-90`  | `#DDDEDF` | Tertiary backgrounds              |
| `--bg-85`  | `#CDCECF` | Disabled states, muted areas      |

### Border Colors (Bordures)

| Token              | Hex       | Usage                      |
| ------------------ | --------- | -------------------------- |
| `--border-80`      | `#BDBEBF` | Light borders              |
| `--border-75`      | `#ADAEAF` | Medium borders             |
| `--border-70`      | `#9D9E9F` | Standard borders           |
| `--border-default` | `#8E8F90` | Default input/card borders |

### Text Colors (Textes)

| Token            | Hex       | Usage                  |
| ---------------- | --------- | ---------------------- |
| `--text-primary` | `#000000` | Headings, primary text |
| `--text-dark`    | `#212222` | Dark text              |
| `--text-body`    | `#2D2E2E` | Body text, subtitles   |
| `--text-muted`   | `#3A3B3B` | Muted/secondary text   |

### Brand Colors (Couleurs de marque)

#### Primary Blue

| Token             | Hex       | Usage                                       |
| ----------------- | --------- | ------------------------------------------- |
| `--brand-blue-10` | `#D1E6F7` | Light blue background                       |
| `--brand-blue-20` | `#A3CEF0` | Hover states                                |
| `--brand-blue-30` | `#75B5E8` | -                                           |
| `--brand-blue-40` | `#479DE1` | -                                           |
| `--brand-blue-50` | `#1880D9` | **Primary - buttons, links, active states** |
| `--brand-blue-60` | `#1366AE` | Hover on primary                            |
| `--brand-blue-70` | `#0F4D82` | Active/pressed state                        |
| `--brand-blue-80` | `#0A3357` | -                                           |
| `--brand-blue-90` | `#051A2B` | Dark blue                                   |

#### Accent Green

| Token              | Hex       | Usage                                         |
| ------------------ | --------- | --------------------------------------------- |
| `--brand-green-10` | `#CDF1DB` | Light green background                        |
| `--brand-green-20` | `#9BE3B7` | -                                             |
| `--brand-green-30` | `#69D593` | -                                             |
| `--brand-green-40` | `#37C76F` | -                                             |
| `--brand-green-50` | `#04B84A` | **Accent - success states, positive actions** |
| `--brand-green-60` | `#03943B` | Hover                                         |
| `--brand-green-70` | `#026F2C` | Active                                        |
| `--brand-green-80` | `#024A1E` | -                                             |
| `--brand-green-90` | `#01250F` | Dark green                                    |

### Semantic Colors (Couleurs logiques)

| Token                      | Hex       | Usage                                 |
| -------------------------- | --------- | ------------------------------------- |
| `--semantic-error`         | `#E71D02` | Error states, destructive actions     |
| `--semantic-error-light`   | `#FDEBE8` | Error background                      |
| `--semantic-success`       | `#46A102` | Success states (alternative to green) |
| `--semantic-success-light` | `#EBF5E6` | Success background                    |
| `--semantic-warning`       | `#E8A600` | Warning states                        |
| `--semantic-warning-light` | `#FDF6E5` | Warning background                    |
| `--semantic-info`          | `#00ADDB` | Info states                           |
| `--semantic-info-light`    | `#E5F7FB` | Info background                       |

### CSS Variables

```css
:root {
  /* Backgrounds */
  --bg-100: #ffffff;
  --bg-95: #edeeef;
  --bg-90: #dddedf;
  --bg-85: #cdcecf;

  /* Borders */
  --border-80: #bdbebf;
  --border-75: #adaeaf;
  --border-70: #9d9e9f;
  --border-default: #8e8f90;

  /* Text */
  --text-primary: #000000;
  --text-dark: #212222;
  --text-body: #2d2e2e;
  --text-muted: #3a3b3b;

  /* Brand - Blue (Primary) */
  --brand-blue-10: #d1e6f7;
  --brand-blue-50: #1880d9;
  --brand-blue-60: #1366ae;
  --brand-blue-70: #0f4d82;

  /* Brand - Green (Accent/Success) */
  --brand-green-10: #cdf1db;
  --brand-green-50: #04b84a;
  --brand-green-60: #03943b;
  --brand-green-70: #026f2c;

  /* Semantic */
  --semantic-error: #e71d02;
  --semantic-error-light: #fdebe8;
  --semantic-success: #46a102;
  --semantic-success-light: #ebf5e6;
  --semantic-warning: #e8a600;
  --semantic-warning-light: #fdf6e5;
  --semantic-info: #00addb;
  --semantic-info-light: #e5f7fb;
}
```

---

## Spacing Scale

| Token         | Value (px) | Value (rem) | Usage                         |
| ------------- | ---------- | ----------- | ----------------------------- |
| `--space-xs`  | 8px        | 0.5rem      | Tight spacing, icon gaps      |
| `--space-s`   | 12px       | 0.75rem     | Small spacing, form gaps      |
| `--space-m`   | 24px       | 1.5rem      | Default padding, section gaps |
| `--space-l`   | 36px       | 2.25rem     | Large spacing                 |
| `--space-xl`  | 52px       | 3.25rem     | Section separators            |
| `--space-xxl` | 76px       | 4.75rem     | Page margins, major sections  |

### CSS Variables

```css
:root {
  --space-xs: 0.5rem; /* 8px */
  --space-s: 0.75rem; /* 12px */
  --space-m: 1.5rem; /* 24px */
  --space-l: 2.25rem; /* 36px */
  --space-xl: 3.25rem; /* 52px */
  --space-xxl: 4.75rem; /* 76px */
}
```

---

## Elevation & Shadows

| Token               | Value                                 | Usage                    |
| ------------------- | ------------------------------------- | ------------------------ |
| `--shadow-card`     | `0px 4px 4px 0px rgba(0, 0, 0, 0.25)` | Cards, elevated surfaces |
| `--shadow-dropdown` | `0px 2px 8px 0px rgba(0, 0, 0, 0.15)` | Dropdowns, popovers      |

### CSS Variables

```css
:root {
  --shadow-card: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
  --shadow-dropdown: 0px 2px 8px 0px rgba(0, 0, 0, 0.15);
}
```

---

## Border Radius

| Token           | Value  | Usage                |
| --------------- | ------ | -------------------- |
| `--radius-xs`   | 4px    | Small elements       |
| `--radius-sm`   | 8px    | Inputs, small cards  |
| `--radius-md`   | 12px   | Medium elements      |
| `--radius-lg`   | 16px   | Large elements       |
| `--radius-xl`   | 24px   | Cards, containers    |
| `--radius-full` | 9999px | Pill buttons, badges |

### CSS Variables

```css
:root {
  --radius-xs: 4px;
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 24px;
  --radius-full: 9999px;
}
```

---

## Components

### Buttons

#### Variants

| Variant               | Background  | Text Color | Border        | Hover State  |
| --------------------- | ----------- | ---------- | ------------- | ------------ |
| **Primary**           | `#1880D9`   | `#FFFFFF`  | none          | `#1366AE`    |
| **Primary Outline**   | transparent | `#1880D9`  | 1px `#1880D9` | bg `#D1E6F7` |
| **Secondary**         | transparent | `#8E8F90`  | 1px `#8E8F90` | bg `#EDEEEF` |
| **Success**           | `#04B84A`   | `#FFFFFF`  | none          | `#03943B`    |
| **Success Outline**   | transparent | `#04B84A`  | 1px `#04B84A` | bg `#CDF1DB` |
| **Error/Destructive** | `#E71D02`   | `#FFFFFF`  | none          | darker red   |
| **Error Outline**     | transparent | `#E71D02`  | 1px `#E71D02` | bg `#FDEBE8` |
| **Warning Outline**   | transparent | `#E8A600`  | 1px `#E8A600` | bg `#FDF6E5` |
| **Info Outline**      | transparent | `#00ADDB`  | 1px `#00ADDB` | bg `#E5F7FB` |

#### Sizes

| Size        | Height | Padding   | Font Size | Border Radius |
| ----------- | ------ | --------- | --------- | ------------- |
| **Default** | 40px   | 16px 24px | 16px      | 24px (pill)   |
| **Small**   | 32px   | 8px 16px  | 14px      | 16px          |
| **Icon**    | 40px   | 8px       | -         | 24px          |

#### Button Anatomy

```
┌─────────────────────────────────────┐
│  [icon]  Label Text  [icon]         │
│         ← 24px padding →            │
└─────────────────────────────────────┘
         ↑ 40px height
```

#### States

- **Default**: Normal appearance
- **Hover**: Darker background or light background fill for outline
- **Active/Pressed**: Even darker
- **Disabled**: 50% opacity, no pointer events
- **Loading**: Show spinner, disable interaction

---

### Inputs

#### Text Input

| Property          | Value               |
| ----------------- | ------------------- |
| Height            | 44px                |
| Background        | `#FFFFFF`           |
| Border            | 1px solid `#8E8F90` |
| Border Radius     | 8px                 |
| Padding           | 12px 16px           |
| Font Size         | 16px                |
| Font Color        | `#000000`           |
| Placeholder Color | `#8E8F90`           |

#### States

| State    | Border Color    | Background |
| -------- | --------------- | ---------- |
| Default  | `#8E8F90`       | `#FFFFFF`  |
| Focus    | `#1880D9` (2px) | `#FFFFFF`  |
| Error    | `#E71D02`       | `#FFFFFF`  |
| Disabled | `#CDCECF`       | `#EDEEEF`  |

#### Input with Label

```
Label Text (14px, #2D2E2E)
┌─────────────────────────────────────┐
│ Placeholder or value                │
└─────────────────────────────────────┘
Helper text or error message (12px)
```

---

### Tables

#### Container

| Property      | Value                                 |
| ------------- | ------------------------------------- |
| Background    | `#FFFFFF`                             |
| Border Radius | 24px                                  |
| Box Shadow    | `0px 4px 4px 0px rgba(0, 0, 0, 0.25)` |
| Overflow      | hidden                                |

#### Header Row

| Property      | Value                  |
| ------------- | ---------------------- |
| Background    | `#EDEEEF` or `#FFFFFF` |
| Font Size     | 14px                   |
| Font Weight   | 500 (Medium)           |
| Font Color    | `#8E8F90`              |
| Height        | 48px                   |
| Padding       | 12px 16px              |
| Border Bottom | 1px solid `#EDEEEF`    |

#### Body Rows

| Property         | Value               |
| ---------------- | ------------------- |
| Font Size        | 16px                |
| Font Weight      | 400 (Regular)       |
| Font Color       | `#000000`           |
| Height           | 56px                |
| Padding          | 16px                |
| Border Bottom    | 1px solid `#EDEEEF` |
| Hover Background | `#F5F5F5`           |

#### Action Links in Tables

| Property  | Value     |
| --------- | --------- |
| Color     | `#1880D9` |
| Font Size | 14px      |
| Hover     | Underline |

---

### Cards

#### Standard Card

| Property      | Value                                 |
| ------------- | ------------------------------------- |
| Background    | `#FFFFFF`                             |
| Border Radius | 24px                                  |
| Box Shadow    | `0px 4px 4px 0px rgba(0, 0, 0, 0.25)` |
| Padding       | 24px                                  |

---

### Checkboxes

| Property           | Value               |
| ------------------ | ------------------- |
| Size               | 20px × 20px         |
| Border             | 2px solid `#8E8F90` |
| Border Radius      | 4px                 |
| Checked Background | `#1880D9`           |
| Checkmark Color    | `#FFFFFF`           |

---

### Toggles

| Property             | Value                     |
| -------------------- | ------------------------- |
| Track Width          | 44px                      |
| Track Height         | 24px                      |
| Track Off Background | `#CDCECF`                 |
| Track On Background  | `#1880D9`                 |
| Thumb Size           | 20px                      |
| Thumb Color          | `#FFFFFF`                 |
| Border Radius        | 12px (track), 50% (thumb) |

---

### Sidebar

| Property     | Value                              |
| ------------ | ---------------------------------- |
| Width        | 240px (expanded), 64px (collapsed) |
| Background   | `#FFFFFF`                          |
| Border Right | none (uses shadow)                 |
| Box Shadow   | `2px 0 4px rgba(0,0,0,0.05)`       |

#### Sidebar Item

| State   | Background  | Text Color | Icon Color |
| ------- | ----------- | ---------- | ---------- |
| Default | transparent | `#2D2E2E`  | `#8E8F90`  |
| Hover   | `#EDEEEF`   | `#000000`  | `#1880D9`  |
| Active  | `#D1E6F7`   | `#1880D9`  | `#1880D9`  |

#### Sidebar Item Dimensions

| Property           | Value     |
| ------------------ | --------- |
| Height             | 44px      |
| Padding            | 12px 16px |
| Gap (icon to text) | 12px      |
| Border Radius      | 8px       |
| Icon Size          | 20px      |

---

### Search Bar

| Property      | Value               |
| ------------- | ------------------- |
| Height        | 44px                |
| Background    | `#FFFFFF`           |
| Border        | 1px solid `#8E8F90` |
| Border Radius | 22px (pill)         |
| Padding Left  | 44px (for icon)     |
| Padding Right | 16px                |
| Icon Size     | 20px                |
| Icon Color    | `#8E8F90`           |

---

## Icons

The design uses a consistent icon set. Icons should be:

| Property        | Value        |
| --------------- | ------------ |
| Default Size    | 20px × 20px  |
| Large Size      | 24px × 24px  |
| Color (default) | `#8E8F90`    |
| Color (active)  | `#1880D9`    |
| Stroke Width    | 1.5px or 2px |

**Recommended Icon Library:** Lucide React (already installed in project)

---

## Layout Guidelines

### Page Layout

```
┌──────────────────────────────────────────────────────────┐
│                         HEADER (if any)                   │
├────────────┬─────────────────────────────────────────────┤
│            │                                              │
│  SIDEBAR   │              MAIN CONTENT                    │
│   240px    │                                              │
│            │   ┌────────────────────────────────────┐    │
│            │   │  Page Header (title + actions)      │    │
│            │   └────────────────────────────────────┘    │
│            │                                              │
│            │   ┌────────────────────────────────────┐    │
│            │   │                                    │    │
│            │   │          Content Area              │    │
│            │   │                                    │    │
│            │   └────────────────────────────────────┘    │
│            │                                              │
└────────────┴─────────────────────────────────────────────┘
```

### Main Content Area

| Property   | Value                  |
| ---------- | ---------------------- |
| Background | `#EDEEEF` or `#F1F2F3` |
| Padding    | 24px                   |
| Max Width  | 1200px (optional)      |

### Page Header

| Property      | Value                 |
| ------------- | --------------------- |
| Margin Bottom | 24px                  |
| Title Font    | 24px Bold `#000000`   |
| Actions       | Right-aligned buttons |

---

## Responsive Breakpoints

| Breakpoint | Width          | Sidebar Behavior         |
| ---------- | -------------- | ------------------------ |
| Desktop    | ≥ 1024px       | Full sidebar (240px)     |
| Tablet     | 768px - 1023px | Collapsed sidebar (64px) |
| Mobile     | < 768px        | Hidden sidebar (overlay) |

---

## Animation & Transitions

| Property         | Duration | Easing      |
| ---------------- | -------- | ----------- |
| Hover states     | 150ms    | ease-in-out |
| Focus states     | 150ms    | ease-in-out |
| Sidebar collapse | 200ms    | ease-in-out |
| Modal open/close | 200ms    | ease-out    |

---

## Accessibility Notes

- All interactive elements must have visible focus states
- Color contrast ratio must be at least 4.5:1 for text
- Buttons and links need clear hover/focus states
- Form inputs need associated labels
- Use semantic HTML elements

---

## File Structure Reference

```
src/
├── index.css              # Global styles, CSS variables
├── components/
│   ├── ui/
│   │   ├── Button.tsx     # Button component
│   │   ├── Input.tsx      # Text input component
│   │   ├── Table.tsx      # Table components
│   │   ├── Card.tsx       # Card container
│   │   ├── Badge.tsx      # Status badges
│   │   ├── Checkbox.tsx   # Checkbox
│   │   ├── Toggle.tsx     # Toggle/Switch
│   │   ├── SearchInput.tsx # Search with icon
│   │   └── PageHeader.tsx # Page title + actions
│   └── SidebarComponent.tsx
└── pages/
    ├── PatientsPage.tsx
    ├── ExercicesPage.tsx
    ├── LibraryPage.tsx
    └── SettingsPage.tsx
```
