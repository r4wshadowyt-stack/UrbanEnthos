// ======================================
// DASHBOARD
// ======================================

// Temporary user (Later comes from MongoDB)

const user = {

    name: "Bal Kishan",

    orders: 0,

    wishlist: 0,

    cart: 0,

    spent: 0

};

// ======================================
// SHOW USER NAME
// ======================================

document.getElementById("username").textContent = user.name;

// ======================================
// UPDATE STATS
// ======================================

const cards = document.querySelectorAll(".card h2");

cards[0].textContent = user.orders;

cards[1].textContent = user.wishlist;

cards[2].textContent = user.cart;

cards[3].textContent = "₹" + user.spent;

// ======================================
// CARD HOVER EFFECT
// ======================================

const dashboardCards = document.querySelectorAll(".card");

dashboardCards.forEach(card=>{

    card.addEventListener("mouseenter",()=>{

        card.style.transform="translateY(-8px) scale(1.02)";

    });

    card.addEventListener("mouseleave",()=>{

        card.style.transform="translateY(0px) scale(1)";

    });

});

// ======================================
// LOGOUT
// ======================================

const logout=document.querySelector(".menu li:last-child a");

logout.addEventListener("click",(e)=>{

    e.preventDefault();

    const confirmLogout=confirm("Do you want to logout?");

    if(confirmLogout){

        localStorage.removeItem("token");

        localStorage.removeItem("user");

        window.location.href="login.html";

    }

});

// ======================================
// TABLE ANIMATION
// ======================================

const rows=document.querySelectorAll("tbody tr");

rows.forEach((row,index)=>{

    row.style.opacity="0";

    row.style.transform="translateY(20px)";

    setTimeout(()=>{

        row.style.transition=".5s";

        row.style.opacity="1";

        row.style.transform="translateY(0px)";

    },index*150);

});

// ======================================
// PROFILE IMAGE EFFECT
// ======================================

const profile=document.querySelector(".profile img");

profile.addEventListener("click",()=>{

    alert("Profile page coming soon 🚀");

});

// ======================================
// MENU ACTIVE
// ======================================

const menuLinks=document.querySelectorAll(".menu li");

menuLinks.forEach(item=>{

    item.addEventListener("click",()=>{

        menuLinks.forEach(link=>{

            link.classList.remove("active");

        });

        item.classList.add("active");

    });

});

// ======================================
// WELCOME MESSAGE
// ======================================

window.addEventListener("load",()=>{

    console.log("Welcome to UrbanEthos Dashboard 🚀");

});