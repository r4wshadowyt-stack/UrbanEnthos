
// ======================================
// ELEMENTS
// ======================================

const string = document.getElementById("string");
const bulb = document.querySelector(".bulb");
const light = document.getElementById("light");
const loginBox = document.getElementById("loginBox");
const stars = document.getElementById("stars");
const lamp = document.querySelector(".lamp");

let lampOn = false;

// ======================================
// CREATE STARS
// ======================================

for (let i = 0; i < 250; i++) {

    const star = document.createElement("div");

    star.className = "star";

    const size = Math.random() * 3 + 1;

    star.style.width = size + "px";
    star.style.height = size + "px";

    star.style.left = Math.random() * 100 + "%";
    star.style.top = Math.random() * 100 + "%";

    star.style.animationDuration =
        (2 + Math.random() * 3) + "s";

    star.style.animationDelay =
        (Math.random() * 5) + "s";

    stars.appendChild(star);

}

// ======================================
// PULL STRING ANIMATION
// ======================================

function pullAnimation() {

    string.animate(

        [

            {
                transform: "translateY(0px)"
            },

            {
                transform: "translateY(45px)"
            },

            {
                transform: "translateY(-8px)"
            },

            {
                transform: "translateY(0px)"
            }

        ],

        {

            duration: 450,

            easing: "cubic-bezier(.17,.89,.32,1.2)"

        }

    );

}

// ======================================
// LAMP SWING WHEN PULLED
// ======================================

function swingLamp() {

    lamp.animate(

        [

            {
                transform: "translateX(-50%) rotate(0deg)"
            },

            {
                transform: "translateX(-50%) rotate(7deg)"
            },

            {
                transform: "translateX(-50%) rotate(-5deg)"
            },

            {
                transform: "translateX(-50%) rotate(3deg)"
            },

            {
                transform: "translateX(-50%) rotate(0deg)"
            }

        ],

        {

            duration: 1200,

            easing: "ease-out"

        }

    );

}

// ======================================
// TOGGLE LAMP
// ======================================

string.addEventListener("click", () => {

    pullAnimation();

    swingLamp();

    lampOn = !lampOn;

    if (lampOn) {

        bulb.classList.add("on");

        light.classList.add("on");

        loginBox.classList.add("show");

    }

    else {

        bulb.classList.remove("on");

        light.classList.remove("on");

        loginBox.classList.remove("show");

    }

});

// ======================================
// INPUT ANIMATION
// ======================================

const inputs = document.querySelectorAll("input");

inputs.forEach((input) => {

    input.addEventListener("focus", () => {

        input.parentElement.style.transform = "scale(1.03)";

    });

    input.addEventListener("blur", () => {

        input.parentElement.style.transform = "scale(1)";

    });

});

// ======================================
// LOGIN BUTTON
// ======================================

const button = document.querySelector(".login-btn");

button.addEventListener("mouseenter", () => {

    button.style.transform = "translateY(-4px)";

});

button.addEventListener("mouseleave", () => {

    button.style.transform = "translateY(0px)";

});

// ======================================
// PARALLAX LOGIN CARD
// ======================================

document.addEventListener("mousemove", (e) => {

    const x =
        (e.clientX / window.innerWidth - 0.5) * 10;

    const y =
        (e.clientY / window.innerHeight - 0.5) * 10;

    loginBox.style.marginLeft = x + "px";

    loginBox.style.marginTop = y + "px";

});

// ======================================
// RANDOM SHOOTING STAR BOOST
// ======================================

const shootingStars =
    document.querySelectorAll(".shooting-star");

setInterval(() => {

    shootingStars.forEach((star) => {

        star.style.opacity = "1";

        setTimeout(() => {

            star.style.opacity = "0";

        }, 1200);

    });

}, 7000);

// ======================================
// PAGE LOAD
// ======================================

window.addEventListener("load", () => {

    document.body.style.opacity = "1";

});