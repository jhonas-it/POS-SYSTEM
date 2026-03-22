// DOM Elements
const showPw = document.getElementById('showPw');
const usernameInput = document.getElementById('username');
const password = document.getElementById('password');
const loginBtn = document.getElementById('loginBtn');
const alertsContainer = document.getElementById('alertsContainer');

// Toggle password visibility
showPw.addEventListener('change', () => {
  password.type = showPw.checked ? 'text' : 'password';
});

// Update button color based on input fields
function updateButtonColor() {
  if (usernameInput.value.trim() !== "" && password.value.trim() !== "") {
    loginBtn.style.backgroundColor = "#d9840d"; // bright color when filled
  } else {
    loginBtn.style.backgroundColor = "#825417"; // darker color when empty
  }
}

// Listen for input changes
usernameInput.addEventListener('input', updateButtonColor);
password.addEventListener('input', updateButtonColor);

// Function to show alert message
function showAlerts(message) {
  const alerts = document.createElement('div');
  alerts.classList.add('alerts');

  const icon = document.createElement('img');
  icon.src = "svgs/AlertLogo.svg"; // change path if needed
  icon.classList.add("alert-icon");

  const text = document.createElement('span');
  text.textContent = message;

  alerts.appendChild(icon);
  alerts.appendChild(text);

  alertsContainer.appendChild(alerts);

  setTimeout(() => {
    alerts.remove();
  }, 3500);
}

// Login click handler
loginBtn.addEventListener('click', () => {
  const name = usernameInput.value.trim();
  const pw = password.value.trim();

  if (!name || !pw) {
    showAlerts('Please fill in both username and password');
    return;
  }

  // OPTIONAL(for moving purposes): simple login validation
  if (name === "admin" && pw === "admin123") {

    // SAVE USER
    localStorage.setItem("loggedInUser", name);

    // REDIRECT
    window.location.href = "dashboard.html";

    } else if (name === "cashier" && pw === "cashier123") {
          // SAVE USER
          localStorage.setItem("loggedInUser", name);

          // REDIRECT
          window.location.href = "cashier.html";
      }else {
        showAlerts("Invalid username or password");
        }
    });

// Enter key triggers login
document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') loginBtn.click();
});

// Initialize button color on page load
updateButtonColor();