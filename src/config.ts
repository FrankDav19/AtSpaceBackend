import { config } from "dotenv";
config();

export const {
    MONGODB_URI
} = process.env as {
    [key: string]: string;
};