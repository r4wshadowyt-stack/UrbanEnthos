// ======================================
// ELEMENTS
// ======================================

const string = document.getElementById("string");
const bulb = document.querySelector(".bulb");
const light = document.getElementById("light");
const loginBox = document.getElementById("loginBox");
const stars = document.getElementById("stars");
const lamp = document.querySelector(".lamp");

const form = document.getElementById("forgotForm");

let lampOn = false;

// ======================================
// CREATE STARS
// ======================================

for(let i=0;i<250;i++){

    const star=document.createElement("div");

    star.className="star";

    const size=Math.random()*3+1;

    star.style.width=size+"px";
    star.style.height=size+"px";

    star.style.left=Math.random()*100+"%";
    star.style.top=Math.random()*100+"%";

    star.style.animationDuration=(1+Math.random()*3)+"s";
    star.style.animationDelay=(Math.random()*4)+"s";

    stars.appendChild(star);

}

// ======================================
// STRING ANIMATION
// ======================================

function pullAnimation(){

    string.animate(

        [

            {transform:"translateY(0px)"},

            {transform:"translateY(40px)"},

            {transform:"translateY(0px)"}

        ],

        {

            duration:350,

            easing:"ease-out"

        }

    );

}

// ======================================
// LAMP ON / OFF
// ======================================

string.addEventListener("click",()=>{

    pullAnimation();

    lampOn=!lampOn;

    bulb.classList.toggle("on",lampOn);

    light.classList.toggle("on",lampOn);

    loginBox.classList.toggle("show",lampOn);

});

// ======================================
// INPUT ANIMATION
// ======================================

const inputs=document.querySelectorAll("input");

inputs.forEach(input=>{

    input.addEventListener("focus",()=>{

        input.parentElement.style.transform="scale(1.03)";

    });

    input.addEventListener("blur",()=>{

        input.parentElement.style.transform="scale(1)";

    });

});

// ======================================
// LAMP SWING
// ======================================

let angle=0;

function swingLamp(){

    angle+=0.03;

    const swing=Math.sin(angle)*2;

    lamp.style.transform=
        `translateX(-50%) rotate(${swing}deg)`;

    requestAnimationFrame(swingLamp);

}

swingLamp();

// ======================================
// EMAIL VALIDATION
// ======================================

form.addEventListener("submit",(e)=>{

    e.preventDefault();

    const email=document.getElementById("email").value.trim();

    if(email===""){

        alert("Please enter your email address.");

        return;

    }

    const emailPattern=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(!emailPattern.test(email)){

        alert("Please enter a valid email address.");

        return;

    }

    alert("Password reset link sent successfully!");

    form.reset();

});

// ======================================
// PAGE LOAD
// ======================================

window.addEventListener("load",()=>{

    document.body.style.opacity="1";

});