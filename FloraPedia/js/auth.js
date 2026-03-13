const auth = {};
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
    state.user = data.user || data;
    localStorage.setItem("user", JSON.stringify(state.user));

    if(response.ok && data.token){

      // Save auth data
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("currentUser", JSON.stringify(data.user));

      // Update app state
      state.user = data.user || data;

      // Refresh UI
      if(app && app.updateUI){
        app.updateUI();
      }

      // Close modal
      if(auth.closeModal){
        auth.closeModal();
      }

      // Redirect user
      const role = data.role ? data.role.toLowerCase() : "buyer";

      if(role === "seller"){

        console.log("Redirecting to seller dashboard");

        app.toast("Seller login successful");

        setTimeout(()=>{
          if(app.navigate){
            app.navigate("seller");
          }
        },200);

      }else{

        console.log("Redirecting to home page");

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
auth.logout = function(){

  // Clear storage
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("currentUser");

  // Clear state
  if(typeof state !== "undefined"){
    state.user = null;
  }

  // Reset UI name
  const nameEl = document.getElementById("headerUserName");
  if(nameEl){
    nameEl.innerText = "Login";
  }

  // Update UI
  if(app && app.updateUI){
    app.updateUI();
  }

  // Redirect home
  if(app && app.navigate){
    app.navigate("home");
  }

  app.toast("Logged out");

};
window.auth = auth;
