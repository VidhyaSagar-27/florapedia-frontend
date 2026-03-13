/* =========================================
   FLORAPEDIA APP CONTROLLER
========================================= */

import { state, loadState, saveState, buildProductMap } from "./state.js";

import { renderHome } from "./pages/home.js";
import { renderPDP } from "./pages/product.js";
import { renderCart } from "./pages/cart.js";
import { renderWishlist } from "./pages/wishlist.js";
import { renderCheckout } from "./pages/checkout.js";
import { renderAccount } from "./pages/account.js";

import { productService } from "./services/productService.js";
import { eventBus } from "./utilis/eventBus.js";


/* =========================================
   MAIN APP
========================================= */

export const app = {

  /* =========================================
     INITIALIZE APPLICATION
  ========================================= */

  async init(){

  loadState();

  await this.loadProducts();

  this.bindGlobalEvents();

  /* listen for cart updates */
  eventBus.on("cart:updated", () => {
    this.updateHeader();
  });

  this.navigate("home");

  this.updateHeader();

},


  /* =========================================
     LOAD PRODUCTS
  ========================================= */

  async loadProducts(){

  try{

    const products = await productService.loadProducts();

    state.products = products || [];

    // build fast product lookup map
    buildProductMap();

  }
    catch(err){

      console.error("Product load failed",err);

      this.toast("Failed to load products");

      state.products = [];

    }

  },


  /* =========================================
     PAGE NAVIGATION
  ========================================= */

  navigate(page, id=null){

    document
      .querySelectorAll(".page")
      .forEach(p => p.classList.remove("active-page"));

    const pageEl =
      document.getElementById("page-"+page);

    if(pageEl){
      pageEl.classList.add("active-page");
    }

    window.scrollTo(0,0);


    switch(page){

      case "home":
        renderHome();
      break;

      case "pdp":
        renderPDP(id);
      break;

      case "cart":
        renderCart();
      break;

      case "wishlist":
        renderWishlist();
      break;

      case "checkout":
        renderCheckout();
      break;

      case "account":
        renderAccount();
      break;

    }

  },


  /* =========================================
     UPDATE HEADER UI
  ========================================= */

  updateHeader(){

    const cartCount =
      state.cart.reduce(
        (sum,i)=> sum + i.qty,
        0
      );

    const wishCount =
      state.wishlist.length;

    const cartEl =
      document.getElementById("globalCartCount");

    const wishEl =
      document.getElementById("globalWishlistCount");

    if(cartEl){
      cartEl.textContent = cartCount;
    }

    if(wishEl){
      wishEl.textContent = wishCount;
    }

    const userName =
      state.user?.name ||
      state.user?.email ||
      "Login";

    const userEl =
      document.getElementById("headerUserName");

    if(userEl){

      userEl.textContent =
        userName.includes("@")
        ? userName.split("@")[0]
        : userName;

    }

    saveState();

  },


  /* =========================================
     GLOBAL EVENTS
  ========================================= */

  bindGlobalEvents(){

    window.app = this;

    document
      .querySelectorAll("[data-nav]")
      .forEach(btn=>{

        btn.addEventListener("click",()=>{

          const page =
            btn.dataset.nav;

          this.navigate(page);

        });

      });

  },


  /* =========================================
     SEARCH
  ========================================= */

  search(query){

    query =
      (query || "").toLowerCase();

    state.filters.search = query;

    renderHome();

  },


  /* =========================================
     TOAST
  ========================================= */

  toast(msg){

    const el =
      document.getElementById("toast");

    if(!el) return;

    el.textContent = msg;

    el.classList.add("show");

    clearTimeout(el._timer);

    el._timer = setTimeout(()=>{

      el.classList.remove("show");

    },2000);

  }

};