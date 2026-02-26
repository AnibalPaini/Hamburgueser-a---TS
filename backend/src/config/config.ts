import dotenv, { config } from "dotenv";
import { env } from "node:process";

dotenv.config(
    {path: "./src/.env"}
);

export default  {
    env : process.env.NODE_ENV || "development",
    frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173",
    port: process.env.PORT || 3000,
    mongodbUri: process.env.MONGODB_URI || "mongodb://localhost:27017/hamburgueseria",
    jwtSecret: process.env.JWT_SECRET,
    cookieSecret: process.env.COOKIE_SECRET
}