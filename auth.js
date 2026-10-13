/* ==================================================
   UrbanEthos Authentication JavaScript
================================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* =========================
       FORGOT PASSWORD
    ========================= */

    const forgotForm = document.getElementById("forgotForm");
    const forgotMessage = document.getElementById("forgotMessage");

    if (forgotForm) {
        forgotForm.addEventListener("submit", (event) => {
            event.preventDefault();

            const email = document.getElementById("forgotEmail").value.trim();

            if (!isValidEmail(email)) {
                showForgotMessage("Please enter a valid email address.", "error");
                return;
            }

            // Temporary frontend message; password reset email is not connected yet.
            showForgotMessage(
                "If an account exists with this email, a reset link will be sent.",
                "success"
            );
        });
    }

    /* =========================
       FORGOT → LOGIN
    ========================= */

    const forgotLoginLink = document.getElementById("forgotLoginLink");

    if (forgotLoginLink) {
        forgotLoginLink.addEventListener("click", (event) => {
            event.preventDefault();

            const destination = forgotLoginLink.getAttribute("href");
            document.body.classList.add("slide-out");

            setTimeout(() => {
                window.location.href = destination;
            }, 550);
        });
    }

    /* =========================
       FORGOT MESSAGE
    ========================= */

    function showForgotMessage(message, type) {
        if (!forgotMessage) return;

        forgotMessage.textContent = message;
        forgotMessage.className = "auth-message " + type;
    }

    /* =========================
       REGISTER FORM
    ========================= */

    const registerForm = document.getElementById("registerForm");
    const registerMessage = document.getElementById("registerMessage");

    if (registerForm) {
        registerForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            const name = document.getElementById("name").value.trim();
            const phone = document.getElementById("registerPhone").value.trim();
            const email = document.getElementById("registerEmail").value.trim();
            const password = document.getElementById("registerPassword").value;
            const confirmPassword = document.getElementById("confirmPassword").value;
            const terms = document.getElementById("terms").checked;

            /* VALIDATION */

            if (name.length < 2) {
                showRegisterMessage("Please enter your full name.", "error");
                return;
            }

            if (phone.length < 10) {
                showRegisterMessage("Please enter a valid phone number.", "error");
                return;
            }

            if (!isValidEmail(email)) {
                showRegisterMessage("Please enter a valid email address.", "error");
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
                showRegisterMessage("Passwords do not match.", "error");
                return;
            }

            if (!terms) {
                showRegisterMessage(
                    "Please accept the Terms & Conditions.",
                    "error"
                );
                return;
            }

            /* SHOW LOADING */

            const button = registerForm.querySelector(".auth-button");
            const originalText = button ? button.innerHTML : "";

            if (button) {
                button.disabled = true;
                button.innerHTML = "<span>Creating Account...</span>";
            }

            try {
                const response = await fetch(
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

                const data = await response.json();

                if (!response.ok) {
                    showRegisterMessage(
                        data.message || "Registration failed.",
                        "error"
                    );

                    if (button) {
                        button.disabled = false;
                        button.innerHTML = originalText;
                    }
                    return;
                }

                showRegisterMessage(
                    "Account created successfully! Redirecting...",
                    "success"
                );

                setTimeout(() => {
                    document.body.classList.add("slide-out");

                    setTimeout(() => {
                        window.location.href = "login.html";
                    }, 550);
                }, 1000);

            } catch (error) {
                console.error("REGISTER ERROR:", error);

                showRegisterMessage(
                    "Unable to connect to the server.",
                    "error"
                );

                if (button) {
                    button.disabled = false;
                    button.innerHTML = originalText;
                }
            }
        });
    }

    /* =========================
       REGISTER PASSWORD TOGGLE
    ========================= */

    const registerPassword = document.getElementById("registerPassword");
    const toggleRegisterPassword = document.getElementById("toggleRegisterPassword");

    if (registerPassword && toggleRegisterPassword) {
        toggleRegisterPassword.addEventListener("click", () => {
            if (registerPassword.type === "password") {
                registerPassword.type = "text";
                toggleRegisterPassword.textContent = "🙈";
                toggleRegisterPassword.setAttribute("aria-label", "Hide password");
            } else {
                registerPassword.type = "password";
                toggleRegisterPassword.textContent = "👁";
                toggleRegisterPassword.setAttribute("aria-label", "Show password");
            }
        });
    }

    /* =========================
       CONFIRM PASSWORD TOGGLE
    ========================= */

    const confirmPassword = document.getElementById("confirmPassword");
    const toggleConfirmPassword = document.getElementById("toggleConfirmPassword");

    if (confirmPassword && toggleConfirmPassword) {
        toggleConfirmPassword.addEventListener("click", () => {
            if (confirmPassword.type === "password") {
                confirmPassword.type = "text";
                toggleConfirmPassword.textContent = "🙈";
                toggleConfirmPassword.setAttribute("aria-label", "Hide password");
            } else {
                confirmPassword.type = "password";
                toggleConfirmPassword.textContent = "👁";
                toggleConfirmPassword.setAttribute("aria-label", "Show password");
            }
        });
    }
    /* =========================
   GOOGLE REGISTER
========================= */

    const googleRegister = document.getElementById("googleRegister");

    if (googleRegister) {
        googleRegister.addEventListener("click", () => {
            showRegisterMessage(
                "Google sign-up will be connected later.",
                "success"
            );
        });
    }

    /* =========================
       REGISTER → LOGIN
    ========================= */

    const loginLink = document.getElementById("loginLink");

    if (loginLink) {
        loginLink.addEventListener("click", (event) => {
            event.preventDefault();

            const destination = loginLink.getAttribute("href");
            document.body.classList.add("slide-out");

            setTimeout(() => {
                window.location.href = destination;
            }, 550);
        });
    }

    /* =========================
       REGISTER MESSAGE
    ========================= */

    function showRegisterMessage(message, type) {
        if (!registerMessage) return;

        registerMessage.textContent = message;
        registerMessage.className = "auth-message " + type;
    }

    /* =========================
       CREATE ACCOUNT TRANSITION
    ========================= */

    const createAccountLink = document.getElementById("createAccountLink");

    if (createAccountLink) {
        createAccountLink.addEventListener("click", (event) => {
            event.preventDefault();

            const destination = createAccountLink.getAttribute("href");
            document.body.classList.add("slide-out");

            setTimeout(() => {
                window.location.href = destination;
            }, 550);
        });
    }

    /* =========================
       LOGIN PASSWORD SHOW / HIDE
    ========================= */

    const password = document.getElementById("password");
    const togglePassword = document.getElementById("togglePassword");

    if (password && togglePassword) {
        togglePassword.addEventListener("click", () => {
            if (password.type === "password") {
                password.type = "text";
                togglePassword.textContent = "🙈";
                togglePassword.setAttribute("aria-label", "Hide password");
            } else {
                password.type = "password";
                togglePassword.textContent = "👁";
                togglePassword.setAttribute("aria-label", "Show password");
            }
        });
    }

    /* =========================
       LOGIN FORM
    ========================= */

    const loginForm = document.getElementById("loginForm");
    const authMessage = document.getElementById("authMessage");

    if (loginForm) {
        loginForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            const email = document.getElementById("email").value.trim();
            const passwordValue = document.getElementById("password").value;

            /* VALIDATION */

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

            /* LOGIN API */

            try {
                const response = await fetch(
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

                const data = await response.json();

                if (!response.ok) {
                    showMessage(
                        data.message || "Login failed.",
                        "error"
                    );
                    return;
                }

                if (!data.token || !data.user) {
                    showMessage(
                        "Login response is missing the token or user information.",
                        "error"
                    );
                    return;
                }

                /* SAVE JWT TOKEN */

                localStorage.setItem("token", data.token);

                /* SAVE USER SESSION */

                localStorage.setItem(
                    "user",
                    JSON.stringify({
                        id: data.user.id,
                        name: data.user.name,
                        email: data.user.email,
                        phone: data.user.phone,
                        role: data.user.role,
                        profilePic:
                            data.user.profilePic ||
                            "images/default-profile.png"
                    })
                );

                console.log("User logged in:", data.user);

                showMessage(
                    "Login successful! Redirecting...",
                    "success"
                );

                /* REDIRECT */

                setTimeout(() => {
                    document.body.classList.add("slide-out");

                    setTimeout(() => {
                        window.location.href = "index.html";
                    }, 550);
                }, 1000);

            } catch (error) {
                console.error("LOGIN ERROR:", error);

                showMessage(
                    "Unable to connect to server.",
                    "error"
                );
            }
        });
    }

    /* =========================
       GOOGLE LOGIN
    ========================= */

    const googleLogin = document.getElementById("googleLogin");

    if (googleLogin) {
        googleLogin.addEventListener("click", () => {
            showMessage(
                "Google login will be connected later.",
                "success"
            );
        });
    }

    /* =========================
       MESSAGE FUNCTION
    ========================= */

    function showMessage(message, type) {
        if (!authMessage) return;

        authMessage.textContent = message;
        authMessage.className = "auth-message " + type;
    }

    /* =========================
       EMAIL VALIDATION
    ========================= */

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

});
/* ==================================================
   NAVBAR AUTH / PROFILE
================================================== */

document.addEventListener("DOMContentLoaded", async () => {

    const navAuth = document.getElementById("navAuth");

    if (!navAuth) return;

    /* CART — KEEP VISIBLE */

    const cartMarkup = `
        <a href="cart.html" class="cart-btn">
            🛒 Cart <span id="cart-count">0</span>
        </a>
    `;

    /* GET SAVED SESSION */

    const token = localStorage.getItem("token");

    let user = null;

    try {
        user = JSON.parse(
            localStorage.getItem("user") || "null"
        );
    } catch (error) {
        console.error("USER SESSION ERROR:", error);
        localStorage.removeItem("user");
    }

    /* SHOW LOGIN AND SIGN UP WHEN LOGGED OUT */

    function showLoggedOutNavbar() {
        navAuth.innerHTML = `
            ${cartMarkup}
            <a href="login.html" class="login-btn-nav">
                Login
            </a>
            <a href="register.html" class="signup-btn">
                Sign Up
            </a>
        `;
    }

    /* CLEAR SESSION AND LOG OUT */

    function logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window.location.href = "login.html";
    }

    /* SHOW PROFILE AND LOGOUT */

    function showLoggedInNavbar(currentUser) {
        const profileImage =
            currentUser.profilePic ||
            "images/default-profile.png";

        navAuth.innerHTML = `
            ${cartMarkup}

            <a
                href="profile.html"
                class="profile-link"
                aria-label="My profile"
                title="${escapeHTML(currentUser.name || "My profile")}"
            >
                <img
                    src="${escapeHTML(profileImage)}"
                    class="profile-img"
                    alt="Profile"
                    onerror="this.onerror=null;this.src='images/default-profile.png';"
                >
            </a>

            <button
                type="button"
                class="logout-btn"
                id="logoutBtn"
            >
                Logout
            </button>
        `;

        const logoutBtn = document.getElementById("logoutBtn");

        if (logoutBtn) {
            logoutBtn.addEventListener("click", logout);
        }
    }

    /* BASIC HTML ESCAPING FOR DISPLAY VALUES */

    function escapeHTML(value) {
        return String(value).replace(/[&<>"']/g, (character) => {
            const replacements = {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;"
            };

            return replacements[character];
        });
    }

    /* NO SESSION */

    if (!token || !user) {
        showLoggedOutNavbar();
        return;
    }

    /* FETCH THE REAL PROFILE FROM THE BACKEND */

    try {
        const response = await fetch(
            "http://localhost:5000/api/users/profile",
            {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }
        );

        const data = await response.json();

        /* INVALID OR EXPIRED TOKEN */

        if (response.status === 401 || response.status === 403) {
            logout();
            return;
        }

        if (!response.ok) {
            throw new Error(
                data.message || "Could not retrieve user profile."
            );
        }

        /*
          Supports either:
          { "user": { ... } }
          or a direct user object.
        */

        const profile = data.user || data;

        /* UPDATE SAVED USER INFORMATION */

        user = {
            ...user,
            id: profile.id ?? user.id,
            name: profile.name ?? user.name,
            email: profile.email ?? user.email,
            phone: profile.phone ?? user.phone,
            role: profile.role ?? user.role,
            profilePic:
                profile.profilePic ||
                user.profilePic ||
                "images/default-profile.png"
        };

        localStorage.setItem("user", JSON.stringify(user));

        /* DISPLAY PROFILE */

        showLoggedInNavbar(user);

    } catch (error) {
        console.error("PROFILE / SESSION ERROR:", error);

        /*
          If the backend is temporarily unavailable,
          preserve the saved session and show the
          profile link instead of logging the user out.
        */

        showLoggedInNavbar(user);
    }

});