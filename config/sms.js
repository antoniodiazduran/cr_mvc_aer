const accountSid = process.env.SMS_SID;
const authToken = process.env.SMS_AUTHTOKEN;

const client = require('twilio')(accountSid, authToken);


async function sendTextMessage(sto,sfrom,sbody){
    try {
        const message = await client.messages.create({
            body: sbody,
            from: sfrom,
            to: sto
        });
        
        console.log(`Success! Message SID: ${message.sid}`);
    } catch (error) {
        // Captures network issues, invalid numbers, or wrong credentials
        console.error('Failed to send message:', error.message);
    }
}

module.exports=sendTextMessage;