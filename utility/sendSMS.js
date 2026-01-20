// const twilio = require("twilio");

// const client = new twilio(
//   process.env.TWILIO_SID,
//   process.env.TWILIO_AUTH_TOKEN
// );

// const sendSMS = async (to, message) => {
//   await client.messages.create({
//     body: message,
//     // from: "+14155552671",
//     messagingServiceSid: process.env.TWILIO_MESSAGE_SID,
//     to,
//   });
// };

// module.exports = sendSMS;

const axios = require("axios");

const sendSMS = async (mobile, message) => {
  console.log(mobile, 'mobiillewwwwwwwww');
  console.log(message, 'messageeeeeeeeeee');
  try {
    const response = await axios.post(
      "https://www.fast2sms.com/dev/bulkV2",
      {
        route: "q",
        message,
        numbers: mobile
      },
      {
        headers: {
          authorization: process.env.FAST2SMS_API_KEY,
          "Content-Type": "application/json"
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error("SMS Error:", error.response?.data || error.message);
    throw error;
  }
};

module.exports = sendSMS;
