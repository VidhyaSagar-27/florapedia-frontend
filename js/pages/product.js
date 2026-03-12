/* ======================================================
   PRODUCT PAGE CONTROLLER
====================================================== */

import { state } from "../state/state.js";
import { addToCart } from "../controllers/cartController.js";
import { loadProducts } from "../controllers/productController.js";


/* ======================================================
   RENDER PRODUCT GRID
====================================================== */

export function renderHome(){

  const grid = document.getElementById("mainProductGrid");
  const empty = document.getElementById("emptyState");
  const count = document.getElementById("productCount");

  if(!grid) return;

  const products = getFilteredProducts();

  if(products.length === 0){

    grid.innerHTML = "";

    if(empty) empty.style.display = "block";
    if(count) count.textContent = "0 items";

    return;
  }

  if(empty) empty.style.display = "none";
  if(count) count.textContent = products.length + " items";

  grid.innerHTML = products.map(p => createProductCard(p)).join("");

}



/* ======================================================
   PRODUCT CARD
====================================================== */

function createProductCard(p){

  const id = p._id || p.id;
  const image = p.image || "https://via.placeholder.com/300";

  const oldPrice = p.oldPrice || p.price + 100;

  const discount =
    Math.round((1 - p.price / oldPrice) * 100);

  const inWishlist =
    state.wishlist.includes(id);

  return `

  <div class="product-card"
       onclick="openProduct('${id}')">

    <span class="prod-badge">${discount}% OFF</span>

    <span class="wishlist-heart ${inWishlist?"active":""}"
      onclick="event.stopPropagation();toggleWishlist('${id}')">
      ❤
    </span>

    <div class="prod-img-wrap">
      <img src="${image}" alt="${p.name}">
    </div>

    <div class="prod-body">

      <div class="prod-name">${p.name}</div>

      <div class="price-row">
        <span class="current">₹${p.price}</span>
        <span class="old">₹${oldPrice}</span>
      </div>

      <div class="prod-cta-row">

        <button class="btn-chip"
          onclick="event.stopPropagation();addProductToCart('${id}')">
          Add
        </button>

        <button class="btn-chip btn-chip-primary"
          onclick="event.stopPropagation();buyNow('${id}')">
          Buy
        </button>

      </div>

    </div>

  </div>

  `;
}



/* ======================================================
   FILTER ENGINE
====================================================== */

export function getFilteredProducts(){

  let filtered = [...state.products];

  const f = state.filters;

  if(f.category?.length){

    filtered = filtered.filter(p =>
      f.category.includes(p.category)
    );

  }

  if(f.search){

    const q = f.search.toLowerCase();

    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(q)
    );

  }

  if(f.price){

    filtered = filtered.filter(p =>
      p.price >= f.price[0] &&
      p.price <= f.price[1]
    );

  }

  if(f.rating){

    filtered = filtered.filter(p =>
      (p.rating || 4) >= f.rating
    );

  }

  return filtered;

}



/* ======================================================
   WISHLIST
====================================================== */

export function toggleWishlist(productId){

  const idx = state.wishlist.indexOf(productId);

  if(idx >= 0){

    state.wishlist.splice(idx,1);

  }else{

    state.wishlist.push(productId);

  }

  localStorage.setItem(
    "wishlist",
    JSON.stringify(state.wishlist)
  );

  renderHome();

}



/* ======================================================
   ADD TO CART
====================================================== */

export function addProductToCart(productId){

  addToCart(productId,1);

}



/* ======================================================
   BUY NOW
====================================================== */

export function buyNow(productId){

  addToCart(productId,1);

  window.location.hash = "#checkout";

}



/* ======================================================
   OPEN PDP
====================================================== */

export function openProduct(productId){

  window.location.hash =
    "#product-" + productId;

}