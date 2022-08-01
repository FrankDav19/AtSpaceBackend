"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const socket_io_1 = require("socket.io");
const config_1 = require("./config");
const sockets_1 = __importDefault(require("./routes/sockets"));
const ASRoutes_1 = __importDefault(require("./routes/ASRoutes"));
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const httpServer = server.listen(3010);
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: "http://localhost:8100"
    }
});
(0, sockets_1.default)(io);
console.log('Servidor corriendo en el puerto 3010');
// Body Parser
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)());
// Routes
app.use('/ASAPI', ASRoutes_1.default);
// Mongo connection
mongoose_1.default.connect(config_1.MONGODB_URI, (err) => {
    if (err)
        throw err;
    console.log('Base de Datos en Linea');
});
