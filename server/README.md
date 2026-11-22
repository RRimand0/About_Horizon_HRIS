# Demo request email API (PHP)

This is **not** an HRIS payroll API and has **no database**. It receives demo-request data, checks it, applies a basic IP rate limit, verifies onsite meeting distance when enabled, and emails the Horizon HRIS business inbox. A submission is **not** a confirmed calendar booking.

## Deployment requirements

- PHP 8.1+ with `curl` and HTTPS support; Composer installed on the **server**.
- A PHP-capable web host. A purely static host cannot run the PHP endpoint.
- A working outbound SMTP account with secure authentication (e.g. Gmail with an eligible Google App Password or an SMTP provider).
- A secured writable `RATE_LIMIT_DIR` outside the public web root. No visitor data should be stored in the rate-limit files; only numeric timestamps keyed by a hashed remote IP.
- Set server environment variables (see `.env.example`) securely on the host; **do not commit actual passwords or API keys**. `.env.example` is a reference, not an automatically loaded config file.

Run inside the `server` directory:

```bash
composer install --no-dev --optimize-autoloader
php tests/demo_test.php
```

Expose **only** `server/public/demo-request.php` as `https://your-host/api/demo-request.php` using your PHP web server configuration; keep `server/src`, `vendor`, and config outside the web-accessible document root. For Apache, map `/api/` to `server/public/` with your normal configured PHP handler. Use HTTPS and make sure PHP actually executes, rather than serving PHP source.

## Environment variables

| Variable | Purpose |
|---|---|
| `SITE_ORIGIN` | Exact public frontend origin, including scheme; CORS accepts only this origin |
| `SMTP_HOST` | SMTP server, e.g. `smtp.gmail.com` |
| `SMTP_PORT` | `587` STARTTLS or `465` SMTPS |
| `SMTP_USERNAME` | SMTP account login |
| `SMTP_PASSWORD` | Server-only SMTP password / app password |
| `SMTP_FROM` | Verified sender email for SMTP account |
| `DEMO_RECIPIENT_EMAIL` | `horizonhris.centraljuan@gmail.com` |
| `RATE_LIMIT_DIR` | Outside-web-root directory writable by PHP |
| `ONSITE_ENABLED` | `true` only after service location and geocoding are configured |
| `ONSITE_BASE_LAT`, `ONSITE_BASE_LNG` | Official service-area center latitude and longitude, not invented |
| `GOOGLE_GEOCODING_API_KEY` | Server-only Google Maps Geocoding API key, used for onsite address lookups |

Configure the React build with public settings in the root `.env.local` or hosting build variables:

```bash
VITE_DEMO_API_URL=/api/demo-request.php
VITE_ONSITE_BOOKING_ENABLED=false
```

`VITE_DEMO_API_URL` can also be a complete HTTPS API URL if the PHP service is hosted on a different origin. `SITE_ORIGIN` must match the actual frontend origin. **Never put SMTP or geocoding secrets in a `VITE_*` variable.** Build and deploy the React site again after changing the Vite variables.

## Booking behavior

- Fields: visitor name, company, email, optional phone, feature interests, optional notes, preferred date/time in **Asia/Manila**, meeting mode, required consent, onsite full address when applicable.
- Dates must be at least 24 hours and no more than 90 days ahead. No calendar availability is checked; staff must confirm requests manually.
- Horizon HRIS team is based in **Cagayan de Oro City**. The proposed radius center is the **city-center point** (latitude `8.477`, longitude `124.642`), sourced from the [UN geographical names dashboard](https://ungegn.un.org/dashboard/cities/details?id=3218) using NAMRIA coordinates. This does **not** imply the team works at City Hall or a published office address. If an exact operating base is later selected, replace these values before enabling the onsite policy.
- Onsite can be selected in the React form for **preview**, but its submit button is disabled until `VITE_ONSITE_BOOKING_ENABLED=true` and matching backend settings are configured, the server-only geocoding key is active, and the 200 km rule has been tested. Online booking is unaffected.
- Server geocodes the **submitted full address** through Google and computes Haversine straight-line distance from the configured official service center. Requests **over 200 km** are rejected. No visitor-provided distances or coordinates are trusted. Geocoding does not guarantee the requested address is correct; confirm onsite details manually before traveling.
- Email goes only to the business inbox. Visitor email is used as Reply-To; the visitor is **not** automatically sent an email, to avoid unauthenticated mail abuse.
- The API needs no email database. Submissions are retained in the receiving mailbox according to its retention policy.
- Basic abuse controls include validation, a honeypot, limited payload size, CORS origin restriction, and file-based IP rate limiting. **Before publicly advertising a heavily trafficked form, consider deploying CAPTCHA/Turnstile and monitoring the mailbox.** CORS by itself is not an anti-bot control.
- Error results never claim success if SMTP is not configured or fails. A failed or timed-out request might still have been delivered; check the inbox before retrying.

## Testing

```bash
php tests/demo_test.php
find src public tests -name '*.php' -exec php -l {} \;
```

The tests validate inputs and the distance formula without contacting Gmail or Google. **A real SMTP delivery test and a geocoding test are still required in your hosting environment after secrets and service coordinates are configured.** Do not test delivery using actual employee or payroll data.

## Manual onsite address (no map)

The form displays a required **Full meeting address** text field when **Onsite demo** is selected. Visitors type the building/street, city, province, and country. The website does not use a map picker or browser Google Maps API key.

The PHP backend continues to use a **private server-side** `GOOGLE_GEOCODING_API_KEY` to resolve the submitted address and verify the 200 km straight-line limit from the configured Cagayan de Oro service reference. Do not trust user-input distances or coordinates. Staff must confirm that the address is accurate and travel is practical. Onsite submission remains disabled until backend verification and SMTP delivery are deployed and tested.
