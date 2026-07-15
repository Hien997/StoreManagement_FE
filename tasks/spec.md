# Spec: Store Management System — Client Ordering Flow

## Objective
Build the end-to-end customer ordering experience on the **Client Website (storefront)** so a shopper can:
1. Browse products and add them to a shopping cart (persisted locally).
2. Review the cart, choose a fulfillment method (**pickup** or **delivery**), and provide delivery address / contact when needed.
3. Place an order via the existing `POST /orders` API (creating a `SalesOrder` linked to the logged-in customer).
4. See an order confirmation and track order status from their account.

This simulates a real retail/supermarket shopping flow. Success = a logged-in customer can go from product → cart → checkout → placed order → see it in "My orders", with no backend changes required beyond what already exists.

## Tech Stack
- React 18 + TypeScript + Vite (existing)
- React Router (existing storefront routes under `/shop`)
- TanStack Query + React Hook Form + Zod (existing patterns)
- shadcn/ui components (Button, Card, Input, Label, etc.)
- Zustand for cart state (matches existing `useAuthStore`/`useUIStore` pattern)
- Design system: the `.storefront` theme already applied (green primary, Rubik/Nunito Sans)

## Commands
- Build: `npm run build`
- Typecheck: `npx tsc -b`
- Dev: `npm run dev` (note: currently blocked by an unrelated npm optional-dep bug on this arm64 host; `npm run build` works)

## Project Structure
```
src/storefront/
  store/cartStore.ts          → Zustand cart store (add/remove/qty/clear, persist to localStorage)
  components/
    CartDrawer.tsx            → slide-over cart summary (or CartPage)
    AddToCartButton.tsx       → reused on ProductCard / ProductDetail
  pages/
    CartPage.tsx              → cart review + fulfillment choice
    CheckoutPage.tsx          → address/contact + place order
    OrderConfirmationPage.tsx → success screen with order reference
    OrdersPage.tsx            → "My orders" list (customer's own orders)
  hooks.ts                    → add useMyOrders (query orders for current customer)
tasks/spec.md, tasks/plan.md, tasks/todo.md
```

## Code Style
- Reuse existing patterns: `useToast()` for feedback, `customerService.me` for the current customer id, `orderService.create` for placement.
- Zustand store example:
```ts
export const useCartStore = create<CartState>()(
  persist((set) => ({
    items: [],
    add: (p) => set((s) => /* merge by product id, increment qty */),
    remove: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
    setQty: (id, q) => set((s) => /* clamp >=1 */),
    clear: () => set({ items: [] }),
  }), { name: 'store-cart' }),
)
```
- Naming: `camelCase` for functions/state, `PascalCase` for components, API DTOs kept as-is (snake_case) only at the service boundary.

## Testing Strategy
- No automated test framework is set up in this repo. Verification is via `tsc -b` + `npm run build` (type/build safety) and manual review of the flow.
- If a test runner is added later: unit-test the cart store reducers (add/merge/qty/clear) and the order total computation.

## Boundaries
- **Always:** keep storefront and admin separate; reuse existing services; typecheck + build before done; persist cart in localStorage; show toasts on success/error.
- **Ask first:** any new backend endpoint (e.g. a real payment gateway), schema changes, or new dependencies.
- **Never:** edit vendor/lockfiles unnecessarily; commit secrets; invent a payment provider that doesn't exist.

## Success Criteria (testable)
1. A logged-in customer can add a product to the cart from ProductCard and ProductDetail; cart count updates in the header.
2. Cart persists across page reloads (localStorage).
3. `CartPage` shows line items, quantities (editable), per-line and order totals; empty cart shows an empty state with a "Shop now" CTA.
4. Checkout lets the user pick **pickup** or **delivery**; delivery requires a valid address + phone (Zod-validated); pickup hides address fields.
5. Placing the order calls `orderService.create` with `customer_id` from `customerService.me`, a `warehouse_id` (default/selectable), `items` mapped from the cart, and `status: 'pending'`; on success the cart clears and the user lands on `OrderConfirmationPage` showing the order reference.
6. "My orders" (`OrdersPage`) lists the customer's orders with status badges and links to detail; reachable from the account area.
7. `tsc -b` and `npm run build` pass with no new errors.

## Open Questions / Assumptions (please correct if wrong)
**ASSUMPTIONS I'M MAKING:**
1. Web app (React), modern browsers only — no native mobile.
2. Cart is **client-side only** (localStorage), not a backend cart resource.
3. "Payment" in this spec is **simulated** — there is no payment endpoint in the API, so checkout places the order directly (status `pending`) without a real payment step. A fake "Pay on delivery / Pay at pickup" choice is shown for realism but does not call any gateway.
4. Orders are created against the **logged-in customer**; guest checkout is out of scope (login/register already exist).
5. `warehouse_id` is required by the API; we'll use a single default warehouse id (e.g. `1`) or let the user pick if multiple are available — confirm which.
6. Order tracking = read-only list of the customer's own orders (the existing `GET /orders` returns all orders; we filter client-side by `customer_id` from the profile). If the API supports a `?customer_id=` filter, we'll use it.
7. No new dependencies; Zustand is already a project dependency.

→ Correct me on any of these and I'll revise the spec before planning/implementing.