/* =========================================
   FLORAPEDIA MAIN ENTRY
========================================= */

import { auth } from "./auth.js";
import { app } from "./app.js";
import { loadState } from "./state.js";

window.auth = auth;
window.app = app;


/* =========================================
   APPLICATION BOOTSTRAP
========================================= */

document.addEventListener("DOMContentLoaded", async () => {

  try {

    console.log("FloraPedia starting...");

    /* Load saved local state */
    loadState();

    /* Initialize main app */
    await app.init();

    console.log("FloraPedia initialized");

  } catch (err) {

    console.error("App initialization failed", err);

  }

});


/* =========================================
   GLOBAL HOME FUNCTION
========================================= */

window.goHome = function () {

  if (app && app.navigate) {
    app.navigate("home");
  }

};


window.saveStore = function(){

  const name = document.getElementById("storeName")?.value;
  const location = document.getElementById("storeLocation")?.value;
  const phone = document.getElementById("storePhone")?.value;

  console.log("Store saved:", name, location, phone);

  if(window.app){
    app.toast("Store saved successfully");
  }

};


window.addProduct = function(){

  const name = document.getElementById("productName")?.value;
  const price = document.getElementById("productPrice")?.value;
  const image = document.getElementById("productImage")?.value;

  console.log("Product:", name, price, image);

  if(window.app){
    app.toast("Product added");
  }

};