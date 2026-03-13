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

  const id = product.id || product._id;

  const inWishlist =
    state.wishlist?.includes(id);

  const rating =
    product.rating || 4.2;

  const reviews =
    product.reviews || 12;

  const stock =
    product.stock ?? 10;

  const price =
    product.price || 0;

  const oldPrice =
    product.oldPrice || null;

  const badge =
    stock <= 5
      ? `<span class="product-badge low">Low Stock</span>`
      : rating >= 4.5
      ? `<span class="product-badge top">Top Rated</span>`
      : "";


  const outOfStock =
    stock <= 0;


  return `

  <div class="product-card" data-id="${id}">

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
        onclick="toggleWishlist('${id}')"
      >
        ${inWishlist ? "❤️" : "🤍"}
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

        ${renderStars(rating)}

        <span class="rating-count">
          (${reviews})
        </span>

      </div>


      <div class="product-footer">

        <div class="product-price">

          <span class="price-now">
            ${formatCurrency(price)}
          </span>

          ${
            oldPrice
            ? `<span class="price-old">
                ${formatCurrency(oldPrice)}
              </span>`
            : ""
          }

        </div>


        <div class="product-actions">

          ${
            outOfStock
            ? `<button class="btn-out">
                 Out of Stock
               </button>`
            : `
              <button
                class="btn-cart"
                onclick="addToCart('${id}')"
              >
                Add
              </button>

              <button
                class="btn-buy"
                onclick="buyNow('${id}')"
              >
                Buy
              </button>
            `
          }

        </div>

      </div>

    </div>

  </div>

  `;
}



/* ======================================================
   STAR RENDERING
====================================================== */

function renderStars(rating){

  let stars = "";

  for(let i=1;i<=5;i++){

    if(rating >= i){
      stars += "⭐";
    }
    else if(rating >= i-0.5){
      stars += "✨";
    }
    else{
      stars += "☆";
    }

  }

  return `
    <span class="stars">
      ${stars}
      <span class="rating-number">
        ${rating.toFixed(1)}
      </span>
    </span>
  `;

}



/* ======================================================
   GLOBAL BUTTON FUNCTIONS
====================================================== */

window.addToCart = function(productId){

  cartService.add(productId,1);

  window.app?.updateHeader();
  window.app?.toast("Added to cart");

};



window.buyNow = function(productId){

  cartService.add(productId,1);

  window.app?.updateHeader();
  window.app?.navigate("cart");

};



window.toggleWishlist = function(productId){

  if(!state.wishlist)
    state.wishlist = [];

  const index =
    state.wishlist.indexOf(productId);

  if(index === -1){

    state.wishlist.push(productId);

    window.app?.toast("Added to wishlist");

  }
  else{

    state.wishlist.splice(index,1);

    window.app?.toast("Removed from wishlist");

  }

  window.app?.updateHeader();

  /* refresh UI instantly */

  document
    .querySelectorAll(
      `.product-card[data-id="${productId}"] .wishlist-btn`
    )
    .forEach(btn => {
      btn.classList.toggle("active");
      btn.innerHTML =
        btn.classList.contains("active")
        ? "❤️"
        : "🤍";
    });

};