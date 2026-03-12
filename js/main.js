/* =========================================
   FLORAPEDIA MAIN ENTRY
========================================= */

import { app } from "./app.js";
import { loadState } from "./state/state.js";


/* =========================================
   APPLICATION BOOTSTRAP
========================================= */

document.addEventListener("DOMContentLoaded", async () => {

  try{

    /* Load saved local state */
    loadState();

    /* Initialize main app */
    await app.init();

  }
  catch(err){

    console.error("App initialization failed",err);

  }

});


/* =========================================
   GLOBAL HOME FUNCTION
========================================= */

window.goHome = function(){

  if(app && app.navigate){

    app.navigate("home");

  }

};