# Plan: Client Ordering Flow

## Approach
Implement the full client ordering flow on the storefront using only existing services (`orderService.create`, `customerService.me`, `orderService.list`). Cart state is client-side via a Zustand store persisted to localStorage. No backend changes.

## Components & order (dependency-first)
1. **Cart store** (`store/cartStore.ts`) — Zustand + persist. Foundation for everything.
2. **AddToCartButton** (`components/AddToCartButton.tsx`) — reused by ProductCard + ProductDetail.
3. **Header cart count + drawer** — wire `useCartStore` into `StorefrontLayout` (badge count + slide-over `CartDrawer`).
4. **CartPage** (`pages/CartPage.tsx`) — line items, qty edit, totals, empty state, "Checkout" CTA.
5. **CheckoutPage** (`pages/CheckoutPage.tsx`) — fulfillment (pickup/delivery), Zod-validated address/phone for delivery, place order via `orderService.create` (status `pending`, customer_id from profile, default warehouse 1), clear cart, navigate to confirmation.
6. **OrderConfirmationPage** (`pages/OrderConfirmationPage.tsx`) — success screen with reference.
7. **OrdersPage** (`pages/OrdersPage.tsx`) + `useMyOrders` hook — list customer's own orders (filter by customer_id), status badges, link to detail.
8. **Routes + nav** — add `/shop/cart`, `/shop/checkout`, `/shop/order/:id`, `/shop/orders`; link "My orders" from account area.

## Risks / mitigations
- `GET /orders` returns all orders → filter client-side by `customer_id` from `customerService.me`.
- `warehouse_id` required → use default `1` (assumption #5).
- Payment simulated → no gateway call (assumption #3).

## Verification checkpoints
- After store: `tsc -b` clean.
- After each page: `npm run build` clean.
- Final: full `tsc -b` + `npm run build` pass.