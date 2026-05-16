# Lite Annotate Test Script

## Goal

Use Cedar & Sail as the customer ecommerce app for the Lite Annotate hackathon demo.

## Reproduction

### Scenario 1: Account Crash

1. Open the deployed Cedar & Sail site.
2. If the widget is not visible, add the Lite Annotate API URL:

   ```text
   ?annotateApi=https://<lite-annotate-api>
   ```

3. Navigate to Account.
4. Click **Load loyalty profile**.
5. Confirm the account panel shows a broken loyalty state.
6. Open the Lite Annotate widget.
7. Submit:

   ```text
   Title: Loyalty profile crashes
   Description: Loading my loyalty profile on the account page crashes after the missing customer request.
   ```

### Scenario 2: Broken Product Images

1. Navigate to Shop.
2. Confirm the first two catalog cards show broken image states.
3. Submit:

   ```text
   Title: Product images are broken
   Description: The catalog images for the weekender and throw do not load on the shop page.
   ```

### Scenario 3: Broken Checkout Redirect

1. Navigate to Checkout.
2. Click **Place demo order**.
3. Confirm the app redirects to `/checkout/confirmation` but shows the wrong page.
4. Submit:

   ```text
   Title: Checkout confirmation redirect is broken
   Description: After placing a demo order I expected a confirmation page, but the app navigated away and showed the wrong screen.
   ```

## Expected Report Evidence

- `repo`: `ibrolord/lite-annotate-commerce-demo`
- `route`: `/account`
- Console includes `Cannot read properties of undefined`
- Network includes `GET /api/customers/vip-404` with `404`
- Session includes a click on `Load loyalty profile`
- Screenshot shows the account page broken state

For the image bug:

- `route`: `/shop`
- Console includes `product image failed to load`
- Screenshot shows broken image labels on product cards

For the checkout redirect bug:

- `route`: `/checkout/confirmation`
- Console includes `checkout redirect target is not registered`
- Session includes a click on `Place demo order`
- Screenshot shows the wrong post-submit screen

## Expected Engineering Diagnosis

```json
{
  "type": "bug",
  "severity": "medium",
  "rootCause": "formatLoyaltyGreeting dereferences customer.name when getCustomerById returns undefined.",
  "targetFiles": ["src/customer.js"],
  "fixStrategy": "Return a guest or recovery greeting when the customer record is missing before reading name."
}
```
