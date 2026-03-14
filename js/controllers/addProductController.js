import { productService } from "../services/productService.js";

window.submitProduct = async function(){

  const product = {

    name: document.getElementById("name").value,
    price: Number(document.getElementById("price").value),
    category: document.getElementById("category").value,
    stock: Number(document.getElementById("stock").value),
    description: document.getElementById("description").value

  };

  try{

    await productService.createProduct(product);

    alert("Product added successfully");

    location.reload();

  }catch(err){

    console.error(err);

    alert("Product creation failed");

  }

};