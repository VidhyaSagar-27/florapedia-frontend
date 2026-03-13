/* ======================================================
   FLORAPEDIA PRODUCT CARD COMPONENT
   Reusable product card UI
====================================================== */

import { cartService } from "../services/cartService.js";
import { formatCurrency, getImage } from "../utilis/helpers.js";
import { state } from "../state.js";


/* ======================================================
   PRODUCT CARD UI
====================================================== */

export function renderProductCard(product){

  const inWishlist =
    state.wishlist?.includes(product.id);

  const badge =
    product.stock <= 5
      ? `<span class="product-badge low">Low Stock</span>`
      : product.rating >= 4.5
      ? `<span class="product-badge top">Top Rated</span>`
      : "";


  return `

  <div class="product-card" data-id="${product.id}">

    <div class="product-image-wrap">

      ${badge}

      <img
        src="${getImage(product.image)}"
        alt="${product.name}"
        class="product-image"
        loading="lazy"
      />

      <button
        class="wishlist-btn ${inWishlist ? "active":""}"
        onclick="toggleWishlist('${product.id}')"
      >
        ❤️
      </button>

    </div>


    <div class="product-body">

      <div class="product-category">
        ${product.category || ""}
      </div>

      <h3 class="product-title">
        ${product.name}
      </h3>

      <div class="product-rating">

        ⭐ ${product.rating || 4.2}

        <span class="rating-count">
          (${product.reviews || 12})
        </span>

      </div>


      <div class="product-footer">

        <div class="product-price">
          ${formatCurrency(product.price)}
        </div>

        <div class="product-actions">

          <button
            class="btn-cart"
            onclick="addToCart('${product.id}')"
          >
            Add
          </button>

          <button
            class="btn-buy"
            onclick="buyNow('${product.id}')"
          >
            Buy
          </button>

        </div>

      </div>

    </div>

  </div>

  `;
}



/* ======================================================
   GLOBAL BUTTON FUNCTIONS
====================================================== */

window.addToCart = function(productId){

  cartService.add(productId,1);

  if(window.app){
    window.app.updateHeader();
    window.app.toast("Added to cart");
  }

};


window.buyNow = function(productId){

  cartService.add(productId,1);

  if(window.app){
    window.app.updateHeader();
    window.app.navigate("cart");
  }

};


window.toggleWishlist = function(productId){

  const index =
    state.wishlist.indexOf(productId);

  if(index === -1){

    state.wishlist.push(productId);

    window.app?.toast("Added to wishlist");

  }else{

    state.wishlist.splice(index,1);

    window.app?.toast("Removed from wishlist");

  }

  window.app?.updateHeader();

};