const ENDPOINTS = {
  BASE_URL: process.env.NEXT_PUBLIC_EXTERNAL_API_URL || "https://api.mandccakes.com/api",
  LOCAL_API: "/api",
  EXTERNAL_API: process.env.NEXT_PUBLIC_EXTERNAL_API_URL || "https://api.mandccakes.com/api",
  
  // Local API endpoints
  LOCAL: {
    PRODUCTS: "/api/products",
    CATEGORIES: "/api/categories",
    ORDERS: "/api/orders",
    USERS: "/api/users",
  },
  
  // External API endpoints (M&C Cakes API)
  EXTERNAL: {
    AUTH: {
      LOGIN: "/accounts/login/",
      REGISTER: "/accounts/register/",
      REFRESH: "/accounts/token/refresh/",
    },
    PRODUCTS: {
      LIST: "/products/products/",
      DETAIL: "/products/products/",
      SEARCH: "/products/products/search/",
      FEATURED: "/products/products/featured/",
      LOW_STOCK: "/products/products/low_stock/",
    },
    CATEGORIES: {
      LIST: "/products/categories/",
      DETAIL: "/products/categories/",
    },
    CART: {
      ADD: "/cart/cart/add/",
      REMOVE: "/cart/cart/remove/",
      LIST: "/cart/cart/",
      CLEAR: "/cart/cart/clear/",
    },
    ORDERS: {
      CREATE: "/orders/create/",
      DETAIL: "/orders/",
    },
    PAYMENTS: {
      INITIALIZE: "/payments/initialize/",
      VERIFY: "/payments/verify/",
    },
    HEALTH: "/health/",
  },
  
  // Hybrid endpoints (unified)
  HYBRID: {
    PRODUCTS: "/api/hybrid/products",
    CATEGORIES: "/api/hybrid/categories",
    HEALTH: "/api/external/health",
  },
};

export default ENDPOINTS;
