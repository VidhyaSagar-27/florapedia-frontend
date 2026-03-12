/* ======================================================
   ORDER CONTROLLER
====================================================== */

import { state } from "../state.js";
import * as orderService from "../services/orderService.js";
import { createOrderCard } from "../components/orderCard.js";


/* ======================================================
   LOAD USER ORDERS
====================================================== */

export async function loadOrders(){

  try{

    const orders = await orderService.getOrders();

    state.orders = orders || [];

    renderOrders();

  }catch(err){

    console.error("Order load failed", err);

  }

}



/* ======================================================
   RENDER ORDERS
====================================================== */

export function renderOrders(){

  const container =
    document.getElementById("ordersContainer");

  if(!container) return;

  if(!state.orders || state.orders.length === 0){

    container.innerHTML = `
      <div class="empty-orders">
        <p>No orders yet</p>
      </div>
    `;

    return;

  }

  container.innerHTML = "";

  state.orders.forEach(order => {

    const el = createOrderCard(order);

    container.appendChild(el);

  });

}



/* ======================================================
   CREATE ORDER
====================================================== */

export async function createOrder(orderData){

  try{

    const order =
      await orderService.createOrder(orderData);

    state.orders.unshift(order);

    state.cart = [];

    renderOrders();

    return order;

  }catch(err){

    console.error("Create order failed", err);

    throw err;

  }

}



/* ======================================================
   GET ORDER DETAILS
====================================================== */

export async function getOrder(orderId){

  try{

    const order =
      await orderService.getOrder(orderId);

    return order;

  }catch(err){

    console.error("Order fetch failed", err);

  }

}



/* ======================================================
   CALCULATE ORDER TOTALS
====================================================== */

export function calculateTotals(cartItems){

  const subtotal = cartItems.reduce((sum,item)=>{

    return sum + item.price * item.qty;

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
   TRACK ORDER
====================================================== */

export async function trackOrder(orderId){

  try{

    const tracking =
      await orderService.trackOrder(orderId);

    return tracking;

  }catch(err){

    console.error("Tracking failed", err);

  }

}



/* ======================================================
   UPDATE ORDER STATUS
====================================================== */

export function updateOrderStatus(orderId, status){

  const idx =
    state.orders.findIndex(o =>
      (o._id || o.id) == orderId
    );

  if(idx >= 0){

    state.orders[idx].status = status;

  }

}



/* ======================================================
   CANCEL ORDER
====================================================== */

export async function cancelOrder(orderId){

  try{

    await orderService.cancelOrder(orderId);

    updateOrderStatus(orderId,"Cancelled");

    renderOrders();

  }catch(err){

    console.error("Cancel order failed", err);

  }

}