import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

class BaseDatos {
    constructor() {
        if (BaseDatos.instancia) {
            return BaseDatos.instancia;
        }
        
        this.conexion = null;
        BaseDatos.instancia = this;
    }

    async conectar() {
        if (!this.conexion) {
            try {
                this.conexion = await mysql.createConnection({
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
        return this.conexion;
    }

    async query(sql, parametros) {
        const conexion = await this.conectar();
        return conexion.query(sql, parametros);
    }

    async cerrar() {
        if (this.conexion) {
            await this.conexion.end();
            this.conexion = null;
        }
    }
}

const baseDatos = new BaseDatos();
export default baseDatos;