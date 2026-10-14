
const { Pool } = require("pg");

const isNeon = Boolean(process.env.DATABASE_URL);

const pool = new Pool(
    isNeon
        ? {
            connectionString: process.env.DATABASE_URL,
            ssl: true
        }
        
        : {
            user: process.env.DB_USER,
            host: process.env.DB_HOST,
            database: process.env.DB_NAME,
            password: process.env.DB_PASSWORD,
            port: Number(process.env.DB_PORT) || 5432
        }
);

pool.on("error", (error) => {
    console.error("Unexpected PostgreSQL pool error:", error.message);
});

pool.connect()
    .then((client) => {
        console.log(
            isNeon
                ? "Neon PostgreSQL connected successfully"
                : "Local PostgreSQL connected successfully"
        );
        client.release();
    })
    .catch((error) => {
        console.error("PostgreSQL connection failed:", error.message);
    });

module.exports = pool;
