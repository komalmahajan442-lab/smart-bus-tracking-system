
import { io } from "socket.io-client";
console.log("🔥 SOCKET FILE LOADED");
export const socket = io("http://localhost:9000", {
  transports: ["websocket"],
});