import express from "express"
import cors from "cors"
import bodyParser from "body-parser"
import dotenv from "dotenv"

import mailRouter from "./routes/mail.routes.js"



dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/mail", mailRouter);

app.get("/", (req, res) => {
  res.send("Working")
})

// app.post(
//   "/eventMail",
//   upload.fields([
//     { name: "attachments", maxCount: 10 }, // Accept up to 10 files for attachments
//     { name: "eventPoster", maxCount: 1 }, // Single event poster
//     { name: "excelFile", maxCount: 1 }, // Single Excel file
//   ]),
//   async (req, res) => {
//     try {
//       const {
//         subjectLine,
//         eventName,
//         eventDescription,
//         senderName,
//         location,
//         startDate,
//         endDate,
//         startTime,
//         endTime,
//         contactInfo,
//         category,
//       } = req.body;

//       const attachments = req.files["attachments"] || [];
//       const eventPoster = req.files["eventPoster"] ? req.files["eventPoster"][0] : null;
//       const excelFile = req.files["excelFile"] ? req.files["excelFile"][0] : null;

//       const excelFilePath = excelFile.path;

//       // const eventPoster = eventPosterSimple ? convertToBase64(eventPosterSimple.path) : null;
//       // const eventPosterPath = eventPoster.path;


//       // Logging received data
//       console.log("Received Form Data:");
//       console.log({
//         subjectLine,
//         eventName,
//         eventDescription,
//         senderName,
//         location,
//         startDate,
//         endDate,
//         startTime,
//         endTime,
//         contactInfo,
//         category,
//         attachments: attachments.map((file) => file.filename),
//         eventPoster: eventPoster ? eventPoster.filename : null,
//         excelFile: excelFile ? excelFile.filename : null,
//       });

//       const eventData = {
//         subjectLine,
//         eventName,
//         eventDescription,
//         senderName,
//         location,
//         startDate,
//         endDate,
//         startTime,
//         endTime,
//         contactInfo,
//         category,
//         // eventPosterPath,
//       };

//       // const emailHTML = generateHTMLEventEmail(eventData);

//       const rows = await readXlsxFile(fs.createReadStream(excelFilePath));
//       const [rawHeaders, ...data] = rows;
//       const headers = rawHeaders.map(header => header.toLowerCase());
//       const nameIndex = headers.indexOf('name');
//       const emailIndex = headers.indexOf('email');

//       if (nameIndex === -1 || emailIndex === -1) {
//         throw new Error('The Excel file must contain "name" and "email" columns.');
//       }

//       const students = data.map(row => ({
//         name: row[nameIndex],
//         email: row[emailIndex],
//       }));

//       for (const student of students) {
//         const { name, email } = student;
//         // console.log(`Name: ${name} and Email: ${email}`);
//       }

//       // Configure nodemailer
//       const auth = nodemailer.createTransport({
//         service: "gmail",
//         secure: true,
//         port: 465,
//         auth: {
//           // user: "cac.cuchd@gmail.com",
//           // pass: "vrfscmlkvqkxwhjp",
//           user: "avreetkaur084@gmail.com",
//           pass: "cmazgdoxzladalyj",
//         }
//       });

//       // Send emails to all students
//       let emailErrors = [];
//       for (const student of students) {
//         const { name, email } = student;
//         console.log(`Name: ${name} and Email: ${email}`);

//         let htmldata = fs.readFileSync(path.join(__dirname, 'main.html'), 'utf-8')

//         // const emailHTML = generateHTMLEventEmail({
//         //   ...eventData,
//         //   studentName: name, // Pass the student's name
//         // });

//         const mailOptions = {
//           from: `Chandigarh University`,
//           to: email,
//           subject: subjectLine,
//           html: htmldata,
//           attachments: [
//             ...attachments.map(file => ({
//               filename: file.originalname,
//               path: file.path
//             })),
//             // Inline the event poster image as CID
//             // {
//             //   filename: eventPoster.originalname,
//             //   path: eventPoster.path,
//             //   cid: 'eventPosterCID' // This will be used as the src in the HTML
//             // }
//           ]
//         };

//         try {
//           await auth.sendMail(mailOptions);
//           console.log(`Email successfully sent to ${email}`);
//         } catch (error) {
//           console.error(`Failed to send email to ${email}:`, error.message);
//           emailErrors.push({ email, error: error.message });
//         }

//       };



//       // Handle response
//       if (emailErrors.length > 0) {
//         res.status(207).json({
//           message: "Some emails failed to send.",
//           errors: emailErrors
//         });
//       } else {
//         res.status(200).json({ message: "All emails sent successfully!" });
//       }

//       // console.log("Mail sent successfully!");
//       // return res.status(200).json({ message: "Mail sent successfully!" });
//     } catch (error) {
//       console.log("Error while sensing mail: ", error.message);
//     }
//   }
// );

// app.post('/thankmail',
//   upload.fields([
//     { name: "attachments", maxCount: 10 }, // Accept up to 10 files for attachments
//     { name: "eventPoster", maxCount: 1 }, // Single event poster
//     { name: "excelFile", maxCount: 1 }, // Single Excel file
//   ]),
//   async (req, res) => {
//     try {
//       const {subjectLine, eventName, collaboration_with, skills_gained, date, start_time, end_time, location, url} = req.body;
//       const attachments = req.files["attachments"] || [];
//       const eventPoster = req.files["eventPoster"] ? req.files["eventPoster"][0] : null;
//       const excelFile = req.files["excelFile"] ? req.files["excelFile"][0] : null;

//       const excelFilePath = excelFile.path;

//       const rows = await readXlsxFile(fs.createReadStream(excelFilePath));
//       const [rawHeaders, ...data] = rows;
//       const headers = rawHeaders.map(header => header.toLowerCase());
//       const nameIndex = headers.indexOf('name');
//       const emailIndex = headers.indexOf('email');

//       if (nameIndex === -1 || emailIndex === -1) {
//         throw new Error('The Excel file must contain "name" and "email" columns.');
//       }

//       const students = data.map(row => ({
//         name: row[nameIndex],
//         email: row[emailIndex],
//       }));

//       // Configure nodemailer
//       const auth = nodemailer.createTransport({
//         service: "gmail",
//         secure: true,
//         port: 465,
//         auth: {
//           // user: "cac.cuchd@gmail.com",
//           // pass: "vrfscmlkvqkxwhjp",
//           user: "avreetkaur084@gmail.com",
//           pass: "cmazgdoxzladalyj",
//         }
//       });

//       // Send emails to all students
//       let emailErrors = [];
//       for (const student of students) {
//         const { name, email } = student;

//         if (!email || email.trim() === '' || email.includes('#NA') || !email.includes('@')) {
//           console.error(`Invalid email detected: ${email}`);
//           emailErrors.push({ email, error: "Invalid email address" });
//           continue;
//         }

//         console.log(`Name: ${name} and Email: ${email}`);

//         let htmldata = fs.readFileSync(path.join(__dirname, 'main.html'), 'utf-8');
        
//         htmldata = htmldata.replace(/\[name\]/g, name)
//                            .replace(/\[url\]/g, url)
//                            .replace(/\[eventName\]/g, eventName)
//                            .replace(/\[event_name\]/g, eventName)
//                            .replace(/\[collaboration_with\]/g, collaboration_with)
//                            .replace(/\[skills_gained\]/g, skills_gained)
//                            .replace(/\[date\]/g, date)
//                            .replace(/\[start_time\]/g, start_time)
//                            .replace(/\[end_time\]/g, end_time)
//                            .replace(/\[location\]/g, location);

//         const mailOptions = {
//           from: `Chandigarh University`,
//           to: email,
//           subject: subjectLine,
//           html: htmldata,
//           attachments: [
//             ...attachments.map(file => ({
//               filename: file.originalname,
//               path: file.path
//             })),
//           ]
//         };

//         try {
//           await auth.sendMail(mailOptions);
//           console.log(`Email successfully sent to ${email}`);
//         } catch (error) {
//           console.error(`Failed to send email to ${email}:`, error.message);
//           emailErrors.push({ email, error: error.message });
//         }

//       };


//       // Handle response
//       if (emailErrors.length > 0) {
//         res.status(207).json({
//           message: "Some emails failed to send.",
//           errors: emailErrors
//         });
//       } else {
//         res.status(200).json({ message: "All emails sent successfully!" });
//       }

//     } catch (error) {
//       console.log("Error while sensing mail: ", error.message);
//     }
//   }
// )


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});