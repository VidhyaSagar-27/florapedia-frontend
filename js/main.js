const app = {};
const state = {
  user: null
};

// ======================
// PAGE NAVIGATION
// ======================
app.navigate = function(page){

  const pages = document.querySelectorAll(".page");

  pages.forEach(p=>{
    p.style.display = "none";
  });

  const target = document.getElementById("page-" + page);

  if(target){
    target.style.display = "block";
  }

};

// ======================
// HOME REDIRECT
// ======================
function goHome(){

  if(state.user && state.user.role === "seller"){
    app.navigate("seller");
  }else{
    app.navigate("home");
  }

}

// ======================
// INITIAL LOAD
// ======================
document.addEventListener("DOMContentLoaded", function(){

  updateCartCount();

  if(typeof renderCustomerProducts === "function"){
    renderCustomerProducts();
  }

  if(typeof renderCart === "function"){
    renderCart();
  }

});
function goHome(){

  if(state.user && state.user.role === "seller"){
    app.navigate("seller");
  }else{
    app.navigate("home");
  }

}