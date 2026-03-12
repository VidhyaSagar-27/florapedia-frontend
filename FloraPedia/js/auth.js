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
var auth = {

  openModal(){
    document.getElementById('authModal').classList.add('show');
  },

  closeModal(){
    document.getElementById('authModal').classList.remove('show');
  },

  switchTab(tab){

    document.querySelectorAll('.auth-tab-btn')
      .forEach(btn => btn.classList.remove('active'));

    event.target.classList.add('active');

    document.querySelectorAll('.auth-form')
      .forEach(form => form.classList.remove('show'));

    document.getElementById(tab + 'Form')
      .classList.add('show');
  },

  switchForm(form){

    document.querySelectorAll('.auth-form')
      .forEach(f => f.classList.remove('show'));

    document.getElementById(
      form === 'phone' || form === 'phone-signup'
      ? 'phoneForm'
      : form + 'Form'
    ).classList.add('show');
  },

  doLogin(){

     emailOrPhone =
      document.getElementById('loginEmail').value.trim();

    const password =
      document.getElementById('loginPassword').value.trim();

    if(!emailOrPhone || !password){
      app.toast('Please enter email/phone and password');
      return;
    }

    const user = {
      name:'Flower Lover',
      email: emailOrPhone.includes('@') ? emailOrPhone : null,
      phone: !emailOrPhone.includes('@') ? emailOrPhone : null
    };

    state.user = user;

    localStorage.setItem(
      "currentUser",
      JSON.stringify(user)
    );

    app.updateUI();

    this.closeModal();

    app.toast('✅ Logged in successfully');
  },

  doSignup(){

    const name =
      document.getElementById('signupName').value.trim();

    const email =
      document.getElementById('signupEmail').value.trim();

    const password =
      document.getElementById('signupPassword').value.trim();

    if(!name || !email || !password){
      app.toast('Please fill all fields');
      return;
    }

    const user = {
      name,
      email,
      phone:null
    };

    state.user = user;

    localStorage.setItem(
      "currentUser",
      JSON.stringify(user)
    );

    app.updateUI();

    this.closeModal();

    app.toast('✅ Account created successfully');
  },

  sendOTP(){

    const phone =
      document.getElementById('phoneNumber').value.trim();

    if(!phone || phone.length !== 10){
      app.toast('Please enter valid 10-digit number');
      return;
    }

    document.getElementById('otpSection')
      .style.display = 'block';

    app.toast('📱 OTP sent to +91 ' + phone);
  },

  handleOTPInput(el,idx){

    if(el.value.length === 1 && idx < 5){

      document
      .querySelectorAll('.otp-input')[idx + 1]
      .focus();
    }
  },

  verifyOTP(){

    const otp =
      Array.from(document.querySelectorAll('.otp-input'))
      .map(el => el.value)
      .join('');

    if(otp.length !== 6){
      app.toast('Please enter 6-digit OTP');
      return;
    }

    const phone =
      document.getElementById('phoneNumber').value;

    const user = {

      name:'Flower Enthusiast',
      email:null,
      phone:phone

    };

    state.user = user;

    localStorage.setItem(
      "currentUser",
      JSON.stringify(user)
    );

    app.updateUI();

    this.closeModal();

    app.toast('✅ Verified successfully');
  },

  logout(){

    state.user = null;

    state.cart = [];

    localStorage.removeItem("currentUser");

    app.updateUI();

    saveState();

    app.navigate('home');

    app.toast('Logged out');
  }

};