import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

let dbConexion;

try {
  dbConexion = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    password: process.env.DB_PASSWORD,
  });

  console.log("✅ Conexión a MySQL exitosa");
} catch (err) {
  console.error("❌ Error al conectar a MySQL:", err.message);
}

export default dbConexion;
