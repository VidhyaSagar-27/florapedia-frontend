/* ======================================================
   PRODUCT CONTROLLER
   Handles product loading, filtering, sorting, rendering
====================================================== */


import { state } from "../state.js";
import * as productService from "../services/productService.js";
import { renderProductCard } from "../components/productCard.js";
import { debounce } from "../utilis/helpers.js";


/* ======================================================
   LOAD PRODUCTS FROM API
====================================================== */

export async function loadProducts(){

  try{

    const products = await productService.fetchProducts();

    state.products = products || [];

    renderProducts();

  }catch(err){

    console.error("Product load failed", err);

  }

}



/* ======================================================
   GET FILTERED PRODUCTS
====================================================== */

export function getFilteredProducts(){

  let filtered = [...state.products];

  const filters = state.filters;


  /* CATEGORY FILTER */

  if(filters.category?.length){

    filtered = filtered.filter(p =>
      filters.category.includes(p.category)
    );

  }


  /* OCCASION FILTER */

  if(filters.occasion?.length){

    filtered = filtered.filter(p =>
      p.occasion?.some(o =>
        filters.occasion.includes(o)
      )
    );

  }


  /* PRICE FILTER */

  if(filters.price){

    filtered = filtered.filter(p =>
      p.price >= filters.price[0] &&
      p.price <= filters.price[1]
    );

  }


  /* RATING FILTER */

  if(filters.rating){

    filtered = filtered.filter(p =>
      (p.rating || 0) >= filters.rating
    );

  }


  /* SEARCH FILTER */

  if(filters.search){

    const q = filters.search.toLowerCase();

    filtered = filtered.filter(p =>
      p.name?.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q)
    );

  }


  /* SORTING */

  switch(state.sort){

    case "price-low":

      filtered.sort((a,b)=>a.price-b.price);

    break;

    case "price-high":

      filtered.sort((a,b)=>b.price-a.price);

    break;

    case "rating":

      filtered.sort((a,b)=>(b.rating||0)-(a.rating||0));

    break;

    case "newest":

      filtered.sort((a,b)=>
        new Date(b.createdAt) - new Date(a.createdAt)
      );

    break;

  }


  return filtered;

}



/* ======================================================
   RENDER PRODUCTS GRID
====================================================== */

export function renderProducts(){

  const grid =
    document.getElementById("productGrid");

  if(!grid) return;

  const products = getFilteredProducts();

  if(products.length === 0){

    grid.innerHTML = `
      <div class="empty-products">
        <p>No products found</p>
      </div>
    `;

    return;

  }

  grid.innerHTML = "";

  products.forEach(product => {

    const card = renderProductCard(product);

    grid.appendChild(card);

  });

}



/* ======================================================
   SEARCH PRODUCTS
====================================================== */

export const handleSearch = debounce(function(query){

  state.filters.search = query;

  renderProducts();

},300);



/* ======================================================
   FILTER CATEGORY
====================================================== */

export function toggleCategory(category){

  const idx =
    state.filters.category.indexOf(category);

  if(idx >= 0){

    state.filters.category.splice(idx,1);

  }else{

    state.filters.category.push(category);

  }

  renderProducts();

}



/* ======================================================
   SET PRICE FILTER
====================================================== */

export function setPriceFilter(min,max){

  state.filters.price = [min,max];

  renderProducts();

}



/* ======================================================
   SET RATING FILTER
====================================================== */

export function setRatingFilter(rating){

  state.filters.rating = rating;

  renderProducts();

}



/* ======================================================
   SORT PRODUCTS
====================================================== */

export function setSort(type){

  state.sort = type;

  renderProducts();

}



/* ======================================================
   GET PRODUCT BY ID
====================================================== */

export function getProductById(id){

  return state.products.find(p =>
    (p._id || p.id) == id
  );

}



/* ======================================================
   LOAD PRODUCT DETAILS PAGE
====================================================== */

export function loadProductDetails(productId){

  const product = getProductById(productId);

  if(!product) return;

  const container =
    document.getElementById("productDetails");

  if(!container) return;

  container.innerHTML = `

  <div class="product-detail">

    <div class="product-image">
      <img src="${product.image}" alt="${product.name}">
    </div>

    <div class="product-info">

      <h1>${product.name}</h1>

      <p class="product-price">
        ₹${product.price}
      </p>

      <p class="product-rating">
        ⭐ ${product.rating || 4.5}
      </p>

      <button class="btn-primary"
        data-product="${product._id || product.id}"
        id="addToCartBtn">

        Add To Cart

      </button>

    </div>

  </div>

  `;

}