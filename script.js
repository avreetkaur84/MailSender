document.getElementById('uploadForm').addEventListener('submit', async (event) => {
    try {
        event.preventDefault();

        // Create FormData object
        const formData = new FormData();

        // Get form field values
        const senderName = document.getElementById('senderName').value;
        const senderEmail = document.getElementById('senderEmail').value;
        const subject = document.getElementById('subject').value;
        const body = document.getElementById('body').value;

        // Get file inputs
        const excelFile = document.getElementById('excelFile').files[0];
        const attachments = document.getElementById('attachments').files;

        // Validate required fields
        if (!senderName || !senderEmail || !subject || !body || !excelFile) {
            alert('Please fill in all required fields and upload the Excel file.');
            return;
        }

        // Append form fields to FormData
        formData.append('senderName', senderName);
        formData.append('senderEmail', senderEmail);
        formData.append('subject', subject);
        formData.append('body', body);
        formData.append('excelFile', excelFile);

        // Append multiple attachments
        for (let i = 0; i < attachments.length; i++) {
            formData.append('attachments', attachments[i]);
        }

        // Send POST request to backend
        const response = await fetch('http://localhost:3000/mail', {
            method: 'POST',
            body: formData,
        });

        // Handle response
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        document.getElementById('status').innerText = result.message;

    } catch (error) {
        console.error("Error while sending data to backend", error.message);
        document.getElementById('status').innerText = 'An error occurred while sending emails.';
    }
});

// Show file name when a file is selected
document.getElementById('excelFile').addEventListener('change', (event) => {
    const file = event.target.files[0];
    document.getElementById('status').textContent = file
        ? `Selected file: ${file.name}`
        : 'No file chosen';
});