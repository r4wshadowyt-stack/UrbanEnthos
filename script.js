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

// Display Cart
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
                    <img src="${item.image}" width="80">
                    <h3>${item.name}</h3>
                    <p>₹${item.price}</p>
                    <p>Quantity: ${item.quantity}</p>
                </div>
                <hr>
            `;
        });

        totalPrice.textContent = total;

    }
}