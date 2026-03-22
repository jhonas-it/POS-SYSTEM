let activePeriod = "daily";
let salesChartInstance = null;

// ─── DATA ─────────────────────────────────────────────────────────────────────

const dashboardData = {
  daily: {
    sales: 1000,
    transactions: 2,
    avg: 500,
    lowStock: 0,
    salesSub: "Today",
    chartTitle: "Revenue Overview",
    chartSub: "Today Breakdown",
    chartLabels: ["8:00","10:00","12:00","14:00","16:00","18:00","20:00","22:00"],
    chartValues: [0, 0, 0, 4321, 5321, 0, 0, 0],
    topProducts: [
      { name: "Jr Lucero", sold: 14, amount: 712 },
      { name: "Jr Lucero", sold: 6,  amount: 796 },
      { name: "Jr Lucero", sold: 3,  amount: 412 },
      { name: "Jr Lucero", sold: 3,  amount: 212 },
      { name: "Jr Lucero", sold: 2,  amount: 132 },
    ]
  },
  weekly: {
    sales: 7000,
    transactions: 15,
    avg: 467,
    lowStock: 5,
    salesSub: "This Week",
    chartTitle: "Revenue Overview",
    chartSub: "Weekly Breakdown",
    chartLabels: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],
    chartValues: [800, 1200, 900, 1500, 1100, 1000, 500],
    topProducts: [
      { name: "Jr Lucero", sold: 40, amount: 3200 },
      { name: "Jr Lucero", sold: 28, amount: 2100 },
      { name: "Jr Lucero", sold: 20, amount: 1400 },
      { name: "Jr Lucero", sold: 15, amount: 900  },
      { name: "Jr Lucero", sold: 10, amount: 400  },
    ]
  },
  monthly: {
    sales: 30000,
    transactions: 60,
    avg: 500,
    lowStock: 8,
    salesSub: "This Month",
    chartTitle: "Revenue Overview",
    chartSub: "Monthly Breakdown",
    chartLabels: ["Wk 1","Wk 2","Wk 3","Wk 4"],
    chartValues: [6000, 8500, 9000, 6500],
    topProducts: [
      { name: "Jr Lucero", sold: 120, amount: 9600 },
      { name: "Jr Lucero", sold: 90,  amount: 7200 },
      { name: "Jr Lucero", sold: 60,  amount: 4800 },
      { name: "Jr Lucero", sold: 40,  amount: 3200 },
      { name: "Jr Lucero", sold: 25,  amount: 1200 },
    ]
  }
};

// ─── INIT ─────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activePeriod = btn.dataset.period;
      updateDashboard();
    });
  });

  updateDashboard();
});

// ─── UPDATE ───────────────────────────────────────────────────────────────────

function updateDashboard() {
  const d = dashboardData[activePeriod];

  // Stat cards
  document.getElementById("sales").textContent        = "₱" + d.sales.toLocaleString() + ".00";
  document.getElementById("transactions").textContent = d.transactions;
  document.getElementById("avg").textContent          = "₱" + d.avg.toLocaleString() + ".00";
  document.getElementById("lowStock").textContent     = d.lowStock;
  document.getElementById("salesSub").textContent     = d.salesSub;

  // Low stock danger highlight — red only when there ARE low stock items
  const lowStockCard = document.getElementById("lowStockCard");
const badge = lowStockCard.querySelector(".card-badge");

if (d.lowStock > 0) {
    lowStockCard.classList.add("danger");
    badge.style.background = "rgba(239,68,68,0.15)";
    badge.style.borderColor = "rgba(239,68,68,0.4)";
    badge.style.color = "#ef4444";
} else {
    lowStockCard.classList.remove("danger");
    badge.style.background = "rgba(0,201,80,0.15)";
    badge.style.borderColor = "rgba(0,201,80,0.4)";
    badge.style.color = "#00c950";
}

  // Chart header
  document.getElementById("chartTitle").textContent = d.chartTitle;
  document.getElementById("chartSub").textContent   = d.chartSub;

  // Badge = total sales for the period
  document.getElementById("chartBadge").textContent = "₱" + d.sales.toLocaleString();

  updateChart(d);
  updateTopProducts(d.topProducts);
  animateElements();

  if (window.lucide) lucide.createIcons();
}

// ─── CHART ────────────────────────────────────────────────────────────────────

function updateChart(d) {
  const ctx = document.getElementById("salesChart").getContext("2d");
  if (salesChartInstance) salesChartInstance.destroy();

  const peak = Math.max(...d.chartValues);

  salesChartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels: d.chartLabels,
      datasets: [{
        data: d.chartValues,
        backgroundColor: "#d9840d",
        borderColor:     "#d9840d",
        borderWidth: 1.5,
        borderRadius: 5,
        borderSkipped: false,
        barPercentage: 1.2,       
        categoryPercentage: 0.5,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          displayColors: false,  
          backgroundColor: "#1e1917",
          borderColor: "#453f3a",
          borderWidth: 1.5,
          titleColor: "#fcfaf8",
          bodyColor: "#d9840d",
          padding: 10,
          callbacks: {
            label: ctx => " Sales: ₱" + ctx.raw.toLocaleString()
          }
        }
      },
      scales: {
        x: {
          grid: { color: "rgba(255,255,255,0.04)" },
          ticks: { color: "rgba(252,250,248,0.45)", font: { size: 11 } },
          border: { color: "transparent" }
        },
        y: {
          grid: { color: "rgba(255,255,255,0.06)" },
          ticks: {
            color: "rgba(252,250,248,0.45)",
            font: { size: 11 },
            callback: v => v === 0 ? "₱0" : "₱" + (v / 1000).toFixed(0) + "k"
          },
          border: { color: "transparent" }
        }
      }
    }
  });
}

// ─── TOP PRODUCTS ─────────────────────────────────────────────────────────────

function updateTopProducts(products) {
  const list = document.getElementById("topProductsList");
  list.innerHTML = "";
  const maxAmt = Math.max(...products.map(p => p.amount));

  products.forEach(p => {
    const pct = Math.round((p.amount / maxAmt) * 100);
    const el = document.createElement("div");
    el.className = "product";
    el.innerHTML = `
      <span class="product-name">${p.name}</span>
      <span class="product-amount">₱${p.amount.toLocaleString()}</span>
      <span class="product-sold">${p.sold} Sold</span>
      <div class="product-bar-track">
        <div class="product-bar-fill" style="width:${pct}%"></div>
      </div>`;
    list.appendChild(el);
  });
}

// ─── ANIMATION ────────────────────────────────────────────────────────────────

function animateElements() {
  document.querySelectorAll(".card, .chart-card, .quick-card, .top-products, .product").forEach(el => {
    el.classList.remove("animate");
    void el.offsetWidth;
    el.classList.add("animate");
  });
}

// ─── SCROLL FIX ───────────────────────────────────────────────────────────────
// overflow-y: auto clips transforms, so we handle scroll manually
const scroller = document.querySelector(".main-scroll");
if (scroller) {
    scroller.style.overflow = "visible";
    scroller.style.height = "auto";
}

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