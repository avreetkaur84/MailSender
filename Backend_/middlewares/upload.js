import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

// Get __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define storage location & file naming strategy
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadFolder = path.join(__dirname, "../upload/");
    cb(null, uploadFolder);
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

export default upload;