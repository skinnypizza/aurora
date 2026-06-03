---
name: Obsidian Glass
colors:
  surface: '#101415'
  surface-dim: '#101415'
  surface-bright: '#363a3b'
  surface-container-lowest: '#0b0f10'
  surface-container-low: '#191c1e'
  surface-container: '#1d2022'
  surface-container-high: '#272a2c'
  surface-container-highest: '#323537'
  on-surface: '#e0e3e5'
  on-surface-variant: '#c4c7c7'
  inverse-surface: '#e0e3e5'
  inverse-on-surface: '#2d3133'
  outline: '#8e9192'
  outline-variant: '#444748'
  surface-tint: '#c9c6c5'
  primary: '#c9c6c5'
  on-primary: '#313030'
  primary-container: '#050505'
  on-primary-container: '#797777'
  inverse-primary: '#5f5e5e'
  secondary: '#c0c1ff'
  on-secondary: '#1000a9'
  secondary-container: '#3131c0'
  on-secondary-container: '#b0b2ff'
  tertiary: '#c6c6c9'
  on-tertiary: '#2f3133'
  tertiary-container: '#040506'
  on-tertiary-container: '#76777a'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e5e2e1'
  primary-fixed-dim: '#c9c6c5'
  on-primary-fixed: '#1c1b1b'
  on-primary-fixed-variant: '#474646'
  secondary-fixed: '#e1e0ff'
  secondary-fixed-dim: '#c0c1ff'
  on-secondary-fixed: '#07006c'
  on-secondary-fixed-variant: '#2f2ebe'
  tertiary-fixed: '#e2e2e5'
  tertiary-fixed-dim: '#c6c6c9'
  on-tertiary-fixed: '#1a1c1e'
  on-tertiary-fixed-variant: '#454749'
  background: '#101415'
  on-background: '#e0e3e5'
  surface-variant: '#323537'
typography:
  display-lg:
    fontFamily: Geist
    fontSize: 64px
    fontWeight: '200'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '500'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Geist
    fontSize: 28px
    fontWeight: '500'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '500'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Geist
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.0'
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '400'
    lineHeight: '1.0'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1200px
  gutter: 24px
  margin-mobile: 20px
  margin-desktop: 64px
---

## Brand & Style

The design system embodies an ultra-premium, "Dark Obsidian" aesthetic, drawing inspiration from high-end hardware and architectural glass. It is characterized by an immersive sense of depth, utilizing deep blacks, frosted textures, and precision-engineered light.

The visual style is a fusion of **Minimalism** and **Glassmorphism**, specifically focusing on:
- **Atmospheric Depth:** Layers are defined by varying levels of transparency and background blur rather than traditional solid fills.
- **Internal Illumination:** Elements feature ultra-fine, 0.5pt borders that mimic fiber-optic light catching the edge of a glass pane.
- **Sophisticated Precision:** Every pixel is deliberate, with generous whitespace creating a gallery-like experience for content.

The target audience consists of power users and luxury-focused consumers who value a quiet, focused, and high-fidelity interface that feels both futuristic and grounded.

## Colors

The palette is rooted in the "Obsidian" theme, prioritizing low-light comfort and high-contrast accents.

- **Primary (Obsidian):** `#050505` serves as the infinite base layer. It is a true black designed to melt into modern OLED displays.
- **Secondary (Indigo Glow):** `#6366F1` is used sparingly for interactive highlights, notifications, and subtle "internal illumination" effects.
- **Tertiary (Slate):** `#1A1C1E` provides the mid-tone for surface containers that require more opacity or structural definition.
- **Glass White:** A translucent white (`rgba(255, 255, 255, 0.05)`) used for the frost effect on elevated surfaces.
- **Text & Accents:** High-purity neutrals (`#F8FAFC`) ensure legibility against the dark backdrop, with lower-tier information utilizing 40–60% opacity.

## Typography

This design system utilizes **Geist** for its entire typographic scale to maintain a clinical, developer-grade precision. The hierarchy relies on extreme weight contrast—pairing thin, large-scale display text with bold, compact labels.

- **Display Text:** Set with light weights and tight letter spacing to evoke a premium, editorial feel.
- **Body Copy:** Optimized for readability with generous line heights (1.6x) and standard tracking.
- **Micro-copy:** Labels use slightly increased tracking and semi-bold weights to ensure they remain legible even at reduced opacities.
- **Mobile scaling:** Headlines scale down aggressively to maintain the layout's architectural balance on smaller screens.

## Layout & Spacing

The layout philosophy follows a **Fixed-Grid** model for desktop and a **Fluid-Grid** for mobile. It emphasizes "Generous Breathing Room."

- **Grid System:** A 12-column grid on desktop with wide 24px gutters. Elements frequently span 6 or 8 columns to keep content centered and focused.
- **Rhythm:** All spacing (padding, margins, gap) must be multiples of the 8px base unit. 
- **Whitespace:** Use 64px or 80px vertical margins between major sections to prevent the "Obsidian" theme from feeling heavy or claustrophobic.
- **Adaptation:** On mobile, margins reduce to 20px, and grid columns collapse to a single column while maintaining the 8px vertical rhythm.

## Elevation & Depth

Depth is not created with shadows, but through **material properties**. 

- **Backdrop Blur:** All elevated containers must use a background blur (minimum 20px) to create a "frosted glass" effect.
- **Layering:** 
    - *Level 0 (Base):* Obsidian Black (#050505).
    - *Level 1 (Surface):* 5% White fill + 20px Blur + 0.5px subtle border (#FFFFFF at 10% opacity).
    - *Level 2 (Active):* 8% White fill + 40px Blur + 1px border with a subtle Indigo gradient glow.
- **Internal Glow:** For high-priority elements, apply an inner shadow with 0-blur and a 1px spread using the secondary Indigo color at 20% opacity to simulate light refracting within the glass edge.

## Shapes

The shape language is "Apple-inspired," utilizing "continuous corners" (squircle-like feel) rather than simple geometric radii.

- **Containers:** Large surfaces like cards and modals use `rounded-xl` (1.5rem / 24px) to feel approachable and soft against the dark theme.
- **Components:** Buttons and input fields use `rounded-lg` (1rem / 16px).
- **Interactive Small:** Checkboxes and small chips use `rounded` (0.5rem / 8px).
- **Icons:** Should be contained within circular or highly rounded soft-square enclosures.

## Components

- **Buttons:** Primary buttons feature a semi-transparent Indigo gradient with a 1px "light-catch" top border. Secondary buttons are pure frosted glass (20% opacity white) with white text.
- **Cards:** No solid background. Use 5% white transparency with a heavy 30px backdrop blur and a thin #FFFFFF (10% opacity) stroke.
- **Input Fields:** Minimalist design. A simple 0.5px bottom border or a very subtle dark-grey fill. The focus state should illuminate the border with the Indigo glow.
- **Chips/Tags:** Use a "Pill" shape (Rounded 3) with 10% white fill and uppercase label typography for a technical look.
- **Lists:** Separated by ultra-thin (0.5px) dividers at 5% white opacity. Hover states should trigger a subtle increase in background brightness (from 5% to 8% white).
- **Modals:** Centered with a heavy backdrop blur (60px) on the layers beneath them to create a sense of total immersion.