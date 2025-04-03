import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import ClientRoute from "./routes/ClientRoute";
import PaymentRoute from "./routes/PaymentRoute";
import AgentRoute from "./routes/AgentRoute";
import authRoutes from "./routes/AuthRoute";
import path from "path";

dotenv.config();
const app = express();
app.use(cors());
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/", ClientRoute, PaymentRoute, AgentRoute);
app.use("/api/auth", authRoutes);

// servir des fichiers statisques à express
const public_path = path.join(__dirname, "./dist");
app.use(express.static(public_path));
app.get("*", (_, res) => {
  res.sendFile(path.join(public_path, "index.html"));
});

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
