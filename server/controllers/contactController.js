import asyncHandler from 'express-async-handler';
// Import the Brevo SDK directly
import SibApiV3Sdk from 'sib-api-v3-sdk'; 

// --- Brevo API Configuration ---
// This config should ideally be placed globally (e.g., in server.js) 
// but is included here for a self-contained controller demonstration.
const defaultClient = SibApiV3Sdk.ApiClient.instance;
// Use your Brevo API key
defaultClient.authentications['api-key'].apiKey = process.env.BREVO_API_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

// --- Controller Function ---
export const submitContactForm = asyncHandler(async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        res.status(400);
        throw new Error('Please fill out all fields.');
    }

    // --- Prepare Brevo Email Payload ---
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail(); 
    
    // 1. SENDER: Must be verified in Brevo
    sendSmtpEmail.sender = {
        email: process.env.BREVO_VERIFIED_SENDER_EMAIL, 
        name: `${name} (via ParikshaNode)`, 
    };
    
    // 2. TO: Your receiving address
    sendSmtpEmail.to = [{ email: process.env.EMAIL_RECEIVER_ADDRESS }];
    
    // 3. REPLY-TO: User's email for easy reply
    sendSmtpEmail.replyTo = { email: email, name: name };
    
    // 4. SUBJECT
    sendSmtpEmail.subject = `New ParikshaNode Contact Message from ${name}`;
    
    // 5. HTML CONTENT (Recommended over plain text for Brevo API)
    sendSmtpEmail.htmlContent = `
        <h3>You have received a new message from your ParikhsaNode contact form:</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
        <p><strong>Message:</strong></p>
        <div style="padding: 10px; border: 1px solid #eee;">
            <p>${message.replace(/\n/g, '<br>')}</p>
        </div>
    `;

    // --- Send Email via Brevo API ---
    try {
        const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
        res.status(200).json({ 
            success: true, 
            message: 'Message sent successfully!',
            messageId: response.messageId
        });
    } catch (error) {
        console.error('Brevo API Error:', error.response ? error.response.text : error.message);
        res.status(500);
        // The asyncHandler will automatically handle throwing this error
        throw new Error('Email could not be sent. Check server logs for Brevo API details.');
    }
});

