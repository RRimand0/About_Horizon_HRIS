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

Update `src/siteData.js` to edit feature descriptions, screenshot paths, and business contact information. Screenshot values are **empty by default**. The website will display intentional placeholders until images are supplied.

Suggested future assets (PNG or optimized WebP) in `public/images/`:

- `product-overview.webp`
- `scheduling-attendance.webp`
- `payroll-management.webp`
- `mobile-kiosk.webp`

Then set the paths in `productImages`. Do not commit real employee information, salary records, private payroll figures or personal contact details in screenshots. Use sanitized or demonstration records.

The `contact` object intentionally contains blank fields. Inquiry actions are hidden until a real email or inquiry URL is configured. There is no fake contact form.

## Brand assets

The official uploaded symbol and horizontal logo are optimized as WebP in `public/branding/`. Keep their proportions unchanged. The logo is displayed on a white background to match the original artwork.

## Product limits

Horizon HRIS is not advertised as self-service SaaS. CSV attendance import is supported; real-time biometric device integration requires separate setup and configuration and is not included in the standard package. Only publish product claims that match the actual HRIS implementation.
