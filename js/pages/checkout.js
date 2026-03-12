/* ======================================================
   CHECKOUT PAGE CONTROLLER
====================================================== */

import { state } from "../state.js";
import { createOrder } from "../controllers/orderController.js";
import { PAYMENT, DELIVERY } from "../config.js";

/* ======================================================
   SELECT ADDRESS
====================================================== */

export function selectAddress(idx){

  state.selectedAddressIdx = idx;

  renderCheckout();

}



/* ======================================================
   SAVE ADDRESS
====================================================== */

export function saveAddress(){

  const label =
    document.getElementById("addrLabel")?.value.trim();

  const text =
    document.getElementById("addrText")?.value.trim();

  const instructions =
    document.getElementById("addrInstructions")?.value.trim();

  if(!text){
    showToast("Please enter address");
    return;
  }

  state.addresses.push({
    label,
    text,
    instructions
  });

  state.selectedAddressIdx =
    state.addresses.length - 1;

  localStorage.setItem(
    "addresses",
    JSON.stringify(state.addresses)
  );

  renderCheckout();

}



/* ======================================================
   DELIVERY TYPE
====================================================== */

export function selectDelivery(type){

  state.deliveryType = type;

  renderCheckout();

}



/* ======================================================
   PAYMENT TYPE
====================================================== */

export function selectPayment(type){

  state.paymentType = type;

}



/* ======================================================
   PLACE ORDER
====================================================== */

export async function placeOrder(){

  if(!state.selectedAddressIdx){

    showToast("Select address first");
    return;

  }

  const totals =
    calculateTotals();

  if(state.paymentType === "razorpay"){

    launchRazorpayPayment(totals.total);

  }else{

    await finalizeOrder(totals);

  }

}



/* ======================================================
   RAZORPAY PAYMENT
====================================================== */

function launchRazorpayPayment(amount){

  const options = {

    key: PAYMENT.razorpay.key,

    amount: amount * 100,

    currency: "INR",

    name: PAYMENT.razorpay.name,

    description: PAYMENT.razorpay.description,

    handler: async function(){

      await finalizeOrder(
        calculateTotals()
      );

    }

  };

  const rzp =
    new Razorpay(options);

  rzp.open();

}



/* ======================================================
   FINALIZE ORDER
====================================================== */

async function finalizeOrder(totals){

  const orderData = {

    items: state.cart,

    address:
      state.addresses[state.selectedAddressIdx],

    deliveryType:
      state.deliveryType,

    paymentType:
      state.paymentType,

    totals

  };

  await createOrder(orderData);

  state.cart = [];

  localStorage.setItem("cart","[]");

  window.location.hash =
    "#account";

}



/* ======================================================
   CALCULATE TOTALS
====================================================== */

function calculateTotals(){

  const subtotal =
    state.cart.reduce((sum,item)=>{

      const product =
        state.products.find(
          p => (p._id||p.id)==item.productId
        );

      if(!product) return sum;

      return sum +
        product.price * item.qty;

    },0);

  const delivery =
    state.deliveryType === "express"
      ? DELIVERY.expressFee
      : DELIVERY.standardFee;

  const tax =
    Math.round(subtotal * 0.05);

  const total =
    subtotal + tax + delivery;

  return {
    subtotal,
    delivery,
    tax,
    total
  };

}



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
/* ======================================================
   RENDER CHECKOUT PAGE
====================================================== */

export function renderCheckout(){

  const root = document.getElementById("app");

  if(!root) return;

  const totals = calculateTotals();

  root.innerHTML = `
    <div class="checkout-page">

      <h2>Checkout</h2>

      <div class="checkout-summary">
        <p>Subtotal: ₹${totals.subtotal}</p>
        <p>Delivery: ₹${totals.delivery}</p>
        <p>Tax: ₹${totals.tax}</p>
        <h3>Total: ₹${totals.total}</h3>
      </div>

      <button onclick="placeOrder()">
        Place Order
      </button>

    </div>
  `;

}