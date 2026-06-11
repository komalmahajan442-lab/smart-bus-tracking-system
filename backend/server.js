import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import router from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import driverRoute from "./routes/driverRoute.js";
import {Server} from "socket.io";
import http, { createServer } from "http";
import studentRoute from "./routes/studentRoutes.js";
import userRoute from './routes/userRoutes.js'
import Bus from "./models/busModel.js";
import { type } from "os";


const app=express();
dotenv.config();

const server=http.createServer(app);

const io=new Server(server,
    {cors:{
      origin:'*',
credentials:true
    }});


 app.use(cors({
  origin:"*",
  credentials:true
 }));
 app.use(express.json());
 app.use(router);
app.use(adminRoutes);
app.use("/driver",driverRoute);
app.use("/student",studentRoute);
app.use(userRoute);

io.on("connection", (socket) => {

  console.log("USER CONNECTED:", socket.id);



  socket.on("joinBus", (busId) => {
    socket.join(busId);
    console.log("Joined Bus Room:", busId);
  });

  socket.on("nextStopUpdate", ({ busId, nextStopIndex }) => {

  io.to(busId).emit("updateNextStop", { nextStopIndex });

});

  socket.on("sendLocation", async ({ busId, lat, lng }) => {

    try {

      console.log("LOCATION:", busId, lat, lng);

      await Bus.findByIdAndUpdate(busId, {
        currentlocation: {
          type: "Point",
          coordinates: [lng, lat]
        }
      });

      io.to(busId).emit("receiveLocation", { busId, lat, lng });

    } catch (err) {
      console.log(err);
    }

  });

});

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      serverSelectionTimeoutMS: 30000,
      connectTimeoutMS: 30000,
    });
    console.log("Database connected");

    // ✅ Only start server AFTER DB is confirmed connected
    server.listen(9000, () => {
      console.log("App is listening on port 9000");
    });

  } catch(err) {
    console.error("❌ Failed to connect to MongoDB:", err.message);
    process.exit(1); // ← stop the server entirely, don't run without DB
  }
}

start();