// import express from "express";
import streamifier from "streamifier";
import fs from "fs";
import path from "path";

// Initialize express
// const app = express();

// Custom middleware for processing file uploads using streamifier
const upload = (req, res, next) => {
  const { file } = req.body;  // Access the file from the request body
  if (file) {
    // Convert the file buffer to a readable stream
    const fileStream = streamifier.createReadStream(file.buffer);

    // Set the destination folder and file name
    const uploadFolder = path.join(__dirname, "upload/");
    const fileName = `${Date.now()}-${file.originalname}`;
    const filePath = path.join(uploadFolder, fileName);

    // Create a writable stream to write the file to disk
    const writeStream = fs.createWriteStream(filePath);

    // Pipe the file stream into the write stream
    fileStream.pipe(writeStream);

    writeStream.on("finish", () => {
      console.log("File uploaded successfully!");
      next(); // Proceed to the next middleware or route handler
    });

    writeStream.on("error", (err) => {
      console.error("Error while uploading file:", err);
      res.status(500).send("File upload failed.");
    });
  } else {
    res.status(400).send("No file uploaded.");
  }
};

// Route to handle file upload
// app.post("/upload", express.json(), express.urlencoded({ extended: true }), processFileUpload, (req, res) => {
//   res.send("File uploaded successfully!");
// });
export default upload;