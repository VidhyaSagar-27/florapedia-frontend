// =============================
// UPDATE CART COUNT
// =============================
function updateCartCount(){

  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  let total = 0;

  cart.forEach(item=>{
    total += item.qty;
  });

  const cartCount = document.getElementById("globalCartCount");

  if(cartCount){
    cartCount.innerText = total;
  }

}
function changeQty(productId, change){

  let cart = JSON.parse(localStorage.getItem("cart") || "[]");

  const item = cart.find(i => i.id === productId);

  if(!item) return;

  item.qty += change;

  if(item.qty <= 0){
    cart = cart.filter(i => i.id !== productId);
  }

  localStorage.setItem("cart", JSON.stringify(cart));

  updateCartCount();

  renderCart();
}
function removeFromCart(productId){

  let cart = JSON.parse(localStorage.getItem("cart") || "[]");

  cart = cart.filter(item => item.id !== productId);

  localStorage.setItem("cart", JSON.stringify(cart));

  updateCartCount();

  renderCart();

}