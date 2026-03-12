/* ======================================================
   AUTH CONTROLLER
====================================================== */

import { state } from "../state/state.js";
import * as authService from "../services/authService.js";
import { ROLES } from "../config/config.js";


/* ======================================================
   LOGIN
====================================================== */

export async function login(email, password){

  try{

    const data = await authService.login({
      email,
      password
    });

    state.user = data.user;
    state.token = data.token;

    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("token", data.token);

    updateAuthUI();

    return data.user;

  }catch(err){

    console.error("Login failed", err);

    throw err;

  }

}



/* ======================================================
   REGISTER
====================================================== */

export async function register(userData){

  try{

    const data = await authService.register(userData);

    state.user = data.user;
    state.token = data.token;

    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("token", data.token);

    updateAuthUI();

    return data.user;

  }catch(err){

    console.error("Register failed", err);

    throw err;

  }

}



/* ======================================================
   LOGOUT
====================================================== */

export async function logout(){

  try{

    await authService.logout();

  }catch(err){

    console.warn("Logout API failed");

  }

  state.user = null;
  state.token = null;

  localStorage.removeItem("user");
  localStorage.removeItem("token");

  updateAuthUI();

}



/* ======================================================
   RESTORE SESSION
====================================================== */

export function restoreSession(){

  try{

    const savedUser =
      JSON.parse(localStorage.getItem("user"));

    const savedToken =
      localStorage.getItem("token");

    if(savedUser && savedToken){

      state.user = savedUser;
      state.token = savedToken;

    }

  }catch(err){

    console.warn("Session restore failed");

  }

}



/* ======================================================
   LOAD PROFILE
====================================================== */

export async function loadProfile(){

  try{

    const profile = await authService.getProfile();

    state.user = profile;

    localStorage.setItem("user", JSON.stringify(profile));

    updateAuthUI();

  }catch(err){

    console.error("Profile load failed");

  }

}



/* ======================================================
   ROLE HELPERS
====================================================== */

export function isLoggedIn(){

  return !!state.user;

}


export function isSeller(){

  return state.user?.role === ROLES.SELLER;

}


export function isCustomer(){

  return state.user?.role === ROLES.CUSTOMER;

}


export function isDelivery(){

  return state.user?.role === ROLES.DELIVERY;

}



/* ======================================================
   UPDATE AUTH UI
====================================================== */

export function updateAuthUI(){

  const userNameEl =
    document.getElementById("headerUserName");

  const loginBtn =
    document.getElementById("loginBtn");

  const logoutBtn =
    document.getElementById("logoutBtn");

  const sellerBtn =
    document.getElementById("sellerDashboardBtn");


  if(!state.user){

    if(userNameEl)
      userNameEl.textContent = "Login";

    if(loginBtn)
      loginBtn.style.display = "block";

    if(logoutBtn)
      logoutBtn.style.display = "none";

    if(sellerBtn)
      sellerBtn.style.display = "none";

    return;

  }


  const name =
    state.user.name ||
    state.user.email.split("@")[0];

  if(userNameEl)
    userNameEl.textContent = name;

  if(loginBtn)
    loginBtn.style.display = "none";

  if(logoutBtn)
    logoutBtn.style.display = "block";


  if(state.user.role === ROLES.SELLER){

    if(sellerBtn)
      sellerBtn.style.display = "block";

  }

}