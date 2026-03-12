const API_URL = "http://localhost:5000/api";

/*
  Centralized API client for FloraPedia
  Handles errors, headers, tokens and timeouts
*/

const api = {

  async request(endpoint, options = {}) {

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    try {

      const response = await fetch(`${API_URL}${endpoint}`, {
        headers: {
          "Content-Type": "application/json",
          ...(options.token && { "Authorization": `Bearer ${options.token}` })
        },
        ...options,
        signal: controller.signal
      });

      clearTimeout(timeout);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "API Error");
      }

      return data;

    } catch (error) {

      console.error("API Error:", error);

      return {
        success: false,
        message: error.message
      };

    }

  },



  /* ================= PRODUCTS ================= */

  async getProducts() {
    return this.request("/products");
  },

  async getProduct(id) {
    return this.request(`/products/${id}`);
  },

  async addProduct(data, token) {
    return this.request("/products", {
      method: "POST",
      body: JSON.stringify(data),
      token
    });
  },

  async deleteProduct(id, token) {
    return this.request(`/products/${id}`, {
      method: "DELETE",
      token
    });
  },



  /* ================= AUTH ================= */

  async login(data) {
    return this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify(data)
    });
  },

  async signup(data) {
    return this.request("/auth/signup", {
      method: "POST",
      body: JSON.stringify(data)
    });
  },



  /* ================= ORDERS ================= */

  async createOrder(data, token) {
    return this.request("/orders", {
      method: "POST",
      body: JSON.stringify(data),
      token
    });
  },

  async getOrders(token) {
    return this.request("/orders", {
      token
    });
  }

};