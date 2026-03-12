/* ======================================================
   FLORAPEDIA HELPER UTILITIES
   Core shared functions across entire application
====================================================== */


/* =========================================
   ID GENERATOR
========================================= */

export function generateId(prefix = "ID") {

  const rand = Math.random().toString(36).substring(2,6);

  return `${prefix}-${Date.now().toString(36)}-${rand}`;

}



/* =========================================
   CURRENCY FORMATTER
========================================= */

export function formatCurrency(amount = 0){

  return new Intl.NumberFormat("en-IN",{
    style:"currency",
    currency:"INR",
    maximumFractionDigits:0
  }).format(amount);

}



/* =========================================
   NUMBER FORMAT
========================================= */

export function formatNumber(num = 0){

  return new Intl.NumberFormat("en-IN").format(num);

}



/* =========================================
   DATE FORMATTER
========================================= */

export function formatDate(date){

  if(!date) return "";

  return new Date(date).toLocaleDateString("en-IN",{
    year:"numeric",
    month:"short",
    day:"numeric"
  });

}



/* =========================================
   DEBOUNCE (SEARCH OPTIMIZATION)
========================================= */

export function debounce(fn, delay = 300){

  let timer;

  return (...args)=>{

    clearTimeout(timer);

    timer = setTimeout(()=>{
      fn(...args);
    },delay);

  };

}



/* =========================================
   SLUG GENERATOR
========================================= */

export function slugify(text = ""){

  return text
    .toLowerCase()
    .replace(/[^\w ]+/g,"")
    .replace(/ +/g,"-");

}



/* =========================================
   PRODUCT SEARCH
========================================= */

export function searchProducts(products = [], query = ""){

  if(!query) return products;

  const q = query.toLowerCase();

  return products.filter(p=>{

    const name = p.name?.toLowerCase() || "";
    const category = p.category?.toLowerCase() || "";
    const desc = p.description?.toLowerCase() || "";
    const tags = p.tags?.join(" ").toLowerCase() || "";

    return (
      name.includes(q) ||
      category.includes(q) ||
      desc.includes(q) ||
      tags.includes(q)
    );

  });

}



/* =========================================
   FILTER PRODUCTS
========================================= */

export function filterProducts(products = [], filters = {}){

  let result = [...products];

  if(filters.category?.length){

    result = result.filter(p =>
      filters.category.includes(p.category)
    );

  }

  if(filters.price){

    const [min,max] = filters.price;

    result = result.filter(p =>
      p.price >= min && p.price <= max
    );

  }

  if(filters.rating){

    result = result.filter(p =>
      (p.rating || 0) >= filters.rating
    );

  }

  if(filters.stock === "available"){

    result = result.filter(p =>
      (p.stock || 0) > 0
    );

  }

  return result;

}



/* =========================================
   SORT PRODUCTS
========================================= */

export function sortProducts(products = [], type = "relevance"){

  const list = [...products];

  switch(type){

    case "price-low":
      return list.sort((a,b)=>a.price - b.price);

    case "price-high":
      return list.sort((a,b)=>b.price - a.price);

    case "rating":
      return list.sort((a,b)=>(b.rating||0)-(a.rating||0));

    case "newest":
      return list.sort((a,b)=>
        new Date(b.createdAt) - new Date(a.createdAt)
      );

    case "popular":
      return list.sort((a,b)=>
        (b.reviews||0)-(a.reviews||0)
      );

    default:
      return list;

  }

}



/* =========================================
   CART TOTAL CALCULATOR
========================================= */

export function calculateCart(cart = [], products = []){

  let subtotal = 0;
  let items = 0;

  cart.forEach(item=>{

    const product = products.find(
      p => p.id === item.productId || p._id === item.productId
    );

    if(!product) return;

    const price = Number(product.price) || 0;
    const qty = Number(item.qty) || 0;

    subtotal += price * qty;
    items += qty;

  });

  const delivery = subtotal > 499 ? 0 : 99;

  const tax = Math.round(subtotal * 0.05);

  const total = subtotal + delivery + tax;

  return {
    items,
    subtotal,
    delivery,
    tax,
    total
  };

}



/* =========================================
   VALIDATION UTILITIES
========================================= */

export function validateEmail(email){

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

}

export function validatePhone(phone){

  return /^[6-9]\d{9}$/.test(phone);

}



/* =========================================
   IMAGE FALLBACK
========================================= */

export function getImage(url){

  if(!url || url.trim()===""){
    return "assets/images/placeholder.png";
  }

  return url;

}



/* =========================================
   RANDOM PICKER
========================================= */

export function randomItems(list = [], count = 5){

  const shuffled = [...list]
    .sort(()=>0.5 - Math.random());

  return shuffled.slice(0,count);

}



/* =========================================
   DELIVERY ETA
========================================= */

export function deliveryETA(type="standard"){

  if(type==="express") return "45 minutes";

  if(type==="same-day") return "Today";

  return "2-4 hours";

}



/* =========================================
   SAFE NUMBER
========================================= */

export function safeNumber(value, fallback = 0){

  const n = Number(value);

  return isNaN(n) ? fallback : n;

}



/* =========================================
   STOCK CHECK
========================================= */

export function isInStock(product){

  return (product?.stock || 0) > 0;

}