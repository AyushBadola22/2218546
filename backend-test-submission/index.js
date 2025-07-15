import express from "express";
import cors from "cors";
import { config } from "dotenv";

config();

const PORT = process.env.PORT ?? 5000;
const app = express();

app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})
