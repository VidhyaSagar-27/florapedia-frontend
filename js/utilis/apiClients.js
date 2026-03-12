/* ======================================================
   FLORAPEDIA API ENGINE
   Advanced backend communication layer
====================================================== */

import { ENV, API } from "../config.js";
import { state, persistState } from "../state.js";

/* ======================================================
   CONFIG
====================================================== */

const API_TIMEOUT = 15000;
const RETRY_COUNT = 2;


/* ======================================================
   REQUEST ENGINE
====================================================== */

async function request(url, options = {}, retry = RETRY_COUNT) {

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), API_TIMEOUT);

  try {

    const response = await fetch(url, {

      method: options.method || "GET",

      headers: {

        "Content-Type": "application/json",

        ...(state.token && {
          Authorization: "Bearer " + state.token
        }),

        ...(options.headers || {})

      },

      body: options.body || null,

      signal: controller.signal

    });

    clearTimeout(timeout);

    let data;

    try {
      data = await response.json();
    } catch {
      data = null;
    }

    if (!response.ok) {

      if (response.status === 401) {

        handleUnauthorized();

      }

      const message =
        data?.message ||
        `Request failed (${response.status})`;

      throw new Error(message);

    }

    return data;

  } catch (err) {

    clearTimeout(timeout);

    if (retry > 0) {

      console.warn("Retrying API:", url);

      return request(url, options, retry - 1);

    }

    console.error("API ERROR:", err.message);

    throw err;

  }

}



/* ======================================================
   UNAUTHORIZED HANDLER
====================================================== */

function handleUnauthorized() {

  console.warn("Session expired");

  state.token = null;
  state.user = null;
  state.role = "guest";

  persistState();

  window.location.reload();

}



/* ======================================================
   FILE UPLOAD REQUEST
====================================================== */

async function upload(url, formData) {

  const response = await fetch(url, {

    method: "POST",

    headers: {
      ...(state.token && {
        Authorization: "Bearer " + state.token
      })
    },

    body: formData

  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Upload failed");
  }

  return data;

}



/* ======================================================
   AUTH API
====================================================== */

export const authAPI = {

  async login(credentials) {

    const data = await request(API.LOGIN, {
      method: "POST",
      body: JSON.stringify(credentials)
    });

    state.user = data.user;
    state.token = data.token;
    state.role = data.role;

    persistState();

    return data;

  },


  async register(data) {

    return request(API.REGISTER, {
      method: "POST",
      body: JSON.stringify(data)
    });

  },


  async getProfile() {

    return request(API.PROFILE);

  },


  async logout() {

    await request(API.LOGOUT, { method: "POST" });

    state.user = null;
    state.token = null;
    state.role = "guest";

    persistState();

  }

};



/* ======================================================
   PRODUCT API
====================================================== */

export const productAPI = {

  getAll() {
    return request(API.PRODUCTS);
  },

  getById(id) {
    return request(API.PRODUCT_BY_ID(id));
  },

  getCategories() {
    return request(API.CATEGORIES);
  },

  search(query) {
    return request(API.SEARCH + "?q=" + encodeURIComponent(query));
  }

};



/* ======================================================
   SELLER API
====================================================== */

export const sellerAPI = {

  getDashboard() {
    return request(API.SELLER_DASHBOARD);
  },

  getProducts() {
    return request(API.SELLER_PRODUCTS);
  },

  addProduct(product) {

    return request(API.ADD_PRODUCT, {
      method: "POST",
      body: JSON.stringify(product)
    });

  },

  updateProduct(id, product) {

    return request(API.UPDATE_PRODUCT(id), {
      method: "PUT",
      body: JSON.stringify(product)
    });

  },

  deleteProduct(id) {

    return request(API.DELETE_PRODUCT(id), {
      method: "DELETE"
    });

  }

};



/* ======================================================
   CART API
====================================================== */

export const cartAPI = {

  getCart() {

    return request(API.CART);

  },

  updateCart(cart) {

    return request(API.CART, {
      method: "POST",
      body: JSON.stringify(cart)
    });

  },

  clearCart() {

    return request(API.CART_CLEAR, {
      method: "POST"
    });

  }

};



/* ======================================================
   ORDER API
====================================================== */

export const orderAPI = {

  create(orderData) {

    return request(API.ORDERS, {
      method: "POST",
      body: JSON.stringify(orderData)
    });

  },

  getOrders() {

    return request(API.ORDERS);

  },

  getOrder(id) {

    return request(API.ORDER_BY_ID(id));

  },

  cancelOrder(id) {

    return request(API.CANCEL_ORDER(id), {
      method: "POST"
    });

  }

};



/* ======================================================
   DELIVERY API
====================================================== */

export const deliveryAPI = {

  getAssignedOrders() {

    return request(API.DELIVERY_ASSIGNED);

  },

  updateStatus(data) {

    return request(API.DELIVERY_UPDATE, {
      method: "POST",
      body: JSON.stringify(data)
    });

  },

  track(orderId) {

    return request(API.DELIVERY_TRACK(orderId));

  }

};



/* ======================================================
   PAYMENT API (RAZORPAY)
====================================================== */

export const paymentAPI = {

  createOrder(data) {

    return request(API.CREATE_ORDER, {
      method: "POST",
      body: JSON.stringify(data)
    });

  },

  verifyPayment(data) {

    return request(API.VERIFY_PAYMENT, {
      method: "POST",
      body: JSON.stringify(data)
    });

  }

};



/* ======================================================
   IMAGE UPLOAD API
====================================================== */

export const uploadAPI = {

  uploadProductImage(file) {

    const formData = new FormData();

    formData.append("image", file);

    return upload(API.UPLOAD_IMAGE, formData);

  }

};