// const nodemailer = require("nodemailer");
// const { google } = require("googleapis");

// const OAuth2 = google.auth.OAuth2;

// const oauth2Client = new OAuth2(
//   process.env.CLIENT_ID,
//   process.env.CLIENT_SECRET,
//   "https://developers.google.com/oauthplayground"
// );

// oauth2Client.setCredentials({
//   refresh_token: process.env.REFRESH_TOKEN,
// });

// const createTransporter = async () => {
//   try {
//     const accessToken = await oauth2Client.getAccessToken();

//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         type: "OAuth2",
//         user: process.env.EMAIL_USER,
//         clientId: process.env.CLIENT_ID,
//         clientSecret: process.env.CLIENT_SECRET,
//         refreshToken: process.env.REFRESH_TOKEN,
//         accessToken: accessToken.token,
//       },
//     });

//     return transporter;
//   } catch (error) {
//     console.error("Transporter Creation Error:", error);
//     throw error;
//   }
// };

// // action = "account_verification" | "event_booking"
// const sentOtpEmail = async (toEmail, otp, action) => {
//   try {
//     const transporter = await createTransporter();

//     const isVerification = action === "account_verification";

//     const subject = isVerification
//       ? "Verify your Eventora account"
//       : "Your Eventora event booking OTP";

//     const html = isVerification
//       ? `
//         <h2>Welcome to Eventora!</h2>
//         <p>Use the OTP below to verify your account. It expires in <strong>5 minutes</strong>.</p>
//         <h1 style="letter-spacing:8px; color:#4F46E5;">${otp}</h1>
//         <p>If you didn't register, ignore this email.</p>
//       `
//       : `
//         <h2>Event Booking OTP</h2>
//         <p>Use the OTP below to confirm your event booking. It expires in <strong>5 minutes</strong>.</p>
//         <h1 style="letter-spacing:8px; color:#4F46E5;">${otp}</h1>
//         <p>If you didn't request this, please contact support.</p>
//       `;

//     const mailOptions = {
//       from: `"Eventora" <${process.env.EMAIL_USER}>`,
//       to: toEmail,
//       subject,
//       html,
//     };

//     const info = await transporter.sendMail(mailOptions);

//     console.log("Email Sent Successfully");
//     console.log("Message ID:", info.messageId);

//     return info;
//   } catch (error) {
//     console.error("SEND MAIL ERROR:", error);
//     throw error;
//   }
// };

// module.exports = { sentOtpEmail };




//  Without OAuth2
const nodemailer = require("nodemailer");

// Refactored to a synchronous, clean SMTP transport using an App Password
const createTransporter = () => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_APP_PASSWORD, 
      },
    });

    return transporter;
  } catch (error) {
    console.error("Transporter Creation Error:", error);
    throw error;
  }
};

// Action = "account_verification" | "event_booking"
const sentOtpEmail = async (toEmail, otp, action) => {
  try {
    // No await needed here anymore as createTransporter is synchronous now
    const transporter = createTransporter();

    const subject = "Verify your BookBuddy account"

    const html =`
        <h2>Welcome to BookBuddy!</h2>
        <p>Use the OTP below to verify your account. It expires in <strong>5 minutes</strong>.</p>
        <h1 style="letter-spacing:8px; color:#4F46E5;">${otp}</h1>
        <p>If you didn't register, ignore this email.</p>
      `;

   const mailOptions = {
  from: `"Bookbuddy" <${process.env.EMAIL_USER}>`,
  to: toEmail,
  subject,
  html,
  text: `Welcome to Eventora! Use the OTP code ${otp} to verify your account. It expires in 5 minutes.`
    
};


    const info = await transporter.sendMail(mailOptions);

    return info;
  } catch (error) {
    console.error("SEND MAIL ERROR:", error);
    throw error;
  }
};

module.exports = { sentOtpEmail };
