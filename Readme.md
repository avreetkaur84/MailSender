# Bulk Email Sending System with Excel Integration

This project is a **Bulk Email Sending System** that allows users to send emails to multiple recipients by uploading an Excel file containing the recipients' details. The system also supports adding attachments and customizing email content.

## 🚀 Features
- **Bulk Email Sending**: Upload an Excel file with `name` and `email` columns to send personalized emails to recipients.
- **HTML Email Templates**: Generate visually appealing HTML email templates with dynamic content.
- **File Attachments**: Include multiple attachments in emails.
- **Error Handling**: Tracks and logs errors for emails that fail to send.
- **Lightweight and Fast**: Uses `nodemailer` for reliable email delivery and `multer` for handling file uploads.

## 🛠️ Tech Stack
- **Backend**: Node.js, Express.js
- **Email Service**: Nodemailer with Gmail
- **File Parsing**: `read-excel-file` for reading Excel files
- **Middleware**: `multer` for file uploads, `cors` for handling cross-origin requests
- **Utilities**: `body-parser` for parsing incoming request bodies, `fs` for file system operations