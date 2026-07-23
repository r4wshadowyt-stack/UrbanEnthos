// ===============================
// Shopping Cart
// ===============================

// Add to Cart
const addCartButtons = document.querySelectorAll(".add-cart");

addCartButtons.forEach(button => {

    button.addEventListener("click", () => {

        const product = {
            id: button.dataset.id,
            name: button.dataset.name,
            price: Number(button.dataset.price),
            image: button.dataset.image,
            quantity: 1
        };

        let cart = JSON.parse(localStorage.getItem("cart")) || [];

        const existingProduct = cart.find(item => item.id === product.id);

        if (existingProduct) {
            existingProduct.quantity++;
        } else {
            cart.push(product);
        }

        localStorage.setItem("cart", JSON.stringify(cart));

        alert(product.name + " added to cart!");
    });

});

// ===============================
// Display Cart
// ===============================

const cartItems = document.getElementById("cart-items");
const totalPrice = document.getElementById("total-price");

if (cartItems && totalPrice) {

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart.length === 0) {

        cartItems.innerHTML = "<p>Your cart is empty.</p>";

    } else {

        let total = 0;

        cartItems.innerHTML = "";

        cart.forEach(item => {

            total += item.price * item.quantity;

            cartItems.innerHTML += `
            <div class="cart-item">

                <img src="${item.image}" alt="${item.name}">

                <div class="cart-info">

                    <h3>${item.name}</h3>

                    <p>₹${item.price}</p>

                    <div class="quantity-controls">

                        <button class="decrease" data-id="${item.id}">−</button>

                        <span>${item.quantity}</span>

                        <button class="increase" data-id="${item.id}">+</button>

                    </div>

                    <button class="remove-item" data-id="${item.id}">
                        Remove
                    </button>

                </div>

            </div>

            <hr>
            `;

        });

        totalPrice.textContent = total;

    }

}

// ===============================
// Increase / Decrease / Remove
// ===============================

document.addEventListener("click", function (e) {

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (e.target.classList.contains("increase")) {

        const id = e.target.dataset.id;

        cart.forEach(item => {
            if (item.id === id) {
                item.quantity++;
            }
        });

        localStorage.setItem("cart", JSON.stringify(cart));
        location.reload();
    }

    if (e.target.classList.contains("decrease")) {

        const id = e.target.dataset.id;

        cart.forEach(item => {
            if (item.id === id && item.quantity > 1) {
                item.quantity--;
            }
        });

        localStorage.setItem("cart", JSON.stringify(cart));
        location.reload();
    }

    if (e.target.classList.contains("remove-item")) {

        const id = e.target.dataset.id;

        cart = cart.filter(item => item.id !== id);

        localStorage.setItem("cart", JSON.stringify(cart));
        location.reload();
    }

});
// ===============================
// Cart Count
// ===============================

const cartCount = document.getElementById("cart-count");

if (cartCount) {

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    let count = 0;

    cart.forEach(item => {
        count += item.quantity;
    });

    cartCount.textContent = count;
}