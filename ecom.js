/**
 * ============================================================
 *  ecom.js  –  Full E-Commerce Interactive Functionality
 *  Mini Project | Vanilla JavaScript
 * ============================================================
 */

/* ═══════════════════════════════════════════════════════════
   1. STATE
   ═══════════════════════════════════════════════════════════ */
let cart   = JSON.parse(localStorage.getItem("ecom-cart"))   || [];
let orders = JSON.parse(localStorage.getItem("ecom-orders")) || [];

/* ═══════════════════════════════════════════════════════════
   2. BOOTSTRAP
   ═══════════════════════════════════════════════════════════ */
document.addEventListener("DOMContentLoaded", () => {
  injectStyles();
  injectCartSidebar();
  injectOrderModal();
  injectTrackModal();
  injectToast();
  injectCartBadge();
  bindProductButtons();
  renderCart();
});

/* ═══════════════════════════════════════════════════════════
   3. ALL DYNAMIC CSS
   ═══════════════════════════════════════════════════════════ */
function injectStyles() {
  const style = document.createElement("style");
  style.textContent = `
    #cart-count {
      position:absolute; top:-8px; right:-8px;
      background:#e53935; color:#fff;
      font-size:10px; font-weight:700;
      width:18px; height:18px; border-radius:50%;
      display:none; align-items:center; justify-content:center;
      pointer-events:none; z-index:10;
    }
    .ec-overlay {
      display:none; position:fixed; inset:0;
      background:rgba(0,0,0,0.5); z-index:1998;
    }
    .ec-overlay.open { display:block; }
    #cart-panel {
      position:fixed; top:0; right:-440px;
      width:420px; max-width:100vw; height:100vh;
      background:#fff; z-index:1999;
      display:flex; flex-direction:column;
      transition:right 0.35s ease;
      box-shadow:-4px 0 20px rgba(0,0,0,0.15);
    }
    #cart-panel.open { right:0; }
    #cart-header {
      display:flex; justify-content:space-between; align-items:center;
      padding:18px 24px; background:#088178; color:#fff;
      border-bottom:1px solid #066b63;
    }
    #cart-header h3 { font-size:18px; color:#fff; margin:0; }
    #close-cart {
      background:none; border:none; color:#fff;
      font-size:22px; cursor:pointer; line-height:1;
    }
    #cart-items-wrapper { flex:1; overflow-y:auto; padding:16px 24px; }
    .cart-empty { text-align:center; padding:60px 20px; color:#888; font-size:15px; }
    .cart-empty span { font-size:48px; display:block; margin-bottom:12px; }
    .cart-item {
      display:flex; gap:14px; align-items:center;
      padding:14px 0; border-bottom:1px solid #f0f0f0;
    }
    .cart-item img {
      width:70px; height:70px; object-fit:cover;
      border-radius:10px; border:1px solid #cce7d0; flex-shrink:0;
    }
    .cart-item-info { flex:1; min-width:0; }
    .cart-item-info .item-brand { font-size:11px; color:#888; margin:0; }
    .cart-item-info .item-name {
      font-size:13px; font-weight:600; color:#1a1a1a;
      margin:2px 0 6px; white-space:nowrap;
      overflow:hidden; text-overflow:ellipsis;
    }
    .cart-item-info .item-price { font-size:14px; font-weight:700; color:#088178; margin:0; }
    .qty-controls { display:flex; align-items:center; gap:8px; margin-top:8px; }
    .qty-btn {
      width:26px; height:26px; border-radius:50%;
      border:1px solid #cce7d0; background:#e8f6ea;
      color:#088178; font-size:16px; font-weight:700;
      cursor:pointer; display:flex; align-items:center; justify-content:center;
      transition:0.2s;
    }
    .qty-btn:hover { background:#088178; color:#fff; }
    .qty-value { font-size:14px; font-weight:600; min-width:20px; text-align:center; }
    .remove-btn {
      background:none; border:none; font-size:18px;
      color:#ccc; cursor:pointer; transition:0.2s; padding:4px; flex-shrink:0;
    }
    .remove-btn:hover { color:#e53935; }
    #cart-footer { padding:16px 24px; border-top:1px solid #e0e0e0; background:#fafafa; }
    .cart-totals { margin-bottom:14px; }
    .cart-row {
      display:flex; justify-content:space-between;
      font-size:14px; margin-bottom:6px; color:#444;
    }
    .total-row {
      font-size:16px; font-weight:700; color:#222;
      border-top:1px solid #ddd; padding-top:8px; margin-top:8px;
    }
    #checkout-btn {
      width:100%; padding:13px; background:#088178; color:#fff;
      border:none; border-radius:6px; font-size:14px; font-weight:700;
      cursor:pointer; transition:0.2s; margin-bottom:8px;
    }
    #checkout-btn:hover { background:#066b63; }
    #clear-cart-btn {
      width:100%; padding:10px; background:none; color:#e53935;
      border:1px solid #e53935; border-radius:6px;
      font-size:13px; font-weight:600; cursor:pointer; transition:0.2s;
    }
    #clear-cart-btn:hover { background:#e53935; color:#fff; }
    #order-modal {
      position:fixed; top:50%; left:50%;
      transform:translate(-50%,-50%) scale(0.85);
      width:480px; max-width:95vw; background:#fff; border-radius:16px;
      padding:40px 36px; z-index:2100; text-align:center;
      box-shadow:0 20px 60px rgba(0,0,0,0.25);
      opacity:0; pointer-events:none; transition:opacity 0.3s, transform 0.3s;
    }
    #order-modal.open { opacity:1; pointer-events:all; transform:translate(-50%,-50%) scale(1); }
    .order-check { font-size:64px; line-height:1; margin-bottom:12px; }
    #order-modal h2 { font-size:22px; color:#088178; margin-bottom:8px; }
    #order-modal p { font-size:14px; color:#555; margin:6px 0; }
    #order-id-display {
      display:inline-block; margin:16px 0;
      background:#e8f6ea; border:1px solid #cce7d0;
      padding:10px 24px; border-radius:8px;
      font-size:18px; font-weight:700; color:#088178; letter-spacing:2px;
    }
    .order-items-summary {
      text-align:left; margin:16px 0; background:#f9f9f9;
      border-radius:8px; padding:12px 16px; font-size:13px; color:#444;
      max-height:160px; overflow-y:auto;
    }
    .order-items-summary li { margin-bottom:4px; list-style:disc; margin-left:16px; }
    #order-total-display { font-size:16px; font-weight:700; color:#1a1a1a; margin:10px 0 20px; }
    .modal-btn-row { display:flex; gap:10px; justify-content:center; flex-wrap:wrap; }
    .btn-primary {
      padding:11px 28px; background:#088178; color:#fff;
      border:none; border-radius:6px; font-size:14px; font-weight:700;
      cursor:pointer; transition:0.2s;
    }
    .btn-primary:hover { background:#066b63; }
    .btn-outline {
      padding:11px 28px; background:none; color:#088178;
      border:2px solid #088178; border-radius:6px;
      font-size:14px; font-weight:700; cursor:pointer; transition:0.2s;
    }
    .btn-outline:hover { background:#088178; color:#fff; }
    #track-modal {
      position:fixed; top:50%; left:50%;
      transform:translate(-50%,-50%) scale(0.85);
      width:500px; max-width:95vw; background:#fff; border-radius:16px;
      padding:36px; z-index:2100;
      box-shadow:0 20px 60px rgba(0,0,0,0.25);
      opacity:0; pointer-events:none; transition:opacity 0.3s, transform 0.3s;
    }
    #track-modal.open { opacity:1; pointer-events:all; transform:translate(-50%,-50%) scale(1); }
    #track-modal h2 { font-size:20px; color:#088178; margin-bottom:6px; }
    #track-modal p { font-size:13px; color:#777; margin-bottom:18px; }
    .track-input-row { display:flex; gap:8px; margin-bottom:20px; }
    #track-input {
      flex:1; height:44px; padding:0 14px;
      border:1px solid #cce7d0; border-radius:6px; font-size:14px; outline:none;
    }
    #track-input:focus { border-color:#088178; }
    #track-btn {
      padding:0 20px; height:44px; background:#088178; color:#fff;
      border:none; border-radius:6px; font-size:14px; font-weight:700; cursor:pointer;
    }
    #track-btn:hover { background:#066b63; }
    #track-result { display:none; }
    #track-result.show { display:block; }
    .track-order-meta {
      background:#f0faf9; border-radius:8px;
      padding:12px 16px; margin-bottom:18px; font-size:13px; color:#444;
    }
    .track-order-meta strong { color:#088178; }
    .timeline { list-style:none; padding:0; margin:0; position:relative; }
    .timeline::before {
      content:""; position:absolute; left:15px; top:0; bottom:0;
      width:2px; background:#e0e0e0;
    }
    .timeline li { display:flex; align-items:flex-start; gap:16px; padding:10px 0; position:relative; }
    .tl-dot {
      width:32px; height:32px; border-radius:50%; flex-shrink:0;
      display:flex; align-items:center; justify-content:center;
      font-size:14px; z-index:1; background:#e0e0e0; color:#888;
      border:2px solid #e0e0e0; transition:0.3s;
    }
    .tl-dot.done { background:#088178; border-color:#088178; color:#fff; }
    .tl-dot.active {
      background:#fff; border-color:#088178; color:#088178;
      box-shadow:0 0 0 4px rgba(8,129,120,0.15);
    }
    .tl-label { padding-top:6px; }
    .tl-label strong { font-size:14px; color:#1a1a1a; display:block; }
    .tl-label span { font-size:12px; color:#888; }
    .tl-label.active-label strong { color:#088178; }
    #track-error {
      display:none; background:#fff0f0; border:1px solid #ffcdd2;
      color:#c62828; padding:12px 16px; border-radius:8px;
      font-size:13px; margin-bottom:12px;
    }
    #track-error.show { display:block; }
    #close-track-btn {
      width:100%; margin-top:20px; padding:11px;
      background:#f5f5f5; color:#444; border:none;
      border-radius:6px; font-size:14px; font-weight:600;
      cursor:pointer; transition:0.2s;
    }
    #close-track-btn:hover { background:#e0e0e0; }
    #ec-toast {
      position:fixed; bottom:30px; left:50%;
      transform:translateX(-50%) translateY(20px);
      background:#041e42; color:#fff; padding:12px 24px; border-radius:30px;
      font-size:13px; font-weight:600; opacity:0;
      transition:opacity 0.3s, transform 0.3s;
      z-index:3000; white-space:nowrap; pointer-events:none;
    }
    #ec-toast.show { opacity:1; transform:translateX(-50%) translateY(0); }
  `;
  document.head.appendChild(style);
}

/* ═══════════════════════════════════════════════════════════
   4. INJECT HTML ELEMENTS
   ═══════════════════════════════════════════════════════════ */

function injectCartSidebar() {
  const el = document.createElement("div");
  el.id = "cart-sidebar";
  el.innerHTML = `
    <div class="ec-overlay" id="cart-overlay"></div>
    <div id="cart-panel">
      <div id="cart-header">
        <h3>Your Cart</h3>
        <button id="close-cart">&#10005;</button>
      </div>
      <div id="cart-items-wrapper"></div>
      <div id="cart-footer">
        <div class="cart-totals">
          <div class="cart-row"><span>Subtotal</span><span id="cart-subtotal">&#8377;0</span></div>
          <div class="cart-row total-row"><span>Total</span><span id="cart-total">&#8377;0</span></div>
        </div>
        <button id="checkout-btn">Place Order</button>
        <button id="clear-cart-btn">Clear Cart</button>
      </div>
    </div>`;
  document.body.appendChild(el);
  document.getElementById("close-cart").addEventListener("click", closeCart);
  document.getElementById("cart-overlay").addEventListener("click", closeCart);
  document.getElementById("checkout-btn").addEventListener("click", placeOrder);
  document.getElementById("clear-cart-btn").addEventListener("click", () => {
    if (!cart.length) return;
    if (confirm("Remove all items from the cart?")) {
      cart = []; saveCart(); renderCart();
    }
  });
}

function injectOrderModal() {
  const el = document.createElement("div");
  el.innerHTML = `
    <div class="ec-overlay" id="order-overlay"></div>
    <div id="order-modal">
      <div class="order-check">&#127881;</div>
      <h2>Order Placed Successfully!</h2>
      <p>Thank you for shopping with us.</p>
      <p>Your Order ID:</p>
      <div id="order-id-display">-</div>
      <ul class="order-items-summary" id="order-items-list"></ul>
      <p id="order-total-display"></p>
      <p style="font-size:12px;color:#aaa;">Save your Order ID to track your order later.</p>
      <div class="modal-btn-row">
        <button class="btn-primary" id="close-order-btn">Continue Shopping</button>
        <button class="btn-outline" id="go-track-btn">Track Order</button>
      </div>
    </div>`;
  document.body.appendChild(el);
  document.getElementById("order-overlay").addEventListener("click", closeOrderModal);
  document.getElementById("close-order-btn").addEventListener("click", closeOrderModal);
  document.getElementById("go-track-btn").addEventListener("click", () => {
    closeOrderModal();
    openTrackModal();
    const last = orders[orders.length - 1];
    if (last) document.getElementById("track-input").value = last.orderId;
  });
}

function injectTrackModal() {
  const el = document.createElement("div");
  el.innerHTML = `
    <div class="ec-overlay" id="track-overlay"></div>
    <div id="track-modal">
      <h2>&#128230; Track Your Order</h2>
      <p>Enter your Order ID to see the current status.</p>
      <div class="track-input-row">
        <input id="track-input" type="text" placeholder="e.g. ORD-A1B2C3">
        <button id="track-btn">Track</button>
      </div>
      <div id="track-error">&#10060; Order ID not found. Please check and try again.</div>
      <div id="track-result">
        <div class="track-order-meta" id="track-meta"></div>
        <ul class="timeline" id="track-timeline"></ul>
      </div>
      <button id="close-track-btn">Close</button>
    </div>`;
  document.body.appendChild(el);
  document.getElementById("track-overlay").addEventListener("click", closeTrackModal);
  document.getElementById("close-track-btn").addEventListener("click", closeTrackModal);
  document.getElementById("track-btn").addEventListener("click", trackOrder);
  document.getElementById("track-input").addEventListener("keydown", (e) => {
    if (e.key === "Enter") trackOrder();
  });
  document.querySelectorAll("footer a").forEach((a) => {
    if (a.textContent.trim() === "Track My Order") {
      a.style.cursor = "pointer";
      a.style.color = "#088178";
      a.addEventListener("click", (e) => { e.preventDefault(); openTrackModal(); });
    }
  });
}

function injectToast() {
  const toast = document.createElement("div");
  toast.id = "ec-toast";
  document.body.appendChild(toast);
}

/* ═══════════════════════════════════════════════════════════
   5. NAVBAR BADGE
   ═══════════════════════════════════════════════════════════ */
function injectCartBadge() {
  const cartLi = document.querySelector("#navbar li:last-child");
  if (!cartLi) return;
  cartLi.style.position = "relative";
  const badge = document.createElement("span");
  badge.id = "cart-count";
  cartLi.appendChild(badge);
  cartLi.querySelector("a").addEventListener("click", (e) => {
    e.preventDefault(); openCart();
  });
}

/* ═══════════════════════════════════════════════════════════
   6. BIND PRODUCT BUTTONS
   ═══════════════════════════════════════════════════════════ */
function bindProductButtons() {
  document.querySelectorAll("#product-1 .pro").forEach((card) => {
    const btn = card.querySelector(".cart");
    if (!btn) return;
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const imgSrc   = card.querySelector("img")?.src || "";
      const brand    = card.querySelector(".des span")?.textContent.trim() || "";
      const name     = card.querySelector(".des h5")?.textContent.trim() || "";
      const priceRaw = card.querySelector(".des h4")?.textContent.trim() || "0";
      const price    = parseFloat(priceRaw.replace(/[^\d.]/g, "")) || 0;
      const id       = (brand + name).toLowerCase().replace(/\s+/g, "-");
      addToCart({ id, imgSrc, brand, name, price });
    });
  });
}

/* ═══════════════════════════════════════════════════════════
   7. CART LOGIC
   ═══════════════════════════════════════════════════════════ */
function addToCart(product) {
  const existing = cart.find((i) => i.id === product.id);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  saveCart();
  renderCart();

  console.log("🛒 Cart:", cart); // debug
  showToast('"' + product.name + '" added to cart!');
}

function changeQty(id, delta) {
  const item = cart.find((i) => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter((i) => i.id !== id);
  saveCart(); renderCart();
}

function removeItem(id) {
  cart = cart.filter((i) => i.id !== id);
  saveCart(); renderCart();
}

function saveCart() {
  localStorage.setItem("ecom-cart", JSON.stringify(cart));
}

/* ═══════════════════════════════════════════════════════════
   8. RENDER CART
   ═══════════════════════════════════════════════════════════ */
function renderCart() {
  const wrapper    = document.getElementById("cart-items-wrapper");
  const badge      = document.getElementById("cart-count");
  const subtotalEl = document.getElementById("cart-subtotal");
  const totalEl    = document.getElementById("cart-total");

  const totalQty = cart.reduce((s, i) => s + i.qty, 0);

  // 🟢 Update badge
  if (badge) {
    badge.textContent = totalQty;
    badge.style.display = totalQty ? "flex" : "none";
  }

  // 🔴 EMPTY CART FIX
  if (!cart.length) {
    wrapper.innerHTML = `
      <div class="cart-empty">
        <span>🛒</span>
        <p>Your cart is empty.</p>
        <p>Add some products to get started!</p>
      </div>`;

    if (subtotalEl) subtotalEl.innerHTML = "₹0";
    if (totalEl)    totalEl.innerHTML    = "₹0";
    return;
  }

  // 🟢 Render items
  wrapper.innerHTML = cart.map((item) => `
    <div class="cart-item" data-id="${item.id}">
      <img src="${item.imgSrc}" alt="${item.name}">
      <div class="cart-item-info">
        <p class="item-brand">${item.brand}</p>
        <p class="item-name">${item.name}</p>
        <p class="item-price">₹${(item.price * item.qty).toLocaleString("en-IN")}</p>
        <div class="qty-controls">
          <button class="qty-btn" data-action="dec" data-id="${item.id}">−</button>
          <span class="qty-value">${item.qty}</span>
          <button class="qty-btn" data-action="inc" data-id="${item.id}">+</button>
        </div>
      </div>
      <button class="remove-btn" data-id="${item.id}" title="Remove">🗑</button>
    </div>
  `).join("");

  // 🟢 CALCULATE TOTAL (FIXED)
  const subtotal = cart.reduce((s, i) => {
    const price = Number(i.price) || 0;
    const qty   = Number(i.qty) || 0;
    return s + price * qty;
  }, 0);

  if (subtotalEl) subtotalEl.innerHTML = "₹" + subtotal.toLocaleString("en-IN");
  if (totalEl)    totalEl.innerHTML    = "₹" + subtotal.toLocaleString("en-IN");

  // 🟢 Buttons
  wrapper.querySelectorAll(".qty-btn").forEach((btn) =>
    btn.addEventListener("click", () =>
      changeQty(btn.dataset.id, btn.dataset.action === "inc" ? 1 : -1)
    )
  );

  wrapper.querySelectorAll(".remove-btn").forEach((btn) =>
    btn.addEventListener("click", () => removeItem(btn.dataset.id))
  );
}

/* ═══════════════════════════════════════════════════════════
   9. PLACE ORDER
   ═══════════════════════════════════════════════════════════ */

/*
 * Status auto-advances based on minutes elapsed since order:
 * 0-1 min   = Order Placed
 * 1-3 min   = Packed
 * 3-10 min  = Shipped
 * 10-20 min = Out for Delivery
 * 20+ min   = Delivered
 */
const STATUS_STAGES = [
  { label: "Order Placed",     icon: "&#128203;", desc: "We received your order." },
  { label: "Packed",           icon: "&#128230;", desc: "Your items are being packed." },
  { label: "Shipped",          icon: "&#128666;", desc: "Your order is on its way." },
  { label: "Out for Delivery", icon: "&#128693;", desc: "Almost there!" },
  { label: "Delivered",        icon: "&#9989;",   desc: "Enjoy your purchase!" },
];

function generateOrderId() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let id = "ORD-";
  for (let i = 0; i < 6; i++)
    id += chars[Math.floor(Math.random() * chars.length)];
  return id;
}

// place order UPDATED//
function placeOrder() {
  if (!cart.length) {
    showToast("Your cart is empty! Add items first.");
    return;
  }

  // 👇 Take user details
  const name = prompt("Enter your name:");
  const email = prompt("Enter your email:");
  const address = prompt("Enter your address:");

  if (!name || !email || !address) {
    alert("All fields are required!");
    return;
  }

  // 👇 Generate order details
  const orderId = generateOrderId();
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const order = {
    orderId,
    items: cart.map(({ brand, name, price, qty }) => ({
      brand,
      name,
      price,
      qty
    })),
    total,
    timestamp: Date.now()
  };

  // ✅ ✅ NEW BACKEND FORMAT (VERY IMPORTANT)
  const backendData = {
    name,
    email,
    address,
    order_id: orderId,

    items: cart.map(item => ({
      product_name: item.name,
      quantity: item.qty,
      price: item.price
    }))
  };

  // 🚀 SEND TO DJANGO
  fetch("http://127.0.0.1:8000/api/create-order/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(backendData)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error("Server error: " + response.status);
    }
    return response.json();
  })
  .then(data => {
    console.log("✅ Backend response:", data);

    // ✅ Save locally
    orders.push(order);
    localStorage.setItem("ecom-orders", JSON.stringify(orders));

    // ✅ Clear cart
    cart = [];
    saveCart();
    renderCart();
    closeCart();

    // ✅ Update UI
    document.getElementById("order-id-display").textContent = orderId;

    document.getElementById("order-items-list").innerHTML =
      order.items.map((item) =>
        `<li>
          ${item.brand} - ${item.name} 
          x${item.qty} 
          (₹${(item.price * item.qty).toLocaleString("en-IN")})
        </li>`
      ).join("");

    document.getElementById("order-total-display").innerHTML =
      `<strong>Total Paid: ₹${total.toLocaleString("en-IN")}</strong>`;

    openOrderModal();
  })
  .catch(error => {
    console.error("❌ ERROR:", error);

    if (error.message.includes("Failed to fetch")) {
      alert("❌ Backend server is not running!");
    } else {
      alert("❌ Error saving order to backend");
    }
  });
}
/* ═══════════════════════════════════════════════════════════
   10. TRACK ORDER
   ═══════════════════════════════════════════════════════════ */
function trackOrder() {
  const input      = document.getElementById("track-input");
  const errorEl    = document.getElementById("track-error");
  const resultEl   = document.getElementById("track-result");
  const metaEl     = document.getElementById("track-meta");
  const timelineEl = document.getElementById("track-timeline");

  const query = input.value.trim().toUpperCase();
  errorEl.classList.remove("show");
  resultEl.classList.remove("show");

  if (!query) { showToast("Please enter an Order ID."); return; }

  const order = orders.find((o) => o.orderId === query);
  if (!order) { errorEl.classList.add("show"); return; }

  const elapsed = (Date.now() - order.timestamp) / 60000;
  let stageIndex;
  if      (elapsed <  1)  stageIndex = 0;
  else if (elapsed <  3)  stageIndex = 1;
  else if (elapsed < 10)  stageIndex = 2;
  else if (elapsed < 20)  stageIndex = 3;
  else                    stageIndex = 4;

  const orderDate = new Date(order.timestamp).toLocaleString("en-IN");
  metaEl.innerHTML = `
    <strong>Order ID:</strong> ${order.orderId} &nbsp;|&nbsp;
    <strong>Placed:</strong> ${orderDate}<br>
    <strong>Items:</strong> ${order.items.map((i) => i.name + " x" + i.qty).join(", ")}<br>
    <strong>Total:</strong> &#8377;${order.total.toLocaleString("en-IN")}`;

  timelineEl.innerHTML = STATUS_STAGES.map((stage, idx) => {
    let dotClass   = "";
    let labelClass = "";
    if (idx < stageIndex)   dotClass = "done";
    if (idx === stageIndex) { dotClass = "active"; labelClass = "active-label"; }
    return `
      <li>
        <div class="tl-dot ${dotClass}">${stage.icon}</div>
        <div class="tl-label ${labelClass}">
          <strong>${stage.label}</strong>
          <span>${stage.desc}</span>
        </div>
      </li>`;
  }).join("");

  resultEl.classList.add("show");
}

/* ═══════════════════════════════════════════════════════════
   11. OPEN / CLOSE HELPERS
   ═══════════════════════════════════════════════════════════ */
function openCart() {
  document.getElementById("cart-panel").classList.add("open");
  document.getElementById("cart-overlay").classList.add("open");
  document.body.style.overflow = "hidden";
}
function closeCart() {
  document.getElementById("cart-panel").classList.remove("open");
  document.getElementById("cart-overlay").classList.remove("open");
  document.body.style.overflow = "";
}
function openOrderModal() {
  document.getElementById("order-modal").classList.add("open");
  document.getElementById("order-overlay").classList.add("open");
  document.body.style.overflow = "hidden";
}
function closeOrderModal() {
  document.getElementById("order-modal").classList.remove("open");
  document.getElementById("order-overlay").classList.remove("open");
  document.body.style.overflow = "";
}
function openTrackModal() {
  document.getElementById("track-error").classList.remove("show");
  document.getElementById("track-result").classList.remove("show");
  document.getElementById("track-modal").classList.add("open");
  document.getElementById("track-overlay").classList.add("open");
  document.body.style.overflow = "hidden";
}
function closeTrackModal() {
  document.getElementById("track-modal").classList.remove("open");
  document.getElementById("track-overlay").classList.remove("open");
  document.body.style.overflow = "";
}

/* ═══════════════════════════════════════════════════════════
   12. TOAST
   ═══════════════════════════════════════════════════════════ */
let toastTimer;
function showToast(msg) {
  const toast = document.getElementById("ec-toast");
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2800);
}