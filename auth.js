/* ==================================================
UrbanEthos Authentication JavaScript
================================================== */

document.addEventListener("DOMContentLoaded", () => {

/* =========================
   FORGOT PASSWORD
========================= */

const forgotForm =
    document.getElementById("forgotForm");

const forgotMessage =
    document.getElementById("forgotMessage");


if (forgotForm) {

    forgotForm.addEventListener(
        "submit",
        (event) => {

            event.preventDefault();

            const email =
                document
                    .getElementById("forgotEmail")
                    .value
                    .trim();


            if (!isValidEmail(email)) {

                showForgotMessage(
                    "Please enter a valid email address.",
                    "error"
                );

                return;
            }


            /*
                TEMPORARY FRONTEND MESSAGE

                Real email/password reset will be
                connected with the backend later.
            */

            showForgotMessage(
                "If an account exists with this email, a reset link will be sent.",
                "success"
            );

        }
    );

}


/* =========================
   FORGOT → LOGIN
========================= */

const forgotLoginLink =
    document.getElementById("forgotLoginLink");


if (forgotLoginLink) {

    forgotLoginLink.addEventListener(
        "click",
        (event) => {

            event.preventDefault();

            const destination =
                forgotLoginLink.getAttribute("href");


            document.body.classList.add(
                "slide-out"
            );


            setTimeout(() => {

                window.location.href =
                    destination;

            }, 550);

        }
    );

}


/* =========================
   FORGOT MESSAGE
========================= */

function showForgotMessage(message, type) {

    if (!forgotMessage) return;

    forgotMessage.textContent =
        message;

    forgotMessage.className =
        "auth-message " + type;

}


/* =========================
   REGISTER FORM
========================= */

const registerForm =
    document.getElementById("registerForm");

const registerMessage =
    document.getElementById("registerMessage");


if (registerForm) {

    registerForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            const name =
                document
                    .getElementById("name")
                    .value
                    .trim();


            const phone =
                document
                    .getElementById("registerPhone")
                    .value
                    .trim();


            const email =
                document
                    .getElementById("registerEmail")
                    .value
                    .trim();


            const password =
                document
                    .getElementById("registerPassword")
                    .value;


            const confirmPassword =
                document
                    .getElementById("confirmPassword")
                    .value;


            const terms =
                document
                    .getElementById("terms")
                    .checked;


            /* =========================
               VALIDATION
            ========================= */

            if (name.length < 2) {

                showRegisterMessage(
                    "Please enter your full name.",
                    "error"
                );

                return;
            }


            if (phone.length < 10) {

                showRegisterMessage(
                    "Please enter a valid phone number.",
                    "error"
                );

                return;
            }


            if (!isValidEmail(email)) {

                showRegisterMessage(
                    "Please enter a valid email address.",
                    "error"
                );

                return;
            }


            if (password.length < 6) {

                showRegisterMessage(
                    "Password must contain at least 6 characters.",
                    "error"
                );

                return;
            }


            if (password !== confirmPassword) {

                showRegisterMessage(
                    "Passwords do not match.",
                    "error"
                );

                return;
            }


            if (!terms) {

                showRegisterMessage(
                    "Please accept the Terms & Conditions.",
                    "error"
                );

                return;
            }


            /* =========================
               SHOW LOADING
            ========================= */

            const button =
                registerForm.querySelector(".auth-button");


            const originalText =
                button.innerHTML;


            button.disabled = true;

            button.innerHTML =
                `<span>Creating Account...</span>`;


            try {

                const response =
                    await fetch(
                        "http://localhost:5000/api/users/register",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type": "application/json"
                            },

                            body: JSON.stringify({
                                name,
                                email,
                                phone,
                                password
                            })
                        }
                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    showRegisterMessage(
                        data.message ||
                        "Registration failed.",
                        "error"
                    );


                    button.disabled = false;

                    button.innerHTML =
                        originalText;

                    return;
                }


                /* =========================
                   SUCCESS
                ========================= */

                showRegisterMessage(
                    "Account created successfully! Redirecting...",
                    "success"
                );


                setTimeout(() => {

                    document.body.classList.add(
                        "slide-out"
                    );


                    setTimeout(() => {

                        window.location.href =
                            "login.html";

                    }, 550);

                }, 1000);


            } catch (error) {

                console.error(
                    "REGISTER ERROR:",
                    error
                );


                showRegisterMessage(
                    "Unable to connect to the server.",
                    "error"
                );


                button.disabled = false;

                button.innerHTML =
                    originalText;

            }

        }
    );

}


/* =========================
   REGISTER PASSWORD TOGGLE
========================= */

const registerPassword =
    document.getElementById("registerPassword");


const toggleRegisterPassword =
    document.getElementById("toggleRegisterPassword");


if (registerPassword && toggleRegisterPassword) {

    toggleRegisterPassword.addEventListener(
        "click",
        () => {

            if (registerPassword.type === "password") {

                registerPassword.type = "text";

                toggleRegisterPassword.textContent =
                    "🙈";


                toggleRegisterPassword.setAttribute(
                    "aria-label",
                    "Hide password"
                );

            } else {

                registerPassword.type = "password";

                toggleRegisterPassword.textContent =
                    "👁";


                toggleRegisterPassword.setAttribute(
                    "aria-label",
                    "Show password"
                );

            }

        }
    );

}


/* =========================
   CONFIRM PASSWORD TOGGLE
========================= */

const confirmPassword =
    document.getElementById("confirmPassword");


const toggleConfirmPassword =
    document.getElementById("toggleConfirmPassword");


if (confirmPassword && toggleConfirmPassword) {

    toggleConfirmPassword.addEventListener(
        "click",
        () => {

            if (confirmPassword.type === "password") {

                confirmPassword.type = "text";

                toggleConfirmPassword.textContent =
                    "🙈";


                toggleConfirmPassword.setAttribute(
                    "aria-label",
                    "Hide password"
                );

            } else {

                confirmPassword.type = "password";

                toggleConfirmPassword.textContent =
                    "👁";


                toggleConfirmPassword.setAttribute(
                    "aria-label",
                    "Show password"
                );

            }

        }
    );

}


/* =========================
   GOOGLE REGISTER
========================= */

const googleRegister =
    document.getElementById("googleRegister");


if (googleRegister) {

    googleRegister.addEventListener(
        "click",
        () => {

            showRegisterMessage(
                "Google sign-up will be connected later.",
                "success"
            );

        }
    );

}


/* =========================
   REGISTER → LOGIN
========================= */

const loginLink =
    document.getElementById("loginLink");


if (loginLink) {

    loginLink.addEventListener(
        "click",
        (event) => {

            event.preventDefault();


            const destination =
                loginLink.getAttribute("href");


            document.body.classList.add(
                "slide-out"
            );


            setTimeout(() => {

                window.location.href =
                    destination;

            }, 550);

        }
    );

}


/* =========================
   REGISTER MESSAGE
========================= */

function showRegisterMessage(message, type) {

    if (!registerMessage) return;


    registerMessage.textContent =
        message;


    registerMessage.className =
        "auth-message " + type;

}


/* =========================
   CREATE ACCOUNT TRANSITION
========================= */

const createAccountLink =
    document.getElementById("createAccountLink");


if (createAccountLink) {

    createAccountLink.addEventListener(
        "click",
        (event) => {

            event.preventDefault();


            const destination =
                createAccountLink.getAttribute("href");


            document.body.classList.add(
                "slide-out"
            );


            setTimeout(() => {

                window.location.href =
                    destination;

            }, 550);

        }
    );

}


/* =========================
   LOGIN PASSWORD SHOW / HIDE
========================= */

const password =
    document.getElementById("password");


const togglePassword =
    document.getElementById("togglePassword");


if (password && togglePassword) {

    togglePassword.addEventListener(
        "click",
        () => {

            if (password.type === "password") {

                password.type = "text";

                togglePassword.textContent =
                    "🙈";


                togglePassword.setAttribute(
                    "aria-label",
                    "Hide password"
                );

            } else {

                password.type = "password";

                togglePassword.textContent =
                    "👁";


                togglePassword.setAttribute(
                    "aria-label",
                    "Show password"
                );

            }

        }
    );

}


/* =========================
   LOGIN FORM
========================= */

const loginForm =
    document.getElementById("loginForm");


const authMessage =
    document.getElementById("authMessage");


if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            const email =
                document
                    .getElementById("email")
                    .value
                    .trim();


            const passwordValue =
                document
                    .getElementById("password")
                    .value
                    .trim();


            /* =========================
               VALIDATION
            ========================= */

            if (!email || !passwordValue) {

                showMessage(
                    "Please enter your email and password.",
                    "error"
                );

                return;
            }


            if (!isValidEmail(email)) {

                showMessage(
                    "Please enter a valid email address.",
                    "error"
                );

                return;
            }


            /* =========================
               LOGIN API
            ========================= */

            try {

                const response =
                    await fetch(
                        "http://localhost:5000/api/users/login",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type": "application/json"
                            },

                            body: JSON.stringify({
                                email,
                                password: passwordValue
                            })
                        }
                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    showMessage(
                        data.message ||
                        "Login failed.",
                        "error"
                    );

                    return;
                }


                /* =========================
                   SAVE JWT TOKEN
                ========================= */

                localStorage.setItem(
                    "token",
                    data.token
                );


                /* =========================
                   SAVE USER SESSION
                ========================= */

                localStorage.setItem(
                    "user",
                    JSON.stringify({
                        id: data.user.id,
                        name: data.user.name,
                        email: data.user.email,
                        role: data.user.role,
                        profilePic:
                            data.user.profilePic ||
                            "images/default-profile.png"
                    })
                );


                console.log(
                    "✅ User logged in:",
                    data.user
                );


                showMessage(
                    "Login successful! Redirecting...",
                    "success"
                );


                /* =========================
                   REDIRECT
                ========================= */

                setTimeout(() => {

                    document.body.classList.add(
                        "slide-out"
                    );


                    setTimeout(() => {

                        window.location.href =
                            "index.html";

                    }, 550);

                }, 1000);


            } catch (error) {

                console.error(
                    "LOGIN ERROR:",
                    error
                );


                showMessage(
                    "Unable to connect to server.",
                    "error"
                );

            }

        }
    );

}


/* =========================
   GOOGLE LOGIN
========================= */

const googleLogin =
    document.getElementById("googleLogin");


if (googleLogin) {

    googleLogin.addEventListener(
        "click",
        () => {

            showMessage(
                "Google login will be connected later.",
                "success"
            );

        }
    );

}


/* =========================
   MESSAGE FUNCTION
========================= */

function showMessage(message, type) {

    if (!authMessage) return;


    authMessage.textContent =
        message;


    authMessage.className =
        "auth-message " + type;

}


/* =========================
   EMAIL VALIDATION
========================= */

function isValidEmail(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        email
    );

}


});

/* ==================================================
   NAVBAR AUTH / PROFILE
================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const navAuth =
            document.getElementById("navAuth");

        if (!navAuth) return;

        let user = null;

        try {

            user = JSON.parse(
                localStorage.getItem("user")
            );

        } catch (error) {

            console.error(
                "USER SESSION ERROR:",
                error
            );

            localStorage.removeItem("user");

        }

        if (user) {

            navAuth.innerHTML = `
                <a
                    href="profile.html"
                    class="profile-link">

                    <img
                        src="${user.profilePic || "images/default-profile.png"}"
                        class="profile-img"
                        alt="Profile">

                </a>
            `;

        }

    }
);