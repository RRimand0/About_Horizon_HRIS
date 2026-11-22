# Horizon HRIS — Marketing Website

A separate public-facing landing page for Horizon HRIS. This repository contains **no HRIS application backend, payroll data, database connection, subscription system, or authentication**.

## Local setup

Requirements: Node.js 20.19+ (or a current compatible Node.js release).

```bash
npm install
npm run dev
```

For a production build:

```bash
npm run build
npm run preview
```

Deploy the generated `dist/` directory to any static hosting service. Set up an HTTPS domain before making the website public. The marketing content works without environment variables. The demo-request form requires frontend build settings and a deployed PHP SMTP endpoint; see the demo request section below.

## Content, screenshots and contact details

Update `src/siteData.js` to edit feature descriptions and business contact information. The three product showcase paths are already connected, and **a neutral placeholder displays until the named image is added**. No React changes are necessary when supplying these screenshots.

Suggested future assets (PNG or optimized WebP) in `public/images/`:

- `product-overview.webp`
- `scheduling-attendance.webp`
- `payroll-management.webp`
- `mobile-kiosk.webp`

Drop the three named showcase screenshots in `public/images/` and refresh the site: the product tabs will display them automatically. `product-overview.webp` is optional; the hero deliberately keeps the existing workflow illustration until you enable `productImages.overview` in `src/siteData.js`. Prefer landscape screenshots for scheduling and payroll and a portrait screenshot for mobile kiosk. Do not commit real employee information, salary records, private payroll figures or personal contact details in screenshots. Use sanitized or demonstration records.

The `contact` object contains the verified Horizon HRIS business email. Other contact channels stay blank until provided. The demo request form requires a configured PHP endpoint before it can send automatically.

## Brand assets

The official uploaded symbol and horizontal logo are optimized as WebP in `public/branding/`. Keep their proportions unchanged. The logo is displayed on a white background to match the original artwork.

## Product limits

Horizon HRIS is not advertised as self-service SaaS. CSV attendance import is supported; real-time biometric device integration requires separate setup and configuration and is not included in the standard package. Only publish product claims that match the actual HRIS implementation.

## UI revision V2 — quicker to scan

The homepage prioritizes a short hero statement and a **conceptual workflow illustration**, then four compact capability cards. The product showcase uses keyboard-accessible tabs so visitors can switch between Scheduling, Payroll, and the Mobile Kiosk instead of scrolling through long repeated sections. The illustration represents the workflow only; it is **not** an actual Horizon HRIS screenshot.

Screenshot paths and text live in `src/siteData.js`. Showcase image paths are preconfigured: add sanitized files under `public/images/` without changing component code. With no overview screenshot configured, the hero retains its conceptual workflow illustration. Only the verified business email is published; phone, address, and social links remain blank. Demo booking submission is disabled until the PHP endpoint is configured.

Biometric devices require separately configured real-time integration; CSV attendance import is supported.

## Demo request form (Who / What / When / How)

The responsive **Request a Demo** form asks who is requesting it, what they would like to see, their preferred date/time in Philippine time, and whether they prefer online or onsite. The request is **not** an automatic calendar booking; Horizon HRIS confirms availability separately.

Automatic email delivery uses a **separate PHP SMTP endpoint**, not the payroll/HRIS backend. The UI is ready, but submitting is **disabled until** the secure PHP endpoint is deployed and `VITE_DEMO_API_URL` is configured. Until then, visitors can request a demo using the existing business email fallback. Follow [server/README.md](server/README.md) for SMTP and PHP deployment steps.

Onsite availability is limited to **200 km straight-line distance** from the proposed Cagayan de Oro City-center reference point. Onsite visitors type the meeting address; server-side Google Geocoding verifies its distance before the request can be emailed. Submitting onsite requests remains disabled until this private API is deployed and tested. Never commit credentials or API keys.

## Onsite meeting address — typed input

Visitors selecting **Onsite demo** enter the full meeting address manually (building/street, city, province, Philippines). No map, pin picker, or frontend Google Maps key is used.

The proposed 200 km service radius is centered on Cagayan de Oro City. The **PHP server** must independently geocode and check the submitted address before accepting an onsite request; a typed address is not accepted as proof of distance. The server's private `GOOGLE_GEOCODING_API_KEY` is still required for this validation method.

Onsite requests remain unavailable for submission until the PHP API, private geocoding credentials, and radius checks have been configured and verified, then `VITE_ONSITE_BOOKING_ENABLED=true` is set. Online demo requests are unaffected. Staff confirms availability separately.
