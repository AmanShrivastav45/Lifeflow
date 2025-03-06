import nodemailer from "nodemailer";
import { VERIFICATION_EMAIL_TEMPLATE } from "../templates/templates.js";

export const sendOTPverificationEmail = async (name, email, OTP) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: '"Lifeflow" <shivamlifeflow07@gmail.com>',
      to: email,
      subject: "OTP Verification Code",
      html: VERIFICATION_EMAIL_TEMPLATE.replace("{OTP}", OTP).replace("{name}", name),
    };

    await transporter.sendMail(mailOptions);
    console.log("OTP sent:", OTP);

    return {
      status: "PENDING",
      message: "Verification OTP email sent",
      data: {
        email,
      },
    };
  } catch (error) {
    console.error("Error in sendOTP:", error);
    return {
      status: "FAILED",
      message: error.message,
    };
  }
};
