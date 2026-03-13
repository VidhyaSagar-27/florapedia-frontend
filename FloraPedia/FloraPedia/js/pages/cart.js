/* ======================================================
   CART PAGE CONTROLLER
====================================================== */

import { state } from "../state.js";
import {
  addToCart,
  removeItem,
  updateQuantity
} from "../controllers/cartController.js";



/* ======================================================
   RENDER CART PAGE
====================================================== */

export function renderCart(){

  const content =
    document.getElementById("cartContent");

  if(!content) return;

  if(!state.cart || state.cart.length === 0){

    content.innerHTML = `
      <div class="cart-empty">
        <p>Your cart is empty</p>
        <button onclick="goHome()" class="btn-primary">
          Continue Shopping
        </button>
      </div>
    `;

    return;
  }

  const itemsHTML =
    state.cart.map(item => createCartItem(item)).join("");

  const totals =
    calculateTotals(state.cart);

  content.innerHTML = `

  <div class="cart-container">

    <div class="cart-items">
      ${itemsHTML}
    </div>

    <div class="cart-summary">

      <div class="summary-row">
        <span>Subtotal</span>
        <span>₹${totals.subtotal}</span>
      </div>

      <div class="summary-row">
        <span>Delivery</span>
        <span>₹${totals.delivery}</span>
      </div>

      <div class="summary-row">
        <span>Tax</span>
        <span>₹${totals.tax}</span>
      </div>

      <div class="summary-row total">
        <span>Total</span>
        <span>₹${totals.total}</span>
      </div>

      <button
        class="btn-checkout"
        onclick="goCheckout()">

        Proceed to Checkout

      </button>

    </div>

  </div>

  `;

}



/* ======================================================
   CART ITEM UI
====================================================== */

function createCartItem(item){

  const product =
    state.products.find(
      p => (p._id || p.id) == item.productId
    );

  if(!product) return "";

  const total =
    product.price * item.qty;

  return `

  <div class="cart-item">

    <img
      src="${product.image}"
      alt="${product.name}"
      class="cart-item-img">

    <div class="cart-item-info">

      <h4>${product.name}</h4>

      <p>₹${product.price}</p>

      <div class="qty-selector">

        <button
        onclick="changeQty('${item.productId}',-1)">
        −
        </button>

        <span>${item.qty}</span>

        <button
        onclick="changeQty('${item.productId}',1)">
        +
        </button>

      </div>

    </div>

    <div class="cart-item-total">
      ₹${total}
    </div>

    <button
      class="remove-btn"
      onclick="removeCartItem('${item.productId}')">

      Remove

    </button>

  </div>

  `;

}



/* ======================================================
   TOTAL CALCULATION
====================================================== */

function calculateTotals(cart){

  const subtotal =
    cart.reduce((sum,item)=>{

      const product =
        state.products.find(
          p => (p._id||p.id)==item.productId
        );

      if(!product) return sum;

      return sum + product.price * item.qty;

    },0);

  const tax =
    Math.round(subtotal * 0.05);

  const delivery =
    subtotal > 499 ? 0 : 99;

  const total =
    subtotal + tax + delivery;

  return {
    subtotal,
    tax,
    delivery,
    total
  };

}



/* ======================================================
   ACTION HELPERS
====================================================== */

window.changeQty = function(productId,change){

  const item =
    state.cart.find(
      c => c.productId == productId
    );

  if(!item) return;

  const newQty =
    item.qty + change;

  updateQuantity(productId,newQty);

};



window.removeCartItem = function(productId){

  removeItem(productId);

};



window.goCheckout = function(){

  window.location.hash = "#checkout";

};



window.goHome = function(){

  window.location.hash = "#home";

};