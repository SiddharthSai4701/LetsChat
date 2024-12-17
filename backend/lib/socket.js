import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ['http://localhost:5173']
    }
});

export function getReceiverSocketId(userId) {
    return userSocketKeyMap[userId];
}

// Used to store online users {userId : socketId}
const userSocketKeyMap = {

}

io.on("connection", (socket) => {
    console.log(`A user connected! Socket ID: ${socket.id}`);

    const userId = socket.handshake.query.userId;
    if (userId) {
        userSocketKeyMap[userId] = socket.id;
    }
    // Broadcast an event to all connected users
    io.emit("getOnlineUsers", Object.keys(userSocketKeyMap));


    socket.on("disconnect", () => {
        console.log(`A user disconnected! Socket ID: ${socket.id}`);
        delete userSocketKeyMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketKeyMap));
    })
})

export { io, app, server };