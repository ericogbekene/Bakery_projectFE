const ENDPOINTS = {
  BASE_URL: process.env.NEXT_PUBLIC_EXTERNAL_API_URL || "",
  LOCAL_API: "/api",
  EXTERNAL_API: process.env.NEXT_PUBLIC_EXTERNAL_API_URL || "https://api.mandccakes.com",
  
  // Local API endpoints
  LOCAL: {
    PRODUCTS: "/api/products",
    CATEGORIES: "/api/categories",
    ORDERS: "/api/orders",
    USERS: "/api/users",
  },
  
  // External API endpoints
  EXTERNAL: {
    PRODUCTS: "/products",
    CATEGORIES: "/categories",
    ORDERS: "/orders",
    USERS: "/users",
    HEALTH: "/health",
    AUTH: "/auth/login",
  },
  
  // Hybrid endpoints (unified)
  HYBRID: {
    PRODUCTS: "/api/hybrid/products",
    CATEGORIES: "/api/hybrid/categories",
    HEALTH: "/api/external/health",
  },
};

export default ENDPOINTS;
