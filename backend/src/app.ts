import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import ClientRoute from "./routes/ClientRoute";
import PaymentRoute from "./routes/PaymentRoute";
import AgentRoute from "./routes/AgentRoute";
import authRoutes from "./routes/AuthRoute";
import NotificationRoute from "./routes/NotificationRoute";
import path from "path";
import http from "http";
import { Server } from "socket.io";

const app = express();
dotenv.config();
app.use(
  cors({
    origin: "http://localhost:5173", //  l'URL de votre client
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  })
);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // R l'URL de votre client
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/", ClientRoute, PaymentRoute, AgentRoute, NotificationRoute);
app.use("/api/auth", authRoutes);

// Servir des fichiers statiques à express
const public_path = path.join(__dirname, "./dist");
app.use(express.static(public_path));
app.get("*", (_, res) => {
  res.sendFile(path.join(public_path, "index.html"));
});

// Écouter les connexions Socket.IO
io.on("connection", (socket) => {
  console.log("Un utilisateur est connecté");
});

server.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);

export { io };
