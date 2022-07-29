import { Socket } from "socket.io";
import { User, Station } from "../models/models";


export default (io: any) => {
    io.on('connection', (socket: Socket) => {
        console.log('New User Connected');
        console.log(socket.id);

        Station.watch().on('change', (data) => {
            io.emit('StationsChange', data);
        })

        socket.on('disconnect', () => {
            console.log('user disconnected');
        })

    })

 
}