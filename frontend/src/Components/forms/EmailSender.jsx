import React, { useState } from 'react';

function EmailSender() {
    const [status, setStatus] = useState('');

    const handleFormSubmit = async (event) => {
        try {
            event.preventDefault();

            const formData = new FormData(event.target);

            // Validate required fields
            const senderName = formData.get('senderName');
            const senderEmail = formData.get('senderEmail');
            const subject = formData.get('subject');
            const body = formData.get('body');
            const excelFile = formData.get('excelFile');

            if (!senderName || !senderEmail || !subject || !body || !excelFile) {
                alert('Please fill in all required fields and upload the Excel file.');
                return;
            }

            // Send POST request to backend
            const response = await fetch('http://localhost:3000/mail', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            setStatus(result.message);
        } catch (error) {
            console.error("Error while sending data to backend", error.message);
            setStatus('An error occurred while sending emails.');
        }
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setStatus(file ? `Selected file: ${file.name}` : 'No file chosen');
    };

    return (
        <div className="flex flex-col items-center justify-center py-16 min-h-screen bg-gray-100">
            <form
                id="uploadForm"
                onSubmit={handleFormSubmit}
                className="w-full max-w-lg p-6 bg-white shadow-md rounded-lg"
            >
                <h1 className="mb-6 text-2xl font-bold text-center text-gray-800">
                    Email Details Form
                </h1>

                <div className="mb-4">
                    <label
                        htmlFor="senderName"
                        className="block mb-2 text-sm font-medium text-gray-700"
                    >
                        Sender Name
                    </label>
                    <input
                        type="text"
                        id="senderName"
                        name="senderName"
                        placeholder="Enter your name"
                        required
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                    />
                </div>

                <div className="mb-4">
                    <label
                        htmlFor="senderEmail"
                        className="block mb-2 text-sm font-medium text-gray-700"
                    >
                        Sender Email
                    </label>
                    <input
                        type="email"
                        id="senderEmail"
                        name="senderEmail"
                        placeholder="Enter your email"
                        required
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                    />
                </div>

                <div className="mb-4">
                    <label
                        htmlFor="subject"
                        className="block mb-2 text-sm font-medium text-gray-700"
                    >
                        Subject
                    </label>
                    <input
                        type="text"
                        id="subject"
                        name="subject"
                        placeholder="Enter email subject"
                        required
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                    />
                </div>

                <div className="mb-4">
                    <label
                        htmlFor="body"
                        className="block mb-2 text-sm font-medium text-gray-700"
                    >
                        Email Body
                    </label>
                    <textarea
                        id="body"
                        name="body"
                        rows="5"
                        placeholder="Write your email here..."
                        required
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                    ></textarea>
                </div>

                <div className="mb-4">
                    <label
                        htmlFor="attachments"
                        className="block mb-2 text-sm font-medium text-gray-700"
                    >
                        Attachments (Optional)
                    </label>
                    <input
                        type="file"
                        id="attachments"
                        name="attachments"
                        multiple
                        className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border file:border-gray-300 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                </div>

                <div className="mb-4">
                    <label
                        htmlFor="excelFile"
                        className="block mb-2 text-sm font-medium text-gray-700"
                    >
                        Upload Excel File:
                    </label>
                    <input
                        type="file"
                        id="excelFile"
                        name="excelFile"
                        accept=".xlsx"
                        required
                        onChange={handleFileChange}
                        className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border file:border-gray-300 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                </div>

                <button
                    type="submit"
                    id="btn"
                    className="w-full px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
                >
                    Send Emails
                </button>
            </form>

            <div
                id="status"
                className="mt-4 text-sm font-medium text-gray-700"
            >
                {status}
            </div>
        </div>
    );
}

export default EmailSender;