import express from "express";
import cors from "cors";
import { config } from "dotenv";
import Log from "../loggingMiddleware/logger.js";

config();

const PORT = process.env.PORT ?? 5000;
const app = express();

app.use(cors());

// Testing the logging  middleware
app.get("/", async (req, res) => {
  const response = await Log("backend", "info", "service", "Testing middleware");
  res.json({ message: "Hello World!", response });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
