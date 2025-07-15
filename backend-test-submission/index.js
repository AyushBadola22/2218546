import express from "express";
import cors from "cors";
import { config } from "dotenv";
import Log from "../loggingMiddleware/logger.js";
import shorturlRoutes from "./routes/shorturlRoutes.js";

config();

const PORT = process.env.PORT ?? 5000;
const app = express();

app.use(cors());
app.use(express.json());

app.use("/shorturls", shorturlRoutes);

// Testing the logging  middleware
app.get("/", async (req, res) => {
  const response = await Log(
    "backend",
    "info",
    "service",
    "Testing middleware"
  );
  res.json({ message: "Hello World!", response });
});

app.listen(PORT, () => {
  Log("backend", "info", "service", "Server running");
});
