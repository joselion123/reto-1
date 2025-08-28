import Proveedor from '../models/proveedorModel.js';

class ProveedorController {
    constructor() {
        this.model = Proveedor;
    }

    async listarTodos(req, res) { 
        try {
            const proveedores = await this.model.buscartodos();
            res.status(200).json({
                success: true,
                data: proveedores,
                message: 'Proveedores obtenidos exitosamente'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al obtener proveedores',
                error: error.message
            });
        }
    }

    async crear(req, res) {
        try {
            const { nombres, apellidos } = req.body;
            if (!nombres || !apellidos) {
                return res.status(400).json({
                    success: false,
                    message: 'Nombres y apellidos son requeridos'
                });
            }

            const resultado = await this.model.crear(req.body);
            res.status(201).json({
                success: true,
                data: { id: resultado.insertId, ...req.body },
                message: 'Proveedor creado exitosamente'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al crear proveedor',
                error: error.message
            });
        }
    }

    async buscarPorApellido(req, res) {
        try {
            const { apellido } = req.params;
            if (!apellido) {
                return res.status(400).json({
                    success: false,
                    message: 'El apellido es requerido'
                });
            }

            const resultado = await this.model.encontrarporapellido(apellido);
            res.status(200).json({
                success: true,
                data: resultado,
                message: `Se encontraron ${resultado.length} proveedores`
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al buscar proveedores',
                error: error.message
            });
        }
    }

    async buscarPorId(req, res) {
        try {
            const { id } = req.params;
            const proveedor = await this.model.encontrarporid(id);
            
            if (!proveedor) {
                return res.status(404).json({
                    success: false,
                    message: 'Proveedor no encontrado'
                });
            }

            res.status(200).json({
                success: true,
                data: proveedor,
                message: 'Proveedor encontrado'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al buscar proveedor',
                error: error.message
            });
        }
    }

    async actualizar(req, res) {
        try {
            const { id } = req.params;
            const resultado = await this.model.actualizar(id, req.body);
            
            if (resultado.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Proveedor no encontrado'
                });
            }

            const proveedorActualizado = await this.model.encontrarporid(id);
            res.status(200).json({
                success: true,
                data: proveedorActualizado,
                message: 'Proveedor actualizado exitosamente'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al actualizar proveedor',
                error: error.message
            });
        }
    }

    async eliminar(req, res) {
        try {
            const { id } = req.params;
            const resultado = await this.model.eliminar(id);
            
            if (resultado.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Proveedor no encontrado'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Proveedor eliminado exitosamente'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al eliminar proveedor',
                error: error.message
            });
        }
    }
}

const controller = new ProveedorController();

export default {
    listarTodos: controller.listarTodos.bind(controller),
    insertar: controller.crear.bind(controller),
    buscarPorApellido: controller.buscarPorApellido.bind(controller),
    buscarPorId: controller.buscarPorId.bind(controller),
    actualizar: controller.actualizar.bind(controller),
    eliminar: controller.eliminar.bind(controller)
};
