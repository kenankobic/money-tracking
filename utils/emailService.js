const nodemailer = require("nodemailer");

exports.sendResetPasswordEmail = async (email, resetToken) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail", // You can use other email services or SMTP settings
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Password Reset",
    text: `You requested a password reset. Click the link below to reset your password: \n
           ${process.env.CLIENT_URL}/reset-password?token=${resetToken}`,
  };

  await transporter.sendMail(mailOptions);
};
