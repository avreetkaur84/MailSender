import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";

import mailRouter from "./routes/mail.routes.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: ["https://mail-sender-4nhwu6wzk-avreet-kaurs-projects.vercel.app/"],
    methods: ["POST", "GET"],
    credentials: true,
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/mail", mailRouter);

app.get("/api", (req, res) => {
  res.send("Backend is working on Vercel!");
});

// ✅ Fix: Start the Express server if not in a Vercel serverless function
const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;