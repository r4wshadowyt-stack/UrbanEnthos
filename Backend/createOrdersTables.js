require("dotenv").config();
const pool = require("./config/db");

async function createOrderTables() {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");
        await client.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id BIGSERIAL PRIMARY KEY,
        full_name VARCHAR(120) NOT NULL,
        email VARCHAR(254) NOT NULL,
        phone VARCHAR(40) NOT NULL,
        delivery_address TEXT NOT NULL,
        payment_method VARCHAR(40) NOT NULL CHECK (payment_method IN ('Cash on Delivery', 'UPI', 'Credit / Debit Card')),
        order_total NUMERIC(12,2) NOT NULL CHECK (order_total >= 0),
        status VARCHAR(30) NOT NULL DEFAULT 'Placed',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);
        await client.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id BIGSERIAL PRIMARY KEY,
        order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
        product_id VARCHAR(30) NOT NULL,
        product_name VARCHAR(160) NOT NULL,
        unit_price NUMERIC(12,2) NOT NULL CHECK (unit_price >= 0),
        quantity INTEGER NOT NULL CHECK (quantity BETWEEN 1 AND 99),
        line_total NUMERIC(12,2) NOT NULL CHECK (line_total >= 0),
        product_image TEXT,
        custom_image_url TEXT,
        custom_image_public_id TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);
        await client.query("CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders (created_at DESC)");
        await client.query("CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items (order_id)");
        await client.query("COMMIT");
        console.log("UrbanEthos order tables created successfully.");
    } catch (error) {
        await client.query("ROLLBACK");
        console.error("Could not create order tables:", error.message);
        process.exitCode = 1;
    } finally {
        client.release();
        await pool.end();
    }
}

createOrderTables().catch(async error => {
    console.error("Order table setup failed:", error.message);
    try { await pool.end(); } catch { }
    process.exitCode = 1;
});
