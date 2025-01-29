import nodemailer from "nodemailer";
import fs from "fs";

export const sendEmail = async (mailData, attachments = []) => {
    const { name, email, subjectLine, templatePath, replacements } = mailData;

    if (!email || email.trim() === "" || email.includes("#NA") || !email.includes("@")) {
        console.error(`Invalid email detected: ${email}`);
        return { email, error: "Invalid email address" };
    }

    let htmlTemplate = fs.readFileSync(templatePath, "utf-8");

    // Replace placeholders in the email template
    Object.keys(replacements).forEach((key) => {
        htmlTemplate = htmlTemplate.replace(new RegExp(`\\[${key}\\]`, "g"), replacements[key]);
    });

    const transporter = nodemailer.createTransport({
        service: "gmail",
        secure: true,
        port: 465,
        auth: {
            user: "avreetkaur084@gmail.com",
            pass: "cmazgdoxzladalyj",
        }
    });

    const mailOptions = {
        from: "Chandigarh University",
        to: email,
        subject: subjectLine,
        html: htmlTemplate,
        attachments: attachments.map(file => ({
            filename: file.originalname,
            path: file.path
        })),
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email successfully sent to ${email}`);
        return null; // No error
    } catch (error) {
        console.error(`Failed to send email to ${email}:`, error.message);
        return { email, error: error.message };
    }
};