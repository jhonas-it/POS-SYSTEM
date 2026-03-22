
document.addEventListener("DOMContentLoaded", function(){


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

// STAFF DATA
let staff = [
  { name:"Jhonnas Pogi", role:"Manager", email:"jhonnas@gmail.com", phone:"0994567891", status:"active", img:"https://i.pravatar.cc/200?img=1" },
  { name:"Jhonnas tlog", role:"Cashier", email:"tlog@gmail.com", phone:"0994567891", status:"active", img:"https://i.pravatar.cc/200?img=2" },
  { name:"Jhonnas Unggoy", role:"Manager", email:"unggoy@gmail.com", phone:"0994567891", status:"off", img:"https://i.pravatar.cc/200?img=3" }
];

let staffIndexToDelete = null;
const managerPassword = "admin123";

// MODAL ELEMENTS
const modal = document.getElementById("addStaffModal");
const addBtn = document.querySelector(".addBtn");
const cancelBtn = document.querySelector(".cancelBtn");
const addForm = document.getElementById("addStaffForm");

const deleteModal = document.getElementById("deleteModal");
const confirmDeleteBtn = document.querySelector(".confirmDeleteBtn");
const cancelDeleteBtn = document.querySelector(".cancelDeleteBtn");

const togglePassword = document.getElementById("togglePassword");
const passwordInput = document.getElementById("managerPassword");

togglePassword.addEventListener("click", function(){

  if(passwordInput.type === "password"){
    passwordInput.type = "text";
  } else {
    passwordInput.type = "password";
  }

});

// DISPLAY STAFF
function displayStaff(list) {

  let grid = document.getElementById("staffGrid");
  let htmlContent = "";

  list.forEach((s, index) => {

    let statusClass = s.status == "active" ? "active" : "off";
    let roleClass = s.role.toLowerCase();
    let textStatusClass = s.status == "active" ? "status-active" : "status-off";

    htmlContent += `
      <div class="card">
        <div class="status-label">
          <div class="status-dot ${statusClass}"></div>
          <span class="status-text ${textStatusClass}">
          ${s.status == "active" ? "Active" : "Off Duty"}
          </span>
        </div>

        
        <div class="name">${s.name}</div>
        <div class="role ${roleClass}">${s.role}</div>

        <div class="info"><i data-lucide="mail"></i> ${s.email}</div>
        <div class="info"><i data-lucide="phone"></i> ${s.phone}</div>

        <button class="deleteBtn" onclick="deleteStaff(${index})">
          <i data-lucide="trash-2"></i>
        </button>

      </div>
    `;

  });

  grid.innerHTML = htmlContent;
  lucide.createIcons();
}

displayStaff(staff);

// SEARCH
document.getElementById("search").addEventListener("keyup", function(){

  let value = this.value.toLowerCase();

  let filtered = staff.filter(s =>
    s.name.toLowerCase().includes(value)
  );

  displayStaff(filtered);

});

// DELETE BUTTON CLICK
window.deleteStaff = function(index){

  staffIndexToDelete = index;
  deleteModal.style.display = "flex";

};

// VERIFY DELETE
confirmDeleteBtn.addEventListener("click", function(){

  let enteredPassword = document.getElementById("managerPassword").value;

  if(enteredPassword === managerPassword){

    staff.splice(staffIndexToDelete,1);
    displayStaff(staff);

    deleteModal.style.display = "none";
    document.getElementById("managerPassword").value = "";

  }
  else{
    showAlert("Incorrect manager password!");
  }

});

// CANCEL DELETE
cancelDeleteBtn.addEventListener("click", function(){

  deleteModal.style.display = "none";
  document.getElementById("managerPassword").value = "";

});

// OPEN ADD MODAL
addBtn.addEventListener("click", ()=>{

  modal.style.display="flex";

});

// CANCEL ADD MODAL
cancelBtn.addEventListener("click", ()=>{

  modal.style.display="none";
  addForm.reset();

});

// ADD STAFF
addForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = new FormData(addForm);
  const enteredPassword = formData.get("password"); // This targets name="password" in your HTML

  // CHECK PASSWORD
  if (enteredPassword === managerPassword) {
    staff.push({
      name: formData.get("name"),
      role: formData.get("role"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      status: "active",
      img: "https://i.pravatar.cc/200"
    });

    displayStaff(staff);
    showAlert("New staff member added!"); // Success Alert

    modal.style.display = "none";
    addForm.reset();
  } else {
    // WRONG PASSWORD
    showAlert("Incorrect manager password!");
    // Optional: clear only the password field so they can try again
    addForm.querySelector('input[name="password"]').value = "";
  }
});

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