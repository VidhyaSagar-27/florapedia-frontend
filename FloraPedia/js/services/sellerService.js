/* ======================================================
   FLORAPEDIA SELLER SERVICE
   Handles seller dashboard, products and analytics
====================================================== */

import { state } from "../state.js";
import { sellerAPI } from "../apiClient.js";
import { generateId } from "../utils/helpers.js";
import { orderService } from "./orderService.js";


class SellerService {

  constructor(){
    this.loadSellerProducts();
  }



  /* =========================================
     LOAD SELLER PRODUCTS
  ========================================= */

  loadSellerProducts(){

    try{

      const products =
        JSON.parse(localStorage.getItem("seller_products"));

      state.sellerProducts = products || [];

    }catch{

      state.sellerProducts = [];

    }

  }



  /* =========================================
     SAVE SELLER PRODUCTS
  ========================================= */

  saveSellerProducts(){

    localStorage.setItem(
      "seller_products",
      JSON.stringify(state.sellerProducts)
    );

  }



  /* =========================================
     GET SELLER PRODUCTS
  ========================================= */

  getProducts(){

    const sellerId = state.user?.id;

    if(!sellerId) return [];

    return state.sellerProducts.filter(
      p => p.sellerId === sellerId
    );

  }



  /* =========================================
     ADD PRODUCT
  ========================================= */

  async addProduct(data){

    const sellerId = state.user?.id;

    if(!sellerId) return;

    const product = {

      id: generateId("PROD"),

      sellerId,

      name: data.name,

      category: data.category,

      price: Number(data.price),

      stock: Number(data.stock),

      image: data.image || "",

      description: data.description || "",

      rating: 0,

      reviews: 0,

      createdAt: new Date().toISOString()

    };



    state.sellerProducts.push(product);

    this.saveSellerProducts();



    try{

      await sellerAPI.addProduct(product);

    }catch(err){

      console.warn("Backend sync failed");

    }



    return product;

  }



  /* =========================================
     UPDATE PRODUCT
  ========================================= */

  async updateProduct(productId, data){

    const product = state.sellerProducts.find(
      p => p.id === productId
    );

    if(!product) return;

    Object.assign(product, data);

    this.saveSellerProducts();



    try{

      await sellerAPI.updateProduct(productId, data);

    }catch(err){

      console.warn("Backend sync failed");

    }

  }



  /* =========================================
     DELETE PRODUCT
  ========================================= */

  async deleteProduct(productId){

    state.sellerProducts =
      state.sellerProducts.filter(
        p => p.id !== productId
      );

    this.saveSellerProducts();



    try{

      await sellerAPI.deleteProduct(productId);

    }catch(err){

      console.warn("Backend sync failed");

    }

  }



  /* =========================================
     UPDATE INVENTORY
  ========================================= */

  updateStock(productId, qty){

    const product = state.sellerProducts.find(
      p => p.id === productId
    );

    if(!product) return;

    product.stock = qty;

    this.saveSellerProducts();

  }



  /* =========================================
     SELLER ORDERS
  ========================================= */

  getOrders(){

    const sellerId = state.user?.id;

    if(!sellerId) return [];

    return orderService.getSellerOrders(sellerId);

  }



  /* =========================================
     SELLER ANALYTICS
  ========================================= */

  getAnalytics(){

    const products = this.getProducts();

    const orders = this.getOrders();

    let revenue = 0;

    let totalItems = 0;



    orders.forEach(order => {

      order.items.forEach(item => {

        const product = products.find(
          p => p.id === item.productId
        );

        if(product){

          revenue += item.price * item.qty;

          totalItems += item.qty;

        }

      });

    });



    return {

      totalProducts: products.length,

      totalOrders: orders.length,

      itemsSold: totalItems,

      revenue

    };

  }



  /* =========================================
     LOW STOCK PRODUCTS
  ========================================= */

  getLowStock(){

    return this.getProducts().filter(
      p => p.stock <= 5
    );

  }



  /* =========================================
     TOP SELLING PRODUCTS
  ========================================= */

  getTopProducts(){

    const products = this.getProducts();

    const orders = this.getOrders();

    const salesMap = {};



    orders.forEach(order => {

      order.items.forEach(item => {

        if(!salesMap[item.productId]){

          salesMap[item.productId] = 0;

        }

        salesMap[item.productId] += item.qty;

      });

    });



    return products
      .map(p => ({
        ...p,
        sold: salesMap[p.id] || 0
      }))
      .sort((a,b)=> b.sold - a.sold)
      .slice(0,5);

  }

}


export const sellerService = new SellerService();