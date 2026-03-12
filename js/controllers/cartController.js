/* ======================================================
   CART CONTROLLER
====================================================== */

import { state } from "../state.js";
import * as cartService from "../services/cartService.js";
import { createCartItem } from "../components/cartItems.js";

/* ======================================================
   LOAD CART
====================================================== */

export async function loadCart(){

  try{

    const cart = await cartService.getCart();

    state.cart = cart || [];

    renderCart();

  }catch(err){

    console.error("Cart load failed", err);

  }

}



/* ======================================================
   RENDER CART
====================================================== */

export function renderCart(){

  const container =
    document.getElementById("cartItems");

  if(!container) return;

  if(state.cart.length === 0){

    container.innerHTML = `
      <div class="empty-cart">
        <p>Your cart is empty</p>
      </div>
    `;

    return;

  }

  container.innerHTML = "";

  state.cart.forEach(item => {

    const el = createCartItem(item);

    container.appendChild(el);

  });

  updateCartTotals();

}



/* ======================================================
   ADD TO CART
====================================================== */

export async function addToCart(productId, qty = 1){

  try{

    const updatedCart =
      await cartService.addToCart(productId, qty);

    state.cart = updatedCart;

    renderCart();

  }catch(err){

    console.error("Add to cart failed", err);

  }

}



/* ======================================================
   REMOVE ITEM
====================================================== */

export async function removeItem(productId){

  try{

    const updatedCart =
      await cartService.removeFromCart(productId);

    state.cart = updatedCart;

    renderCart();

  }catch(err){

    console.error("Remove cart item failed", err);

  }

}



/* ======================================================
   UPDATE QUANTITY
====================================================== */

export async function updateQuantity(productId, qty){

  try{

    const updatedCart =
      await cartService.updateQuantity(productId, qty);

    state.cart = updatedCart;

    renderCart();

  }catch(err){

    console.error("Update quantity failed", err);

  }

}



/* ======================================================
   CALCULATE TOTALS
====================================================== */

export function updateCartTotals(){

  const subtotal = state.cart.reduce((sum,item)=>{

    return sum + item.price * item.qty;

  },0);

  const tax = Math.round(subtotal * 0.05);

  const delivery =
    subtotal > 499 ? 0 : 99;

  const total =
    subtotal + tax + delivery;


  const subtotalEl =
    document.getElementById("cartSubtotal");

  const taxEl =
    document.getElementById("cartTax");

  const deliveryEl =
    document.getElementById("cartDelivery");

  const totalEl =
    document.getElementById("cartTotal");


  if(subtotalEl)
    subtotalEl.textContent = "₹" + subtotal;

  if(taxEl)
    taxEl.textContent = "₹" + tax;

  if(deliveryEl)
    deliveryEl.textContent = "₹" + delivery;

  if(totalEl)
    totalEl.textContent = "₹" + total;

}



/* ======================================================
   PROCEED TO CHECKOUT
====================================================== */

export function proceedToCheckout(){

  if(state.cart.length === 0){

    alert("Cart is empty");

    return;

  }

  window.location.hash = "#checkout";

}