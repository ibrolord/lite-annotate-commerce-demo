# Lite Annotate Commerce Demo

Public ecommerce test site for the Lite Annotate hackathon.

The business is **Cedar & Sail**, a small direct-to-consumer shop for travel-ready home and carry goods. The site exists to give Lite Annotate a realistic customer app to run against: product browsing, cart state, checkout fields, account UI, network calls, console output, route changes, and a deterministic planted bug.

## Planted Bugs

### Account Crash

The account crash is in `src/customer.js`.

1. Open the site.
2. Go to **Account**.
3. Click **Load loyalty profile**.
4. The app fetches `/api/customers/vip-404`, gets a missing-customer response, then calls `formatLoyaltyGreeting("vip-404")`.
5. `formatLoyaltyGreeting` dereferences `customer.name` without checking whether the customer exists.

Expected Lite Annotate evidence:

- Route: `/account`
- Console error: `Cannot read properties of undefined`
- Network breadcrumb: `GET /api/customers/vip-404` returns `404`
- Session breadcrumb: click on `Load loyalty profile`
- Source target: `src/customer.js`

### Broken Product Images

The first two catalog cards intentionally reference missing image assets:

- `/assets/products/canvas-weekender-missing.jpg`
- `/assets/products/harbor-throw-missing.jpg`

Expected Lite Annotate evidence:

- Route: `/shop`
- Console error: `product image failed to load`
- Screenshot: catalog cards show `Image failed to load`
- Source target: `src/catalog.js` or `src/app.js`

### Broken Checkout Redirect

The checkout submit flow in `src/app.js` intentionally redirects to `/checkout/confirmation`, but that route is not registered by the router.

Expected Lite Annotate evidence:

- Route before submit: `/checkout`
- Route after submit: `/checkout/confirmation`
- Console warning: `checkout redirect target is not registered`
- Screenshot: customer lands back on the home view instead of an order confirmation
- Source target: `src/app.js`

## Lite Annotate Runtime Config

The site reads Lite Annotate config in this order:

1. URL query params: `?annotateApi=https://...&widgetUrl=https://.../widget.js`
2. `localStorage` keys: `liteAnnotateApiUrl`, `liteAnnotateWidgetUrl`
3. Local development fallback: `http://localhost:3001/widget.js`

For local end-to-end testing:

```bash
cd /Users/ibrobaba/lite-annotate
npm run dev
```

In another terminal:

```bash
cd /Users/ibrobaba/lite-annotate-commerce-demo
npm run dev
```

Then open:

```text
http://localhost:4174/?annotateApi=http://localhost:3001
```

For hosted testing, open the deployed site with:

```text
https://<commerce-site>/?annotateApi=https://<lite-annotate-api>
```

The site sends this repo identifier in Lite Annotate payloads:

```text
ibrolord/lite-annotate-commerce-demo
```
