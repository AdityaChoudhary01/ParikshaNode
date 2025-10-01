// Import the Brevo SDK
import SibApiV3Sdk from 'sib-api-v3-sdk';

// --- Brevo API Configuration ---
// The API client configuration should typically run once globally (e.g., in server.js), 
// but we set it here to ensure the API instance is configured.
const defaultClient = SibApiV3Sdk.ApiClient.instance;
defaultClient.authentications['api-key'].apiKey = process.env.BREVO_API_KEY;
const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();


/**
 * Sends a transactional email using the Brevo Direct API.
 * @param {object} options
 * @param {string} options.subject - The subject of the email.
 * @param {string} options.message - The plain text message content.
 * @param {string} options.replyTo - The user's email address for the Reply-To header.
 */
const sendEmail = async (options) => {
    
    // Convert the plain text message to a simple HTML structure for Brevo
    const htmlMessage = `
        <div style="white-space: pre-wrap; font-family: Arial, sans-serif;">
            <p>${options.message.replace(/\n/g, '<br>')}</p>
        </div>
    `;

    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail(); 

    // 1. SENDER: Must be a verified sender in your Brevo account.
    sendSmtpEmail.sender = {
        // Use the verified Brevo sender email
        email: process.env.BREVO_VERIFIED_SENDER_EMAIL, 
        name: 'ProQuiz Contact Form', 
    };
    
    // 2. TO: Your receiving address
    sendSmtpEmail.to = [{ 
        // Use your receiving inbox address
        email: process.env.EMAIL_RECEIVER_ADDRESS 
    }];
    
    // 3. REPLY-TO: The user's email for easy reply
    sendSmtpEmail.replyTo = { email: options.replyTo };
    
    // 4. SUBJECT
    sendSmtpEmail.subject = options.subject;
    
    // 5. CONTENT (Brevo prefers HTML over plain text)
    sendSmtpEmail.htmlContent = htmlMessage;
    
    // 6. Send the Email via API Call
    try {
        await apiInstance.sendTransacEmail(sendSmtpEmail);
    } catch (error) {
        // Log detailed error and re-throw so the calling controller can catch it
        console.error('Brevo API Error in sendEmail utility:', error.response ? error.response.text : error.message);
        throw new Error('Brevo email failed to send.');
    }
};

export default sendEmail;
