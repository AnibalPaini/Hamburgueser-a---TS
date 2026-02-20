import dotenv, { config } from "dotenv";

dotenv.config(
    {path: "./src/.env"}
);

export default  {
    port: process.env.PORT || 3000,
    mongodbUri: process.env.MONGODB_URI || "mongodb://localhost:27017/hamburgueseria",
    jwtSecret: process.env.JWT_SECRET
}