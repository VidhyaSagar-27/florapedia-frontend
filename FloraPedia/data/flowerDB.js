/* =========================================
   FloraPedia Marketplace Demo Product DB
   Used only as fallback if backend fails
========================================= */

export const PRODUCT_DB = [

  {
    id: "prod-101",
    name: "Fresh Red Roses Bouquet",
    category: "flowers",
    subCategory: "bouquets",
    price: 799,
    rating: 4.7,
    reviews: 124,
    sellerId: "seller-demo",
    sellerName: "City Flower Shop",
    image: "assets/images/rose-red.png",
    stock: 40,
    tags: ["romantic","gift"],
    description: "Fresh farm roses bouquet perfect for gifts."
  },

  {
    id: "prod-102",
    name: "Organic Bananas",
    category: "fruits",
    subCategory: "fresh fruits",
    price: 60,
    rating: 4.5,
    reviews: 89,
    sellerId: "seller-demo",
    sellerName: "Green Farm Market",
    image: "assets/images/banana.png",
    stock: 120,
    tags: ["organic","healthy"],
    description: "Naturally grown organic bananas."
  },

  {
    id: "prod-103",
    name: "Fresh Tomatoes",
    category: "vegetables",
    subCategory: "farm vegetables",
    price: 40,
    rating: 4.6,
    reviews: 63,
    sellerId: "seller-demo",
    sellerName: "Local Veg Market",
    image: "assets/images/tomato.png",
    stock: 150,
    tags: ["farm","fresh"],
    description: "Farm fresh red tomatoes."
  },

  {
    id: "prod-104",
    name: "Whole Wheat Bread",
    category: "bakery",
    subCategory: "bread",
    price: 50,
    rating: 4.4,
    reviews: 75,
    sellerId: "seller-demo",
    sellerName: "City Bakery",
    image: "assets/images/bread.png",
    stock: 70,
    tags: ["fresh","baked"],
    description: "Fresh baked whole wheat bread."
  },

  {
    id: "prod-105",
    name: "Premium Basmati Rice",
    category: "grocery",
    subCategory: "grains",
    price: 1200,
    rating: 4.8,
    reviews: 210,
    sellerId: "seller-demo",
    sellerName: "Daily Grocery Store",
    image: "assets/images/rice.png",
    stock: 90,
    tags: ["premium","grain"],
    description: "High quality basmati rice."
  }

];


/* =========================================
   PRODUCT UTILITY FUNCTIONS
========================================= */

export function getAllProducts(){
  return PRODUCT_DB;
}


export function getProductById(id){
  return PRODUCT_DB.find(p => p.id === id);
}


export function getProductsByCategory(category){
  return PRODUCT_DB.filter(p => p.category === category);
}


export function searchProducts(query){

  const q = query.toLowerCase();

  return PRODUCT_DB.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q)
  );

}


export function getCategories(){

  return [
    ...new Set(PRODUCT_DB.map(p => p.category))
  ];

}