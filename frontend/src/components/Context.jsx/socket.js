
import { io } from "socket.io-client";
console.log("🔥 SOCKET FILE LOADED");
export const socket = io("https://smart-bus-tracking-system.onrender.com", {
  transports: ["websocket"],
});