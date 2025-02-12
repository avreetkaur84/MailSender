import axios from "axios";
import readXlsxFile from "read-excel-file/node";
import fs from "fs";
import path from "path";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";
import { fileURLToPath } from "url";
import { sendEmail } from "../utils/email.utils.js";
import stream from "stream"; // ✅ Added for handling streaming

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const thankMail = async (req, res) => {
  try {
    console.log("Received files:", req.files);

    const {
      subjectLine,
      eventName,
      collaboration_with,
      skills_gained,
      date,
      start_time,
      end_time,
      location,
      url,
    } = req.body;

    const attachments = req.files["attachments"] || [];
    const eventPoster = req.files["eventPoster"] ? req.files["eventPoster"][0] : null;
    const excelFile = req.files["excelFile"] ? req.files["excelFile"][0] : null;

    if (!excelFile) {
      return res.status(402).json({ message: "Excel file is required" });
    }

    console.log("Uploading Excel file to Cloudinary...");

    // Upload Excel file to Cloudinary
    const excelUpload = await uploadOnCloudinary(excelFile.path);
    if (!excelUpload) {
      return res.status(500).json({ message: "Failed to upload Excel file to Cloudinary" });
    }
    const excelUrl = excelUpload.secure_url;
    console.log("✅ Excel file uploaded:", excelUrl);

    // ✅ **Download Excel file from Cloudinary**
    console.log("📥 Downloading Excel file from Cloudinary...");
    const response = await axios({
      url: excelUrl,
      method: "GET",
      responseType: "stream", // Stream the file instead of storing it
    });

    const bufferStream = new stream.PassThrough();
    response.data.pipe(bufferStream);

    // ✅ **Read Excel File from Stream**
    const rows = await readXlsxFile(bufferStream);
    const [rawHeaders, ...data] = rows;
    const headers = rawHeaders.map(header => header.toLowerCase());
    const nameIndex = headers.indexOf("name");
    const emailIndex = headers.indexOf("email");

    if (nameIndex === -1 || emailIndex === -1) {
      throw new Error('The Excel file must contain "name" and "email" columns.');
    }

    const students = data.map(row => ({
      name: row[nameIndex],
      email: row[emailIndex],
    }));

    console.log("✅ Extracted data from Excel file:", students.length, "students found!");

    // Upload event poster to Cloudinary (if available)
    let eventPosterUrl = null;
    if (eventPoster) {
      console.log("Uploading event poster...");
      const eventPosterUpload = await uploadOnCloudinary(eventPoster.path);
      if (eventPosterUpload) {
        eventPosterUrl = eventPosterUpload.secure_url;
        console.log("✅ Event poster uploaded:", eventPosterUrl);
      }
    }

    // Upload attachments to Cloudinary (if available)
    let attachmentUrls = [];
    for (const file of attachments) {
      console.log(`Uploading attachment: ${file.originalname}...`);
      const attachmentUpload = await uploadOnCloudinary(file.path);
      if (attachmentUpload) {
        attachmentUrls.push(attachmentUpload.secure_url);
        console.log("✅ Attachment uploaded:", attachmentUpload.secure_url);
      }
    }

    // Send emails
    let emailErrors = [];
    for (const student of students) {
      const emailError = await sendEmail(
        {
          name: student.name,
          email: student.email,
          subjectLine,
          templatePath: path.join(__dirname, "../templates/thankMail.html"),
          replacements: {
            name: student.name,
            url,
            eventName,
            event_name: eventName,
            collaboration_with,
            skills_gained,
            date,
            start_time,
            end_time,
            location,
            eventPosterUrl, // Include Cloudinary URL for the event poster
          },
        },
        attachmentUrls // Send Cloudinary URLs as attachments
      );

      if (emailError) {
        emailErrors.push(emailError);
      }
    }

    // Cleanup: Delete locally stored files after upload
    // [eventPoster, ...attachments].forEach(file => {
    //   if (file) {
    //     fs.unlinkSync(file.path);
    //     console.log("🗑️ Deleted local file:", file.path);
    //   }
    // });

    // Handle response
    if (emailErrors.length > 0) {
      res.status(207).json({
        message: "Some emails failed to send.",
        errors: emailErrors,
      });
    } else {
      res.status(200).json({ message: "All emails sent successfully!" });
    }
  } catch (error) {
    console.error("❌ Error while sending mail:", error.message);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};



export const invitationMail = async (req, res) => {
  try {
    console.log("Received files:", req.files);

    const {
      subjectLine,
      eventName,
      eventHost,
      startDate,
      endDate,
      startTime,
      endTime,
      eventVenue,
      eventDescription,
      specialInstructions,
      // rsvpLink
    } = req.body;

    const attachments = req.files["attachments"] || [];
    const eventPoster = req.files["eventPoster"] ? req.files["eventPoster"][0] : null;
    const excelFile = req.files["excelFile"] ? req.files["excelFile"][0] : null;

    console.log("Uploading Excel file to Cloudinary...");

    // Upload Excel file to Cloudinary
    const excelUpload = await uploadOnCloudinary(excelFile.path);
    if (!excelUpload) {
      return res.status(500).json({ message: "Failed to upload Excel file to Cloudinary" });
    }
    const excelUrl = excelUpload.secure_url;
    console.log("✅ Excel file uploaded:", excelUrl);

    // ✅ **Download Excel file from Cloudinary**
    console.log("📥 Downloading Excel file from Cloudinary...");
    const response = await axios({
      url: excelUrl,
      method: "GET",
      responseType: "stream", // Stream the file instead of storing it
    });

    const bufferStream = new stream.PassThrough();
    response.data.pipe(bufferStream);

     // ✅ **Read Excel File from Stream**
     const rows = await readXlsxFile(bufferStream);
     const [rawHeaders, ...data] = rows;
     const headers = rawHeaders.map(header => header.toLowerCase());
     const nameIndex = headers.indexOf("name");
     const emailIndex = headers.indexOf("email");

    if (nameIndex === -1 || emailIndex === -1) {
      throw new Error('The Excel file must contain "name" and "email" columns.');
    }

    const students = data.map(row => ({
      name: row[nameIndex],
      email: row[emailIndex],
    }));

    console.log("Worked fine till extracting data from excel file!!");

    console.log("✅ Extracted data from Excel file:", students.length, "students found!");

    // Upload event poster to Cloudinary (if available)
    let eventPosterUrl = null;
    if (eventPoster) {
      console.log("Uploading event poster...");
      const eventPosterUpload = await uploadOnCloudinary(eventPoster.path);
      if (eventPosterUpload) {
        eventPosterUrl = eventPosterUpload.secure_url;
        console.log("✅ Event poster uploaded:", eventPosterUrl);
      }
    }

    // Upload attachments to Cloudinary (if available)
    let attachmentUrls = [];
    for (const file of attachments) {
      console.log(`Uploading attachment: ${file.originalname}...`);
      const attachmentUpload = await uploadOnCloudinary(file.path);
      if (attachmentUpload) {
        attachmentUrls.push(attachmentUpload.secure_url);
        console.log("✅ Attachment uploaded:", attachmentUpload.secure_url);
      }
    }



    let emailErrors = [];
    for (const student of students) {
      const emailError = await sendEmail({
        name: student.name,
        email: student.email,
        subjectLine,
        templatePath: path.join(__dirname, "../templates/invitationMail.html"),
        replacements: {
          name: student.name,
          eventName,
          eventHost,
          startDate,
          endDate,
          startTime,
          endTime,
          eventVenue,
          eventDescription,
          specialInstructions,
          // rsvpLink
        },
      }, attachments);

      if (emailError) {
        emailErrors.push(emailError);
      }
    }

    // Handle response
    if (emailErrors.length > 0) {
      res.status(207).json({
        message: "Some emails failed to send.",
        errors: emailErrors,
      });
    } else {
      res.status(200).json({ message: "All emails sent successfully!" });
    }

  } catch (error) {
    console.log("Error while sending mail:", error.message);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
}