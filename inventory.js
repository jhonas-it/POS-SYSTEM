// ── TEMPORARY DATA ────────────────────────────────────────────
const inventoryData = [
  { id: "BITCH-051", name: "Dark Choco Macchiato", stock: 31 },
  { id: "BITCH-201", name: "Matcha Overload",      stock: 314 },
  { id: "BITCH-501", name: "Mango Overload",       stock: 214 },
  { id: "BITCH-301", name: "Caramel Chocolate",    stock: 3 },
  { id: "BITCH-021", name: "Caramel Overload",     stock: 63 },
  { id: "FOOD-001",  name: "Cheese Bread",         stock: 0 },
];

// ── RENDER TABLE ──────────────────────────────────────────────
function renderTable(data) {
  const tbody = document.getElementById("inventoryTable");

  tbody.innerHTML = data.map((item, index) => {
    const { statusText, statusClass, isDanger } = getStatus(item.stock);
    return `
      <tr class="${isDanger ? "row-danger" : ""}" data-index="${index}">
        <td>${item.name}</td>
        <td><span class="status ${statusClass}">${statusText}<Aspan></td>
        <td class="stock">${item.stock}</td>
        <td>
          <div class="update-wrapper">
            <input type="number" class="update-input" placeholder="Upd qty" min="0" />
            <button class="update-btn" title="Save">
              <i data-lucide="save"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join("");

  // Rebind update buttons
  tbody.querySelectorAll(".update-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const row   = btn.closest("tr");
      const idx   = parseInt(row.dataset.index);
      const input = row.querySelector(".update-input");
      const val   = parseInt(input.value);

      if (isNaN(val) || val < 0) {
        alert("Please enter a valid number.");
        return;
      }

      inventoryData[idx].stock = val;
      input.value = "";
      renderTable(getCurrentData());
      updateStats();
      lucide.createIcons();
    });
  });

  lucide.createIcons();
}

// ── STATUS HELPER ─────────────────────────────────────────────
function getStatus(stock) {
  if (stock === 0)  return { statusText: "Out of Stock", statusClass: "out",  isDanger: true  };
  if (stock < 10)   return { statusText: "Low Stock",    statusClass: "low",  isDanger: true  };
  return              { statusText: "In Stock",     statusClass: "",     isDanger: false };
}

// ── UPDATE STATS ──────────────────────────────────────────────
function updateStats() {
  const data = getCurrentData();

  document.getElementById("totalItems").textContent = data.length;

  const lowCount = data.filter(i => i.stock < 10).length;
  document.getElementById("lowStock").textContent = lowCount;

  // Toggle danger style on low stock box
  const box = document.getElementById("lowStockBox");
  if (lowCount > 0) {
    box.classList.add("stat-danger");
  } else {
    box.classList.remove("stat-danger");
  }

  lucide.createIcons();
}

// ── SEARCH ────────────────────────────────────────────────────
document.getElementById("searchInput").addEventListener("input", e => {
  const q = e.target.value.toLowerCase().trim();
  const filtered = inventoryData.filter(item =>
    item.name.toLowerCase().includes(q) ||
    item.id.toLowerCase().includes(q)
  );
  renderTable(filtered);
  lucide.createIcons();
});

// ── HELPER: get current search-filtered data ──────────────────
function getCurrentData() {
  const q = document.getElementById("searchInput").value.toLowerCase().trim();
  if (!q) return inventoryData;
  return inventoryData.filter(i =>
    i.name.toLowerCase().includes(q) || i.id.toLowerCase().includes(q)
  );
}

// ── INIT ──────────────────────────────────────────────────────
renderTable(inventoryData);
updateStats();