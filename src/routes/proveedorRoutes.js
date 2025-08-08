import { Router } from 'express';
import proveedorController from '../controllers/proveedorController.js';

const router = Router();

router.get("/listarTodos", proveedorController.listarTodos);

router.post("/insertar", proveedorController.insertar);

router.get("/buscarporapellido/:apellido", proveedorController.buscarPorApellido);

router.delete("/eliminar/:id", proveedorController.eliminar);

export default router;
