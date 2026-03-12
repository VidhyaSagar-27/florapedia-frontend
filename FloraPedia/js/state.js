/* =====================================================
   FLORAPEDIA GLOBAL STATE ENGINE
   Central state manager for entire application
===================================================== */

const STORAGE_VERSION = "v1";


export const state = {

  version: STORAGE_VERSION,

  /* ======================================
     AUTH
  ====================================== */

  user: load("user", null),
  role: load("role", "guest"),
  token: load("token", null),


  /* ======================================
     PRODUCTS
  ====================================== */

  products: [],
  productMap: {},

  featuredProducts: [],
  categories: [],

  sellerProducts: load("sellerProducts", []),


  /* ======================================
     CART
  ====================================== */

  cart: load("cart", []),

  cartSummary: {
    items: 0,
    subtotal: 0,
    delivery: 0,
    tax: 0,
    total: 0
  },


  /* ======================================
     WISHLIST
  ====================================== */

  wishlist: load("wishlist", []),


  /* ======================================
     ORDERS
  ====================================== */

  orders: load("orders", []),

  currentOrder: null,

  orderTracking: {
    orderId: null,
    status: null,
    timeline: [],
    deliveryPartner: null
  },


  /* ======================================
     ADDRESS
  ====================================== */

  addresses: load("addresses", []),

  selectedAddressIdx: load("selectedAddressIdx", null),


  /* ======================================
     CHECKOUT
  ====================================== */

  checkout: {

    deliveryType: load("deliveryType","standard"),
    paymentType: load("paymentType","cod"),

    coupon: null,
    notes: ""

  },


  /* ======================================
     DELIVERY PARTNER
  ====================================== */

  delivery: {

    assignedOrders: [],
    activeDelivery: null,
    history: []

  },


  /* ======================================
     FILTERS
  ====================================== */

  filters: {

    category: [],
    subCategory: [],
    seller: [],

    price: null,
    rating: null,

    search: "",

    availability: true

  },


  /* ======================================
     SORT
  ====================================== */

  sort: "relevance",


  /* ======================================
     UI STATE
  ====================================== */

  ui: {

    loading: false,

    page: "home",

    modals: {

      auth:false,
      cart:false,
      search:false

    },

    notifications: [],

    lastToast:null

  }

};



/* =====================================================
   STORAGE LOAD
===================================================== */

function load(key, fallback){

  try{

    const raw = localStorage.getItem(`${STORAGE_VERSION}_${key}`);

    if(!raw) return fallback;

    return JSON.parse(raw);

  }
  catch(err){

    console.warn("State load error:", key);

    return fallback;

  }

}



/* =====================================================
   STORAGE SAVE
===================================================== */

function save(key,value){

  try{

    localStorage.setItem(
      `${STORAGE_VERSION}_${key}`,
      JSON.stringify(value)
    );

  }
  catch(err){

    console.warn("State save error:", key);

  }

}



/* =====================================================
   PERSIST STATE
===================================================== */

export function persistState(){

  save("user", state.user);
  save("role", state.role);
  save("token", state.token);

  save("cart", state.cart);
  save("wishlist", state.wishlist);

  save("orders", state.orders);

  save("addresses", state.addresses);
  save("selectedAddressIdx", state.selectedAddressIdx);

  save("deliveryType", state.checkout.deliveryType);
  save("paymentType", state.checkout.paymentType);

  save("sellerProducts", state.sellerProducts);

}



/* =====================================================
   RESET USER STATE
===================================================== */

export function resetUserState(){

  state.user = null;
  state.role = "guest";
  state.token = null;

  state.cart = [];
  state.wishlist = [];

  state.orders = [];

  persistState();

}



/* =====================================================
   PRODUCT MAP BUILDER
===================================================== */

export function buildProductMap(){

  const map = {};

  state.products.forEach(p=>{

    map[p.id || p._id] = p;

  });

  state.productMap = map;

}



/* =====================================================
   GET PRODUCT FAST
===================================================== */

export function getProduct(productId){

  return state.productMap[productId];

}



/* =====================================================
   CART RECALCULATION
===================================================== */

export function recalcCart(){

  let items = 0;
  let subtotal = 0;

  state.cart.forEach(item=>{

    const product =
      state.productMap[item.productId] ||
      state.products.find(
        p => p.id === item.productId || p._id === item.productId
      );

    if(!product) return;

    items += item.qty;

    subtotal += product.price * item.qty;

  });


  const delivery =
    state.checkout.deliveryType === "express"
      ? 299
      : subtotal > 499
        ? 0
        : 99;

  const tax =
    Math.round(subtotal * 0.05);

  const total =
    subtotal + delivery + tax;


  state.cartSummary = {

    items,
    subtotal,
    delivery,
    tax,
    total

  };

}



/* =====================================================
   WISHLIST HELPERS
===================================================== */

export function toggleWishlist(productId){

  const index = state.wishlist.indexOf(productId);

  if(index > -1){

    state.wishlist.splice(index,1);

  }
  else{

    state.wishlist.push(productId);

  }

  save("wishlist", state.wishlist);

}



/* =====================================================
   UI HELPERS
===================================================== */

export function setLoading(value){

  state.ui.loading = value;

}



export function setPage(page){

  state.ui.page = page;

}



/* =====================================================
   NOTIFICATION SYSTEM
===================================================== */

export function pushNotification(message){

  state.ui.notifications.push({

    id: Date.now(),
    message

  });

}



/* =====================================================
   INIT STATE
===================================================== */

export function initState(){

  recalcCart();

}