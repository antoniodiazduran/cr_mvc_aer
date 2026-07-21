const nodemailer = require('nodemailer');

// Transporter configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

async function sendEmailMessage(to, subject, text ) {
    try {
        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to, subject, text
        });
        console.log(`Success! Message sent: ${info.messageId}`);
        
    } catch (error) {
        console.error('Failed to send Email ', error.message);
    }
}

module.exports=sendEmailMessage;