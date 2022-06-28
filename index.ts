import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import Server from './classes/server';
import ASRoutes from './routes/ASRoutes';

const server = new Server(); // Server instance 

// Body Parser
server.app.use(bodyParser.urlencoded({ extended: true }));
server.app.use(bodyParser.json());


// Routes
server.app.use('/atspace', ASRoutes);

// Mongo connection
mongoose.connect('mongodb://127.0.0.1:27017/AS', (err) => {
    if (err) throw err;
 
    console.log('Base de Datos en Linea');
})

// Server start
server.start(() => {
    console.log(`Servidor corriendo en el puerto ${server.port}`);
});