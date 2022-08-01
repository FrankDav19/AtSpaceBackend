"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models/models");
exports.default = (io) => {
    io.on('connection', (socket) => {
        console.log('New User Connected');
        console.log(socket.id);
        models_1.Station.watch().on('change', (data) => {
            var _a;
            if (data.operationType == 'insert') {
                io.emit('stationInsert', data.fullDocument);
            }
            if (data.operationType == 'update' && data.updateDescription != undefined) {
                var readingIndex = Object.keys(data.updateDescription.updatedFields)[1];
                socket.emit('newReading', {
                    stationID: (_a = data.documentKey) === null || _a === void 0 ? void 0 : _a._id,
                    updatedReading: data.updateDescription.updatedFields[readingIndex]
                });
            }
        });
        socket.on('disconnect', () => {
            console.log('user disconnected');
        });
    });
};
