const mysql = require("mysql2");

const dbPort = process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306;
const useSsl =
  process.env.DB_SSL === "true" ||
  (process.env.DB_HOST && process.env.DB_HOST.includes("aivencloud.com")) ||
  (process.env.DB_HOST && process.env.DB_HOST.includes("tidbcloud.com")) ||
  (process.env.DB_PORT && dbPort !== 3306);

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: dbPort,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || process.env.DB_PASS || "",
  database: process.env.DB_NAME || "tourism_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: useSsl ? { minVersion: "TLSv1.2", rejectUnauthorized: true } : undefined,
});

// Auto-verify connection and initialize newsletter table
const initSql = `
  CREATE TABLE IF NOT EXISTS newsletter (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`;

pool.query(initSql, (err) => {
  if (err) {
    console.warn("⚠️ Database note:", err.message);
  } else {
    console.log("✅ MySQL Connected & 'newsletter' table verified.");
  }
});

module.exports = pool;
