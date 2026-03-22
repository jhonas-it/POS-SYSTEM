const alertsContainer = document.getElementById("alertsContainer");

function showAlert(message) {
    const alertBox = document.createElement("div");
    alertBox.classList.add("alerts");

    const icon = document.createElement("img");
    icon.src = "svgs/AlertLogo.svg"; 
    icon.classList.add("alert-icon");

    const text = document.createElement("span");
    text.textContent = message;

    alertBox.appendChild(icon);
    alertBox.appendChild(text);
    alertsContainer.appendChild(alertBox);

    setTimeout(() => {
        alertBox.remove();
    }, 3500);
}

let pendingProduct = null;
let selectedRow = null;

// ===============================
// MODAL CONTROLS
// ===============================
function openModal(id) {
    document.getElementById(id).style.display = "flex";
}

function closeModal(id) {
    document.getElementById(id).style.display = "none";
}

// CLOSE WHEN CLICK OUTSIDE
window.onclick = function (e) {
    document.querySelectorAll(".modal").forEach(modal => {
        if (e.target === modal) {
            modal.style.display = "none";
        }
    });
};

// ===============================
// OPEN TYPE FLOW
// ===============================
function openFoodModal() {
    closeModal("typeModal");
    openModal("foodModal");
}

function openDrinkModal() {
    closeModal("typeModal");
    openModal("drinkModal");
}

// ===============================
// SKU GENERATOR
// ===============================
function generateSKU(name) {
    const prefix = name.substring(0, 4).toUpperCase();
    const random = Math.floor(Math.random() * 900 + 100);
    return `${prefix}-${random}`;
}

// ===============================
// SAVE FOOD
// ===============================
function saveFood() {
    const name = document.getElementById("foodName").value;
    const price = document.getElementById("foodPrice").value;

    if (!name || !price) {
        showAlert("Fill all fields");
        return;
    }

    pendingProduct = {
        type: "Food",
        name,
        price
    };

    document.getElementById("confirmName").innerText = name;
    document.getElementById("confirmCategory").innerText = "Food";
    document.getElementById("confirmPrice").innerText =
        parseFloat(price).toFixed(2);

    closeModal("foodModal");
    openModal("confirmModal");
}

// ===============================
// IMAGE PREVIEW (FOOD)
// ===============================
document.getElementById("foodImageInput").addEventListener("change", function () {
    const file = this.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        const img = document.getElementById("foodPreview");
        img.src = e.target.result;
        img.style.display = "block";
    };
    reader.readAsDataURL(file);
});

// ===============================
// SAVE DRINK
// ===============================
function saveDrink() {
    const name = document.getElementById("drinkName").value;
    const small = document.getElementById("smallPrice").value;
    const medium = document.getElementById("mediumPrice").value;
    const large = document.getElementById("largePrice").value;

    if (!name || !small || !medium || !large) {
        showAlert("Fill all fields");
        return;
    }

    pendingProduct = {
        type: "Drink",
        name,
        sizes: [
            { label: "S", price: small },
            { label: "M", price: medium },
            { label: "L", price: large }
        ]
    };

    document.getElementById("confirmName").innerText = name;
    document.getElementById("confirmCategory").innerText = "Drink";
    document.getElementById("confirmPrice").innerText =
        `${small} / ${medium} / ${large}`;

    closeModal("drinkModal");
    openModal("confirmModal");
}

// ===============================
// IMAGE PREVIEW (DRINK)
// ===============================
document.getElementById("drinkImageInput").addEventListener("change", function () {
    const file = this.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        const img = document.getElementById("drinkPreview");
        img.src = e.target.result;
        img.style.display = "block";
    };
    reader.readAsDataURL(file);
});

// ===============================
// UPDATE PRODUCT
// ===============================
function openUpdateModal(btn) {
    selectedRow = btn.closest("tr");

    const cells = selectedRow.querySelectorAll("td");

    const name = cells[0].innerText;
    const sku = cells[1].innerText;
    const category = cells[2].innerText.trim();
    const price = cells[3].innerText.replace("₱", "");

    document.querySelector("#updateModal input[placeholder='Product name']").value = name;
    document.querySelector("#updateModal .row input[type='text']").value = sku;
    document.querySelector("#updateModal input[type='number']").value = price;

    document.getElementById("updateCategory").value = category;

    openModal("updateModal");
}

document.querySelector("#updateModal .saveBtn").addEventListener("click", function () {
    if (!selectedRow) return;

    const name = document.querySelector("#updateModal input[placeholder='Product name']").value;
    const sku = document.querySelector("#updateModal .row input[type='text']").value;
    const price = document.querySelector("#updateModal input[type='number']").value;
    const category = document.getElementById("updateCategory").value;

    if (!name || !sku || !price || !category) {
        showAlert("Please fill all fields");
        return;
    }

    const cells = selectedRow.querySelectorAll("td");

    cells[0].innerText = name;
    cells[1].innerText = sku;
    cells[2].innerHTML = `<span class="badge">${category}</span>`;
    cells[3].innerText = `₱${parseFloat(price).toFixed(2)}`;

    selectedRow = null;
    closeModal("updateModal");
});

// ===============================
// DELETE PRODUCT
// ===============================
function openDeleteModal(btn) {
    selectedRow = btn.closest("tr");
    openModal("deleteModal");
}

document.querySelector("#deleteModal .deleteBtn").addEventListener("click", function () {
    if (selectedRow) {
        selectedRow.remove();
        selectedRow = null;
    }
    closeModal("deleteModal");
});

// ===============================
// SEARCH
// ===============================
document.getElementById("searchInput").addEventListener("keyup", function () {
    const value = this.value.toLowerCase();
    const rows = document.querySelectorAll("#productTable tr");

    rows.forEach(row => {
        const text = row.innerText.toLowerCase();
        row.style.display = text.includes(value) ? "" : "none";
    });
});

// ===============================
// CONFIRM SAVE
// ===============================
function confirmSave() {
    const password = document.getElementById("managerPassword").value;

    if (password !== "admin123") {
        showAlert("Incorrect password");
        return;
    }

    if (!pendingProduct) return;

    const table = document.getElementById("productTable");

    // FOOD
    if (pendingProduct.type === "Food") {
        const sku = generateSKU(pendingProduct.name);

        table.innerHTML += `
            <tr>
                <td>${pendingProduct.name}</td>
                <td>${sku}</td>
                <td><span class="badge">Food</span></td>
                <td>₱${parseFloat(pendingProduct.price).toFixed(2)}</td>
                <td>
                    <button onclick="openUpdateModal(this)" class="edit">
                        <i data-lucide="pencil"></i>
                    </button>
                    <button onclick="openDeleteModal(this)" class="delete">
                        <i data-lucide="trash-2"></i>
                    </button>
                </td>
            </tr>
        `;
    }

    // DRINK
    if (pendingProduct.type === "Drink") {
        pendingProduct.sizes.forEach(size => {
            const sku = generateSKU(pendingProduct.name + size.label);

            table.innerHTML += `
                <tr>
                    <td>${pendingProduct.name}</td>
                    <td>${sku}</td>
                    <td><span class="badge">Drink</span></td>
                    <td>₱${parseFloat(size.price).toFixed(2)}</td>
                    <td>
                        <button onclick="openUpdateModal(this)" class="edit">
                            <i data-lucide="pencil"></i>
                        </button>
                        <button onclick="openDeleteModal(this)" class="delete">
                            <i data-lucide="trash-2"></i>
                        </button>
                    </td>
                </tr>
            `;
        });
    }

    // RESET
    pendingProduct = null;
    document.getElementById("managerPassword").value = "";

    closeModal("confirmModal");

    lucide.createIcons();

    document.getElementById("successText").innerText = "Product added!";
    document.getElementById("generatedSKU").innerText = "Generated";

    openModal("successModal");

    
}

function confirmLogout() {
    // Redirect to login page
    window.location.href = "login.html";
}

