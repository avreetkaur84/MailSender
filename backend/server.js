import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";

import mailRouter from "./routes/mail.routes.js";

dotenv.config();

const app = express();

app.use(cors({
  origin: ["https://mail-sender-4nhwu6wzk-avreet-kaurs-projects.vercel.app/"],
  methods: ["POST", "GET"],
  credentials: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/mail", mailRouter);  // Change route to /api/mail

app.get("/api", (req, res) => {
  res.send("Backend is working!");
});

export default app;  // Ensure it's exported for Vercel