import { Schema, model } from "mongoose";

const readingSchema = new Schema(
    {
        humidity: { type: Number },
        temp: { type: Number },
        hic: { type: Number },
        pm1: { type: Number },
        pm25: { type: Number },
        pm10: { type: Number },
        wDirection: { type: String },
        wSpeed: { type: Number },
        rainMM: { type: Number }
    },
    { timestamps: true }
)

const stationSchema = new Schema(
    {
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
        units: ['Imperial', 'Metric'],
        readings: [readingSchema]
    },
    { timestamps: true }
);

const userSchema = new Schema({
    userData: {
        name: {
            type: String,
            min: 6,
            max: 255,
            required: [true, 'El nombre es requerido']
        },
        image: {
            type: String,
            default: 'default.png'
        },
        email: {
            type: String,
            unique: true,
            min: 6,
            max: 1024,
            required: [true, 'El correo es necesario']
        },
        password: {
            type: String,
            min: 6,
            required: [true, 'La contraseña es obligatoria']
        },
        date: {
            type: Date,
            default: Date.now
        }
    },
    uiType: {
        type: String,
        enum: ["basic", "advanced"],
        required: true
    },
    stations: [stationSchema]
});

export const User = model('User', userSchema);
export const Station = model('Station', stationSchema);
export const Reading = model('Reading', readingSchema);