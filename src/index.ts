import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server as webSocketServer } from 'socket.io';
import { MONGODB_URI } from './config';
import sockets from './routes/sockets'
import ASRoutes from './routes/ASRoutes';

const app = express();
const server = http.createServer(app);
const port: string|number = process.env.PORT || 5000;
const httpServer = server.listen(port);

const io = new webSocketServer(httpServer,  {
    cors: {
      origin: "*"
    }
  });
  
sockets(io);

console.log(`Servidor corriendo en el puerto ${port}`);

// Body Parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({origin: "*"}));

// Routes
app.use('/ASAPI', ASRoutes);

// Mongo connection
mongoose.connect(MONGODB_URI, (err) => {
    if (err) throw err;
 
    console.log('Base de Datos en Linea');
})