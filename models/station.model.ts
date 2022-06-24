import { Schema, model } from "mongoose";

interface IStation {
    stationID: string,
    humedad: number,
    temperatura: number,
    hic: number,
    pm1: number,
    pm25: number,
    pm10: number,
    wDirection: string,
    rainMM: number,
    wSpeed: number,
}

const readingSchema =  new Schema(
    {
    humedad: { type: Number, required: true },
    temperatura: { type: Number, required: true },
    hic: { type: Number, required: true },
    pm1: { type: Number, required: true },
    pm25: { type: Number, required: true },
    pm10: { type: Number, required: true },
    wDirection: { type: String, required: true },
    wSpeed: { type: Number, required: true },
    rainMM: { type: Number, required: true },
    },
    { timestamps: true }
)

const stationSchema = new Schema(
    {
        stationID: String,
        readings: [readingSchema]
        
    },
    { timestamps: true }
);

export const Station = model<IStation>('Station', stationSchema)