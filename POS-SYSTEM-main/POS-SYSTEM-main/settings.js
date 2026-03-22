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

// SAVE ACCOUNT SETTINGS
document.getElementById("saveAccount").addEventListener("click", () => {
  localStorage.setItem("fullname", document.getElementById("fullname").value);
  localStorage.setItem("username", document.getElementById("username").value);
  localStorage.setItem("email", document.getElementById("email").value);
  localStorage.setItem("password", document.getElementById("password").value);

  showAlert("Account settings saved!");
});

// SAVE STORE SETTINGS
document.getElementById("saveStore").addEventListener("click", () => {
  localStorage.setItem("storeName", document.getElementById("storeName").value);
  localStorage.setItem("storeEmail", document.getElementById("storeEmail").value);
  localStorage.setItem("contactNumber", document.getElementById("contactNumber").value);

  showAlert("Store info saved!");
});

// SAVE TAX SETTINGS
document.getElementById("saveTax").addEventListener("click", () => {
  localStorage.setItem("taxRate", document.getElementById("taxRate").value);
  localStorage.setItem("stockAlert", document.getElementById("stockAlert").value);

  showAlert("Tax & alerts saved!");
});

window.onload = () => {
  // Account
  document.getElementById("fullname").value = localStorage.getItem("fullname") || "";
  document.getElementById("username").value = localStorage.getItem("username") || "";
  document.getElementById("email").value = localStorage.getItem("email") || "";
  document.getElementById("password").value = localStorage.getItem("password") || "";

  // Store
  document.getElementById("storeName").value = localStorage.getItem("storeName") || "";
  document.getElementById("storeEmail").value = localStorage.getItem("storeEmail") || "";
  document.getElementById("contactNumber").value = localStorage.getItem("contactNumber") || "";

  // Tax
  document.getElementById("taxRate").value = localStorage.getItem("taxRate") || 5;
  document.getElementById("stockAlert").value = localStorage.getItem("stockAlert") || 5;
};

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

