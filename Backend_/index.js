import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";

// import upload from "./middlewares/upload.js";
import mailRouter from "./routes/mail.routes.js";

dotenv.config();

const app = express();

// app.use(cors());
// app.use(
//   cors({
//     origin: "https://mail-sender-frontend-nine.vercel.app",
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   })
// );

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Explicitly handle OPTIONS preflight requests
// app.options("*", cors({ origin: "https://mail-sender-frontend-nine.vercel.app", credentials: true }));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use("/mail", mailRouter);

app.get("/", (req, res) => {
  res.send("Backend is working!");
});

const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;