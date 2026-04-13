// ====== KASIR.JS (Firebase Realtime Database) ======
import { db } from "./firebase.js";
import {
  ref, onValue, update, remove, query, orderByChild
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// ── STATE ──────────────────────────────────────────────────
let allOrders   = [];   // [{ firebaseKey, ...orderData }]
let currentFilter = "all";
let detailKey     = null;

const formatRp = n => "Rp " + n.toLocaleString("id-ID");

// ── REALTIME LISTENER ──────────────────────────────────────
const ordersRef = query(ref(db, "orders"), orderByChild("timestamp"));

onValue(ordersRef, snapshot => {
  allOrders = [];
  if (snapshot.exists()) {
    snapshot.forEach(child => {
      allOrders.unshift({ firebaseKey: child.key, ...child.val() });
    });
  }
  renderOrders();
  updateStats();
  updateLastUpdate();
});

// ── STATS ──────────────────────────────────────────────────
function updateStats() {
  const antrian    = allOrders.filter(o => o.status === "baru" || o.status === "proses").length;
  const selesai    = allOrders.filter(o => o.status === "selesai").length;
  const pendapatan = allOrders.filter(o => o.status === "selesai").reduce((s, o) => s + o.total, 0);

  document.getElementById("statAntrian").textContent   = antrian;
  document.getElementById("statSelesai").textContent   = selesai;
  document.getElementById("statPendapatan").textContent = (pendapatan / 1000).toFixed(0) + "K";
}

function updateLastUpdate() {
  document.getElementById("lastUpdate").textContent =
    "Update: " + new Date().toLocaleTimeString("id-ID");
}

// ── FILTER ─────────────────────────────────────────────────
window.filterOrders = (status, btn) => {
  currentFilter = status;
  document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  renderOrders();
};

// ── RENDER ORDERS ──────────────────────────────────────────
function renderOrders() {
  const grid = document.getElementById("ordersGrid");
  grid.innerHTML = "";

  let list = currentFilter === "all"
    ? allOrders
    : allOrders.filter(o => o.status === currentFilter);

  const pri = { baru: 0, proses: 1, selesai: 2, batal: 3 };
  list = [...list].sort((a, b) => (pri[a.status] ?? 9) - (pri[b.status] ?? 9));

  if (!list.length) {
    grid.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">☕</div>
        <p>Belum ada pesanan</p>
        <span>Pesanan dari pelanggan akan muncul secara real-time</span>
      </div>`;
    return;
  }

  list.forEach(order => grid.appendChild(createOrderCard(order)));
}

const BADGES = {
  baru:    `<span class="order-status-badge badge-baru">🟡 Baru</span>`,
  proses:  `<span class="order-status-badge badge-proses">🔵 Diproses</span>`,
  selesai: `<span class="order-status-badge badge-selesai">🟢 Selesai</span>`,
  batal:   `<span class="order-status-badge badge-batal">🔴 Dibatal</span>`,
};

function createOrderCard(order) {
  const card = document.createElement("div");
  card.className = `order-card status-${order.status}`;

  const visible   = order.items.slice(0, 3);
  const extraCnt  = order.items.length - 3;
  const itemsHtml = visible.map(i =>
    `<div class="order-item-row"><span>${i.emoji} ${i.name}</span><span class="item-qty">×${i.qty}</span></div>`
  ).join("") + (extraCnt > 0 ? `<div class="order-more">+${extraCnt} item lainnya...</div>` : "");

  const noteHtml = order.note ? `<div class="order-note">${order.note}</div>` : "";

  let actionBtns = `<button class="act-btn act-detail" onclick="openDetail('${order.firebaseKey}')">📋 Detail</button>`;
  if (order.status === "baru") {
    actionBtns += `<button class="act-btn act-proses" onclick="updateStatus('${order.firebaseKey}','proses')">🔵 Proses</button>`;
    actionBtns += `<button class="act-btn act-batal"  onclick="updateStatus('${order.firebaseKey}','batal')">✕ Batal</button>`;
  } else if (order.status === "proses") {
    actionBtns += `<button class="act-btn act-selesai" onclick="updateStatus('${order.firebaseKey}','selesai')">✅ Selesai</button>`;
  }

  card.innerHTML = `
    <div class="order-card-header">
      <div>
        <div class="order-id">${order.id}</div>
        <div class="order-table">🪑 Meja ${order.table}</div>
      </div>
      ${BADGES[order.status] || ""}
    </div>
    <div class="order-card-items">${itemsHtml}</div>
    ${noteHtml}
    <div class="order-card-footer">
      <span class="order-total">${formatRp(order.total)}</span>
      <span class="order-time">🕐 ${order.time}</span>
    </div>
    <div class="order-actions">${actionBtns}</div>`;
  return card;
}

// ── UPDATE STATUS ──────────────────────────────────────────
window.updateStatus = async (firebaseKey, newStatus) => {
  try {
    await update(ref(db, `orders/${firebaseKey}`), { status: newStatus });
    const msgs = { proses: "🔵 Pesanan sedang diproses", selesai: "✅ Pesanan selesai!", batal: "🔴 Pesanan dibatalkan" };
    showToast(msgs[newStatus] || "Status diperbarui");
    if (detailKey === firebaseKey) openDetail(firebaseKey);
  } catch (err) {
    console.error(err);
    showToast("❌ Gagal memperbarui status");
  }
};

// ── CLEAR DONE ─────────────────────────────────────────────
window.clearDone = async () => {
  if (!confirm("Hapus semua pesanan selesai & dibatalkan?")) return;
  const toDelete = allOrders.filter(o => o.status === "selesai" || o.status === "batal");
  try {
    await Promise.all(toDelete.map(o => remove(ref(db, `orders/${o.firebaseKey}`))));
    showToast("🗑 Pesanan selesai dihapus");
  } catch (err) {
    console.error(err);
    showToast("❌ Gagal menghapus");
  }
};

// ── DETAIL MODAL ───────────────────────────────────────────
window.openDetail = (firebaseKey) => {
  detailKey = firebaseKey;
  const order = allOrders.find(o => o.firebaseKey === firebaseKey);
  if (!order) return;

  document.getElementById("detailTitle").textContent = `Detail — ${order.id}`;

  const itemsHtml = order.items.map(i => `
    <div class="detail-item-line">
      <span>${i.emoji} ${i.name}</span>
      <span>${i.qty} × ${formatRp(i.price)} = <strong>${formatRp(i.price * i.qty)}</strong></span>
    </div>`).join("");

  document.getElementById("detailBody").innerHTML = `
    <div class="detail-row"><span class="label">Order ID</span><span class="val">${order.id}</span></div>
    <div class="detail-row"><span class="label">Meja</span><span class="val">Meja ${order.table}</span></div>
    <div class="detail-row"><span class="label">Waktu</span><span class="val">${order.time}</span></div>
    <div class="detail-row"><span class="label">Status</span><span class="val">${order.status.toUpperCase()}</span></div>
    ${order.note ? `<div class="detail-row"><span class="label">Catatan</span><span class="val">${order.note}</span></div>` : ""}
    <div class="detail-items-title">Item Pesanan</div>
    ${itemsHtml}
    <div class="detail-row" style="margin-top:12px;font-size:1rem">
      <span class="label">TOTAL</span>
      <span class="val" style="color:var(--gold-light);font-size:1.1rem">${formatRp(order.total)}</span>
    </div>`;

  const actions = document.getElementById("detailActions");
  actions.innerHTML = `<button class="act-btn act-detail" onclick="closeDetail()">Tutup</button>`;
  if (order.status === "baru") {
    actions.innerHTML += `
      <button class="act-btn act-proses"  onclick="updateStatus('${firebaseKey}','proses')">🔵 Proses</button>
      <button class="act-btn act-batal"   onclick="updateStatus('${firebaseKey}','batal')">✕ Batal</button>`;
  } else if (order.status === "proses") {
    actions.innerHTML += `
      <button class="act-btn act-selesai" onclick="updateStatus('${firebaseKey}','selesai')">✅ Selesai</button>`;
  }

  document.getElementById("detailModal").classList.add("open");
};

window.closeDetail = () => {
  document.getElementById("detailModal").classList.remove("open");
  detailKey = null;
};

// ── CLOCK ──────────────────────────────────────────────────
function updateClock() {
  const el = document.getElementById("clockDisplay");
  if (el) el.textContent = new Date().toLocaleTimeString("id-ID");
}
updateClock();
setInterval(updateClock, 1000);

// ── REFRESH BUTTON ──────────────────────────────────────────
window.loadOrders = () => showToast("🔄 Data selalu real-time dari Firebase!");

// ── TOAST ──────────────────────────────────────────────────
function showToast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 3000);
}
