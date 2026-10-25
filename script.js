
/* =========================================
   UrbanEthos - Shopping Cart & User Display
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    // Safely read JSON data from localStorage
    function readStorage(key, fallback = []) {
        try {
            const value = JSON.parse(localStorage.getItem(key));
            return value ?? fallback;
        } catch (error) {
            console.warn(`Invalid ${key} data in localStorage.`);
            return fallback;
        }
    }

    function getCart() {
        const cart = readStorage("cart", []);
        return Array.isArray(cart) ? cart : [];
    }

    function saveCart(cart) {
        localStorage.setItem("cart", JSON.stringify(cart));
    }

    // Allow local images and HTTPS image URLs only
    function safeImageUrl(image) {
        if (typeof image !== "string" || !image.trim()) {
            return "images/default-user.png";
        }

        try {
            const url = new URL(image, window.location.href);

            if (
                url.protocol !== "https:" &&
                url.origin !== window.location.origin
            ) {
                return "images/default-user.png";
            }

            if (
                url.protocol !== "https:" &&
                url.protocol !== "http:"
            ) {
                return "images/default-user.png";
            }

            return url.href;
        } catch {
            return "images/default-user.png";
        }
    }

    // =====================================
    // Cart Count
    // =====================================

    function updateCartCount() {
        const cartCount = document.getElementById("cart-count");

        if (!cartCount) return;

        const count = getCart().reduce((total, item) => {
            const quantity = Number(item.quantity);

            return total + (
                Number.isSafeInteger(quantity) && quantity > 0
                    ? quantity
                    : 0
            );
        }, 0);

        cartCount.textContent = String(count);
    }

    // =====================================
    // Add to Cart
    // =====================================

    document.querySelectorAll(".add-cart").forEach(button => {
        button.addEventListener("click", () => {

            const id = button.dataset.id;
            const name = button.dataset.name || "Product";
            const price = Number(button.dataset.price);
            const image = button.dataset.image || "";

            if (
                !id ||
                !Number.isFinite(price) ||
                price < 0
            ) {
                alert("Sorry, this product cannot be added right now.");
                return;
            }

            const cart = getCart();
            const existingProduct = cart.find(
                item => item.id === id
            );

            if (existingProduct) {
                existingProduct.quantity =
                    (Number(existingProduct.quantity) || 0) + 1;
            } else {
                cart.push({
                    id,
                    name,
                    price,
                    image,
                    quantity: 1
                });
            }

            saveCart(cart);
            updateCartCount();

            alert(name + " added to cart!");
        });
    });

    // =====================================
    // Display Cart
    // =====================================

    function renderCart() {
        const cartItems = document.getElementById("cart-items");
        const totalPrice = document.getElementById("total-price");

        if (!cartItems || !totalPrice) return;

        const cart = getCart();

        cartItems.replaceChildren();

        if (cart.length === 0) {
            const message = document.createElement("p");
            message.textContent = "Your cart is empty.";
            cartItems.appendChild(message);
            totalPrice.textContent = "0";
            updateCartCount();
            return;
        }

        let total = 0;

        cart.forEach(item => {
            const price = Number(item.price);
            const quantity = Number(item.quantity);

            if (
                typeof item.id !== "string" ||
                !Number.isFinite(price) ||
                price < 0 ||
                !Number.isSafeInteger(quantity) ||
                quantity < 1
            ) {
                return;
            }

            total += price * quantity;

            const cartItem = document.createElement("div");
            cartItem.className = "cart-item";

            const image = document.createElement("img");
            image.src = safeImageUrl(item.image);
            image.alt = String(item.name || "Product");
            image.loading = "lazy";

            const info = document.createElement("div");
            info.className = "cart-info";

            const name = document.createElement("h3");
            name.textContent = String(item.name || "Product");

            const priceText = document.createElement("p");
            priceText.textContent = `₹${price.toFixed(2)}`;

            const controls = document.createElement("div");
            controls.className = "quantity-controls";

            const decrease = document.createElement("button");
            decrease.type = "button";
            decrease.className = "decrease";
            decrease.dataset.id = item.id;
            decrease.textContent = "−";
            decrease.setAttribute("aria-label", "Decrease quantity");

            const quantityText = document.createElement("span");
            quantityText.textContent = String(quantity);

            const increase = document.createElement("button");
            increase.type = "button";
            increase.className = "increase";
            increase.dataset.id = item.id;
            increase.textContent = "+";
            increase.setAttribute("aria-label", "Increase quantity");

            controls.append(decrease, quantityText, increase);

            const remove = document.createElement("button");
            remove.type = "button";
            remove.className = "remove-item";
            remove.dataset.id = item.id;
            remove.textContent = "Remove";

            info.append(name, priceText, controls, remove);
            cartItem.append(image, info);

            const divider = document.createElement("hr");

            cartItems.append(cartItem, divider);
        });

        totalPrice.textContent = total.toFixed(2);
        updateCartCount();
    }

    // =====================================
    // Increase, Decrease & Remove Products
    // =====================================

    document.addEventListener("click", event => {
        const button = event.target.closest(
            ".increase, .decrease, .remove-item"
        );

        if (!button) return;

        const id = button.dataset.id;
        if (!id) return;

        let cart = getCart();

        if (button.classList.contains("increase")) {
            cart = cart.map(item => {
                if (item.id === id) {
                    return {
                        ...item,
                        quantity: (Number(item.quantity) || 0) + 1
                    };
                }

                return item;
            });
        } else if (button.classList.contains("decrease")) {
            cart = cart.map(item => {
                if (item.id === id) {
                    return {
                        ...item,
                        quantity: Math.max(
                            1,
                            (Number(item.quantity) || 1) - 1
                        )
                    };
                }

                return item;
            });
        } else if (button.classList.contains("remove-item")) {
            cart = cart.filter(item => item.id !== id);
        }

        saveCart(cart);
        renderCart();
    });

    // =====================================
    // Display Logged-in User
    // =====================================

    const userArea = document.getElementById("user-area");
    const user = readStorage("user", null);

    if (userArea && user && typeof user === "object") {
        const profileLink = document.createElement("a");
        profileLink.href = "profile.html";
        profileLink.className = "profile-link";

        const profileImage = document.createElement("img");
        profileImage.src = safeImageUrl(
            user.profilePic || "images/default-user.png"
        );
        profileImage.alt = "Profile";
        profileImage.className = "profile-img";

        profileImage.addEventListener("error", () => {
            profileImage.onerror = null;
            profileImage.src = "images/default-user.png";
        });

        const userName = document.createElement("span");
        userName.textContent =
            typeof user.name === "string" ? user.name : "My Profile";

        profileLink.append(profileImage, userName);
        userArea.replaceChildren(profileLink);
    }
    // =====================================
    // Custom Design Request Form
    // =====================================

    const customDesignForm = document.getElementById("customDesignForm");

    if (customDesignForm) {
        const submitButton = document.getElementById("customDesignSubmit");
        const statusMessage = document.getElementById("customDesignStatus");
        const referenceImage = document.getElementById("referenceImage");

        const CUSTOM_REQUEST_API =
            "https://urbanethos-api.onrender.com/api/custom-requests";

        customDesignForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            if (!customDesignForm.reportValidity()) {
                return;
            }

            const image = referenceImage?.files?.[0];

            // Validate the optional image before uploading.
            if (image) {
                const allowedTypes = [
                    "image/jpeg",
                    "image/png",
                    "image/webp"
                ];

                if (!allowedTypes.includes(image.type)) {
                    statusMessage.textContent =
                        "Please select a JPG, PNG, or WebP image.";

                    return;
                }

                if (image.size > 5 * 1024 * 1024) {
                    statusMessage.textContent =
                        "Your image must be 5 MB or smaller.";

                    return;
                }
            }

            const originalButtonText = submitButton.textContent;

            submitButton.disabled = true;
            submitButton.textContent = "Sending Request...";
            statusMessage.textContent = "Submitting your custom design request...";

            try {
                const formData = new FormData(customDesignForm);

                const response = await fetch(CUSTOM_REQUEST_API, {
                    method: "POST",
                    body: formData
                });

                let result;

                try {
                    result = await response.json();
                } catch {
                    result = {};
                }

                if (!response.ok) {
                    throw new Error(
                        result.message ||
                        result.error ||
                        "We couldn't submit your request. Please try again."
                    );
                }

                statusMessage.textContent =
                    result.message ||
                    "Your custom design request was submitted successfully!";

                customDesignForm.reset();

            } catch (error) {
                console.error("Custom design request error:", error);

                statusMessage.textContent =
                    error.message ||
                    "Unable to submit your request. Please try again later.";

            } finally {
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
            }
        });
    }
    // Initial page setup
    updateCartCount();
    renderCart();

});
