const express = require("express");
const pool = require("../config/db");
const router = express.Router();

// Keep this server-side catalogue in sync with products.html.
const PRODUCT_CATALOG = Object.freeze({
    "1": { name: "Customized Bottle", price: 499, image: "image/bottle.jpg" },
    "2": { name: "Customized Calendar", price: 399, image: "image/call.jpg" },
    "3": { name: "Customized Gift Wrapping", price: 199, image: "image/wrapper.jpg" },
    "4": { name: "Customized Photo Frame", price: 999, image: "image/frame.jpg" },
    "5": { name: "Customized Keychain", price: 299, image: "image/keychain.jpg" },
    "6": { name: "Customized Gift Bag", price: 499, image: "image/bag.jpg" }
});
const PAYMENT_METHODS = new Set(["Cash on Delivery", "UPI", "Credit / Debit Card"]);

function cleanString(value, maxLength) {
    return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}
function validEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function validCustomImageUrl(value) {
    if (value === undefined || value === null || value === "") return true;
    if (typeof value !== "string" || value.length > 2048) return false;
    try {
        const url = new URL(value);
        return url.protocol === "https:" && url.hostname === "res.cloudinary.com";
    } catch {
        return false;
    }
}

router.post("/", async (req, res) => {
    const fullName = cleanString(req.body?.fullName, 120);
    const email = cleanString(req.body?.email, 254).toLowerCase();
    const phone = cleanString(req.body?.phone, 40);
    const deliveryAddress = cleanString(req.body?.deliveryAddress, 2000);
    const paymentMethod = cleanString(req.body?.paymentMethod, 40);
    const items = req.body?.items;

    if (fullName.length < 2) return res.status(400).json({ message: "Please enter your full name." });
    if (!validEmail(email)) return res.status(400).json({ message: "Please enter a valid email address." });
    if (phone.replace(/\D/g, "").length < 7) return res.status(400).json({ message: "Please enter a valid phone number." });
    if (deliveryAddress.length < 8) return res.status(400).json({ message: "Please enter your complete delivery address." });
    if (!PAYMENT_METHODS.has(paymentMethod)) return res.status(400).json({ message: "Please select a valid payment method." });
    if (!Array.isArray(items) || items.length < 1 || items.length > 30) {
        return res.status(400).json({ message: "Your cart is empty or contains too many items." });
    }

    const normalizedItems = [];
    let orderTotal = 0;
    for (const item of items) {
        const productId = cleanString(item?.id, 30);
        const product = PRODUCT_CATALOG[productId];
        const quantity = Number(item?.quantity);
        if (!product) return res.status(400).json({ message: "Your cart contains an unknown product. Please refresh your cart." });
        if (!Number.isSafeInteger(quantity) || quantity < 1 || quantity > 99) {
            return res.status(400).json({ message: "A product quantity is invalid. Please update your cart." });
        }
        if (!validCustomImageUrl(item?.customImageUrl)) {
            return res.status(400).json({ message: "A custom picture URL is invalid. Please upload the picture again." });
        }
        const lineTotal = product.price * quantity;
        orderTotal += lineTotal;
        normalizedItems.push({
            productId, product, quantity, lineTotal,
            customImageUrl: item?.customImageUrl || null,
            customImagePublicId: cleanString(item?.customImagePublicId, 500) || null
        });
    }
    if (!Number.isFinite(orderTotal) || orderTotal <= 0) {
        return res.status(400).json({ message: "The order total is invalid." });
    }

    const client = await pool.connect();
    try {
        await client.query("BEGIN");
        const orderResult = await client.query(
            `INSERT INTO orders (full_name, email, phone, delivery_address, payment_method, order_total)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, order_total, status, created_at`,
            [fullName, email, phone, deliveryAddress, paymentMethod, orderTotal.toFixed(2)]
        );
        const order = orderResult.rows[0];

        for (const item of normalizedItems) {
            await client.query(
                `INSERT INTO order_items
          (order_id, product_id, product_name, unit_price, quantity, line_total,
           product_image, custom_image_url, custom_image_public_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
                [order.id, item.productId, item.product.name, item.product.price.toFixed(2),
                item.quantity, item.lineTotal.toFixed(2), item.product.image,
                item.customImageUrl, item.customImagePublicId]
            );
        }
        await client.query("COMMIT");
        return res.status(201).json({
            message: "Your order has been placed and saved successfully.",
            order: {
                id: order.id, total: Number(order.order_total), status: order.status,
                createdAt: order.created_at, paymentMethod
            },
            paymentNotice: paymentMethod === "Cash on Delivery"
                ? "Payment is due on delivery."
                : "Your selected payment method has been recorded, but online payment has not been processed."
        });
    } catch (error) {
        try { await client.query("ROLLBACK"); } catch (rollbackError) {
            console.error("Order rollback error:", rollbackError.message);
        }
        console.error("Order creation failed:", error.message);
        return res.status(500).json({ message: "We could not save your order. Your cart has not been cleared. Please try again." });
    } finally {
        client.release();
    }
});

module.exports = router;
