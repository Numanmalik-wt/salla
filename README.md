# Hareer | حرير — Salla theme for abaya and modest-fashion stores

Hareer is a Twilight theme for Salla built on the official starter (Theme Raed), with its own design system,
header, footer, product card and nine custom home-page sections made for abaya and modest-fashion stores.

## What's in the theme

**Home sections (Theme components)**

| Component | Path | What it does |
|---|---|---|
| Editorial Hero | `home.hareer-hero` | Full-width slides with title, text and button, separate mobile image, autoplay with progress bars, swipe support |
| Scrolling Announcements | `home.hareer-marquee` | Infinite text strip (shipping, tailoring, exchanges) |
| Collection Tiles | `home.hareer-collections` | Portrait category tiles, grid or mosaic layout |
| Products by Category Tabs | `home.hareer-tabbed-products` | Each chosen category becomes a tab of products |
| Shop the Look | `home.hareer-lookbook` | Lookbook photo with hotspots plus linked products |
| Offer with Countdown | `home.hareer-offer` | Promotional banner with a live countdown |
| Brand Story | `home.hareer-story` | Image and text block with signature |
| Service Highlights | `home.hareer-services` | 2–4 service icons with short text |
| Photo Gallery | `home.hareer-gallery` | Edge-to-edge photo grid linking to Instagram |

**Theme settings (Hareer groups at the top of the settings panel)**

- Heading font (El Messiri, Amiri, Noto Naskh, Playfair, or the store font) and sharp or rounded corners
- Dismissible announcement bar, optional utility bar
- Product photo shape (3:4, 2:3, 1:1) and second photo on hover
- Product page: abaya length guide (default chart or merchant image), WhatsApp tailoring request,
  delivery and exchange notes as accordions
- Large tagline above the footer

**Other changes from the starter**

- New header: centered logo, search / account / wishlist / cart actions, menu on its own row
- New footer layout (dark by default)
- Product cards: portrait photos, hover second image, quick add-to-cart over the photo on desktop
- Hareer design tokens in `src/assets/styles/06-hareer/`

## Development

```bash
pnpm install
salla login
salla theme preview      # live preview against your demo store
pnpm run production      # build into /public
```

Theme files: `src/views` (Twig), `src/assets/styles/06-hareer` (Hareer styles),
`src/assets/js/hareer` (section scripts), `src/locales` (`blocks.hareer.*` strings), `twilight.json`.

**Demo photos.** Every Hareer section ships with real abaya photos (in `src/assets/images/hareer`), shown until the merchant uploads their own. `demo-content/products/` has 12 portrait product photos for filling a demo store. Sources are listed in `CREDITS.md`.

See `SUBMISSION.md` for the publishing checklist and store listing text.
