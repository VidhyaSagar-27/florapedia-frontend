/* =========================================
   FLORAPEDIA MAIN ENTRY
========================================= */

import { app } from "./app.js";
import { loadState } from "./state.js";


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