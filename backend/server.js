import express from "express"
import nodemailer from "nodemailer"
import cors from "cors"
import readXlsxFile from 'read-excel-file/node'
import multer from 'multer'
import fs from 'fs'
import bodyParser from "body-parser"
import path from "path"

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

const generateHtmlEmail = (senderName, senderEmail, subject, body, attachments) => {
    // Start the HTML template
    let emailHtml = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${subject}</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    margin: 20px;
                }
                h1 {
                    color: #007BFF;
                }
                .email-container {
                    max-width: 600px;
                    margin: auto;
                    padding: 20px;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    background: #f9f9f9;
                }
                .sender-info, .email-body {
                    margin-bottom: 20px;
                }
                .attachments {
                    margin-top: 20px;
                    padding: 10px;
                    border-top: 1px dashed #ddd;
                }
                .attachments p {
                    margin: 5px 0;
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                <h1>Email from ${senderName}</h1>
                <div class="sender-info">
                    <p><strong>From:</strong> ${senderName} (${senderEmail})</p>
                    <p><strong>Subject:</strong> ${subject}</p>
                </div>
                <div class="email-body">
                    <p>${body.replace(/\n/g, '<br>')}</p>
                </div>
    `;

    // Add attachments section if any
    if (attachments && attachments.length > 0) {
        emailHtml += `
            <div class="attachments">
                <h3>Attachments:</h3>
        `;
        attachments.forEach((file, index) => {
            emailHtml += `<p>${index + 1}. ${file.originalname}</p>`;
        });
        emailHtml += `</div>`;
    }

    // Close the HTML template
    emailHtml += `
            </div>
        </body>
        </html>
    `;

    return emailHtml;
};


app.get("/", (req, res) => {
    res.send("Working")
})

app.post("/mail", upload.fields([
    { name: 'excelFile', maxCount: 1 },
    { name: 'attachments', maxCount: 10 } // Handles multiple attachments
]), async (req, res) => {
    try {
        console.log('Request Body:', req.body);
        const senderName = req.body.senderName;
        const senderEmail = req.body.senderEmail;
        const subject = req.body.subject;
        const body = req.body.body;

        const excelFile = req.files['excelFile'] ? req.files['excelFile'][0] : null;
        const attachments = req.files['attachments'] || [];

        console.log('Form Data Received:');
        console.log('Sender Name:', senderName);
        console.log('Sender Email:', senderEmail);
        console.log('Subject:', subject);
        console.log('Body:', body);

        if (excelFile) {
            console.log('Excel File:', excelFile);
        }

        if (attachments.length > 0) {
            console.log('Attachments:', attachments);
        }

        const htmlEmailContent = generateHtmlEmail(
            senderName,
            senderEmail,
            subject,
            body,
            attachments
        );

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

        for (const student of students) {
            const { name, email } = student;
            console.log(`Name: ${name} and Email: ${email}`);
        }

        // Configure nodemailer
        const auth = nodemailer.createTransport({
            service: "gmail",
            secure: true,
            port: 465,
            auth: {
                user: "avreetkaur484@gmail.com",
                pass: "tuwkvrhxpsdrnzvm"
            }
        });

        // Send emails to all students
        let emailErrors = [];
        for (const student of students) {
            const { name, email } = student;

            const mailOptions = {
                from: `${senderName} <${senderEmail}>`,
                to: email, 
                subject: subject,
                html: htmlEmailContent,
                attachments: attachments.map(file => ({
                    filename: file.originalname,
                    path: file.path
                }))
            };

            try {
                await auth.sendMail(mailOptions);
                console.log(`Email successfully sent to ${email}`);
            } catch (error) {
                console.error(`Failed to send email to ${email}:`, error.message);
                emailErrors.push({ email, error: error.message });
            }
        }

        // Handle response
        if (emailErrors.length > 0) {
            res.status(207).json({
                message: "Some emails failed to send.",
                errors: emailErrors
            });
        } else {
            res.status(200).json({ message: "All emails sent successfully!" });
        }

        console.log("Mail sent successfully!");
        return res.status(200).json({ message: "Mail sent successfully!" });
    } catch (error) {
        console.log("Error while sensing mail: ", error.message);
    }
})

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});


// You are a lucky candidate chosen so be happy and scream at the top of your lungs once. This is a test email sent for verifying the functionality of our email-sending system.
// Thank you for your time!