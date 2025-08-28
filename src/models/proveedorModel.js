import dbConexion from '../config/conexion.js';

class Proveedor {
    constructor(data = {}) {
        this.id = data.id;
        this.nombres = data.nombres;
        this.apellidos = data.apellidos;
        this.direccion = data.direccion;
        this.email = data.email;
        this.telefono = data.telefono;
        this.ciudad = data.ciudad;
        this.estado = data.estado;
    }

    validate() {
        const errors = [];
        if (!this.nombres) errors.push('Nombres es requerido');
        if (!this.apellidos) errors.push('Apellidos es requerido');
        if (this.email && !this.validarEmail(this.email)) errors.push('Email inválido');
        return {
            isValid: errors.length === 0,
            errors
        };
    }

    validarEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    NombreCompleto() {
        return `${this.nombres} ${this.apellidos}`.trim();
    }

    toJSON() {
        return {
            id: this.id,
            nombres: this.nombres,
            apellidos: this.apellidos,
            direccion: this.direccion,
            email: this.email,
            telefono: this.telefono,
            ciudad: this.ciudad,
            estado: this.estado
        };
    }

    static async buscartodos() {
        try {
            const query = "SELECT * FROM proveedor ORDER BY apellidos DESC";
            const [result] = await dbConexion.query(query);
            return result;
        } catch (error) {
            throw new Error(`Error al buscar proveedores: ${error.message}`);
        }
    }

    static async crear(proveedorData) {
        try {
            const proveedor = new Proveedor(proveedorData);
            const validation = proveedor.validate();
            
            if (!validation.isValid) {
                throw new Error(`Validación fallida: ${validation.errors.join(', ')}`);
            }

            const query = "INSERT INTO proveedor SET ?";
            const [result] = await dbConexion.query(query, [proveedor.toJSON()]);
            return result;
        } catch (error) {
            throw new Error(`Error al crear proveedor: ${error.message}`);
        }
    }

    static async encontrarporapellido(apellido) {
        try {
            if (!apellido) throw new Error('Apellido es requerido');
            const query = "SELECT * FROM proveedor WHERE apellidos LIKE ? ORDER BY apellidos ASC";
            const [result] = await dbConexion.query(query, [apellido + '%']);
            return result;
        } catch (error) {
            throw new Error(`Error al buscar por apellido: ${error.message}`);
        }
    }

    static async encontrarporid(id) {
        try {
            const query = "SELECT * FROM proveedor WHERE id = ?";
            const [result] = await dbConexion.query(query, [id]);
            return result.length > 0 ? result[0] : null;
        } catch (error) {
            throw new Error(`Error al buscar por ID: ${error.message}`);
        }
    }

    static async actualizar(id, data) {
        try {
            const proveedor = new Proveedor(data);
            const validation = proveedor.validate();
            
            if (!validation.isValid) {
                throw new Error(`Validación fallida: ${validation.errors.join(', ')}`);
            }

            const query = "UPDATE proveedor SET ? WHERE id = ?";
            const cleanData = Object.fromEntries(
                Object.entries(proveedor.toJSON()).filter(([key, value]) => value !== undefined && key !== 'id')
            );
            const [result] = await dbConexion.query(query, [cleanData, id]);
            return result;
        } catch (error) {
            throw new Error(`Error al actualizar proveedor: ${error.message}`);
        }
    }

    static async eliminar(id) {
        try {
            const query = "DELETE FROM proveedor WHERE id = ?";
            const [result] = await dbConexion.query(query, [id]);
            return result;
        } catch (error) {
            throw new Error(`Error al eliminar proveedor: ${error.message}`);
        }
    }
}

export default Proveedor;