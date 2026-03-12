/* ======================================================
   WISHLIST PAGE CONTROLLER
====================================================== */

import { state } from "../state.js";
import { addProductToCart } from "./product.js";
import { renderHome } from "./product.js";


/* ======================================================
   TOGGLE WISHLIST
====================================================== */

export function toggleWishlist(productId){

  if(!state.wishlist)
    state.wishlist = [];

  const idx =
    state.wishlist.indexOf(productId);

  if(idx >= 0){

    state.wishlist.splice(idx,1);

    showToast("Removed from wishlist");

  }else{

    state.wishlist.push(productId);

    showToast("Added to wishlist");

  }

  localStorage.setItem(
    "wishlist",
    JSON.stringify(state.wishlist)
  );

}



/* ======================================================
   RENDER WISHLIST
====================================================== */

export function renderWishlist(){

  const grid =
    document.getElementById("wishlistGrid");

  const empty =
    document.getElementById("wishlistEmpty");

  if(!grid || !empty) return;

  if(!state.wishlist || state.wishlist.length === 0){

    grid.innerHTML = "";
    empty.style.display = "block";

    return;
  }

  const products =
    state.products.filter(p =>
      state.wishlist.includes(p._id || p.id)
    );

  if(products.length === 0){

    empty.style.display = "block";
    grid.innerHTML = "";

    return;
  }

  empty.style.display = "none";

  grid.innerHTML =
    products.map(p =>
      createWishlistCard(p)
    ).join("");

}



/* ======================================================
   WISHLIST CARD
====================================================== */

function createWishlistCard(p){

  const id = p._id || p.id;

  const discount =
    p.oldPrice
      ? Math.round((1 - p.price / p.oldPrice) * 100)
      : 0;

  return `

  <div class="product-card"
       onclick="openWishlistProduct('${id}')">

    <span class="prod-badge">${discount}% OFF</span>

    <span class="wishlist-heart active"
      onclick="event.stopPropagation();
               removeFromWishlist('${id}')">

      ❤

    </span>

    <div class="prod-img-wrap">
      <img src="${p.image}"
           alt="${p.name}">
    </div>

    <div class="prod-body">

      <div class="prod-name">
        ${p.name}
      </div>

      <div class="price-row">
        <span class="current">
          ₹${p.price}
        </span>
      </div>

      <div class="prod-cta-row">

        <button
          class="btn-chip btn-chip-primary"
          onclick="event.stopPropagation();
                   addWishlistToCart('${id}')">

          Add to Cart

        </button>

      </div>

    </div>

  </div>

  `;

}



/* ======================================================
   ACTION HELPERS
====================================================== */

window.removeFromWishlist = function(productId){

  toggleWishlist(productId);

  renderWishlist();

};



window.addWishlistToCart = function(productId){

  addProductToCart(productId);

};



window.openWishlistProduct = function(productId){

  window.location.hash =
    "#product-" + productId;

};



/* ======================================================
   TOAST
====================================================== */

function showToast(msg){

  const el =
    document.getElementById("toast");

  if(!el) return;

  el.textContent = msg;

  el.classList.add("show");

  setTimeout(()=>{
    el.classList.remove("show");
  },2000);

}