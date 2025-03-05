import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import mongoConnect from "./config/mongodbConnection.js";
import cloudinary from 'cloudinary';
import cors from 'cors';

import authRoute from "./routes/authRoute.js";
import userRoute from "./routes/userRoute.js";

dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();

const allowedOrigins = [process.env.FRONTEND_URL]; // Include frontend URL from env

app.use(cors({
  origin: function (origin, callback) {
    // Check if the origin is allowed
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error(`Not allowed by CORS: ${origin}`));
    }
  },
  credentials: true, // Allow credentials (cookies, authorization headers)
  methods: ['GET', 'POST', 'DELETE', 'PUT'], // Specify allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Add any custom headers if needed
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

// Api end points
app.use('/auth', authRoute);
app.use('/user', userRoute);

app.listen(process.env.PORT, async () => {
  console.log(`PORT IS RUNNING ON ${process.env.PORT}`);
  await mongoConnect();
});