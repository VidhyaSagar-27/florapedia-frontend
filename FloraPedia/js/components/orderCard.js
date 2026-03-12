/* ======================================================
   FLORAPEDIA ORDER CARD COMPONENT
   UI for displaying orders in account dashboard
====================================================== */

import { formatCurrency } from "../utils/helpers.js";


export function renderOrderCard(order){

  const statusClass =
    order.status?.toLowerCase() || "pending";

  const delivery =
    order.deliveryStatus || "Processing";



  return `

  <div class="order-card" data-id="${order.id}">

    <div class="order-header">

      <div class="order-info">

        <div class="order-id">
          Order #${order.id}
        </div>

        <div class="order-date">
          ${order.createdAt || order.date}
        </div>

      </div>

      <span class="order-status ${statusClass}">
        ${order.status || "Pending"}
      </span>

    </div>



    <div class="order-body">

      <div class="order-items">

        ${order.items.length}
        item${order.items.length > 1 ? "s" : ""}

      </div>

      <div class="order-delivery">

        🚚 ${delivery}

      </div>

      <div class="order-total">

        ${formatCurrency(order.totals?.total || order.total)}

      </div>

    </div>



    <div class="order-actions">

      <button
        class="btn-secondary"
        onclick="viewOrder('${order.id}')"
      >
        View Details
      </button>

      <button
        class="btn-primary"
        onclick="trackOrder('${order.id}')"
      >
        Track Order
      </button>

    </div>

  </div>

  `;
}