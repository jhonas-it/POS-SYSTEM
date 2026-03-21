/**
 * CONFIGURATION & STATE
 */
let activePeriod = "daily";
let revChart = null;
let transChart = null;

/**
 * 1. MOCK DATA SOURCE
 */
const mockData = {
    daily: {
        labels: ["Mar 01", "Mar 02", "Mar 03", "Mar 04", "Mar 05", "Mar 06", "Mar 07", "Mar 08", "Mar 09", "Mar 10", "Mar 11", "Mar 12", "Mar 13", "Mar 14", "Mar 15"],
        revenue: [1200, 1500, 800, 1900, 2200, 1100, 1400, 1600, 1300, 1700, 900, 2100, 1800, 1550, 2000],
        transactions: [30, 35, 20, 45, 50, 25, 32, 38, 29, 40, 22, 48, 41, 36, 42]
    },
    weekly: {
        labels: ["Wk 01", "Wk 02", "Wk 03", "Wk 04", "Wk 05", "Wk 06", "Wk 07", "Wk 08", "Wk 09", "Wk 10", "Wk 11", "Wk 12", "Wk 13"],
        revenue: [8500, 7200, 9300, 6800, 8100, 9000, 7500, 8800, 7000, 9500, 8200, 8900, 9100],
        transactions: [210, 180, 240, 170, 200, 230, 190, 220, 175, 250, 215, 225, 235]
    },
    monthly: {
        labels: ["Jan 23", "Feb 23", "Mar 23", "Apr 23", "May 23", "Jun 23", "Jul 23", "Aug 23", "Sep 23", "Oct 23", "Nov 23", "Dec 23", "Jan 24"],
        revenue: [45000, 52000, 48000, 61000, 55000, 59000, 63000, 58000, 60000, 65000, 70000, 75000, 80000],
        transactions: [1100, 1300, 1200, 1500, 1400, 1450, 1600, 1550, 1500, 1700, 1800, 1950, 2100]
    },
    products: [
        { name: "Quarter Pounder", sold: 156, revenue: 23400.00 },
        { name: "Large Fries", sold: 120, revenue: 10200.00 },
        { name: "Caramel Macchiato", sold: 98, revenue: 14700.00 },
        { name: "Chicken Sandwich", sold: 85, revenue: 12750.00 }
    ],
    history: [
        { receipt: "RCP-20260312-F31303", items: 2, cashier: "Jhonas pogi", total: 0.01, date: "Mar 19, 2026", time: "10:10 PM" },
        { receipt: "RCP-20260312-F31304", items: 5, cashier: "Jhonas pogi", total: 450.00, date: "Mar 19, 2026", time: "10:15 PM" },
        { receipt: "RCP-20260312-F31305", items: 1, cashier: "Jhonas pogi", total: 120.00, date: "Mar 19, 2026", time: "10:20 PM" },
        { receipt: "RCP-20260312-F31306", items: 3, cashier: "Jhonas pogi", total: 890.00, date: "Mar 19, 2026", time: "10:30 PM" }
    ]
};

/**
 * 2. DATA FETCHING (FUTURE-PROOF)
 */
async function getLifetimeData() {
    const totalRev = mockData.monthly.revenue.reduce((a, b) => a + b, 0);
    const totalTrans = mockData.monthly.transactions.reduce((a, b) => a + b, 0);
    return { totalRev, totalTrans, avg: totalTrans > 0 ? totalRev / totalTrans : 0 };
}

/**
 * 3. RENDERING FUNCTIONS
 */
async function initDashboard() {
    const stats = await getLifetimeData();
    document.getElementById("total-revenue").textContent = `₱${stats.totalRev.toLocaleString()}`;
    document.getElementById("total-trans").textContent = stats.totalTrans.toLocaleString();
    document.getElementById("avg-ticket").textContent = `₱${stats.avg.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    await refreshCharts();
}

async function refreshCharts() {
    const fullData = mockData[activePeriod];
    const limits = { daily: 14, weekly: 12, monthly: 12 };
    const limit = limits[activePeriod];

    const d = {
        labels: fullData.labels.slice(-limit),
        revenue: fullData.revenue.slice(-limit),
        transactions: fullData.transactions.slice(-limit)
    };
    updateChartsUI(d);
}

async function renderProductTable() {
    const tbody = document.getElementById("product-table-body");
    if (!tbody) return;
    tbody.innerHTML = mockData.products.map((prod, index) => `
        <tr>
            <td style="opacity: 0.5">${index + 1}</td>
            <td>${prod.name}</td>
            <td>${prod.sold}</td>
            <td class="text-orange">₱${prod.revenue.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
        </tr>
    `).join('');
}

async function renderTransactionTable() {
    const tbody = document.getElementById("transactions-table-body");
    if (!tbody) return;
    tbody.innerHTML = mockData.history.map(row => `
        <tr>
            <td style="font-size: 12px; opacity: 0.8;">${row.receipt}</td>
            <td>${row.items} Items</td>
            <td>${row.cashier}</td>
            <td class="text-orange">₱${row.total.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
            <td>
                <div style="font-size: 13px;">${row.date}</div>
                <div style="font-size: 11px; opacity: 0.5;">${row.time}</div>
            </td>
            <td><button class="btn-view" onclick="viewReceipt('${row.receipt}')">View</button></td>
        </tr>
    `).join('');
}

function viewReceipt(id) {
    alert("Opening receipt: " + id);
}

// Re-using your updateChartsUI function here...
function updateChartsUI(d) {
    const periodRevenue = d.revenue.reduce((a, b) => a + b, 0);

    // Peak = label of the highest revenue point
    const peakIndex = d.revenue.indexOf(Math.max(...d.revenue));
    const peakLabel = d.labels[peakIndex];

    // Sub label
    const subLabels = { daily: "Last 14 days", weekly: "Last 12 weeks", monthly: "Last 12 months" };

    // Inject into DOM
    document.getElementById("period-revenue").textContent =
        "₱" + periodRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 });
    document.getElementById("peak-label").textContent = peakLabel;
    document.getElementById("rev-sub").textContent = subLabels[activePeriod];
    const commonOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
            x: { grid: { color: "rgba(255,255,255,0.05)" }, ticks: { color: "rgba(252,250,248,0.5)" } },
            y: { grid: { color: "rgba(255,255,255,0.05)" }, ticks: { color: "rgba(252,250,248,0.5)" } }
        }
    };
    if (revChart) revChart.destroy();
    if (transChart) transChart.destroy();

    revChart = new Chart(document.getElementById("revenueChart"), {
        type: "line",
        data: {
            labels: d.labels,
            datasets: [{ data: d.revenue, borderColor: "#d9840d", backgroundColor: "rgba(217, 132, 13, 0.1)", fill: true, tension: 0.4 }]
        },
        options: commonOptions
    });

    const peak = Math.max(...d.transactions);
    transChart = new Chart(document.getElementById("transactionChart"), {
        type: "bar",
        data: {
            labels: d.labels,
            datasets: [{ data: d.transactions, backgroundColor: d.transactions.map(v => v === peak ? "#d9840d" : "rgba(217, 132, 13, 0.2)"), borderRadius: 5 }]
        },
        options: commonOptions
    });
}

/**
 * 4. EVENT LISTENERS
 */
document.addEventListener('DOMContentLoaded', () => {
    initDashboard();

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activePeriod = btn.dataset.period;
            await refreshCharts();
        });
    });

    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const targetTab = btn.dataset.tab;
            document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
            document.getElementById(targetTab).classList.add('active');
            
            if(targetTab === 'sales-date') await refreshCharts();
            if(targetTab === 'product-sales') await renderProductTable();
            if(targetTab === 'transactions') await renderTransactionTable();
        });
    });
});
function viewReceipt(receiptId) {
    // 1. Find the data (In the future, this would be a fetch call)
    const data = mockData.history.find(r => r.receipt === receiptId);
    if (!data) return;

    // 2. Mocking some items for the specific receipt
    const items = [
        { name: "Cheese Burger", qty: 1, price: 199.00 },
        { name: "Latte", qty: 1, price: 149.00 }
    ];

    // 3. Populate Modal
    document.getElementById("m-receipt-id").textContent = data.receipt;
    document.getElementById("m-date").textContent = data.date;
    document.getElementById("m-time").textContent = data.time;
    document.getElementById("m-cashier").textContent = data.cashier;
    
    const itemsContainer = document.getElementById("m-items-list");
    itemsContainer.innerHTML = items.map(item => `
        <div class="receipt-item">
            <div class="item-info">
                <h5>${item.name} <span style="opacity:0.5">× ${item.qty}</span></h5>
                <p>₱${item.price.toFixed(2)} each</p>
            </div>
            <div class="item-price">₱${(item.price * item.qty).toFixed(2)}</div>
        </div>
    `).join('');

    document.getElementById("m-subtotal").textContent = `₱${data.total.toLocaleString()}`;
    document.getElementById("m-total").textContent = `₱${data.total.toLocaleString()}`;

    // 4. Show Modal
    document.getElementById("receipt-modal").classList.add("active");
    lucide.createIcons(); // Refresh icons inside modal
}

function closeModal() {
    document.getElementById("receipt-modal").classList.remove("active");
}