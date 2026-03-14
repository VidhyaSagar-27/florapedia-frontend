/* ======================================================
   FLORAPEDIA PRODUCT SERVICE
   Handles all product catalog logic
====================================================== */
import { api } from "../utilis/apiClients.js";
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
    this.cacheDuration = 300000; // 5 minutes
  }



  /* =========================================
     LOAD PRODUCTS FROM BACKEND
  ========================================= */

  async loadProducts(force = false){

    try{

      const now = Date.now();

      if(
        !force &&
        this.cache.length &&
        now - this.lastFetch < this.cacheDuration
      ){
        return this.cache;
      }

      const response = await api.getAll();

      let products = [];

      if(Array.isArray(response)){
        products = response;
      }
      else if(Array.isArray(response?.products)){
        products = response.products;
      }
      else{
        console.warn("Unexpected product response format", response);
        products = [];
      }

      /* Normalize product structure */

      products = products.map(p => {

        const id = p._id || p.id;

        return {
          ...p,
          id: String(id),
          price: Number(p.price) || 0,
          rating: Number(p.rating) || 0,
          stock: Number(p.stock ?? 10)
        };

      });

      this.cache = products;
      this.lastFetch = now;

      state.products = products;

      return products;

    }catch(err){

      console.error("PRODUCT LOAD ERROR:", err);

      return [];

    }

  }



  /* =========================================
     GET ALL PRODUCTS
  ========================================= */

  getAll(){

    if(this.cache.length) return this.cache;

    if(state.products?.length) return state.products;

    return [];

  }



  /* =========================================
     VALIDATE MONGODB OBJECTID
  ========================================= */

  isValidId(id){

    return typeof id === "string" &&
      /^[0-9a-fA-F]{24}$/.test(id);

  }



  /* =========================================
     GET PRODUCT BY ID
  ========================================= */

  getById(id){

    if(!id) return null;

    return this.getAll().find(p =>
      p.id === id || p._id === id
    );

  }



  /* =========================================
     GET PRODUCTS BY CATEGORY
  ========================================= */

  getByCategory(category){

    if(!category) return [];

    return this.getAll().filter(p =>
      p.category?.toLowerCase() === category.toLowerCase()
    );

  }



  /* =========================================
     SEARCH PRODUCTS
  ========================================= */

  search(query){

    if(!query) return this.getAll();

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

    if(state.filters?.search){
      products = searchProducts(products, state.filters.search);
    }

    products = filterProducts(products, state.filters);

    products = sortProducts(products, state.sort);

    return products;

  }



  /* =========================================
     FEATURED PRODUCTS
  ========================================= */

  getFeatured(){

    return randomItems(this.getAll(), 8);

  }



  /* =========================================
     TRENDING PRODUCTS
  ========================================= */

  getTrending(){

    return this.getAll()
      .filter(p => (p.rating || 0) >= 4)
      .slice(0,10);

  }



  /* =========================================
     RELATED PRODUCTS
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

    const prices = this.getAll()
      .map(p => p.price)
      .filter(p => typeof p === "number");

    if(!prices.length){
      return { min:0, max:0 };
    }

    return {
      min: Math.min(...prices),
      max: Math.max(...prices)
    };

  }

}

export const productService = new ProductService();
