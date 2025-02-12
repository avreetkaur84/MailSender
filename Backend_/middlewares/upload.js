import multer from "multer";
import fs from "fs";
import path from "path";
import os from "os"; // Import OS module

// Use a temporary directory instead of 'public/temp'
const tempDir = path.join(os.tmpdir(), "uploads");

// Ensure the temp folder exists (only needed for local environments)
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
}

// Multer Storage Config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      console.log(`Saving file: ${file.originalname} (Type: ${file.mimetype})`);
      cb(null, tempDir);
  },
  filename: function (req, file, cb) {
      const fileName = `${Date.now()}-${file.originalname}`;
      console.log(`Final File Name: ${fileName}`);
      cb(null, fileName);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "application/vnd.ms-excel", // .xls
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" // .xlsx
  ];

  console.log(`🔍 Checking file: ${file.originalname} (Type: ${file.mimetype})`);

  if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
  } else {
      console.log("⛔ File type not allowed:", file.mimetype);
      cb(new Error("Invalid file type"), false);
  }
};

const upload = multer({
  storage,
  fileFilter
});

export default upload;