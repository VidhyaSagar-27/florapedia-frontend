const API = "https://florapedia-backend.onrender.com/api";

/* ==============================
   SAVE STORE DETAILS
============================== */

window.saveStore = async function(){

  const name = document.getElementById("storeName").value;
  const location = document.getElementById("storeLocation").value;
  const phone = document.getElementById("storePhone").value;

  try{

    const res = await fetch(API + "/seller/store",{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
        "Authorization":"Bearer " + localStorage.getItem("token")
      },
      body: JSON.stringify({
        name,
        location,
        phone
      })
    });

    const data = await res.json();

    alert(data.message || "Store saved");

  }catch(err){

    console.error(err);
    alert("Failed to save store");

  }

};


/* ==============================
   ADD PRODUCT
============================== */

window.addProduct = async function(){

  const name = document.getElementById("productName").value;
  const price = document.getElementById("productPrice").value;
  const image = document.getElementById("productImage").value;

  try{

    const res = await fetch(API + "/seller/product",{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
        "Authorization":"Bearer " + localStorage.getItem("token")
      },
      body: JSON.stringify({
        name,
        price,
        description:"Flower product",
        images:[image],
        seller: state.user._id,
        shop: state.user.shop
      })
    });

    const data = await res.json();

    alert(data.message || "Product added");

    loadSellerProducts();

  }catch(err){

    console.error(err);
    alert("Failed to add product");

  }

};


/* ==============================
   LOAD SELLER PRODUCTS
============================== */

window.loadSellerProducts = async function(){

  try{

    const res = await fetch(API + "/seller/products",{
      headers:{
        "Authorization":"Bearer " + localStorage.getItem("token")
      }
    });

    const products = await res.json();

    const container =
      document.getElementById("sellerProducts");

    container.innerHTML = "";

    products.forEach(p => {

      const div = document.createElement("div");

      div.innerHTML = `
<div style="border:1px solid #ddd;padding:12px;margin:10px 0;border-radius:8px;">
  <img src="${p.images[0]}" width="80" style="border-radius:6px;">
  
  <h4>${p.name}</h4>
  <p>₹${p.price}</p>

  <button onclick="editProduct('${p._id}')">Edit</button>
  <button onclick="deleteProduct('${p._id}')">Delete</button>

</div>
`;

      container.appendChild(div);

    });

  }catch(err){

    console.error(err);

  }

};


/* ==============================
   DELETE PRODUCT
============================== */

window.deleteProduct = async function(id){

  if(!confirm("Delete this product?")) return;

  try{

    const res = await fetch(API + "/seller/product/" + id,{
      method:"DELETE",
      headers:{
        "Authorization":"Bearer " + localStorage.getItem("token")
      }
    });

    const data = await res.json();

    alert(data.message || "Product deleted");

    loadSellerProducts();

  }catch(err){

    console.error(err);
    alert("Delete failed");

  }

};


/* ==============================
   EDIT PRODUCT
============================== */

window.editProduct = async function(id){

  const newName = prompt("New flower name");
  const newPrice = prompt("New price");

  if(!newName || !newPrice) return;

  try{

    const res = await fetch(API + "/seller/product/" + id,{
      method:"PUT",
      headers:{
        "Content-Type":"application/json",
        "Authorization":"Bearer " + localStorage.getItem("token")
      },
      body: JSON.stringify({
        name:newName,
        price:newPrice
      })
    });

    const data = await res.json();

    alert(data.message || "Product updated");

    loadSellerProducts();

  }catch(err){

    console.error(err);
    alert("Update failed");

  }

};