/* =========================================
   HOME PAGE
========================================= */

import { state } from "../state.js";
import { renderProductCard } from "../components/productCard.js";


/* =========================================
   RENDER HOME
========================================= */

export function renderHome() {

  renderCategories();
  renderProducts();

}


/* =========================================
   RENDER PRODUCTS
========================================= */

function renderProducts() {

  const grid = document.getElementById("productGrid");
  if (!grid) return;

  const products = getFilteredProducts();

  if (!products || products.length === 0) {

    grid.innerHTML = `
      <div class="empty-state">
        <h3>No products found</h3>
      </div>
    `;

    return;
  }

  let html = "";

  products.forEach(product => {
    html += renderProductCard(product);
  });

  grid.innerHTML = html;

}


/* =========================================
   CATEGORY STRIP
========================================= */

function renderCategories() {

  const strip = document.getElementById("categoryStrip");
  if (!strip) return;

  if (!state.products || state.products.length === 0) return;

  const categories =
    [...new Set(
      state.products
        .map(p => p.category)
        .filter(Boolean)
    )];

  strip.innerHTML = categories.map(cat => `

      <div class="cat-pill"
           onclick="filterCategory('${cat}')">

        <div class="cat-icon-wrap">
          ${cat.charAt(0).toUpperCase()}
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

window.filterCategory = function (category) {

  if (!state.filters) state.filters = {};

  state.filters.category = [category];

  renderProducts();

};


/* =========================================
   SEARCH
========================================= */

window.handleSearch = function (query) {

  if (!state.filters) state.filters = {};

  query = (query || "").toLowerCase();

  state.filters.search = query;

  renderProducts();

};


/* =========================================
   SORT
========================================= */

window.setSort = function (sort) {

  state.sort = sort;

  renderProducts();

};


/* =========================================
   FILTER ENGINE
========================================= */

function getFilteredProducts() {

  if (!state.products) return [];

  let products = [...state.products];

  const filters = state.filters || {};


  /* CATEGORY FILTER */

  if (filters.category && filters.category.length > 0) {

    products = products.filter(p =>
      filters.category.includes(p.category)
    );

  }


  /* SEARCH FILTER */

  if (filters.search) {

    const q = filters.search.toLowerCase();

    products = products.filter(p =>

      p.name?.toLowerCase().includes(q)

      ||

      p.category?.toLowerCase().includes(q)

      ||

      p.description?.toLowerCase().includes(q)

    );

  }


  /* PRICE FILTER */

  if (filters.price && filters.price.length === 2) {

    const [min, max] = filters.price;

    products = products.filter(p =>
      p.price >= min && p.price <= max
    );

  }


  /* SORTING */

  if (state.sort === "price-low") {

    products.sort((a, b) => a.price - b.price);

  }

  else if (state.sort === "price-high") {

    products.sort((a, b) => b.price - a.price);

  }

  else if (state.sort === "rating") {

    products.sort((a, b) => (b.rating || 0) - (a.rating || 0));

  }

  return products;

}