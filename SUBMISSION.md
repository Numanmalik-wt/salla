# Hareer — publishing checklist

## 1. Fill in your details

- [ ] `twilight.json`: replace `repository`, `author_email` and `support_url` placeholders
- [ ] `package.json`: replace `author` and `repository`

## 2. Connect and preview

- [ ] Create a Salla Partners account and connect GitHub
- [ ] Push this folder to a new GitHub repository (keep `public/`, it holds the built files)
- [ ] Partners Portal → My Themes → Create theme → **Import** the repository
- [ ] Locally: `pnpm install`, `salla login`, `salla theme preview`, pick a demo store
- [ ] Add 10–15 abaya products to the demo store, at least 2 photos each (pairs from `demo-content/products/` work well, the second photo shows on hover), with lengths 52–60 as options

## 3. Test in the preview (things that can only be checked on a live store)

- [ ] Home: add each Hareer component from the theme panel and fill it
- [ ] Hero autoplay, dots and swipe on mobile; mobile image switch
- [ ] Category tabs load products for each category (`salla-products-list source="categories"`)
- [ ] Lookbook products list shows the selected products
- [ ] Countdown with a future date; disappears when the date field is empty
- [ ] Theme settings: each heading font, sharp/rounded corners, all three photo shapes
- [ ] Announcement bar close button; utility bar toggle
- [ ] Product page: length guide opens, custom guide image replaces the table, WhatsApp button
      (needs a WhatsApp number in store settings), delivery/returns notes
- [ ] Product cards: hover photo, quick add-to-cart, out-of-stock, sale price, wishlist
- [ ] Header: sticky menu, mega menu, "more" menu overflow, mobile menu, search modal, cart count
- [ ] Arabic (RTL) and English (LTR), currency/language switcher
- [ ] Cart, checkout entry, customer pages, blog, brands, thank-you page (unchanged from the starter, but check styling)
- [ ] Lighthouse on mobile: no layout shift from the hero, images sized

## 4. Before submitting

- [ ] Sync with the latest Theme Raed changes (Salla requires themes to stay current with the starter)
- [ ] Take 3 screenshots from the demo store: desktop home, product page, mobile home
- [ ] Partners Portal → Publish → fill the listing below → submit for review
- [ ] Expect UI/UX, technical and metadata review rounds; fix and resubmit

## Store listing text

**Name:** حرير | Hareer

**Category:** Fashion & clothing (أزياء وملابس)

**Short description (AR)**
قالب أنيق لمتاجر العبايات والأزياء المحتشمة، بصور منتجات طولية ودليل أطوال وطلب تفصيل عبر واتساب.

**Short description (EN)**
An editorial theme for abaya and modest-fashion stores, with portrait product photos, a length guide and WhatsApp tailoring requests.

**Full description (AR)**
صُمم حرير لمتاجر العبايات والأزياء المحتشمة التي تريد واجهة هادئة وفاخرة تبرز التفاصيل.
- واجهة افتتاحية بعرض كامل مع صورة مستقلة للجوال
- بطاقات مجموعات وتخطيط فسيفساء
- منتجات بتبويبات حسب التصنيف
- قسم "تسوقي الإطلالة" بنقاط تفاعلية على الصورة
- عرض بعداد تنازلي، قصة العلامة، مزايا الخدمة، ومعرض صور
- دليل أطوال العبايات في صفحة المنتج، وزر طلب تفصيل عبر واتساب
- صور منتجات طولية 3:4 مع صورة ثانية عند التمرير وإضافة سريعة للسلة
- اختيار خط العناوين، زوايا حادة أو دائرية، ودعم كامل للعربية والإنجليزية

**Full description (EN)**
Hareer is built for abaya and modest-fashion stores that want a calm, premium storefront that lets the details show.
- Full-width editorial hero with a separate mobile image
- Collection tiles with an optional mosaic layout
- Products in tabs by category
- "Shop the look" section with hotspots on the photo
- Countdown offer, brand story, service highlights and photo gallery
- Abaya length guide on the product page and a WhatsApp tailoring request button
- Portrait 3:4 product photos with a second photo on hover and quick add-to-cart
- Choice of heading font, sharp or rounded corners, full Arabic and English support
