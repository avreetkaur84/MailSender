import express from "express"
import nodemailer from "nodemailer"
import cors from "cors"
import readXlsxFile from 'read-excel-file/node'
import multer from 'multer'
import fs from 'fs'
import bodyParser from "body-parser"
import path from "path"
import dotenv from "dotenv"
import { fileURLToPath } from 'url';

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Directory to save files
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ dest: 'uploads/' });


const convertToBase64 = (imagePath) => {
  const image = fs.readFileSync(imagePath);
  return `data:image/png;base64,${image.toString("base64")}`;
};

const generateHTMLEventEmail = ({
  subjectLine,
  eventName,
  eventDescription,
  senderName,
  location,
  startDate,
  endDate,
  startTime,
  endTime,
  contactInfo,
  category,
  eventPosterPath,
  studentName,
}) => {
  return `
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              margin: 0;
              padding: 0;
              background-color: #f4f4f9;
            }
            .container {
              width: 80%;
              margin: 20px auto;
              background-color: #ffffff;
              border: 1px solid #ddd;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
              overflow: hidden;
            }
            .header {
              text-align: center;
              padding: 10px 20px;
              background-color: #ff0000; /* Changed to red */
              color: white;
            }
            .header h1 {
              margin: 0;
              font-size: 28px;
            }
            .header p {
              margin: 5px 0 0;
            }
            .poster {
              text-align: center;
              padding: 20px;
            }
            .poster img {
              max-width: 100%;
              height: auto;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            }
            .details {
              padding: 20px;
            }
            .details h2 {
              margin-top: 0;
            }
            .details p {
              margin: 5px 0;
            }
            .footer {
              text-align: center;
              padding: 10px;
              background-color: #f4f4f9;
              color: #555;
              font-size: 0.9em;
              border-top: 1px solid #ddd;
            }
            .highlight {
              color: #ff0000; /* Changed to red */
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <!-- Event Poster -->
            <div class="poster">
            <img src="https://www.google.com/imgres?q=hackathon%20poster&imgurl=https%3A%2F%2Flookaside.instagram.com%2Fseo%2Fgoogle_widget%2Fcrawler%2F%3Fmedia_id%3D3449616497407246412&imgrefurl=https%3A%2F%2Fwww.instagram.com%2Fceg_tech_forum%2Fp%2FC_ff-9ESd-H%2F&docid=IoODnyFyTtDPvM&tbnid=R_rFFyZGgYIkKM&vet=12ahUKEwit_bqmyYOLAxVYTWwGHQu8DDAQM3oECGQQAA..i&w=1440&h=1440&hcb=2&ved=2ahUKEwit_bqmyYOLAxVYTWwGHQu8DDAQM3oECGQQAA" alt="Event Poster" />
          </div>
  
            <!-- Header with Event Name and Subject Line -->
            <div class="header">
              <h1>${eventName}</h1>
              <p>${subjectLine}</p>
            </div>
  
            <!-- Welcome and Fixed Lines -->
            <div class="details">
              <p>Dear ${studentName},</p>
              <p>
                We are delighted to invite you to our <span class="highlight">${eventName}</span>, 
                a one-of-a-kind event designed to inspire, engage, and create lasting memories.
              </p>
              <p>
                This is your opportunity to connect, learn, and innovate alongside professionals, 
                enthusiasts, and experts in the field.
              </p>
            </div>
  
            <!-- Event Purpose Section -->
            <div class="details">
              <h2>Event Purpose</h2>
              <p>${eventDescription}</p>
              <p>
                The event will take place at <span class="highlight">${location}</span>, 
                starting on <span class="highlight">${startDate}</span> at <span class="highlight">${startTime}</span>, 
                and concluding on <span class="highlight">${endDate}</span> at <span class="highlight">${endTime}</span>.
              </p>
            </div>
  
            <!-- Closing Statement -->
            <div class="details">
              <p>
                <span class="highlight">Don't miss out on this incredible opportunity!</span> 
                Reserve your spot today and be part of something extraordinary.
              </p>
            </div>
  
            <!-- Contact Information Section -->
            <div class="details">
              <h2>Contact Information</h2>
              <p>If you have any questions or need assistance, feel free to reach out to:</p>
              <p><strong>Sender:</strong> ${senderName}</p>
              <p><strong>Contact:</strong> ${contactInfo}</p>
            </div>
  
            <!-- Footer -->
            <div class="footer">
              <p>This is an automated email. For further assistance, please contact us.</p>
              <p>We look forward to seeing you at the event!</p>
            </div>
          </div>
        </body>
      </html>
    `;
};

const deleteFiles = (files) => {
  files.forEach(file => {
    fs.unlink(file.path, (err) => {
      if (err) {
        console.error(`Failed to delete file: ${file.path}`, err.message);
      } else {
        console.log(`Deleted file: ${file.path}`);
      }
    });
  });
};

app.get("/", (req, res) => {
  res.send("Working")
})

app.post(
  "/eventMail",
  upload.fields([
    { name: "attachments", maxCount: 10 }, // Accept up to 10 files for attachments
    { name: "eventPoster", maxCount: 1 }, // Single event poster
    { name: "excelFile", maxCount: 1 }, // Single Excel file
  ]),
  async (req, res) => {
    try {
      const {
        subjectLine,
        eventName,
        eventDescription,
        senderName,
        location,
        startDate,
        endDate,
        startTime,
        endTime,
        contactInfo,
        category,
      } = req.body;

      const attachments = req.files["attachments"] || [];
      const eventPoster = req.files["eventPoster"] ? req.files["eventPoster"][0] : null;
      const excelFile = req.files["excelFile"] ? req.files["excelFile"][0] : null;

      const excelFilePath = excelFile.path;

      // const eventPoster = eventPosterSimple ? convertToBase64(eventPosterSimple.path) : null;
      // const eventPosterPath = eventPoster.path;


      // Logging received data
      console.log("Received Form Data:");
      console.log({
        subjectLine,
        eventName,
        eventDescription,
        senderName,
        location,
        startDate,
        endDate,
        startTime,
        endTime,
        contactInfo,
        category,
        attachments: attachments.map((file) => file.filename),
        eventPoster: eventPoster ? eventPoster.filename : null,
        excelFile: excelFile ? excelFile.filename : null,
      });

      const eventData = {
        subjectLine,
        eventName,
        eventDescription,
        senderName,
        location,
        startDate,
        endDate,
        startTime,
        endTime,
        contactInfo,
        category,
        // eventPosterPath,
      };

      // const emailHTML = generateHTMLEventEmail(eventData);

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

      for (const student of students) {
        const { name, email } = student;
        // console.log(`Name: ${name} and Email: ${email}`);
      }

      // Configure nodemailer
      const auth = nodemailer.createTransport({
        service: "gmail",
        secure: true,
        port: 465,
        auth: {
          // user: "cac.cuchd@gmail.com",
          // pass: "vrfscmlkvqkxwhjp",
          user: "avreetkaur084@gmail.com",
          pass: "cmazgdoxzladalyj",
        }
      });

      // Send emails to all students
      let emailErrors = [];
      for (const student of students) {
        const { name, email } = student;
        console.log(`Name: ${name} and Email: ${email}`);

        let htmldata = fs.readFileSync(path.join(__dirname, 'main.html'), 'utf-8')

        // const emailHTML = generateHTMLEventEmail({
        //   ...eventData,
        //   studentName: name, // Pass the student's name
        // });

        const mailOptions = {
          from: `Chandigarh University`,
          to: email,
          subject: subjectLine,
          html: htmldata,
          attachments: [
            ...attachments.map(file => ({
              filename: file.originalname,
              path: file.path
            })),
            // Inline the event poster image as CID
            // {
            //   filename: eventPoster.originalname,
            //   path: eventPoster.path,
            //   cid: 'eventPosterCID' // This will be used as the src in the HTML
            // }
          ]
        };

        try {
          await auth.sendMail(mailOptions);
          console.log(`Email successfully sent to ${email}`);
        } catch (error) {
          console.error(`Failed to send email to ${email}:`, error.message);
          emailErrors.push({ email, error: error.message });
        }

      };



      // Handle response
      if (emailErrors.length > 0) {
        res.status(207).json({
          message: "Some emails failed to send.",
          errors: emailErrors
        });
      } else {
        res.status(200).json({ message: "All emails sent successfully!" });
      }

      // console.log("Mail sent successfully!");
      // return res.status(200).json({ message: "Mail sent successfully!" });
    } catch (error) {
      console.log("Error while sensing mail: ", error.message);
    }
  }
);

app.post('/thankmail',
  upload.fields([
    { name: "attachments", maxCount: 10 }, // Accept up to 10 files for attachments
    { name: "eventPoster", maxCount: 1 }, // Single event poster
    { name: "excelFile", maxCount: 1 }, // Single Excel file
  ]),
  async (req, res) => {
    try {
      const {subjectLine, eventName, collaboration_with, skills_gained, date, start_time, end_time, location} = req.body;
      const attachments = req.files["attachments"] || [];
      const eventPoster = req.files["eventPoster"] ? req.files["eventPoster"][0] : null;
      const excelFile = req.files["excelFile"] ? req.files["excelFile"][0] : null;

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

      // Configure nodemailer
      const auth = nodemailer.createTransport({
        service: "gmail",
        secure: true,
        port: 465,
        auth: {
          // user: "cac.cuchd@gmail.com",
          // pass: "vrfscmlkvqkxwhjp",
          user: "avreetkaur084@gmail.com",
          pass: "cmazgdoxzladalyj",
        }
      });

      // Send emails to all students
      let emailErrors = [];
      for (const student of students) {
        const { name, email } = student;

        if (!email || email.trim() === '' || email.includes('#NA') || !email.includes('@')) {
          console.error(`Invalid email detected: ${email}`);
          emailErrors.push({ email, error: "Invalid email address" });
          continue;
        }

        console.log(`Name: ${name} and Email: ${email}`);

        let htmldata = fs.readFileSync(path.join(__dirname, 'main.html'), 'utf-8');
        
        htmldata = htmldata.replace(/\[name\]/g, name)
                           .replace(/\[eventName\]/g, eventName)
                           .replace(/\[event_name\]/g, eventName)
                           .replace(/\[collaboration_with\]/g, collaboration_with)
                           .replace(/\[skills_gained\]/g, skills_gained)
                           .replace(/\[date\]/g, date)
                           .replace(/\[start_time\]/g, start_time)
                           .replace(/\[end_time\]/g, end_time)
                           .replace(/\[location\]/g, location);

        const mailOptions = {
          from: `Chandigarh University`,
          to: email,
          subject: subjectLine,
          html: htmldata,
          attachments: [
            ...attachments.map(file => ({
              filename: file.originalname,
              path: file.path
            })),
          ]
        };

        try {
          await auth.sendMail(mailOptions);
          console.log(`Email successfully sent to ${email}`);
        } catch (error) {
          console.error(`Failed to send email to ${email}:`, error.message);
          emailErrors.push({ email, error: error.message });
        }

      };


      // Handle response
      if (emailErrors.length > 0) {
        res.status(207).json({
          message: "Some emails failed to send.",
          errors: emailErrors
        });
      } else {
        res.status(200).json({ message: "All emails sent successfully!" });
      }

    } catch (error) {
      console.log("Error while sensing mail: ", error.message);
    }
  }
)


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});