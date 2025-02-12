import express from 'express'
import upload from '../middlewares/upload.js';
import { invitationMail, thankMail } from '../controllers/mail.controllers.js';

// const app = express();
const router = express.Router();

router.post(
    "/thankmail",
    upload.fields([
        { name: "attachments", maxCount: 5 },
        { name: "excelFile", maxCount: 1 },
        { name: "eventPoster", maxCount: 1 },
    ]),
    (req, res, next) => {
        console.log("📝 Uploaded Files:", req.files);  // Debugging

        // Check if ANY files were received
        if (!req.files || Object.keys(req.files).length === 0) {
            console.log("🚨 No files received!");
            return res.status(400).json({ error: "No files uploaded" });
        }

        // Check if Excel file was uploaded
        if (!req.files.excelFile || req.files.excelFile.length === 0) {
            console.log("🚨 Excel file missing!");
            return res.status(400).json({ error: "Excel file not uploaded" });
        }

        // Log specific file details
        console.log("✅ Excel File:", req.files.excelFile[0]);

        next();
    },
    thankMail
);





router.post(
    "/invitationmail",
    upload.fields([
        { name: "attachments", maxCount: 5 },
        { name: "excelFile", maxCount: 1 },
        { name: "eventPoster", maxCount: 1 },
    ]),
    (req, res, next) => {
        console.log("📝 Uploaded Files:", req.files);  // Debugging

        // Check if ANY files were received
        if (!req.files || Object.keys(req.files).length === 0) {
            console.log("🚨 No files received!");
            return res.status(400).json({ error: "No files uploaded" });
        }

        // Check if Excel file was uploaded
        if (!req.files.excelFile || req.files.excelFile.length === 0) {
            console.log("🚨 Excel file missing!");
            return res.status(400).json({ error: "Excel file not uploaded" });
        }

        // Log specific file details
        console.log("✅ Excel File:", req.files.excelFile[0]);

        next();
    },
    invitationMail
);

export default router;