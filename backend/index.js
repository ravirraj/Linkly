import express from 'express';
import {nanoid} from "nanoid"
import dotenv from 'dotenv';
import  {connectToMongoDB}  from "./src/config/mongo.config.js"
dotenv.config("./.env");




import shortUrlRoutes from "./src/routes/short_url.routes.js"

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use("/api/url", shortUrlRoutes);


app.listen(3000,()=>{
    connectToMongoDB();
    console.log('Server is running on port 3000');
});