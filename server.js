import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import http from "http";

const PORT = process.env.PORT || 3000;
const app = express();
const httpServer = http.createServer(app);

app.use(cors({
    origin: ["http://localhost:5173", "https://collaborative-doc.vercel.app"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({extended: true}))


const io = new Server(httpServer, {
    cors: {
        origin: ["https://collaborative-doc.vercel.app", "http://localhost:5173"],
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    },
});


app.get("/health-check", (req, res) => {
    return res.status(200).json({ message: "ok" });
})

import documentRoutes from "./routes/document.routes.js";

app.use("/api/v1/document", documentRoutes);


export {
    app,
    httpServer,
    io,
    PORT
}
