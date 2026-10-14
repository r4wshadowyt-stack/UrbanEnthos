
/* ==================================================
   UrbanEthos Authentication JavaScript
================================================== */

// Deployed UrbanEthos backend
const API_BASE_URL = "https://urbanethos-api.onrender.com";


/* ==================================================
   AUTHENTICATION FORMS
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
                showForgotMessage(
                    "Please enter a valid email address.",
                    "error"
                );
                return;
            }

            // Password reset service is not connected yet.
            showForgotMessage(
                "Password reset is not available yet. Please contact support.",
                "error"
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

            if (!destination) return;

            document.body.classList.add("slide-out");

            setTimeout(() => {
                window.location.href = destination;
            }, 550);
        });
    }

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
            const termsElement = document.getElementById("terms");
            const terms = termsElement ? termsElement.checked : false;

            if (name.length < 2) {
                showRegisterMessage("Please enter your full name.", "error");
                return;
            }

            if (phone.replace(/\D/g, "").length < 10) {
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

            const button = registerForm.querySelector(".auth-button");
            const originalText = button ? button.innerHTML : "";

            if (button) {
                button.disabled = true;
                button.textContent = "Creating Account...";
            }

            try {
                const response = await fetch(
                    `${ API_BASE_URL } /api/users / register`,
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
                    return;
                }

                showRegisterMessage(
                    "Account created successfully! Redirecting to login...",
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
                    "Unable to connect to the server. Please try again later.",
                    "error"
                );

            } finally {
                if (button) {
                    button.disabled = false;
                    button.innerHTML = originalText;
                }
            }
        });
    }

    function showRegisterMessage(message, type) {
        if (!registerMessage) return;

        registerMessage.textContent = message;
        registerMessage.className = "auth-message " + type;
    }


    /* =========================
       PASSWORD VISIBILITY
    ========================= */

    function setupPasswordToggle(inputId, buttonId) {
        const input = document.getElementById(inputId);
        const toggle = document.getElementById(buttonId);

        if (!input || !toggle) return;

        toggle.addEventListener("click", () => {
            const showing = input.type === "password";

            input.type = showing ? "text" : "password";
            toggle.textContent = showing ? "🙈" : "👁";
            toggle.setAttribute(
                "aria-label",
                showing ? "Hide password" : "Show password"
            );
        });
    }

    setupPasswordToggle("registerPassword", "toggleRegisterPassword");
    setupPasswordToggle("confirmPassword", "toggleConfirmPassword");
    setupPasswordToggle("password", "togglePassword");


    /* =========================
       GOOGLE REGISTER
    ========================= */

    const googleRegister = document.getElementById("googleRegister");

    if (googleRegister) {
        googleRegister.addEventListener("click", () => {
            showRegisterMessage(
                "Google sign-up is not available yet.",
                "error"
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

            if (!destination) return;

            document.body.classList.add("slide-out");

            setTimeout(() => {
                window.location.href = destination;
            }, 550);
        });
    }


    /* =========================
       LOGIN → REGISTER
    ========================= */

    const createAccountLink = document.getElementById("createAccountLink");

    if (createAccountLink) {
        createAccountLink.addEventListener("click", (event) => {
            event.preventDefault();

            const destination = createAccountLink.getAttribute("href");

            if (!destination) return;

            document.body.classList.add("slide-out");

            setTimeout(() => {
                window.location.href = destination;
            }, 550);
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
            const password = document.getElementById("password").value;

            if (!email || !password) {
                showMessage(
                    "Please enter your email and password.",
                    "error"
                );
                return;
            }

            if (!isValidEmail(email)) {
                showMessage("Please enter a valid email address.", "error");
                return;
            }

            const button = loginForm.querySelector(".auth-button");
            const originalText = button ? button.innerHTML : "";

            if (button) {
                button.disabled = true;
                button.textContent = "Logging in...";
            }

            try {
                const response = await fetch(
                    `${ API_BASE_URL } /api/users / login`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            email,
                            password
                        })
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    showMessage(data.message || "Login failed.", "error");
                    return;
                }

                if (!data.token || !data.user) {
                    showMessage(
                        "Login response is missing the token or user information.",
                        "error"
                    );
                    return;
                }

                // Save authentication session.
                localStorage.setItem("token", data.token);

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

                showMessage(
                    "Login successful! Redirecting...",
                    "success"
                );

                setTimeout(() => {
                    document.body.classList.add("slide-out");

                    setTimeout(() => {
                        window.location.href = "index.html";
                    }, 550);
                }, 1000);

            } catch (error) {
                console.error("LOGIN ERROR:", error);

                showMessage(
                    "Unable to connect to the server. Please try again later.",
                    "error"
                );

            } finally {
                if (button) {
                    button.disabled = false;
                    button.innerHTML = originalText;
                }
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
                "Google login is not available yet.",
                "error"
            );
        });
    }


    /* =========================
       LOGIN MESSAGE
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
   NAVBAR AUTHENTICATION / PROFILE
================================================== */

document.addEventListener("DOMContentLoaded", async () => {

    const navAuth = document.getElementById("navAuth");

    if (!navAuth) return;

    const cartMarkup = `
    < a href = "cart.html" class="cart-btn" >
            🛒 Cart < span id = "cart-count" > 0</span >
        </a >
    `;

    const token = localStorage.getItem("token");

    let user = null;

    try {
        user = JSON.parse(localStorage.getItem("user") || "null");
    } catch (error) {
        console.error("USER SESSION ERROR:", error);
        localStorage.removeItem("user");
    }


    /* =========================
       LOGGED-OUT NAVBAR
    ========================= */

    function showLoggedOutNavbar() {
        navAuth.innerHTML = `
            ${ cartMarkup }
            <a href="login.html" class="login-btn-nav">Login</a>
            <a href="register.html" class="signup-btn">Sign Up</a>
`;
    }


    /* =========================
       LOGOUT
    ========================= */

    function logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "login.html";
    }


    /* =========================
       HTML ESCAPING
    ========================= */

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


    /* =========================
       LOGGED-IN NAVBAR
    ========================= */

    function showLoggedInNavbar(currentUser) {
        const profileImage =
            currentUser.profilePic ||
            "images/default-profile.png";

        navAuth.innerHTML = `
            ${ cartMarkup }

<a
    href="profile.html"
    class="profile-link"
    aria-label="My profile"
    title="${escapeHTML(currentUser.name || " My profile")}"
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


    /* =========================
       NO SAVED SESSION
    ========================= */

    if (!token || !user) {
        showLoggedOutNavbar();
        return;
    }


    /* =========================
       FETCH PROFILE FROM BACKEND
    ========================= */

    try {
        const response = await fetch(
            `${ API_BASE_URL } /api/users / profile`,
            {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${ token } `,
                    "Content-Type": "application/json"
                }
            }
        );

        if (response.status === 401 || response.status === 403) {
            logout();
            return;
        }

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Could not retrieve user profile."
            );
        }

        const profile = data.user || data;

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

        showLoggedInNavbar(user);

    } catch (error) {
        console.error("PROFILE / SESSION ERROR:", error);

        // Preserve the saved session during temporary server errors.
        showLoggedInNavbar(user);
    }

});
