import Proveedor from '../models/proveedorModel.js';

class ControladorProveedor {
    constructor() {
        this.modelo = Proveedor;
    }

    async listarTodos(req, res) {
        try {
            const proveedores = await this.modelo.buscartodos();
            res.status(200).json({
                exito: true,
                datos: proveedores,
                mensaje: 'Proveedores obtenidos exitosamente'
            });
        } catch (error) {
            res.status(500).json({
                exito: false,
                mensaje: 'Error al obtener proveedores',
                error: error.message
            });
        }
    }

    async crear(req, res) {
        try {
            const { nombres, apellidos } = req.body;
            if (!nombres || !apellidos) {
                return res.status(400).json({
                    exito: false,
                    mensaje: 'Nombres y apellidos son requeridos'
                });
            }

            const resultado = await this.modelo.crear(req.body);
            res.status(201).json({
                exito: true,
                datos: { id: resultado.insertId, ...req.body },
                mensaje: 'Proveedor creado exitosamente'
            });
        } catch (error) {
            res.status(500).json({
                exito: false,
                mensaje: 'Error al crear proveedor',
                error: error.message
            });
        }
    }

    async buscarPorApellido(req, res) {
        try {
            const { apellido } = req.params;
            if (!apellido) {
                return res.status(400).json({
                    exito: false,
                    mensaje: 'El apellido es requerido'
                });
            }

            const resultado = await this.modelo.encontrarporapellido(apellido);
            res.status(200).json({
                exito: true,
                datos: resultado,
                mensaje: `Se encontraron ${resultado.length} proveedores`
            });
        } catch (error) {
            res.status(500).json({
                exito: false,
                mensaje: 'Error al buscar proveedores',
                error: error.message
            });
        }
    }

    async buscarPorId(req, res) {
        try {
            const { id } = req.params;
            const proveedor = await this.modelo.encontrarporid(id);
            
            if (!proveedor) {
                return res.status(404).json({
                    exito: false,
                    mensaje: 'Proveedor no encontrado'
                });
            }

            res.status(200).json({
                exito: true,
                datos: proveedor,
                mensaje: 'Proveedor encontrado'
            });
        } catch (error) {
            res.status(500).json({
                exito: false,
                mensaje: 'Error al buscar proveedor',
                error: error.message
            });
        }
    }

    async actualizar(req, res) {
        try {
            const { id } = req.params;
            const resultado = await this.modelo.actualizar(id, req.body);
            
            if (resultado.affectedRows === 0) {
                return res.status(404).json({
                    exito: false,
                    mensaje: 'Proveedor no encontrado'
                });
            }

            const proveedorActualizado = await this.modelo.encontrarporid(id);
            res.status(200).json({
                exito: true,
                datos: proveedorActualizado,
                mensaje: 'Proveedor actualizado exitosamente'
            });
        } catch (error) {
            res.status(500).json({
                exito: false,
                mensaje: 'Error al actualizar proveedor',
                error: error.message
            });
        }
    }

    async eliminar(req, res) {
        try {
            const { id } = req.params;
            const resultado = await this.modelo.eliminar(id);
            
            if (resultado.affectedRows === 0) {
                return res.status(404).json({
                    exito: false,
                    mensaje: 'Proveedor no encontrado'
                });
            }

            res.status(200).json({
                exito: true,
                mensaje: 'Proveedor eliminado exitosamente'
            });
        } catch (error) {
            res.status(500).json({
                exito: false,
                mensaje: 'Error al eliminar proveedor',
                error: error.message
            });
        }
    }
}

const controlador = new ControladorProveedor();

export default {
    listarTodos: controlador.listarTodos.bind(controlador),
    insertar: controlador.crear.bind(controlador),
    buscarPorApellido: controlador.buscarPorApellido.bind(controlador),
    buscarPorId: controlador.buscarPorId.bind(controlador),
    actualizar: controlador.actualizar.bind(controlador),
    eliminar: controlador.eliminar.bind(controlador)
};