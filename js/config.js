/* ======================================================
   FLORAPEDIA GLOBAL CONFIGURATION
   Core configuration for entire marketplace platform
====================================================== */


/* ======================================================
   ENVIRONMENT
====================================================== */

export const ENV = {

  mode:
    window.location.hostname === "localhost"
      ? "development"
      : "production",

  apiVersion: "v1",

  apiBaseUrl:
    window.location.hostname === "localhost"
      ? "http://localhost:5000/api"
      : "https://florapedia-backend.onrender.com/api",

  cdnUrl:
    window.location.hostname === "localhost"
      ? "/assets"
      : "https://cdn.florapedia.com"

};



/* ======================================================
   API ENDPOINT BUILDER
====================================================== */

const base = ENV.apiBaseUrl;



export const API = {

  /* =========================
     AUTH
  ========================= */

  LOGIN: `${base}/auth/login`,
  REGISTER: `${base}/auth/register`,
  LOGOUT: `${base}/auth/logout`,
  PROFILE: `${base}/auth/profile`,



  /* =========================
     PRODUCTS
  ========================= */

  PRODUCTS: `${base}/products`,
  PRODUCT_BY_ID: id => `${base}/products/${id}`,

  CATEGORIES: `${base}/products/categories`,
  SEARCH: `${base}/products/search`,

  SELLER_PRODUCTS: `${base}/products/seller`,



  /* =========================
     CART
  ========================= */

  CART: `${base}/cart`,
  CART_CLEAR: `${base}/cart/clear`,



  /* =========================
     ORDERS
  ========================= */

  ORDERS: `${base}/orders`,
  ORDER_BY_ID: id => `${base}/orders/${id}`,
  CANCEL_ORDER: id => `${base}/orders/${id}/cancel`,



  /* =========================
     SELLER
  ========================= */

  SELLER_DASHBOARD: `${base}/seller/dashboard`,

  ADD_PRODUCT: `${base}/products`,
  UPDATE_PRODUCT: id => `${base}/seller/product/${id}`,
  DELETE_PRODUCT: id => `${base}/seller/product/${id}`,



  /* =========================
     DELIVERY
  ========================= */

  DELIVERY_ASSIGNED: `${base}/delivery/assigned`,
  DELIVERY_ASSIGN: `${base}/delivery/assign`,
  DELIVERY_UPDATE: `${base}/delivery/update`,
  DELIVERY_TRACK: id => `${base}/delivery/track/${id}`,



  /* =========================
     PAYMENTS
  ========================= */

  CREATE_ORDER: `${base}/payment/create-order`,
  VERIFY_PAYMENT: `${base}/payment/verify`,



  /* =========================
     UPLOADS
  ========================= */

  UPLOAD_IMAGE: `${base}/upload/image`

};



/* ======================================================
   PAYMENT CONFIG
====================================================== */

export const PAYMENT = {

  provider: "razorpay",

  razorpay: {

    key: "rzp_live_SQ2a0BIeQiJQly",

    currency: "INR",

    companyName: "FloraPedia",

    description: "Marketplace Payment",

    theme: {
      color: "#16a34a"
    },

    retry: true

  }

};



/* ======================================================
   DELIVERY CONFIG
====================================================== */

export const DELIVERY = {

  standardFee: 99,

  expressFee: 299,

  freeDeliveryAbove: 499,

  estimatedTimes: {

    standard: "2-4 Hours",
    express: "45 Minutes"

  }

};



/* ======================================================
   MARKETPLACE ROLES
====================================================== */

export const ROLES = {

  GUEST: "guest",

  CUSTOMER: "customer",

  SELLER: "seller",

  DELIVERY: "delivery",

  ADMIN: "admin"

};



/* ======================================================
   MARKETPLACE CATEGORIES
====================================================== */

export const MARKETPLACE = {

  categories: [

    "flowers",
    "fruits",
    "vegetables",
    "grocery",
    "bakery",
    "plants",
    "gifts"

  ]

};



/* ======================================================
   FEATURE FLAGS
====================================================== */

export const FEATURES = {

  enableWishlist: true,

  enableCoupons: true,

  enableDeliveryTracking: true,

  enableSellerDashboard: true,

  enableLiveSearch: true,

  enableRatings: true,

  enableReviews: true,

  enableRealtimeTracking: false

};



/* ======================================================
   PAGINATION
====================================================== */

export const PAGINATION = {

  productsPerPage: 20,

  reviewsPerPage: 10,

  ordersPerPage: 10

};



/* ======================================================
   APP ROUTES
====================================================== */

export const ROUTES = {

  HOME: "/",

  PRODUCT: "/product",

  CART: "/cart",

  CHECKOUT: "/checkout",

  ACCOUNT: "/account",

  SELLER_DASHBOARD: "/seller",

  DELIVERY_DASHBOARD: "/delivery"

};



/* ======================================================
   CACHE SETTINGS
====================================================== */

export const CACHE = {

  productTTL: 1000 * 60 * 5, // 5 minutes

  categoryTTL: 1000 * 60 * 30

};



/* ======================================================
   APP INFO
====================================================== */

export const APP_INFO = {

  name: "FloraPedia",

  version: "1.0.0",

  description:
    "Multi-category marketplace for flowers, grocery, fruits, bakery and more",

  supportEmail: "support@florapedia.com",

  supportPhone: "1800-FLORAPEDIA",

  website: "https://florapedia.com"

};