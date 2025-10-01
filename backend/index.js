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
    origin: process.env.BASE_URL_FRONTEND,
    credentials: true, // Allow cookies to be sent
}));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser())


// routes
app.use("/api/url", shortUrlRoutes);
app.use("/api/auth", userRoutes);

app.use(errorHandler);


app.get("/",(req,res)=>{
    res.send("Welcome to URL Shortener API");
})

app.listen(process.env.PORT,()=>{
    connectToMongoDB();
    console.log(`Server is running on port ${process.env.PORT}`);
});