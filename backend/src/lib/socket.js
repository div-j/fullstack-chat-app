import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io =  new Server(server, {
    cors: {
        origin: ["http://localhost:3000"],
    }
});

export function getReceiverSocketId(userId) {
    return userSocketMap[userId];
  } 


//storing online users
const userSocketMap = {};

//socket.io connection
io.on("connection", (socket) => {
    console.log("A User connected", socket.id);
    //getting on online users
    
    const userId = socket.handshake.query.userId;
    if (!userId) {
        console.log("User ID is missing");
        socket.disconnect();
        return;
    }

    console.log("User ID:", userId); // Log the user ID to verify it is correct

    if (userId) userSocketMap[userId] = socket.id
    

    //emit online users
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
    console.log("Emitting Online Users:", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        console.log("A User disconnected", socket.id);

        //removing user from online users
        delete userSocketMap[userId]
        
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

export { io, app, server };