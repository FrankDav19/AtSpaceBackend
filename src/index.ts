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
const httpServer = server.listen(3010);

const io = new webSocketServer(httpServer,  {
    cors: {
      origin: "http://localhost:8100"
    }
  });
  
sockets(io);

console.log('Servidor corriendo en el puerto 3010');

// Body Parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// Routes
app.use('/ASAPI', ASRoutes);

// Mongo connection
mongoose.connect(MONGODB_URI, (err) => {
    if (err) throw err;
 
    console.log('Base de Datos en Linea');
})