import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import proveedorRoutes from './routes/proveedorRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();


app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/proveedor', proveedorRoutes);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    estado: 'error',
    mensaje: 'Error interno del servidor'
  });
});

app.use((req, res) => {
  res.status(404).json({
    estado: 'error',
    mensaje: 'Ruta no encontrada'
  });
});

export default app;