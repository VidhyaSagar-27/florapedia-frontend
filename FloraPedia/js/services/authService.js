/* ======================================================
   FLORAPEDIA AUTH SERVICE
   Handles authentication and user sessions
====================================================== */

import { state } from "../state.js";
import { authAPI } from "../apiClient.js";


class AuthService {

  constructor(){
    this.loadSession();
  }



  /* =========================================
     LOAD USER SESSION
  ========================================= */

  loadSession(){

    try{

      const user = JSON.parse(localStorage.getItem("user"));
      const token = localStorage.getItem("token");

      if(user && token){
        state.user = user;
        state.token = token;
      }

    }catch{
      state.user = null;
      state.token = null;
    }

  }



  /* =========================================
     SAVE SESSION
  ========================================= */

  saveSession(user, token){

    state.user = user;
    state.token = token;

    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);

  }



  /* =========================================
     LOGIN
  ========================================= */

  async login(credentials){

    try{

      const res = await authAPI.login(credentials);

      const { user, token } = res;

      this.saveSession(user, token);

      return {
        success:true,
        user
      };

    }catch(err){

      return {
        success:false,
        message: err.message
      };

    }

  }



  /* =========================================
     REGISTER
  ========================================= */

  async register(data){

    try{

      const res = await authAPI.register(data);

      const { user, token } = res;

      this.saveSession(user, token);

      return {
        success:true,
        user
      };

    }catch(err){

      return {
        success:false,
        message: err.message
      };

    }

  }



  /* =========================================
     LOGOUT
  ========================================= */

  logout(){

    state.user = null;
    state.token = null;

    localStorage.removeItem("user");
    localStorage.removeItem("token");

  }



  /* =========================================
     GET CURRENT USER
  ========================================= */

  getUser(){
    return state.user;
  }



  /* =========================================
     CHECK LOGIN
  ========================================= */

  isLoggedIn(){
    return !!state.user;
  }



  /* =========================================
     ROLE CHECKS
  ========================================= */

  isCustomer(){
    return state.user?.role === "customer";
  }

  isSeller(){
    return state.user?.role === "seller";
  }

  isDelivery(){
    return state.user?.role === "delivery";
  }



  /* =========================================
     LOAD PROFILE FROM SERVER
  ========================================= */

  async refreshProfile(){

    try{

      const profile = await authAPI.getProfile();

      state.user = profile;

      localStorage.setItem(
        "user",
        JSON.stringify(profile)
      );

      return profile;

    }catch(err){

      console.error("PROFILE LOAD ERROR:", err);

    }

  }



  /* =========================================
     UPDATE PROFILE
  ========================================= */

  updateProfile(data){

    if(!state.user) return;

    state.user = {
      ...state.user,
      ...data
    };

    localStorage.setItem(
      "user",
      JSON.stringify(state.user)
    );

  }

}


export const authService = new AuthService();