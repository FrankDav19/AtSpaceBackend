import { Socket } from "socket.io";
import { User, Station } from "../models/models";

export default (io: any) => {
    io.on('connection', (socket: Socket) => {

        console.log('New User Connected');
        console.log(socket.id);

        Station.watch().on('change', (data) => {
            if (data.operationType == 'insert') {
                io.emit('stationInsert', data.fullDocument);
                console.log('Emmited!');
            }

            if (data.operationType == 'update' && data.updateDescription != undefined) {
                var readingIndex = Object.keys(data.updateDescription.updatedFields)[1];

                socket.emit('newReading', {
                    stationID: data.documentKey?._id,
                    updatedReading: data.updateDescription.updatedFields[readingIndex]
                });
            }

        });

        socket.on('disconnect', () => {
            console.log('user disconnected');
        });
    })
}