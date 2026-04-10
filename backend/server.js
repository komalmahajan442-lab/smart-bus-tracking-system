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
    {cors:{origin:'*'}});


 app.use(cors());
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

 const start=async()=>{

    try{
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Database connected");
    }catch(err){
        console.log(err);
    }

    server.listen(9000,()=>{
        console.log("app is listening on port");
    })
 }

 start();