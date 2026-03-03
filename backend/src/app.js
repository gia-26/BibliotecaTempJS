//Importamos la librería de express
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import prestamosRoutes from './routes/prestamos.routes.js';
import usuariosRoutes from './routes/usuarios.routes.js';
import multasRoutes from './routes/multas.routes.js';
import inicioRoutes from './routes/inicio.routes.js';

//Creamos el objeto de express para nuestra aplicación
const app = express();

//Configuramos dotenv para cargar las variables de entorno desde el archivo .env
dotenv.config();

//Definimos el puerto en el que se ejecutará el servidor
const port = process.env.PORT || 3000;

app.use(cors({
  origin: "http://localhost"
}));

//Definimos un middleware para parsear el cuerpo de las solicitudes en formato JSON
app.use(express.json());

//Definimos las rutas de nuestra aplicación
app.use('/api/prestamos', prestamosRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/multas', multasRoutes);
app.use('/api/inicio', inicioRoutes);

app.listen(port, () => {
    console.log(`Aplicación corriendo en el puerto ${port}`);
});