# Sarab — سراب

A cinematic Salla (Twilight) theme for sunglasses, caps and accessories stores. Arabic-first (RTL) with full English (LTR) support.

## What's inside

**Signature home sections** (added from *Theme → Home page* in the Salla dashboard):

| Section | Path | What it does |
|---|---|---|
| Polarized lens video hero | `home.sarab-hero` | Full-screen muted video under a glare layer. A "polarized lens" follows the cursor and shows the footage crisp and saturated. It drifts on its own on touch devices. |
| Scroll statement | `home.sarab-statement` | A large editorial sentence whose words light up as you read. `[1] [2] [3]` place small image pills inside the text. |
| Horizontal product runway | `home.sarab-runway` | Merchant-selected products. On desktop the section pins and travels sideways (direction follows RTL/LTR). On mobile it's a native swipe carousel. Uses Salla's real `salla-add-product-button`. |
| Editorial category index | `home.sarab-categories` | Large category names. On desktop the image follows the cursor; on mobile it shows thumbnails. |
| Expanding video window | `home.sarab-reveal-video` | A small framed video opens to full-bleed as you scroll. |
| Velocity marquee | `home.sarab-marquee` | Store promises in a ribbon that speeds up with scroll. Uses the store color or dark. |

All of Salla's standard pages and components from the Raed base are kept: product, category, cart, account, blog, loyalty, and the built-in home features.

**Theme settings:** smooth scroll, custom cursor, film grain, first-visit preloader, and the Arabic display font (Reem Kufi / El Messiri / store font). The accent follows the merchant's primary store color.

## Motion stack
- GSAP 3 + ScrollTrigger for the choreography.
- Lenis 1 as the only smooth-scroll engine, synced to ScrollTrigger through the GSAP ticker. It is paused inside Salla modals and search.
- No Three.js/WebGL, to keep the store fast on mid-range phones.
- `prefers-reduced-motion: reduce` turns off smoothing, pins, scrubs, the lens, video autoplay and the preloader, and renders final states.
- Data-saver mode skips video autoplay. Videos lazy-load and pause offscreen or when the tab is hidden.
- Without JavaScript the page is complete: posters show, text is unsplit and visible, and the preloader never shows.

## Merchant video tips
Upload a short MP4 (H.264, no audio, under ~4 MB, 10–15 s, 1920×1080) and paste its direct link in the section's **video link** field. Leave the field empty to use the bundled demo footage. Always set a poster image.

## Develop
```bash
pnpm install
pnpm run watch      # or: pnpm run prod
salla theme preview # Salla CLI
```
Key files: `src/views/components/home/sarab-*.twig`, `src/assets/js/sarab.js`, `src/assets/styles/04-components/sarab.scss`, `twilight.json`.

## Credits & licensing
- Built on Salla's open-source **Raed** theme (MIT). Keep that notice when distributing.
- Default imagery comes from Unsplash (Unsplash License) and is loaded from `images.unsplash.com` as placeholder content. The bundled demo videos (`src/assets/images/sarab/*.mp4`) were rendered from Unsplash photos. Before selling, swap in imagery you own or license for the marketplace preview store, so merchants never ship stock demo content as their own.
- Fonts: Instrument Serif, Reem Kufi, El Messiri (Google Fonts, SIL OFL).
