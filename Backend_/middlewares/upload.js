import multer from "multer";
import fs from "fs";
import path from "path";
import os from "os"; 
import { fileURLToPath } from "url";

// Get __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Use system temp directory for safer storage
const tempFolder = path.join(os.tmpdir(), "uploads");

// Ensure tmp folder exists
if (!fs.existsSync(tempFolder)) {
  fs.mkdirSync(tempFolder, { recursive: true }); // Ensure parent directories are also created
}

// Define storage location & file naming strategy
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tempFolder); // Save uploaded files in 'tmp' folder
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Set up file upload handling
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
}).fields([
  { name: "attachments", maxCount: 5 },
  { name: "excelFile", maxCount: 1 },
  { name: "eventPoster", maxCount: 1 },
]);

export default upload
export { tempFolder }; // Export tempFolder path for usage elsewhere