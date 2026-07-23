// ======================================
// ELEMENTS
// ======================================

const string = document.getElementById("string");
const bulb = document.querySelector(".bulb");
const light = document.getElementById("light");
const loginBox = document.getElementById("loginBox");
const stars = document.getElementById("stars");
const lamp = document.querySelector(".lamp");

const form = document.getElementById("registerForm");

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

    star.style.animationDuration=(2+Math.random()*3)+"s";
    star.style.animationDelay=(Math.random()*5)+"s";

    stars.appendChild(star);

}

// ======================================
// STRING ANIMATION
// ======================================

function pullAnimation(){

    string.animate(

        [

            {transform:"translateY(0px)"},

            {transform:"translateY(45px)"},

            {transform:"translateY(-8px)"},

            {transform:"translateY(0px)"}

        ],

        {

            duration:450,

            easing:"cubic-bezier(.17,.89,.32,1.2)"

        }

    );

}

function swingLamp(){

    lamp.animate(

        [

            {transform:"translateX(-50%) rotate(0deg)"},

            {transform:"translateX(-50%) rotate(7deg)"},

            {transform:"translateX(-50%) rotate(-5deg)"},

            {transform:"translateX(-50%) rotate(3deg)"},

            {transform:"translateX(-50%) rotate(0deg)"}

        ],

        {

            duration:1200,

            easing:"ease-out"

        }

    );

}

string.addEventListener("click",()=>{

    pullAnimation();

    swingLamp();

    lampOn=!lampOn;

    bulb.classList.toggle("on",lampOn);

    light.classList.toggle("on",lampOn);

    loginBox.classList.toggle("show",lampOn);

});

// ======================================
// INPUT ANIMATION
// ======================================

document.querySelectorAll("input").forEach(input=>{

    input.addEventListener("focus",()=>{

        input.parentElement.style.transform="scale(1.03)";

    });

    input.addEventListener("blur",()=>{

        input.parentElement.style.transform="scale(1)";

    });

});

// ======================================
// REGISTER VALIDATION
// ======================================

form.addEventListener("submit",async(e)=>{

    e.preventDefault();

    const name=document.getElementById("name").value.trim();

    const email=document.getElementById("email").value.trim();

    const phone=document.getElementById("phone").value.trim();

    const password=document.getElementById("password").value;

    const confirmPassword=document.getElementById("confirmPassword").value;

    if(name===""){

        alert("Please enter your name.");

        return;

    }

    if(email===""){

        alert("Please enter your email.");

        return;

    }

    if(phone.length!==10){

        alert("Phone number must contain 10 digits.");

        return;

    }

    if(password.length<6){

        alert("Password must be at least 6 characters.");

        return;

    }

    if(password!==confirmPassword){

        alert("Passwords do not match.");

        return;

    }

    // Ready for backend

    const user={

        name,

        email,

        phone,

        password

    };

    console.log(user);

    alert("Account created successfully! (Backend coming next)");

    window.location.href="login.html";

});

// ======================================
// PAGE LOAD
// ======================================

window.addEventListener("load",()=>{

    document.body.style.opacity="1";

});