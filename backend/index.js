import express from 'express';
import {nanoid} from "nanoid"
import dotenv from 'dotenv';
import cors from 'cors';
import  {connectToMongoDB}  from "./src/config/mongo.config.js"
dotenv.config("./.env");
import cookieParser from 'cookie-parser';
import { errorHandler } from './src/middleware/error.middleware.js';


import shortUrlRoutes from "./src/routes/short_url.routes.js"
import userRoutes from "./src/routes/user.routes.js"


const app = express();
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true, // Allow cookies to be sent
}));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser())


// routes

app.use("/api/url", shortUrlRoutes);
app.use("/api/auth", userRoutes);

app.use(errorHandler);

app.listen(3000,()=>{
    connectToMongoDB();
    console.log('Server is running on port 3000');
});