import express from 'express';
import dbConexion from './config/conexion.js';

const proveedor = express.Router();

proveedor.get("/proveedor/listarTodos", async (req, res) => {
  const consulta = "SELECT * FROM proveedor order by apellidos desc";

  try {
    const [resultado] = await dbConexion.query(consulta);
    res.send({
      estado: "ok",
      data: resultado
    });
  } catch (error) {
    console.error("Error en listarTodos:", error.message);
    res.status(500).send({
      estado: "error",
      data: "Error 500"
    });
  }
});

proveedor.post("/proveedor/insertar", async (req, res) => {
  try {
    const {id, nombres, apellidos,direccion,email, telefono, ciudad, estado } = req.body;


    const datosproveedor = {
      id,
      nombres,
      apellidos,
      direccion,
      email,
      telefono,
      ciudad,
      estado,
    };

    const consulta = "INSERT INTO proveedor SET ?";
    await dbConexion.query(consulta, [datosproveedor]);

    res.status(200).json({ mensaje: "proveedor insertado correctamente" });
  } catch (err) {
    console.error("Error al insertar proveedor:", err.message);
    res.status(500).json({ error: "Error al insertar proveedor" });
  }
});

proveedor.get("/proveedor/buscarporapellido/:apellido", async (req, res) => {
  
  try {
    let apellidos = req.params.apellidos;
    let consulta = "SELECT * FROM proveedor where apellido = ?";
    let [resultado] = await dbConexion.query(consulta, [apellidos]);
    
    if (resultado.length == 0) {
      res.send({ res: "No hay proveedores con el apellido: " + apellidos });
      res.send({
        estado: "Datos vacios",
        data: resultado,
      });
    }

    res.send({ resultado });
    res.send({
      estado: "ok",
      data: resultado,
    });
  }
  catch (e) {
    res.status(500).send({
      estado: "error",
      data: e.code + "=>" + e.message,
    })
    
  }
});

proveedor.delete("/proveedor/eliminar/:id", async(req,res)=>{
  let id=req.params.id;
  try{
    
    let consulta="Delete from proveedor where id = ?";
      let [resultado]=await dbConexion.query(consulta,[id]);

     res.send({resultado});
        res.send({
            estado:"ok",
            data:resultado
        })
    }catch(err){
        res.status(500).send({
            estado:"error",
            codigo: codigo,
            data: err.message
        })
  }
})

proveedor.put("/proveedor/editar/:id", async (req, res) => {
  try {
    const id=req.params.id
    const datosProveedor = {
      nombres : req.params.nombres,
      apellidos: req.params.apellidos,
      direccion: req.params.direccion,
      email: req.params.email,
      telefono: req.params.telefono,
      ciudad: req.params.ciudad,
      estado: req.params.estado,
    };

    const consulta = "update proveedor SET ? where id= ?";
    await dbConexion.query(consulta, [datosProveedor,id]);

    res.status(200).json({ mensaje: "proveedor editado correctamente" });
  } catch (err) {
    console.error("Error al editar proveedor:", err.message);
    res.status(500).json({ error: "Error al editar proveedor" });
  }
});
export default proveedor;
