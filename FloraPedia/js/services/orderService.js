/* ======================================================
   FLORAPEDIA ORDER SERVICE
   Handles orders, payments and tracking
====================================================== */

import { state } from "../state.js";
import { orderAPI, paymentAPI } from "../utilis/apiClients.js";
import { cartService } from "./cartService.js";
import { generateId, formatDate } from "../utilis/helpers.js";


class OrderService {

  constructor(){
    this.loadOrders();
  }



  /* =========================================
     LOAD ORDERS FROM STORAGE
  ========================================= */

  loadOrders(){

    try{
      const saved = JSON.parse(localStorage.getItem("orders"));
      state.orders = saved || [];
    }catch{
      state.orders = [];
    }

  }



  /* =========================================
     SAVE ORDERS
  ========================================= */

  saveOrders(){
    localStorage.setItem("orders", JSON.stringify(state.orders));
  }



  /* =========================================
     GET USER ORDERS
  ========================================= */

  getOrders(){
    return state.orders;
  }



  /* =========================================
     GET ORDER BY ID
  ========================================= */

  getOrder(orderId){

    return state.orders.find(
      o => o.id === orderId
    );

  }



  /* =========================================
     CREATE ORDER OBJECT
  ========================================= */

  createOrderData(address, paymentType){

    const cartData = cartService.prepareOrder();

    const order = {

      id: generateId("ORD"),

      userId: state.user?.id || null,

      items: cartData.items,

      totals: cartData.totals,

      address,

      paymentType,

      status: "pending",

      createdAt: formatDate(new Date()),

      deliveryStatus: "Preparing",

      tracking: []

    };

    return order;

  }



  /* =========================================
     PLACE ORDER (COD)
  ========================================= */

  async placeCOD(address){

    const order = this.createOrderData(address, "cod");

    order.status = "confirmed";

    state.orders.push(order);

    this.saveOrders();

    cartService.clear();

    return order;

  }



  /* =========================================
     CREATE RAZORPAY PAYMENT
  ========================================= */

  async createPayment(address){

    const orderData = this.createOrderData(address, "online");

    const amount = orderData.totals.total * 100;

    const paymentOrder = await paymentAPI.createOrder({
      amount
    });

    return {
      paymentOrder,
      orderData
    };

  }



  /* =========================================
     VERIFY PAYMENT
  ========================================= */

  async verifyPayment(paymentResponse, orderData){

    const verify = await paymentAPI.verifyPayment(paymentResponse);

    if(verify.success){

      orderData.status = "paid";

      state.orders.push(orderData);

      this.saveOrders();

      cartService.clear();

      return {
        success:true,
        order:orderData
      };

    }

    return { success:false };

  }



  /* =========================================
     UPDATE ORDER STATUS
  ========================================= */

  updateStatus(orderId, status){

    const order = this.getOrder(orderId);

    if(!order) return;

    order.deliveryStatus = status;

    order.tracking.push({
      status,
      time: new Date().toLocaleTimeString()
    });

    this.saveOrders();

  }



  /* =========================================
     DELIVERY TRACKING
  ========================================= */

  getTracking(orderId){

    const order = this.getOrder(orderId);

    if(!order) return [];

    return order.tracking;

  }



  /* =========================================
     SELLER VIEW ORDERS
  ========================================= */

  getSellerOrders(sellerId){

    return state.orders.filter(order =>
      order.items.some(item =>
        item.sellerId === sellerId
      )
    );

  }



  /* =========================================
     DELIVERY PARTNER VIEW
  ========================================= */

  getDeliveryOrders(){

    return state.orders.filter(
      o => o.deliveryStatus !== "Delivered"
    );

  }



  /* =========================================
     MARK DELIVERED
  ========================================= */

  markDelivered(orderId){

    const order = this.getOrder(orderId);

    if(!order) return;

    order.deliveryStatus = "Delivered";

    order.status = "completed";

    this.saveOrders();

  }

}


export const orderService = new OrderService();