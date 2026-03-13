/* ======================================================
   FLORAPEDIA PRODUCT SERVICE
   Handles all product catalog logic
====================================================== */

import { productAPI } from "../utilis/apiClients.js";
import { state } from "../state.js";
import {
  searchProducts,
  filterProducts,
  sortProducts,
  randomItems
} from "../utilis/helpers.js";

class ProductService {

  constructor(){
    this.cache = [];
    this.lastFetch = 0;
  }



  /* =========================================
     LOAD PRODUCTS FROM BACKEND
  ========================================= */

  async loadProducts(force = false){

    try{

      const now = Date.now();

      if(!force && this.cache.length && now - this.lastFetch < 300000){
        return this.cache;
      }

      const products = await productAPI.getAll();

      this.cache = products || [];
      this.lastFetch = now;

      state.products = this.cache;

      return this.cache;

    }catch(err){

      console.error("PRODUCT LOAD ERROR:", err);

      return [];

    }

  }



  /* =========================================
     GET ALL PRODUCTS
  ========================================= */

  getAll(){

    return this.cache.length
      ? this.cache
      : state.products;

  }



  /* =========================================
     GET PRODUCT BY ID
  ========================================= */

  getById(id){

    return this.getAll().find(p =>
      p.id === id || p._id === id
    );

  }



  /* =========================================
     GET PRODUCTS BY CATEGORY
  ========================================= */

  getByCategory(category){

    return this.getAll().filter(p =>
      p.category?.toLowerCase() === category.toLowerCase()
    );

  }



  /* =========================================
     SEARCH PRODUCTS
  ========================================= */

  search(query){

    return searchProducts(this.getAll(), query);

  }



  /* =========================================
     FILTER PRODUCTS
  ========================================= */

  filter(filters){

    return filterProducts(this.getAll(), filters);

  }



  /* =========================================
     SORT PRODUCTS
  ========================================= */

  sort(products, sortType){

    return sortProducts(products, sortType);

  }



  /* =========================================
     SEARCH + FILTER + SORT PIPELINE
  ========================================= */

  queryProducts(){

    let products = this.getAll();

    if(state.filters.search){
      products = searchProducts(products, state.filters.search);
    }

    products = filterProducts(products, state.filters);

    products = sortProducts(products, state.sort);

    return products;

  }



  /* =========================================
     GET FEATURED PRODUCTS
  ========================================= */

  getFeatured(){

    return randomItems(this.getAll(), 8);

  }



  /* =========================================
     GET TRENDING PRODUCTS
  ========================================= */

  getTrending(){

    return this.getAll()
      .filter(p => p.rating >= 4)
      .slice(0,10);

  }



  /* =========================================
     GET RELATED PRODUCTS
  ========================================= */

  getRelated(productId){

    const product = this.getById(productId);

    if(!product) return [];

    return this.getByCategory(product.category)
      .filter(p => p.id !== productId)
      .slice(0,6);

  }



  /* =========================================
     GET ALL CATEGORIES
  ========================================= */

  getCategories(){

    const categories = new Set();

    this.getAll().forEach(p=>{
      if(p.category) categories.add(p.category);
    });

    return Array.from(categories);

  }



  /* =========================================
     GET PRICE RANGE
  ========================================= */

  getPriceRange(){

    const prices = this.getAll().map(p => p.price);

    return {
      min: Math.min(...prices),
      max: Math.max(...prices)
    };

  }

}


export const productService = new ProductService();