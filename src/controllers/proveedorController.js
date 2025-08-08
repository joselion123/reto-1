import Proveedor from '../models/proveedorModel.js';

const proveedorController = {
  listarTodos: async (req, res) => {
    try {
      const proveedores = await Proveedor.buscartodos();
      res.status(200).json({
        estado: "ok",
        data: proveedores
      });
    } catch (error) {
      console.error("Error en listarTodos:", error.message);
      res.status(500).json({
        estado: "error",
        data: "Error 500"
      });
    }
  },

  insertar: async (req, res) => {
    try {
      const { id, nombres, apellidos, direccion, email, telefono, ciudad, estado } = req.body;
      
      const datosProveedor = {
        id,
        nombres,
        apellidos,
        direccion,
        email,
        telefono,
        ciudad,
        estado
      };

      await Proveedor.crear(datosProveedor);
      res.status(200).json({ mensaje: "Proveedor insertado correctamente" });
    } catch (err) {
      console.error("Error al insertar proveedor:", err.message);
      res.status(500).json({ error: "Error al insertar proveedor" });
    }
  },

  buscarPorApellido: async (req, res) => {
    try {
      const { apellido } = req.params;
      const resultado = await Proveedor.encontrarporapellido(apellido);
      
      if (resultado.length === 0) {
        return res.status(404).json({
          estado: "No encontrado",
          mensaje: `No hay proveedores con el apellido: ${apellido}`,
          data: []
        });
      }

      res.status(200).json({
        estado: "ok",
        data: resultado
      });
    } catch (error) {
      res.status(500).json({
        estado: "error",
        mensaje: error.message
      });
    }
  },

  eliminar: async (req, res) => {
    try {
      const { id } = req.params;
      const resultado = await Proveedor.eliminar(id);
      
      if (resultado.affectedRows === 0) {
        return res.status(404).json({
          estado: "No encontrado",
          mensaje: `No se encontró el proveedor con ID: ${id}`
        });
      }

      res.status(200).json({
        estado: "ok",
        mensaje: "Proveedor eliminado correctamente"
      });
    } catch (error) {
      res.status(500).json({
        estado: "error",
        mensaje: error.message
      });
    }
  }
};

export default proveedorController;
