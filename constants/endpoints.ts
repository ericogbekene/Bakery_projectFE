/**
 * MC Cakes — API Endpoints
 *
 * FIXES APPLIED:
 * 1. /products/products/ → /products/  (was doubled)
 * 2. /cart/cart/         → /cart/      (was doubled)
 * 3. Removed non-existent endpoints: featured, low_stock, related
 * 4. Added missing endpoints: cakes, pastries, counts, customize
 * 5. BASE_URL now reads from env correctly for local dev vs production
 * 6. Added CART.FULFILLMENT_TYPE and DELIVERY.ZONES for pickup/delivery checkout flow
 */
const ENDPOINTS = {
  // ─── Base URLs ────────────────────────────────────────────────────────────
  // Set NEXT_PUBLIC_API_URL=http://localhost:8000/api in .env.local
  // for local dev. In production point it to your deployed Django API.
  BASE_URL: `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api`,
  // ─── External (Django) API endpoints ─────────────────────────────────────
  EXTERNAL: {
    AUTH: {
      LOGIN: "/accounts/login/",
      REGISTER: "/accounts/register/",
      REFRESH: "/accounts/token/refresh/",
    },
    PRODUCTS: {
      LIST: "/products/", // FIX: was /products/products/
      CAKES: "/products/cakes/", // NEW
      PASTRIES: "/products/pastries/", // NEW
      SEARCH: "/products/search/", // FIX: was /products/products/search/
      COUNTS: "/products/counts/", // NEW
      DETAIL: "/products/", // append <slug>/ e.g. /products/chocolate-cake/
      CUSTOMIZE: "/products/", // append <slug>/customize/
      // Categories live under /products/categories/
      CATEGORIES: "/products/categories/", // FIX: was split across two objects
    },
    CART: {
      ROOT: "/cart/", // FIX: was /cart/cart/
      ADD: "/cart/add/", // FIX: was /cart/cart/add/
      COUNT: "/cart/count/", // NEW
      SUMMARY: "/cart/summary/", // NEW
      CALCULATE_PRICE: "/cart/calculate-price/", // NEW
      ITEM: "/cart/items/", // append <id>/ for update/delete
      DELIVERY: "/cart/delivery/", // NEW
      FULFILLMENT_TYPE: "/cart/fulfillment-type/", // NEW — pickup/delivery toggle
      MERGE: "/cart/merge/", // NEW
    },
    DELIVERY: {
      ZONES: "/delivery/zones/", // NEW — active delivery zones for state dropdown
    },
    ORDERS: {
      CREATE: "/orders/create/",
      LIST: "/orders/",
      DETAIL: "/orders/", // append <id>/
      CANCEL: "/orders/", // append <id>/cancel/
      TRACK: "/orders/", // append <id>/track/
    },
    HEALTH: "/health/",
  },
};
export default ENDPOINTS;