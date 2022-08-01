"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Station = exports.User = void 0;
const mongoose_1 = require("mongoose");
const stationSchema = new mongoose_1.Schema({
    name: { type: String },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    units: {
        type: Number,
        enum: [0, 1],
        default: 0,
        required: true
    },
    readings: [{
            humidity: { type: Number },
            temp: { type: Number },
            hic: { type: Number },
            pm1: { type: Number },
            pm25: { type: Number },
            pm10: { type: Number },
            wDirection: { type: String },
            wSpeed: { type: Number },
            rainMM: { type: Number }
        }]
}, { timestamps: true });
const userSchema = new mongoose_1.Schema({
    userData: {
        name: {
            type: String,
            min: 6,
            max: 255,
            required: [true, 'Ingrese su nombre']
        },
        image: {
            type: String,
            default: 'default.png'
        },
        username: {
            type: String,
            require: true,
            lowercase: true,
            required: [true, 'Ingrese un nombre de usuario']
        },
        email: {
            type: String,
            unique: true,
            min: 6,
            max: 1024,
            required: [true, 'Ingrese su correo electronico']
        },
        password: {
            type: String,
            min: 6,
            required: [true, 'La contraseña es obligatoria']
        },
        favorites: [{
                type: mongoose_1.Schema.Types.ObjectId,
                ref: "Favorite"
            }]
    },
    uiType: {
        type: Number,
        enum: [0, 1],
        default: 0,
        required: true
    },
    stations: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Station"
        }]
}, { timestamps: true });
var UiType;
(function (UiType) {
    UiType[UiType["Basic"] = 0] = "Basic";
    UiType[UiType["Advanced"] = 1] = "Advanced";
})(UiType || (UiType = {}));
var Units;
(function (Units) {
    Units[Units["Metric"] = 0] = "Metric";
    Units[Units["Imperial"] = 1] = "Imperial";
})(Units || (Units = {}));
exports.User = (0, mongoose_1.model)('User', userSchema);
exports.Station = (0, mongoose_1.model)('Station', stationSchema);
