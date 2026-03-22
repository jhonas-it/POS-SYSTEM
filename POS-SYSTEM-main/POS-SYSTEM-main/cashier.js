


// ── SAMPLE DATA ───────────────────────────────────────────────
const products = [
  { id: "BITCH-051", name: "Dark Choco Macchiato", price: 0.01, stock: 11, category: "beverages", img: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80" },
  { id: "BITCH-201", name: "Matcha Overload",      price: 0.01, stock: 11, category: "beverages", img: "https://images.unsplash.com/photo-1619096252214-ef06c45683e3?w=400&q=80" },
  { id: "BITCH-501", name: "Mango Overload",       price: 0.01, stock: 11, category: "beverages", img: "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400&q=80" },
  { id: "BITCH-301", name: "Caramel Chocolate",    price: 0.01, stock: 11, category: "beverages", img: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&q=80" },
  { id: "BITCH-021", name: "Caramel Overload",     price: 0.01, stock: 11, category: "beverages", img: "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400&q=80" },
  { id: "FOOD-001",  name: "Cheese Bread",         price: 0.01, stock: 8,  category: "food",      img: "https://images.unsplash.com/photo-1549931319-a545dcf3bc7b?w=400&q=80" },
  { id: "FOOD-002",  name: "Egg Sandwich",         price: 0.01, stock: 5,  category: "food",      img: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&q=80" },
  { id: "FOOD-003",  name: "Club Sandwich",        price: 0.01, stock: 0,  category: "food",      img: "https://images.unsplash.com/photo-1539252554873-d71e8d8c9f18?w=400&q=80" },
  
];

// ── STATE ─────────────────────────────────────────────────────
let cart = [];
let activeCategory = "all";
let searchQuery = "";

// ── HELPERS ───────────────────────────────────────────────────
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatPrice(val) {
  return "₱" + val.toFixed(2);
}

// ── RENDER PRODUCTS ───────────────────────────────────────────
function renderProducts() {
  const grid = document.getElementById("productGrid");
  const filtered = products.filter(p => {
    const matchCat    = activeCategory === "all" || p.category === activeCategory;
    const matchSearch = p.name.toLowerCase().includes(searchQuery) || p.id.toLowerCase().includes(searchQuery);
    return matchCat && matchSearch;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;opacity:0.35;padding:40px;font-size:13px;">No products found.</div>`;
    return;
  }

  grid.innerHTML = filtered.map(p => `
    <div class="product-card ${p.stock === 0 ? "out-of-stock" : ""}"
         onclick="${p.stock > 0 ? (p.category === 'beverages' ? `openSizePicker('${p.id}')` : `addToCart('${p.id}')`) : ""}">
      <div class="product-img-wrap">
        <img src="${p.img}" alt="${p.name}" loading="lazy" />
        <span class="product-badge">${capitalize(p.category)}</span>
      </div>
      <div class="product-info">
        <div class="product-name">${p.name}</div>
        <div class="product-id">${p.id}</div>
      </div>
      <div class="product-footer">
        <span class="product-price">${formatPrice(p.price)}</span>
        <span class="product-stock">${p.stock === 0 ? "Out of Stock" : "Stock " + p.stock}</span>
      </div>
    </div>
  `).join("");

  lucide.createIcons();
}

// ── CART LOGIC ────────────────────────────────────────────────
function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product || product.stock === 0) return;

  const existing = cart.find(c => c.id === productId);
  if (existing) {
    if (existing.qty < product.stock) existing.qty++;
  } else {
    cart.push({ id: product.id, name: product.name, price: product.price, qty: 1 });
  }

  renderCart();
}

function removeFromCart(productId) {
  cart = cart.filter(c => c.id !== productId);
  renderCart();
}

function changeQty(productId, delta) {
  const item = cart.find(c => c.id === productId);
  if (!item) return;

  // Strip size suffix (e.g. "BITCH-051-small" → "BITCH-051")
  const baseId  = productId.replace(/-(small|medium|large)$/, "");
  const product = products.find(p => p.id === baseId);

  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter(c => c.id !== productId);
  } else if (product && item.qty > product.stock) {
    item.qty = product.stock;
  }
  renderCart();
}

function renderCart() {
  const container = document.getElementById("cartItems");

  if (cart.length === 0) {
    container.innerHTML = `<div class="cart-empty">No items yet.<br>Click a product to add.</div>`;
    updateTotals();
    updateClearButton();
    return;
  }

  container.innerHTML = cart.map(item => `
  <div class="cart-item" id="ci-${item.id}">
    <div class="cart-item-top">
      <div>
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-unit">${formatPrice(item.price)}</div>
      </div>
      <button class="cart-delete" onclick="removeFromCart('${item.id}')">
        <i data-lucide="trash-2" stroke="currentColor" style="width:14px;height:14px;" ></i>
      </button>
    </div>
    <div class="cart-item-bottom">
      <div class="qty-controls">
        <button class="qty-btn" onclick="changeQty('${item.id}', -1)">−</button>
        <span class="qty-value">${item.qty}</span>
        <button class="qty-btn" onclick="changeQty('${item.id}', 1)">+</button>
      </div>
      <div class="cart-item-subtotal">${formatPrice(item.price * item.qty)}</div>
    </div>
  </div>
`).join("");

 
  lucide.createIcons();
  updateTotals();
  updateClearButton();
}

function updateClearButton() {
  const btn = document.getElementById("clearCartBtn");

  if (cart.length === 0) {
    btn.style.display = "none";
  } else {
    btn.style.display = "flex"; 
  }
}

// ── TOTALS ────────────────────────────────────────────────────
function getTotal() {
  const sub = cart.reduce((s, i) => s + i.price * i.qty, 0);
  return sub * 1.05;
}

function updateTotals() {
  const subtotalVal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const taxVal      = subtotalVal * 0.05;
  const totalVal    = subtotalVal + taxVal;

  document.getElementById("subtotal").textContent = formatPrice(subtotalVal);
  document.getElementById("tax").textContent      = formatPrice(taxVal);
  document.getElementById("total").textContent    = formatPrice(totalVal);

  updateChange(totalVal);
}

function updateChange(totalVal) {
  const cash   = parseFloat(document.getElementById("cashInput").value) || 0;
  const change = cash - (totalVal !== undefined ? totalVal : getTotal());
  document.getElementById("change").textContent = formatPrice(Math.max(0, change));

  const payBtn = document.getElementById("payBtn");
  payBtn.disabled = !(cart.length > 0 && cash >= getTotal() && getTotal() > 0);
}

// ── CASH INPUT ────────────────────────────────────────────────
document.getElementById("cashInput").addEventListener("input", () => updateChange());

// ── PAY BUTTON — opens confirm modal ─────────────────────────
document.getElementById("payBtn").addEventListener("click", () => {
  const cash      = parseFloat(document.getElementById("cashInput").value) || 0;
  const total     = getTotal();
  const change    = cash - total;
  const itemCount = cart.reduce((s, i) => s + i.qty, 0);

  // Populate modal item list
  document.getElementById("modalItems").innerHTML = cart.map(item => `
    <div class="modal-item-row">
      <div class="modal-item-left">
        <span class="modal-item-name">${item.name}</span>
        <span class="modal-item-qty" style="font-size:11px;opacity:0.5;margin-top:2px;">${item.qty}x</span>
      </div>
      <span class="modal-item-price orange">${formatPrice(item.price * item.qty)}</span>
    </div>
  `).join("");

  document.getElementById("modalTotal").textContent     = formatPrice(total);
  document.getElementById("modalItemCount").textContent = itemCount;
  document.getElementById("modalCash").textContent      = formatPrice(cash);
  document.getElementById("modalChange").textContent    = formatPrice(change);

  document.getElementById("confirmModal").classList.add("show");
});

// ── MODAL CANCEL — just close ─────────────────────────────────
document.getElementById("modalCancel").addEventListener("click", () => {
  document.getElementById("confirmModal").classList.remove("show");
});

// ── MODAL CONFIRM — clear cart and close ──────────────────────
document.getElementById("modalConfirm").addEventListener("click", () => {
  const total = getTotal();

  // Generate receipt ID
  const receiptId = "RCP-" + new Date().toISOString().slice(0,10).replace(/-/g,"") + "-" + Math.random().toString(36).slice(2,8).toUpperCase();

  // Show receipt section
  document.getElementById("receiptId").textContent    = "Receipt " + receiptId;
  document.getElementById("receiptTotal").textContent = "Total: " + formatPrice(total);
  document.getElementById("receiptSection").style.display = "flex";

  // Clear cart
  cart = [];
  document.getElementById("cashInput").value = "";
  document.getElementById("confirmModal").classList.remove("show");
  renderCart();
  lucide.createIcons();
});

// ── FILTERS ───────────────────────────────────────────────────
document.querySelectorAll(".filter-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    activeCategory = btn.dataset.cat;
    renderProducts();
  });
});

// ── SEARCH ────────────────────────────────────────────────────
document.getElementById("searchInput").addEventListener("input", e => {
  searchQuery = e.target.value.toLowerCase().trim();
  renderProducts();
});

// ── INIT ──────────────────────────────────────────────────────
renderProducts();
renderCart();

function printReceipt() {
  window.print();
}

// beverages sizes
// ── SIZE CONFIG ───────────────────────────────────────────────
// Multipliers and labels for each size tier
const SIZE_OPTIONS = [
  { key: "small",  label: "Small",  badge: "S", sub: "Base size",     multiplier: 1.00 },
  { key: "medium", label: "Medium", badge: "M", sub: "×1.25 of base", multiplier: 1.25 },
  { key: "large",  label: "Large",  badge: "L", sub: "×1.5 of base",  multiplier: 1.50 },
];

// ── SIZE MODAL OPEN ───────────────────────────────────────────
function openSizePicker(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const overlay = document.getElementById("sizeModal");

  // Thumbnail + title
  overlay.querySelector(".size-modal-thumb").src = product.img;
  overlay.querySelector(".size-modal-title h4").textContent = product.name;

  // Build size options
  const optionsEl = overlay.querySelector(".size-options");
  optionsEl.innerHTML = SIZE_OPTIONS.map(s => {
    const price     = product.price * s.multiplier;
    const basePrice = product.price;
    const showOrig  = s.multiplier > 1;

    return `
      <div class="size-option" onclick="pickSize('${productId}', '${s.key}')">
        <div class="size-badge">${s.badge}</div>
        <div class="size-info">
          <div class="size-name">${s.label}</div>
          <div class="size-sub">${s.sub}</div>
        </div>
        <div class="size-price-wrap">
          <div class="size-price-main">${formatPrice(price)}</div>
          ${showOrig ? `<div class="size-price-orig">${formatPrice(basePrice)}</div>` : ""}
        </div>
      </div>
    `;
  }).join("");

  overlay.classList.add("show");
}

// ── SIZE PICKED ───────────────────────────────────────────────
function pickSize(productId, sizeKey) {
  const product = products.find(p => p.id === productId);
  const size    = SIZE_OPTIONS.find(s => s.key === sizeKey);
  if (!product || !size) return;

  const finalPrice = parseFloat((product.price * size.multiplier).toFixed(2));
  const cartId     = `${productId}-${sizeKey}`;  // unique per size
  const cartName   = `${product.name} (${size.label})`;

  const existing = cart.find(c => c.id === cartId);
  if (existing) {
    if (existing.qty < product.stock) existing.qty++;
  } else {
    cart.push({ id: cartId, name: cartName, price: finalPrice, qty: 1 });
  }

  closeSizePicker();
  renderCart();
}

// ── CLOSE ─────────────────────────────────────────────────────
function closeSizePicker() {
  document.getElementById("sizeModal").classList.remove("show");
}
document.getElementById('clearCartBtn').addEventListener('click', () => {
  // Check if cart is empty first
  if (cart.length === 0) return;

  // Optional: Professional confirmation
  if (confirm("Clear all items from cart?")) {
    cart = []; // Empty your cart array
    
    // Refresh your UI functions (use the names from your pos.js)
    renderCart(); 
    updateTotals();
    
    // Reset inputs
    document.getElementById('cashInput').value = "";
    document.getElementById('change').textContent = "₱0.00";
    document.getElementById('payBtn').disabled = true;
  }
});

// ─── LOGOUT ────────────────────────────────────────────────────────────────
function openModal(id) {
    document.getElementById(id).style.display = "flex";
}

function closeModal(id) {
    document.getElementById(id).style.display = "none";
}


function confirmLogout() {
    // Redirect to login page
    window.location.href = "login.html";
}


