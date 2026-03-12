/* ======================================================
   SELLER CONTROLLER
====================================================== */

import { state } from "../state/state.js";
import * as sellerService from "../services/sellerService.js";
import { createProductCard } from "../components/productCard.js";


/* ======================================================
   LOAD SELLER PRODUCTS
====================================================== */

export async function loadSellerProducts(){

  try{

    const products =
      await sellerService.getSellerProducts();

    state.sellerProducts = products || [];

    renderSellerProducts();

  }catch(err){

    console.error("Seller products load failed", err);

  }

}



/* ======================================================
   RENDER SELLER PRODUCTS
====================================================== */

export function renderSellerProducts(){

  const container =
    document.getElementById("sellerProducts");

  if(!container) return;

  const products = state.sellerProducts || [];

  if(products.length === 0){

    container.innerHTML = `
      <div class="empty-products">
        <p>No products yet</p>
      </div>
    `;

    return;

  }

  container.innerHTML = "";

  products.forEach(product => {

    const card = createProductCard(product, true);

    container.appendChild(card);

  });

}



/* ======================================================
   ADD PRODUCT
====================================================== */

export async function addProduct(productData){

  try{

    const newProduct =
      await sellerService.addProduct(productData);

    state.sellerProducts.push(newProduct);

    renderSellerProducts();

    alert("Product added successfully");

  }catch(err){

    console.error("Add product failed", err);

  }

}



/* ======================================================
   UPDATE PRODUCT
====================================================== */

export async function updateProduct(productId, data){

  try{

    const updated =
      await sellerService.updateProduct(
        productId,
        data
      );

    const idx =
      state.sellerProducts.findIndex(p =>
        (p._id || p.id) == productId
      );

    if(idx >= 0){

      state.sellerProducts[idx] = updated;

    }

    renderSellerProducts();

  }catch(err){

    console.error("Product update failed", err);

  }

}



/* ======================================================
   DELETE PRODUCT
====================================================== */

export async function deleteProduct(productId){

  if(!confirm("Delete this product?")) return;

  try{

    await sellerService.deleteProduct(productId);

    state.sellerProducts =
      state.sellerProducts.filter(p =>
        (p._id || p.id) != productId
      );

    renderSellerProducts();

  }catch(err){

    console.error("Delete failed", err);

  }

}



/* ======================================================
   SELLER ANALYTICS
====================================================== */

export function getSellerStats(){

  const products = state.sellerProducts || [];

  const totalProducts = products.length;

  const totalValue = products.reduce(
    (sum,p)=>sum+p.price,
    0
  );

  return {

    totalProducts,
    totalValue

  };

}