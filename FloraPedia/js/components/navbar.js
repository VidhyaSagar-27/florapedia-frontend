/* ======================================================
   NAVBAR CONTROLLER
====================================================== */

import { state } from "../state/state.js";
import { logout, isSeller } from "../controllers/authController.js";
import { handleSearch } from "../controllers/productController.js";


/* ======================================================
   INIT NAVBAR
====================================================== */

export function initNavbar(){

  bindNavbarEvents();

  updateNavbar();

}



/* ======================================================
   UPDATE NAVBAR UI
====================================================== */

export function updateNavbar(){

  updateUserName();
  updateCartCount();
  updateWishlistCount();
  updateSellerButton();

}



/* ======================================================
   USER NAME
====================================================== */

function updateUserName(){

  const el =
    document.getElementById("headerUserName");

  if(!el) return;

  if(!state.user){

    el.textContent = "Login";

    return;

  }

  const name =
    state.user.name ||
    state.user.email?.split("@")[0] ||
    "User";

  el.textContent = name;

}



/* ======================================================
   CART COUNT
====================================================== */

function updateCartCount(){

  const el =
    document.getElementById("globalCartCount");

  if(!el) return;

  const count =
    state.cart.reduce(
      (sum,item)=>sum+item.qty,
      0
    );

  el.textContent = count;

}



/* ======================================================
   WISHLIST COUNT
====================================================== */

function updateWishlistCount(){

  const el =
    document.getElementById("globalWishlistCount");

  if(!el) return;

  el.textContent = state.wishlist.length;

}



/* ======================================================
   SELLER BUTTON
====================================================== */

function updateSellerButton(){

  const btn =
    document.getElementById("sellerDashboardBtn");

  if(!btn) return;

  if(isSeller()){

    btn.style.display = "block";

  }else{

    btn.style.display = "none";

  }

}



/* ======================================================
   NAVBAR EVENTS
====================================================== */

function bindNavbarEvents(){

  bindLogout();
  bindSearch();
  bindMobileMenu();

}



/* ======================================================
   LOGOUT BUTTON
====================================================== */

function bindLogout(){

  const btn =
    document.getElementById("logoutBtn");

  if(!btn) return;

  btn.addEventListener("click", async ()=>{

    await logout();

    updateNavbar();

  });

}



/* ======================================================
   SEARCH
====================================================== */

function bindSearch(){

  const input =
    document.getElementById("searchInput");

  if(!input) return;

  input.addEventListener("input", e => {

    const query = e.target.value;

    handleSearch(query);

  });

}



/* ======================================================
   MOBILE MENU
====================================================== */

function bindMobileMenu(){

  const toggle =
    document.getElementById("mobileMenuToggle");

  const menu =
    document.getElementById("mobileMenu");

  if(!toggle || !menu) return;

  toggle.addEventListener("click", ()=>{

    menu.classList.toggle("open");

  });

}



/* ======================================================
   NAVIGATION HELPER
====================================================== */

export function navigate(page){

  window.location.hash = "#" + page;

}