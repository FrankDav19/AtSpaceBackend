import { Schema, model, Types } from "mongoose";

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
        units: {
            type: Number,
            enum: [0, 1],
            default: 0,
            required: true
        },
        readings: [{
            type: Schema.Types.ObjectId,
            ref: "Reading"
          }]
    },
    { timestamps: true }
);

const userSchema = new Schema({
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
            type: Schema.Types.ObjectId,
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
        type: Schema.Types.ObjectId,
        ref: "Station"
      }]
},
    { timestamps: true });

enum UiType {
    Basic = 0,
    Advanced = 1
}

enum Units {
    Metric = 0,
    Imperial = 1
}

export interface IUser {
    name: string,
    image?: string,
    username: string,
    email: string,
    password: string,
    uiType: UiType
}

export interface IStation {
    name: string,
    location: Types.Array<number>,
    units: Units
}

export interface IReading {
    humidity?: number,
    temp?: number,
    hic?: number,
    pm1?: number,
    pm25?: number,
    pm10?: number,
    wDirection?: string,
    wSpeed?: number,
    rainMM?: number
}

export const User = model('User', userSchema);
export const Station = model('Station', stationSchema);
export const Reading = model('Reading', readingSchema);