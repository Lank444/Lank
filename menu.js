// ====== MENU.JS (Firebase Realtime Database) ======
import { db } from "./firebase.js";
import { ref, push } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// ── MENU DATA ──────────────────────────────────────────────
const MENU_DATA = [
  { id: 1,  name: "Espresso",               cat: "coffee",     emoji: "☕", price: 18000, badge: null },
  { id: 2,  name: "Americano",              cat: "coffee",     emoji: "☕", price: 20000, badge: "Hot/Iced" },
  { id: 3,  name: "Cafe Latte",             cat: "coffee",     emoji: "☕", price: 25000, badge: "Hot/Iced" },
  { id: 4,  name: "Cappuccino",             cat: "coffee",     emoji: "☕", price: 25000, badge: null },
  { id: 5,  name: "Cafe Mocha",             cat: "coffee",     emoji: "☕", price: 27000, badge: null },
  { id: 6,  name: "Caramel Macchiato",      cat: "coffee",     emoji: "☕", price: 28000, badge: null },
  { id: 7,  name: "Vanilla Latte",          cat: "coffee",     emoji: "☕", price: 27000, badge: null },
  { id: 8,  name: "Hazelnut Latte",         cat: "coffee",     emoji: "☕", price: 27000, badge: null },
  { id: 9,  name: "Palm Sugar Latte",       cat: "coffee",     emoji: "☕", price: 26000, badge: null },
  { id: 10, name: "Kopi Susu Gula Aren",    cat: "coffee",     emoji: "☕", price: 24000, badge: "⭐" },
  { id: 11, name: "Es Kopi Susu Gula Aren", cat: "signature",  emoji: "🧊", price: 26000, badge: null },
  { id: 12, name: "Es Kopi Pandan",         cat: "signature",  emoji: "🧊", price: 27000, badge: null },
  { id: 13, name: "Es Kopi Klepon",         cat: "signature",  emoji: "🧊", price: 27000, badge: null },
  { id: 14, name: "Es Kopi Regal",          cat: "signature",  emoji: "🧊", price: 28000, badge: null },
  { id: 15, name: "Es Kopi Coklat",         cat: "signature",  emoji: "🧊", price: 27000, badge: null },
  { id: 16, name: "Matcha Latte",           cat: "noncoffee",  emoji: "🍵", price: 27000, badge: "Hot/Iced" },
  { id: 17, name: "Green Tea Latte",        cat: "noncoffee",  emoji: "🍵", price: 25000, badge: "Hot/Iced" },
  { id: 18, name: "Chocolate",              cat: "noncoffee",  emoji: "🍫", price: 23000, badge: "Hot/Iced" },
  { id: 19, name: "Chocolate Mint",         cat: "noncoffee",  emoji: "🍫", price: 26000, badge: null },
  { id: 20, name: "Thai Tea",               cat: "noncoffee",  emoji: "🧡", price: 22000, badge: null },
  { id: 21, name: "Thai Milk Tea",          cat: "noncoffee",  emoji: "🧡", price: 24000, badge: null },
  { id: 22, name: "Taro Latte",             cat: "noncoffee",  emoji: "🟣", price: 26000, badge: null },
  { id: 23, name: "Red Velvet Latte",       cat: "noncoffee",  emoji: "❤️", price: 26000, badge: null },
  { id: 24, name: "Lemon Tea",              cat: "refreshing", emoji: "🍋", price: 18000, badge: "Hot/Iced" },
  { id: 25, name: "Lychee Tea",             cat: "refreshing", emoji: "🥤", price: 20000, badge: null },
  { id: 26, name: "Peach Tea",              cat: "refreshing", emoji: "🍑", price: 20000, badge: null },
  { id: 27, name: "Yakult Lemon",           cat: "refreshing", emoji: "🥛", price: 18000, badge: null },
  { id: 28, name: "Yakult Strawberry",      cat: "refreshing", emoji: "🍓", price: 18000, badge: null },
  { id: 29, name: "Mango Yakult",           cat: "refreshing", emoji: "🥭", price: 20000, badge: null },
  { id: 30, name: "Strawberry Soda",        cat: "refreshing", emoji: "🍓", price: 22000, badge: null },
  { id: 31, name: "Blue Ocean Soda",        cat: "refreshing", emoji: "🌊", price: 22000, badge: null },
  { id: 32, name: "Fresh Milk",             cat: "milk",       emoji: "🥛", price: 18000, badge: null },
  { id: 33, name: "Caramel Milk",           cat: "milk",       emoji: "🥛", price: 20000, badge: null },
  { id: 34, name: "Vanilla Milk",           cat: "milk",       emoji: "🥛", price: 20000, badge: null },
  { id: 35, name: "Strawberry Milk",        cat: "milk",       emoji: "🍓", price: 20000, badge: null },
  { id: 36, name: "Chocolate Milk",         cat: "milk",       emoji: "🍫", price: 20000, badge: null },
  { id: 37, name: "Nasi Goreng Special",    cat: "food",       emoji: "🍳", price: 35000, badge: null },
  { id: 38, name: "Nasi Ayam Sambal Matah", cat: "food",       emoji: "🍗", price: 38000, badge: null },
  { id: 39, name: "Nasi Ayam Teriyaki",     cat: "food",       emoji: "🍗", price: 38000, badge: null },
  { id: 40, name: "Chicken Katsu Rice Bowl",cat: "food",       emoji: "🍱", price: 40000, badge: null },
  { id: 41, name: "Spaghetti Bolognese",    cat: "food",       emoji: "🍝", price: 38000, badge: null },
  { id: 42, name: "Spaghetti Carbonara",    cat: "food",       emoji: "🍝", price: 40000, badge: null },
  { id: 43, name: "Mie Goreng Jawa",        cat: "food",       emoji: "🍜", price: 32000, badge: null },
  { id: 44, name: "Dori Sambal Matah Rice", cat: "food",       emoji: "🐟", price: 42000, badge: null },
  { id: 45, name: "French Fries",           cat: "snack",      emoji: "🍟", price: 25000, badge: null },
  { id: 46, name: "Chicken Wings",          cat: "snack",      emoji: "🍗", price: 32000, badge: null },
  { id: 47, name: "Chicken Popcorn",        cat: "snack",      emoji: "🍗", price: 28000, badge: null },
  { id: 48, name: "Sosis Bakar",            cat: "snack",      emoji: "🌭", price: 22000, badge: null },
  { id: 49, name: "Cireng Isi",             cat: "snack",      emoji: "🫓", price: 18000, badge: null },
  { id: 50, name: "Tahu Crispy",            cat: "snack",      emoji: "🟨", price: 18000, badge: null },
  { id: 51, name: "Onion Rings",            cat: "snack",      emoji: "🍩", price: 22000, badge: null },
  { id: 52, name: "Chocolate Cake",         cat: "dessert",    emoji: "🍰", price: 32000, badge: null },
  { id: 53, name: "Red Velvet Cake",        cat: "dessert",    emoji: "🎂", price: 32000, badge: null },
  { id: 54, name: "Tiramisu Cake",          cat: "dessert",    emoji: "🍰", price: 35000, badge: null },
  { id: 55, name: "Cheesecake",             cat: "dessert",    emoji: "🧁", price: 35000, badge: null },
  { id: 56, name: "Brownies",               cat: "dessert",    emoji: "🍫", price: 22000, badge: null },
  { id: 57, name: "Croissant",              cat: "dessert",    emoji: "🥐", price: 20000, badge: null },
  { id: 58, name: "Pain au Chocolat",       cat: "dessert",    emoji: "🥐", price: 22000, badge: null },
  { id: 59, name: "Ice Cream",              cat: "sweet",      emoji: "🍦", price: 22000, badge: "Van/Choc/Straw" },
  { id: 60, name: "Affogato",               cat: "sweet",      emoji: "☕", price: 28000, badge: null },
  { id: 61, name: "Pudding Coklat",         cat: "sweet",      emoji: "🍮", price: 18000, badge: null },
  { id: 62, name: "Panna Cotta",            cat: "sweet",      emoji: "🍮", price: 25000, badge: null },
  { id: 63, name: "Waffle Ice Cream",       cat: "sweet",      emoji: "🧇", price: 32000, badge: null },
  { id: 64, name: "Toast Ice Cream",        cat: "sweet",      emoji: "🍞", price: 30000, badge: null },
];

const SECTION_LABELS = {
  coffee:     "☕ Coffee (Hot & Iced)",
  signature:  "🧊 Signature Coffee",
  noncoffee:  "🍵 Non-Coffee",
  refreshing: "🥤 Refreshing Drinks",
  milk:       "🥛 Milk Based",
  food:       "🍝 Main Course",
  snack:      "🍟 Snacks",
  dessert:    "🍰 Cake & Pastry",
  sweet:      "🍨 Sweet Dessert",
};

// ── STATE ──────────────────────────────────────────────────
let cart = {};
let selectedTable = null;
let currentFilter = "all";

const formatRp = n => "Rp " + n.toLocaleString("id-ID");

// ── TABLE BUTTONS ──────────────────────────────────────────
function initTableButtons() {
  const wrap = document.getElementById("tableButtons");
  for (let i = 1; i <= 15; i++) {
    const btn = document.createElement("button");
    btn.className = "table-btn";
    btn.textContent = i;
    btn.onclick = () => {
      selectedTable = i;
      document.querySelectorAll(".table-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
    };
    wrap.appendChild(btn);
  }
}

// ── RENDER MENU ────────────────────────────────────────────
function renderMenu(filter) {
  const grid = document.getElementById("menuGrid");
  grid.innerHTML = "";
  const cats = filter === "all"
    ? ["coffee","signature","noncoffee","refreshing","milk","food","snack","dessert","sweet"]
    : [filter];

  cats.forEach(cat => {
    const items = MENU_DATA.filter(m => m.cat === cat);
    if (!items.length) return;
    const title = document.createElement("div");
    title.className = "section-title";
    title.style.gridColumn = "1 / -1";
    title.textContent = SECTION_LABELS[cat];
    grid.appendChild(title);
    items.forEach(item => {
      const qty = cart[item.id] || 0;
      const card = document.createElement("div");
      card.className = "menu-card" + (qty > 0 ? " in-cart" : "");
      card.id = `card-${item.id}`;
      card.innerHTML = `
        <div class="card-emoji">${item.emoji}</div>
        <div class="card-body">
          <div class="card-name">${item.name}${item.badge ? `<span class="card-badge">${item.badge}</span>` : ""}</div>
          <div class="card-cat">${SECTION_LABELS[item.cat]}</div>
          <div class="card-footer">
            <span class="card-price">${formatRp(item.price)}</span>
            ${buildQtyCtrl(item.id, qty)}
          </div>
        </div>`;
      grid.appendChild(card);
    });
  });
}

function buildQtyCtrl(id, qty) {
  if (qty === 0) return `<button class="card-add" onclick="addToCart(${id})">+</button>`;
  return `<div class="card-qty">
    <button class="qty-btn" onclick="changeQty(${id},-1)">−</button>
    <span class="qty-num">${qty}</span>
    <button class="qty-btn" onclick="changeQty(${id},1)">+</button>
  </div>`;
}

function rerenderCard(id) {
  const item = MENU_DATA.find(m => m.id === id);
  const card = document.getElementById(`card-${id}`);
  if (!card) return;
  const qty = cart[id] || 0;
  card.className = "menu-card" + (qty > 0 ? " in-cart" : "");
  card.querySelector(".card-footer").innerHTML =
    `<span class="card-price">${formatRp(item.price)}</span>${buildQtyCtrl(id, qty)}`;
}

// ── CART ───────────────────────────────────────────────────
window.addToCart = id => { cart[id] = 1; updateCartBar(); rerenderCard(id); };
window.changeQty = (id, d) => {
  cart[id] = (cart[id] || 0) + d;
  if (cart[id] <= 0) delete cart[id];
  updateCartBar(); rerenderCard(id);
};
window.cartChangeQty = (id, d) => {
  cart[id] = (cart[id] || 0) + d;
  if (cart[id] <= 0) delete cart[id];
  updateCartBar(); rerenderCard(id); renderCartModal();
};

function cartTotal() {
  return Object.entries(cart).reduce((s, [id, qty]) => {
    const item = MENU_DATA.find(m => m.id === +id);
    return s + (item ? item.price * qty : 0);
  }, 0);
}

function updateCartBar() {
  const count = Object.values(cart).reduce((a, b) => a + b, 0);
  document.getElementById("cartCount").textContent = `${count} item`;
  document.getElementById("cartTotal").textContent = formatRp(cartTotal());
}

// ── CART MODAL ─────────────────────────────────────────────
window.openCart  = () => { document.getElementById("cartModal").classList.add("open"); renderCartModal(); };
window.closeCart = () => document.getElementById("cartModal").classList.remove("open");

function renderCartModal() {
  const ti = document.getElementById("modalTableInfo");
  if (selectedTable) {
    ti.textContent = `🪑 Meja ${selectedTable}`;
    ti.className = "modal-table-info has-table";
  } else {
    ti.textContent = "⚠️ Belum memilih meja — pilih nomor meja di atas";
    ti.className = "modal-table-info";
  }

  const list = document.getElementById("modalItems");
  list.innerHTML = "";
  const entries = Object.entries(cart);
  if (!entries.length) {
    list.innerHTML = `<p style="text-align:center;color:var(--text-muted);padding:24px 0;font-style:italic">Keranjang masih kosong</p>`;
  }
  entries.forEach(([id, qty]) => {
    const item = MENU_DATA.find(m => m.id === +id);
    if (!item) return;
    const div = document.createElement("div");
    div.className = "modal-item";
    div.innerHTML = `
      <div class="modal-item-emoji">${item.emoji}</div>
      <div class="modal-item-info">
        <div class="modal-item-name">${item.name}</div>
        <div class="modal-item-price">${formatRp(item.price)} × ${qty} = ${formatRp(item.price * qty)}</div>
      </div>
      <div class="modal-item-qty">
        <button class="qty-btn" onclick="cartChangeQty(${id},-1)">−</button>
        <span class="qty-num">${qty}</span>
        <button class="qty-btn" onclick="cartChangeQty(${id},1)">+</button>
      </div>`;
    list.appendChild(div);
  });
  document.getElementById("modalTotal").textContent = formatRp(cartTotal());
}

// ── SUBMIT → FIREBASE ──────────────────────────────────────
window.submitOrder = async () => {
  if (!selectedTable)        { alert("⚠️ Silakan pilih nomor meja terlebih dahulu!"); return; }
  if (!Object.keys(cart).length) { alert("⚠️ Keranjang masih kosong!"); return; }

  const btn = document.getElementById("submitBtn");
  btn.textContent = "⏳ Mengirim...";
  btn.disabled = true;

  const items = Object.entries(cart).map(([id, qty]) => {
    const item = MENU_DATA.find(m => m.id === +id);
    return { id: +id, name: item.name, emoji: item.emoji, price: item.price, qty, cat: item.cat };
  });

  const now   = new Date();
  const order = {
    id:        "ORD-" + now.getTime().toString().slice(-6),
    table:     selectedTable,
    items,
    total:     cartTotal(),
    note:      document.getElementById("orderNote").value.trim(),
    status:    "baru",
    time:      now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
    timestamp: now.getTime(),
  };

  try {
    await push(ref(db, "orders"), order);
    cart = {};
    document.getElementById("orderNote").value = "";
    updateCartBar();
    renderMenu(currentFilter);
    closeCart();
    showToast("✅ Pesanan berhasil dikirim ke kasir!");
  } catch (err) {
    console.error(err);
    showToast("❌ Gagal mengirim. Cek koneksi internet.");
  } finally {
    btn.textContent = "📤 Kirim ke Kasir";
    btn.disabled = false;
  }
};

// ── FILTER ─────────────────────────────────────────────────
window.filterCat = (cat, btn) => {
  currentFilter = cat;
  document.querySelectorAll(".cat-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  renderMenu(cat);
};

// ── TOAST ──────────────────────────────────────────────────
function showToast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 3500);
}

// ── INIT ───────────────────────────────────────────────────
initTableButtons();
renderMenu("all");
updateCartBar();
