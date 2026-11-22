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

Deploy the generated `dist/` directory to any static hosting service. Set up an HTTPS domain before making the website public. No environment variables are required for version 1.

## Content, screenshots and contact details

Update `src/siteData.js` to edit feature descriptions and business contact information. The three product showcase paths are already connected, and **a neutral placeholder displays until the named image is added**. No React changes are necessary when supplying these screenshots.

Suggested future assets (PNG or optimized WebP) in `public/images/`:

- `product-overview.webp`
- `scheduling-attendance.webp`
- `payroll-management.webp`
- `mobile-kiosk.webp`

Drop the three named showcase screenshots in `public/images/` and refresh the site: the product tabs will display them automatically. `product-overview.webp` is optional; the hero deliberately keeps the existing workflow illustration until you enable `productImages.overview` in `src/siteData.js`. Prefer landscape screenshots for scheduling and payroll and a portrait screenshot for mobile kiosk. Do not commit real employee information, salary records, private payroll figures or personal contact details in screenshots. Use sanitized or demonstration records.

The `contact` object intentionally contains blank fields. Inquiry actions are hidden until a real email or inquiry URL is configured. There is no fake contact form.

## Brand assets

The official uploaded symbol and horizontal logo are optimized as WebP in `public/branding/`. Keep their proportions unchanged. The logo is displayed on a white background to match the original artwork.

## Product limits

Horizon HRIS is not advertised as self-service SaaS. CSV attendance import is supported; real-time biometric device integration requires separate setup and configuration and is not included in the standard package. Only publish product claims that match the actual HRIS implementation.

## UI revision V2 — quicker to scan

The homepage prioritizes a short hero statement and a **conceptual workflow illustration**, then four compact capability cards. The product showcase uses keyboard-accessible tabs so visitors can switch between Scheduling, Payroll, and the Mobile Kiosk instead of scrolling through long repeated sections. The illustration represents the workflow only; it is **not** an actual Horizon HRIS screenshot.

Screenshot paths and text live in `src/siteData.js`. Showcase image paths are preconfigured: add sanitized files under `public/images/` without changing component code. With no overview screenshot configured, the hero retains its conceptual workflow illustration. Contact details remain blank until supplied, and contact links are not displayed without a valid destination.

Biometric devices require separately configured real-time integration; CSV attendance import is supported.

## Demo request form (Who / What / When / How)

The responsive **Request a Demo** form asks who is requesting it, what they would like to see, their preferred date/time in Philippine time, and whether they prefer online or onsite. The request is **not** an automatic calendar booking; Horizon HRIS confirms availability separately.

Automatic email delivery uses a **separate PHP SMTP endpoint**, not the payroll/HRIS backend. The UI is ready, but submitting is **disabled until** the secure PHP endpoint is deployed and `VITE_DEMO_API_URL` is configured. Until then, visitors can request a demo using the existing business email fallback. Follow [server/README.md](server/README.md) for SMTP and PHP deployment steps.

Onsite availability is limited to **200 km straight-line distance** from an official service center. Since that location has not been supplied, onsite choice remains disabled. The server requires configured service-center coordinates and a Google Geocoding API key to validate submitted onsite addresses. Only then enable `VITE_ONSITE_BOOKING_ENABLED=true` at build time. No credentials or API keys should be committed to GitHub.
