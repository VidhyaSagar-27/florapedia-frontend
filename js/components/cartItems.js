/* ======================================================
   FLORAPEDIA CART ITEM COMPONENT
   UI for items inside the cart
====================================================== */

import { cartService } from "../services/cartService.js";
import { formatCurrency, getImage } from "../utils/helpers.js";


export function renderCartItem(item){

  const stockLabel =
    item.stock <= 5
      ? `<span class="stock-warning">Only ${item.stock} left</span>`
      : "";


  return `

  <div class="cart-item" data-id="${item.id}">

    <div class="cart-item-image">

      <img
        src="${getImage(item.image)}"
        alt="${item.name}"
        loading="lazy"
      />

    </div>



    <div class="cart-item-info">

      <h3 class="cart-item-title">
        ${item.name}
      </h3>

      <div class="cart-item-category">
        ${item.category || ""}
      </div>

      ${stockLabel}

      <div class="cart-item-price">
        ${formatCurrency(item.price)}
      </div>

    </div>



    <div class="cart-item-qty">

      <button
        class="qty-btn"
        onclick="updateCartQty('${item.id}', ${item.qty - 1})"
      >
        −
      </button>

      <span class="qty-value">
        ${item.qty}
      </span>

      <button
        class="qty-btn"
        onclick="updateCartQty('${item.id}', ${item.qty + 1})"
      >
        +
      </button>

    </div>



    <div class="cart-item-total">

      ${formatCurrency(item.price * item.qty)}

    </div>



    <button
      class="cart-item-remove"
      onclick="removeFromCart('${item.id}')"
    >
      ✕
    </button>

  </div>

  `;
}