/* ======================================================
FLORAPEDIA CART SERVICE
Advanced marketplace cart engine
====================================================== */

import { eventBus } from "../utilis/eventBus.js";
import { state } from "../state.js";
import { productService } from "./productService.js";
import { calculateCart } from "../utilis/helpers.js";

class CartService {

constructor(){
this.loadCart();
}

/* =========================================
LOAD CART
========================================= */

loadCart(){
try{
  const saved = JSON.parse(localStorage.getItem("cart"));
  state.cart = saved || [];
}
catch{
  state.cart = [];
}

}

/* =========================================
SAVE CART
========================================= */

saveCart(){
localStorage.setItem("cart", JSON.stringify(state.cart));
}

/* =========================================
GET CART ITEMS
========================================= */

getItems(){
return state.cart;
}

/* =========================================
ADD PRODUCT TO CART
========================================= */

add(productId, qty = 1){

```
const product = productService.getById(productId);

if(!product) return;

const existing = state.cart.find(
  i => i.productId === productId
);

if(existing){
  existing.qty += qty;
}
else{
  state.cart.push({
    productId,
    qty
  });
}

this.saveCart();

// notify entire app
eventBus.emit("cart:updated");
```

}

/* =========================================
REMOVE PRODUCT
========================================= */

remove(productId){

```
state.cart = state.cart.filter(
  item => item.productId !== productId
);

this.saveCart();

eventBus.emit("cart:updated");
```

}

/* =========================================
UPDATE QUANTITY
========================================= */

updateQty(productId, qty){

```
const item = state.cart.find(
  i => i.productId === productId
);

if(!item) return;

if(qty <= 0){
  this.remove(productId);
  return;
}

item.qty = qty;

this.saveCart();

eventBus.emit("cart:updated");
```

}

/* =========================================
CLEAR CART
========================================= */

clear(){

```
state.cart = [];

this.saveCart();

eventBus.emit("cart:updated");
```

}

/* =========================================
GET CART PRODUCTS (FULL DATA)
========================================= */

getDetailedItems(){

```
return state.cart.map(item => {

  const product = productService.getById(item.productId);

  if(!product) return null;

  return {
    ...product,
    qty: item.qty,
    total: product.price * item.qty
  };

}).filter(Boolean);
```

}

/* =========================================
CART TOTALS
========================================= */

getTotals(){

```
const products = productService.getAll();

return calculateCart(state.cart, products);
```

}

/* =========================================
ITEM COUNT
========================================= */

getItemCount(){

```
return state.cart.reduce(
  (sum,item)=> sum + item.qty,
  0
);
```

}

/* =========================================
CHECK IF PRODUCT IN CART
========================================= */

has(productId){

```
return state.cart.some(
  item => item.productId === productId
);
```

}

/* =========================================
APPLY COUPON
========================================= */

applyCoupon(code){

```
const totals = this.getTotals();

let discount = 0;

const coupons = {
  SAVE50: 50,
  SAVE100: 100,
  FLORA10: totals.subtotal * 0.10
};

if(coupons[code]){

  discount = coupons[code];

  return {
    valid:true,
    discount
  };

}

return {
  valid:false,
  discount:0
};
```

}

/* =========================================
PREPARE ORDER DATA
========================================= */

prepareOrder(){

```
const items = this.getDetailedItems();

const totals = this.getTotals();

return {

  items: items.map(p=>({

    productId: p.id || p._id,
    name: p.name,
    price: p.price,
    qty: p.qty

  })),

  totals

};
```

}

}

export const cartService = new CartService();
