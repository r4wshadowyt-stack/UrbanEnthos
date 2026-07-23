const user = JSON.parse(localStorage.getItem("user"));

const guestMenu = document.getElementById("guestMenu");
const userMenu = document.getElementById("userMenu");
const userName = document.getElementById("userName");

if (user) {
    guestMenu.style.display = "none";
    userMenu.style.display = "block";
    userName.textContent = user.name;
} else {
    guestMenu.style.display = "flex";
    userMenu.style.display = "none";
}

document.getElementById("logoutBtn")?.addEventListener("click", (e) => {
    e.preventDefault();

    localStorage.removeItem("user");
    localStorage.removeItem("token");

    window.location.href = "login.html";
});