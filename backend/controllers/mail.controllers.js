import readXlsxFile from 'read-excel-file/node'
import fs from 'fs'
import path from "path"
import { fileURLToPath } from 'url';
import { sendEmail } from "../utils/email.utils.js";

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export const thankMail = async (req, res) => {
  try {
    const {
      subjectLine, eventName, collaboration_with, skills_gained,
      date, start_time, end_time, location, url
    } = req.body;

    const attachments = req.files["attachments"] || [];
    const eventPoster = req.files["eventPoster"] ? req.files["eventPoster"][0] : null;
    const excelFile = req.files["excelFile"] ? req.files["excelFile"][0] : null;

    if (!excelFile) {
      return res.status(400).json({ message: "Excel file is required" });
    }

    console.log("Worked fine till excel file path");

    const excelFilePath = excelFile.path;

    const rows = await readXlsxFile(fs.createReadStream(excelFilePath));
    const [rawHeaders, ...data] = rows;
    const headers = rawHeaders.map(header => header.toLowerCase());
    const nameIndex = headers.indexOf('name');
    const emailIndex = headers.indexOf('email');

    if (nameIndex === -1 || emailIndex === -1) {
      throw new Error('The Excel file must contain "name" and "email" columns.');
    }

    const students = data.map(row => ({
      name: row[nameIndex],
      email: row[emailIndex],
    }));

    console.log("Worked fine till extracting data from excel file!!");

    // Send emails
    let emailErrors = [];
    for (const student of students) {
      const emailError = await sendEmail({
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
};

export const invitationMail = async (req, res) => {
  try {
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

    if (!excelFile) {
      return res.status(400).json({ message: "Excel file is required" });
    }

    console.log("Worked fine till excel file path");

    const excelFilePath = excelFile.path;

    const rows = await readXlsxFile(fs.createReadStream(excelFilePath));
    const [rawHeaders, ...data] = rows;
    const headers = rawHeaders.map(header => header.toLowerCase());
    const nameIndex = headers.indexOf('name');
    const emailIndex = headers.indexOf('email');

    if (nameIndex === -1 || emailIndex === -1) {
      throw new Error('The Excel file must contain "name" and "email" columns.');
    }

    const students = data.map(row => ({
      name: row[nameIndex],
      email: row[emailIndex],
    }));

    console.log("Worked fine till extracting data from excel file!!");

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