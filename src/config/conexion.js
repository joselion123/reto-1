import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

class Database {
    constructor() {
        if (Database.instance) {
            return Database.instance;
        }
        
        this.connection = null;
        Database.instance = this;
    }

    async connect() {
        if (!this.connection) {
            try {
                this.connection = await mysql.createConnection({
                    host: process.env.DB_HOST,
                    user: process.env.DB_USER,
                    database: process.env.DB_NAME,
                    port: process.env.DB_PORT,
                    password: process.env.DB_PASSWORD,
                });
                console.log("✅ Conexión a MySQL exitosa");
            } catch (error) {
                console.error("❌ Error al conectar a MySQL:", error.message);
                throw error;
            }
        }
        return this.connection;
    }

    async query(sql, params) {
        const connection = await this.connect();
        return connection.query(sql, params);
    }

    async close() {
        if (this.connection) {
            await this.connection.end();
            this.connection = null;
        }
    }
}

const database = new Database();
export default database;