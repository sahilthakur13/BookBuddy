const { BrevoClient } = require("@getbrevo/brevo");

const brevo = new BrevoClient({
  apiKey: process.env.BREVO_API_KEY,
});

exports.sentOtpEmail = async (toEmail, otp) => {
  try {
    const result = await brevo.transactionalEmails.sendTransacEmail({
      sender: {
        name: "BookBuddy",
        email: process.env.BREVO_SENDER_EMAIL,
      },
      to: [{ email: toEmail }],
      subject: "Verify your BookBuddy account",
      htmlContent: `
        <h2>Welcome to BookBuddy!</h2>
        <p>Use the OTP below to verify your account. It expires in <strong>5 minutes</strong>.</p>
        <h1 style="letter-spacing:8px; color:#4F46E5;">${otp}</h1>
        <p>If you didn't register, ignore this email.</p>
      `,
      textContent: `Welcome to BookBuddy! Use the OTP code ${otp} to verify your account. It expires in 5 minutes.`,
    });

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error("SEND MAIL ERROR:", error?.body || error.message || error);

    return {
      success: false,
      error: error?.body || error.message || "Failed to send email",
    };
  }
};