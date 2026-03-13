
/* =========================================
   FLORAPEDIA AUTH MODULE
========================================= */
const API = "https://florapedia-backend.onrender.com/api";

export const auth = {}

/* =========================================
   OPEN LOGIN / SIGNUP MODAL
========================================= */

auth.openModal = function(){

  const modal = document.getElementById("authModal");

  if(modal){
    modal.style.display = "flex";
  }

};

/* =========================================
   CLOSE AUTH MODAL
========================================= */

auth.closeModal = function(){

  const modal = document.getElementById("authModal");

  if(modal){
    modal.style.display = "none";
  }

};

/* =========================================
   SWITCH LOGIN / SIGNUP TAB
========================================= */

auth.switchTab = function(tab){

  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");

  const buttons = document.querySelectorAll(".auth-tab-btn");

  buttons.forEach(btn => btn.classList.remove("active"));

  if(tab === "login"){

    loginForm?.classList.add("show");
    signupForm?.classList.remove("show");
    buttons[0]?.classList.add("active");

  }else{

    signupForm?.classList.add("show");
    loginForm?.classList.remove("show");
    buttons[1]?.classList.add("active");

  }

};

/* =========================================
   LOGIN FUNCTION
========================================= */

auth.doLogin = async function(){

  const email = document.getElementById("loginEmail")?.value.trim();
  const password = document.getElementById("loginPassword")?.value.trim();

  if(!email || !password){
    app.toast("Please enter email and password");
    return;
  }

  try{

    const response = await fetch(API + "/auth/login",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body: JSON.stringify({
        email: email,
        password: password
      })
    });

    const data = await response.json();

    console.log("LOGIN RESPONSE:", data);

    if(response.ok && data.token){

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("currentUser", JSON.stringify(data.user));

      state.user = data.user || data;

      if(app && app.updateUI){
        app.updateUI();
      }

      auth.closeModal();

      const role = data.role ? data.role.toLowerCase() : "buyer";

      if(role === "seller"){

        app.toast("Seller login successful");

        setTimeout(()=>{
          if(app.navigate){
            app.navigate("seller");
          }
        },200);

      }else{

        app.toast("Login successful");

        setTimeout(()=>{
          if(app.navigate){
            app.navigate("home");
          }
        },200);

      }

    }else{

      app.toast(data.message || "Invalid email or password");

    }

  }catch(error){

    console.error("LOGIN ERROR:", error);
    app.toast("Server connection error");

  }

};

/* =========================================
   SIGNUP FUNCTION
========================================= */

auth.doSignup = async function(){

  const name = document.getElementById("signupName")?.value.trim();
  const email = document.getElementById("signupEmail")?.value.trim();
  const password = document.getElementById("signupPassword")?.value.trim();
  const role = document.getElementById("signupRole")?.value || "buyer";

  if(!name || !email || !password){

    app.toast("Please fill all fields");
    return;

  }

  try{

    const response = await fetch(API + "/auth/signup",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body: JSON.stringify({
        name,
        email,
        password,
        role
      })
    });

    const data = await response.json();

    if(response.ok){

      app.toast("Account created successfully");
      auth.switchTab("login");

    }else{

      app.toast(data.message || "Signup failed");

    }

  }catch(err){

    console.error(err);
    app.toast("Server error");

  }

};

/* =========================================
   LOGOUT
========================================= */

auth.logout = function(){

  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("currentUser");

  if(typeof state !== "undefined"){
    state.user = null;
  }

  const nameEl = document.getElementById("headerUserName");

  if(nameEl){
    nameEl.innerText = "Login";
  }

  if(app && app.updateUI){
    app.updateUI();
  }

  if(app && app.navigate){
    app.navigate("home");
  }

  app.toast("Logged out");

};