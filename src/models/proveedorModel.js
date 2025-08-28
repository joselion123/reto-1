import baseDatos from '../config/conexion.js';

class Proveedor {
    constructor(datos = {}) {
        this.id = datos.id;
        this.nombres = datos.nombres;
        this.apellidos = datos.apellidos;
        this.direccion = datos.direccion;
        this.email = datos.email;
        this.telefono = datos.telefono;
        this.ciudad = datos.ciudad;
        this.estado = datos.estado;
    }

    validar() {
        const errores = [];
        if (!this.nombres) errores.push('Nombres es requerido');
        if (!this.apellidos) errores.push('Apellidos es requerido');
        if (this.email && !this.validarEmail(this.email)) errores.push('Email inválido');
        return {
            esValido: errores.length === 0,
            errores
        };
    }

    validarEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    obtenerNombreCompleto() {
        return `${this.nombres} ${this.apellidos}`.trim();
    }

    aJSON() {
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
            const consulta = "SELECT * FROM proveedor ORDER BY apellidos DESC";
            const [resultado] = await baseDatos.query(consulta);
            return resultado;
        } catch (error) {
            throw new Error(`Error al buscar proveedores: ${error.message}`);
        }
    }

    static async crear(datosProveedor) {
        try {
            const proveedor = new Proveedor(datosProveedor);
            const validacion = proveedor.validar();
            
            if (!validacion.esValido) {
                throw new Error(`Validación fallida: ${validacion.errores.join(', ')}`);
            }

            const consulta = "INSERT INTO proveedor SET ?";
            const [resultado] = await baseDatos.query(consulta, [proveedor.aJSON()]);
            return resultado;
        } catch (error) {
            throw new Error(`Error al crear proveedor: ${error.message}`);
        }
    }

    static async encontrarporapellido(apellido) {
        try {
            if (!apellido) throw new Error('Apellido es requerido');
            const consulta = "SELECT * FROM proveedor WHERE apellidos LIKE ? ORDER BY apellidos ASC";
            const [resultado] = await baseDatos.query(consulta, [apellido + '%']);
            return resultado;
        } catch (error) {
            throw new Error(`Error al buscar por apellido: ${error.message}`);
        }
    }

    static async encontrarporid(id) {
        try {
            const consulta = "SELECT * FROM proveedor WHERE id = ?";
            const [resultado] = await baseDatos.query(consulta, [id]);
            return resultado.length > 0 ? resultado[0] : null;
        } catch (error) {
            throw new Error(`Error al buscar por ID: ${error.message}`);
        }
    }

    static async actualizar(id, datos) {
        try {
            const proveedor = new Proveedor(datos);
            const validacion = proveedor.validar();
            
            if (!validacion.esValido) {
                throw new Error(`Validación fallida: ${validacion.errores.join(', ')}`);
            }

            const consulta = "UPDATE proveedor SET ? WHERE id = ?";
            const datosLimpios = Object.fromEntries(
                Object.entries(proveedor.aJSON()).filter(([clave, valor]) => valor !== undefined && clave !== 'id')
            );
            const [resultado] = await baseDatos.query(consulta, [datosLimpios, id]);
            return resultado;
        } catch (error) {
            throw new Error(`Error al actualizar proveedor: ${error.message}`);
        }
    }

    static async eliminar(id) {
        try {
            const consulta = "DELETE FROM proveedor WHERE id = ?";
            const [resultado] = await baseDatos.query(consulta, [id]);
            return resultado;
        } catch (error) {
            throw new Error(`Error al eliminar proveedor: ${error.message}`);
        }
    }
}

export default Proveedor;