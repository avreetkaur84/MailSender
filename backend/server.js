import express from "express"
import cors from "cors"
import bodyParser from "body-parser"
import dotenv from "dotenv"

import mailRouter from "./routes/mail.routes.js"

dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors(
  {
    origin: ["https://mail-sender-4nhwu6wzk-avreet-kaurs-projects.vercel.app/"],
    methods: ["POST", "GET"],
    credentials: true
  }
));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/mail", mailRouter);

app.get("/", (req, res) => {
  res.send("Working")
})

// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });

export default app;