
/* =========================================
   UrbanEthos - Shopping Cart & User Display
   + Individual Product Image Customization
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

    // Support existing cart items and new cart item identifiers
    function getCartKey(item) {
        return String(item.cartItemId || item.id || "");
    }

    function createCartItemId() {
        if (
            window.crypto &&
            typeof window.crypto.randomUUID === "function"
        ) {
            return window.crypto.randomUUID();
        }

        return "cart-" + Date.now() + "-" +
            Math.random().toString(36).slice(2);
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

    const CART_IMAGE_API =
        "https://urbanethos-api.onrender.com/api/cart-images";

    const ALLOWED_IMAGE_TYPES = [
        "image/jpeg",
        "image/png",
        "image/webp"
    ];

    const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

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

            // Preserve the existing behavior: adding the same product
            // increases its quantity instead of creating another row.
            const existingProduct = cart.find(
                item => item.id === id
            );

            if (existingProduct) {
                existingProduct.quantity =
                    (Number(existingProduct.quantity) || 0) + 1;
            } else {
                cart.push({
                    id,
                    cartItemId: createCartItemId(),
                    name,
                    price,
                    image,
                    quantity: 1,
                    customImageUrl: "",
                    customImagePublicId: ""
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

            const cartKey = getCartKey(item);

            total += price * quantity;

            const cartItem = document.createElement("div");
            cartItem.className = "cart-item";
            cartItem.dataset.cartKey = cartKey;

            // Original/sample product image
            const image = document.createElement("img");
            image.src = safeImageUrl(item.image);
            image.alt = String(item.name || "Product");
            image.loading = "lazy";
            image.className = "cart-product-image";

            const info = document.createElement("div");
            info.className = "cart-info";

            const name = document.createElement("h3");
            name.textContent = String(item.name || "Product");

            const priceText = document.createElement("p");
            priceText.textContent = `₹${price.toFixed(2)}`;

            // Quantity controls
            const controls = document.createElement("div");
            controls.className = "quantity-controls";

            const decrease = document.createElement("button");
            decrease.type = "button";
            decrease.className = "decrease";
            decrease.dataset.cartKey = cartKey;
            decrease.textContent = "−";
            decrease.setAttribute("aria-label", "Decrease quantity");

            const quantityText = document.createElement("span");
            quantityText.textContent = String(quantity);

            const increase = document.createElement("button");
            increase.type = "button";
            increase.className = "increase";
            increase.dataset.cartKey = cartKey;
            increase.textContent = "+";
            increase.setAttribute("aria-label", "Increase quantity");

            controls.append(decrease, quantityText, increase);

            // Remove product from cart
            const remove = document.createElement("button");
            remove.type = "button";
            remove.className = "remove-item";
            remove.dataset.cartKey = cartKey;
            remove.textContent = "Remove";

            // =====================================
            // Personal Image Upload Section
            // =====================================

            const customization = document.createElement("div");
            customization.className = "cart-image-customization";

            const uploadTitle = document.createElement("h4");
            uploadTitle.textContent = "Personalize Your Product";

            const uploadHelp = document.createElement("p");
            uploadHelp.textContent =
                "Upload the picture you want us to use for this item.";

            const uploadLabel = document.createElement("label");
            const inputId = "custom-image-" +
                cartKey.replace(/[^a-zA-Z0-9_-]/g, "");

            uploadLabel.htmlFor = inputId;
            uploadLabel.textContent = item.customImageUrl
                ? "Replace Your Picture"
                : "Upload Your Picture";

            const fileInput = document.createElement("input");
            fileInput.type = "file";
            fileInput.id = inputId;
            fileInput.className = "custom-image-input";
            fileInput.dataset.cartKey = cartKey;
            fileInput.accept = ".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp";
            fileInput.setAttribute(
                "aria-label",
                "Upload a personal picture for " + String(item.name || "this product")
            );

            const uploadStatus = document.createElement("p");
            uploadStatus.className = "custom-image-status";
            uploadStatus.dataset.cartKey = cartKey;
            uploadStatus.setAttribute("role", "status");
            uploadStatus.setAttribute("aria-live", "polite");

            customization.append(
                uploadTitle,
                uploadHelp,
                uploadLabel,
                fileInput,
                uploadStatus
            );

            // Show the uploaded picture separately from the sample image
            if (
                typeof item.customImageUrl === "string" &&
                item.customImageUrl.trim()
            ) {
                const previewTitle = document.createElement("p");
                previewTitle.textContent = "Your uploaded picture:";

                const preview = document.createElement("img");
                preview.src = safeImageUrl(item.customImageUrl);
                preview.alt = "Your custom picture for " +
                    String(item.name || "this product");
                preview.className = "custom-image-preview";
                preview.loading = "lazy";
                preview.style.maxWidth = "180px";
                preview.style.maxHeight = "180px";
                preview.style.objectFit = "contain";
                preview.style.display = "block";

                preview.addEventListener("error", () => {
                    preview.alt = "Unable to display your uploaded picture.";
                });

                const removePicture = document.createElement("button");
                removePicture.type = "button";
                removePicture.className = "remove-custom-image";
                removePicture.dataset.cartKey = cartKey;
                removePicture.textContent = "Remove Uploaded Picture";

                customization.append(
                    previewTitle,
                    preview,
                    removePicture
                );
            }

            info.append(
                name,
                priceText,
                controls,
                remove,
                customization
            );

            cartItem.append(image, info);

            const divider = document.createElement("hr");

            cartItems.append(cartItem, divider);
        });

        totalPrice.textContent = total.toFixed(2);
        updateCartCount();
    }

    // =====================================
    // Upload or Replace a Product's Picture
    // =====================================

    document.addEventListener("change", async event => {
        const input = event.target;

        if (
            !input ||
            !input.classList ||
            !input.classList.contains("custom-image-input")
        ) {
            return;
        }

        const cartKey = input.dataset.cartKey;
        const file = input.files && input.files[0];

        if (!cartKey || !file) return;

        const status = Array.from(
            document.querySelectorAll(".custom-image-status")
        ).find(element => element.dataset.cartKey === cartKey);

        function showStatus(message) {
            if (status) status.textContent = message;
        }

        // Validate the selected file
        if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
            showStatus("Please select a JPG, PNG, or WebP image.");
            input.value = "";
            return;
        }

        if (file.size > MAX_IMAGE_SIZE) {
            showStatus("Your picture must be 5 MB or smaller.");
            input.value = "";
            return;
        }

        const cart = getCart();
        const item = cart.find(
            product => getCartKey(product) === cartKey
        );

        if (!item) {
            showStatus("This cart item could not be found. Please refresh.");
            input.value = "";
            return;
        }

        const originalLabel = input.previousElementSibling;
        const originalLabelText = originalLabel
            ? originalLabel.textContent
            : "";

        input.disabled = true;

        if (originalLabel) {
            originalLabel.textContent = "Uploading Picture...";
        }

        showStatus("Uploading your picture. Please wait...");

        try {
            const formData = new FormData();
            formData.append("image", file);

            const response = await fetch(CART_IMAGE_API, {
                method: "POST",
                body: formData
            });

            let result = {};

            try {
                result = await response.json();
            } catch {
                result = {};
            }

            if (!response.ok) {
                throw new Error(
                    result.message ||
                    "Unable to upload your picture. Please try again."
                );
            }

            if (
                typeof result.imageUrl !== "string" ||
                !result.imageUrl.startsWith("https://")
            ) {
                throw new Error(
                    "The upload service did not return a valid image URL."
                );
            }

            // Re-read storage in case the cart changed during upload.
            const latestCart = getCart();
            const latestItem = latestCart.find(
                product => getCartKey(product) === cartKey
            );

            if (!latestItem) {
                throw new Error(
                    "This cart item was removed before the upload finished."
                );
            }

            latestItem.customImageUrl = result.imageUrl;
            latestItem.customImagePublicId =
                typeof result.publicId === "string"
                    ? result.publicId
                    : "";

            saveCart(latestCart);
            renderCart();

            const updatedStatus = Array.from(
                document.querySelectorAll(".custom-image-status")
            ).find(element => element.dataset.cartKey === cartKey);

            if (updatedStatus) {
                updatedStatus.textContent =
                    "Your picture has been uploaded and saved to this cart item.";
            }

        } catch (error) {
            console.error("Cart image upload error:", error);

            showStatus(
                error.message ||
                "Unable to upload your picture. Please try again."
            );

            input.value = "";

        } finally {
            // The cart may have re-rendered after a successful upload.
            // Only restore the original input if it is still on the page.
            if (input.isConnected) {
                input.disabled = false;

                if (originalLabel) {
                    originalLabel.textContent = originalLabelText;
                }
            }
        }
    });

    // =====================================
    // Increase, Decrease, Remove & Clear Picture
    // =====================================

    document.addEventListener("click", event => {
        const button = event.target.closest(
            ".increase, .decrease, .remove-item, .remove-custom-image"
        );

        if (!button) return;

        const cartKey = button.dataset.cartKey;

        if (!cartKey) return;

        let cart = getCart();

        if (button.classList.contains("remove-custom-image")) {
            cart = cart.map(item => {
                if (getCartKey(item) === cartKey) {
                    return {
                        ...item,
                        customImageUrl: "",
                        customImagePublicId: ""
                    };
                }

                return item;
            });

        } else if (button.classList.contains("increase")) {
            cart = cart.map(item => {
                if (getCartKey(item) === cartKey) {
                    return {
                        ...item,
                        quantity: (Number(item.quantity) || 0) + 1
                    };
                }

                return item;
            });

        } else if (button.classList.contains("decrease")) {
            cart = cart.map(item => {
                if (getCartKey(item) === cartKey) {
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
            cart = cart.filter(
                item => getCartKey(item) !== cartKey
            );
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
    // Existing functionality preserved
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
                if (!ALLOWED_IMAGE_TYPES.includes(image.type)) {
                    statusMessage.textContent =
                        "Please select a JPG, PNG, or WebP image.";

                    return;
                }

                if (image.size > MAX_IMAGE_SIZE) {
                    statusMessage.textContent =
                        "Your image must be 5 MB or smaller.";

                    return;
                }
            }

            const originalButtonText = submitButton.textContent;

            submitButton.disabled = true;
            submitButton.textContent = "Sending Request...";
            statusMessage.textContent =
                "Submitting your custom design request...";

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

    // =====================================
    // Initial Page Setup
    // =====================================

    updateCartCount();
    renderCart();

});
