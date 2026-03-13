/* =========================================
   HOME PAGE
========================================= */

import { state } from "../state.js";
import { renderProductCard } from "../components/productCard.js";

/* =========================================
   RENDER HOME
========================================= */

export function renderHome(){

  renderCategories();
  renderProducts();

}



/* =========================================
   RENDER PRODUCTS
========================================= */

function renderProducts(){

  const grid =
    document.getElementById("productGrid");

  if(!grid) return;

  const products =
    getFilteredProducts();

  if(products.length === 0){

    grid.innerHTML = `
      <div class="empty-state">
        <h3>No products found</h3>
      </div>
    `;

    return;

  }

  grid.innerHTML =
    products
      .map(p => ProductCard(p))
      .join("");

}



/* =========================================
   CATEGORY STRIP
========================================= */

function renderCategories(){

  const strip =
    document.getElementById("categoryStrip");

  if(!strip) return;

  const categories =
    [...new Set(
      state.products
        .map(p => p.category)
        .filter(Boolean)
    )];

  strip.innerHTML =
    categories.map(cat => `

      <div class="cat-pill"
           onclick="filterCategory('${cat}')">

        <div class="cat-icon-wrap">
          ${cat.charAt(0)}
        </div>

        <div>

          <div style="font-size:12px;font-weight:600;">
            ${cat}
          </div>

          <div style="font-size:10px;color:var(--text-muted);">
            Explore
          </div>

        </div>

      </div>

    `).join("");

}



/* =========================================
   CATEGORY FILTER
========================================= */

window.filterCategory = function(category){

  state.filters.category = [category];

  renderProducts();

};



/* =========================================
   SEARCH
========================================= */

window.handleSearch = function(query){

  query =
    (query || "").toLowerCase();

  state.filters.search = query;

  renderProducts();

};



/* =========================================
   SORT
========================================= */

window.setSort = function(sort){

  state.sort = sort;

  renderProducts();

};



/* =========================================
   FILTER ENGINE
========================================= */

function getFilteredProducts(){

  let products =
    [...state.products];

  const filters =
    state.filters || {};



  /* CATEGORY */

  if(filters.category?.length){

    products =
      products.filter(p =>
        filters.category.includes(
          p.category
        )
      );

  }



  /* SEARCH */

  if(filters.search){

    const q =
      filters.search.toLowerCase();

    products =
      products.filter(p =>

        p.name?.toLowerCase()
          .includes(q)

        ||

        p.category?.toLowerCase()
          .includes(q)

      );

  }



  /* PRICE */

  if(filters.price){

    products =
      products.filter(p =>

        p.price >= filters.price[0] &&
        p.price <= filters.price[1]

      );

  }



  /* SORTING */

  if(state.sort === "price-low"){

    products.sort(
      (a,b)=> a.price - b.price
    );

  }

  if(state.sort === "price-high"){

    products.sort(
      (a,b)=> b.price - a.price
    );

  }

  if(state.sort === "rating"){

    products.sort(
      (a,b)=> (b.rating||0)-(a.rating||0)
    );

  }

  return products;

}