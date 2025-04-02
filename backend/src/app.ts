import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import ClientRoute from "./routes/ClientRoute";
import PaymentRoute from "./routes/PaymentRoute";

dotenv.config();
const app = express();
app.use(cors());
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/", ClientRoute);
app.use("/api/", PaymentRoute);

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
