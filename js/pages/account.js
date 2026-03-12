/* =========================================
   ACCOUNT PAGE CONTROLLER
========================================= */

import { state } from "../state.js";
import { renderOrderCard } from "../components/orderCard.js";


export function renderAccount(){

  const container =
    document.getElementById("accountContent");

  if(!container) return;


  /* ===============================
     NOT LOGGED IN
  =============================== */

  if(!state.user){

    container.innerHTML = `
      <div class="account-empty">
        <h2>Please login</h2>
        <p>You need an account to view orders</p>

        <button class="btn-primary"
          onclick="app.openAuth()">
          Login
        </button>
      </div>
    `;

    return;

  }


  /* ===============================
     USER DATA
  =============================== */

  const user = state.user;
  const orders = state.orders || [];
  const addresses = state.addresses || [];

  const avatar =
    user.name
      ? user.name.charAt(0).toUpperCase()
      : "U";


  /* ===============================
     RENDER
  =============================== */

  container.innerHTML = `

  <div class="account-layout">

    <aside class="account-sidebar">

      <div class="account-user">

        <div class="avatar">
          ${avatar}
        </div>

        <div class="user-info">
          <div class="user-name">
            ${user.name || "User"}
          </div>

          <div class="user-email">
            ${user.email || ""}
          </div>
        </div>

      </div>


      <div class="account-menu">

        <div class="menu-item active"
          onclick="account.switchTab('profile',this)">
          👤 Profile
        </div>

        <div class="menu-item"
          onclick="account.switchTab('orders',this)">
          📦 Orders
        </div>

        <div class="menu-item"
          onclick="account.switchTab('addresses',this)">
          📍 Addresses
        </div>

        <div class="menu-item"
          onclick="account.switchTab('support',this)">
          💬 Support
        </div>

        ${
          user.role === "seller"
          ? `
          <div class="menu-item"
            onclick="app.navigate('seller')">
            🏪 Seller Dashboard
          </div>
          `
          : ""
        }

        <div class="menu-item logout"
          onclick="auth.logout()">
          🚪 Logout
        </div>

      </div>

    </aside>


    <main class="account-main">

      <section id="tab-profile"
        class="account-tab show">

        ${renderProfile(user)}

      </section>


      <section id="tab-orders"
        class="account-tab">

        ${renderOrders(orders)}

      </section>


      <section id="tab-addresses"
        class="account-tab">

        ${renderAddresses(addresses)}

      </section>


      <section id="tab-support"
        class="account-tab">

        ${renderSupport()}

      </section>

    </main>

  </div>

  `;

}



/* =========================================
   PROFILE
========================================= */

function renderProfile(user){

  return `

  <div class="profile-card">

    <h2>Profile</h2>

    <div class="profile-row">

      <label>Name</label>

      <div>${user.name || "-"}</div>

    </div>

    <div class="profile-row">

      <label>Email</label>

      <div>${user.email || "-"}</div>

    </div>

    <div class="profile-row">

      <label>Phone</label>

      <div>${user.phone || "-"}</div>

    </div>

    <button
      class="btn-secondary"
      onclick="account.editProfile()">

      Edit Profile

    </button>

  </div>

  `;

}



/* =========================================
   ORDERS
========================================= */

function renderOrders(orders){

  if(orders.length === 0){

    return `
      <div class="empty-state">

        <h3>No Orders Yet</h3>

        <button class="btn-primary"
          onclick="app.navigate('home')">

          Start Shopping

        </button>

      </div>
    `;

  }


  return `

  <div class="orders-list">

    ${
      orders.map(o => OrderCard(o)).join("")
    }

  </div>

  `;

}



/* =========================================
   ADDRESSES
========================================= */

function renderAddresses(addresses){

  if(addresses.length === 0){

    return `
      <div class="empty-state">

        <p>No saved addresses</p>

        <button class="btn-primary"
          onclick="app.navigate('checkout')">

          Add Address

        </button>

      </div>
    `;

  }


  return `

  <div class="address-list">

    ${
      addresses.map(addr => `

        <div class="address-card">

          <div class="address-label">
            ${addr.label || "Home"}
          </div>

          <div class="address-text">
            ${addr.text}
          </div>

        </div>

      `).join("")
    }

  </div>

  `;

}



/* =========================================
   SUPPORT
========================================= */

function renderSupport(){

  return `

  <div class="support-grid">

    <div class="support-card">

      <h4>📞 Call</h4>

      <p>1800-FLORAPEDIA</p>

    </div>

    <div class="support-card">

      <h4>💬 Chat</h4>

      <p>Live chat support</p>

    </div>

    <div class="support-card">

      <h4>📧 Email</h4>

      <p>support@florapedia.com</p>

    </div>

    <div class="support-card">

      <h4>❓ FAQ</h4>

      <p>Common questions</p>

    </div>

  </div>

  `;

}



/* =========================================
   ACCOUNT ACTIONS
========================================= */

export const account = {

  switchTab(tab,el){

    document
      .querySelectorAll(".menu-item")
      .forEach(i => i.classList.remove("active"));

    el.classList.add("active");

    document
      .querySelectorAll(".account-tab")
      .forEach(t => t.classList.remove("show"));

    document
      .getElementById("tab-"+tab)
      .classList.add("show");

  },



  editProfile(){

    alert("Profile editing coming soon");

  }

};