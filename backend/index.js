import express from 'express';
import { nanoid } from "nanoid";
import dotenv from 'dotenv';
import cors from 'cors';
import { connectToMongoDB } from "./src/config/mongo.config.js";
import cookieParser from 'cookie-parser';
import { errorHandler } from './src/middleware/error.middleware.js';

import shortUrlRoutes from "./src/routes/short_url.routes.js";
import userRoutes from "./src/routes/user.routes.js";

dotenv.config();

const app = express();

// ✅ Mongo ek hi baar connect hoga (Vercel serverless me har request pe dubara na ho)
connectToMongoDB();

app.use(cors({
    origin: process.env.BASE_URL_FRONTEND,
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


// routes
app.use("/api/url", shortUrlRoutes);
app.use("/api/auth", userRoutes);

app.use(errorHandler);

app.get("/", (req, res) => {
    res.send("Welcome to URL Shortener API 🚀");
});

// ✅ Local me run karega, Vercel pe nahi
if (process.env.NODE_ENV !== "production") {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running locally on port ${PORT}`);
    });
}

// ✅ Serverless ke liye express app export
export default app;
