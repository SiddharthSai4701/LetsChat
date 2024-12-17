import express from "express"; // this can only be done if we use type: "module" in the package json file
import authRoutes from "./routes/auth.route.js"; // remember to add the extension at the end since it is a local file
import messageRoutes from "./routes/message.route.js";
import dotenv from "dotenv"
import cookieParser from "cookie-parser";
import { connectDB } from "../lib/db.js";
import cors from "cors";
import { app, server } from "../lib/socket.js";

import path from "path";

dotenv.config();


const __dirname = path.resolve();
//  Replacing the server with the socket io server
// const app = express();


// This middleware allows us to extract the JSON data from the body of the request
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}
));

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// Our old server will be replaced by the socket io server

// app.listen(process.env.PORT, () => {
//     console.log(`Server is running on port: ${process.env.PORT}`);
//     connectDB();
// });

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    })
}

server.listen(process.env.PORT, () => {
    console.log(`Server is running on port: ${process.env.PORT}`);
    connectDB();
})