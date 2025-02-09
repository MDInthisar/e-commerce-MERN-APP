import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import mongoConnect from "./config/mongodbConnection.js";
import cloudinary from 'cloudinary'
import cors from 'cors';

import authRoute from "./routes/authRoute.js";
import userRoute from "./routes/userRoute.js";

dotenv.config()
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'DELETE', 'PUT']
}))

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(cookieParser());


// Api end points
app.use('/auth', authRoute);
app.use('/user', userRoute)


app.listen( process.env.PORT, ()=>{
    console.log(`PORT IS RUNNING ON ${process.env.PORT}`);
    mongoConnect();
});