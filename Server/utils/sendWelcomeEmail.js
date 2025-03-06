import nodemailer from "nodemailer";
import { WELCOME_TEMPLATE } from "../templates/templates.js";

export const sendWelcomeEmail = async (name, email) => {
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
      subject: "Welcome to Lifeflow",
      html: WELCOME_TEMPLATE.replace("{name}", name),
    };

    await transporter.sendMail(mailOptions);
    return {
      status: "SUCCESS",
      message: "Verification Successfull",
    };

  } catch (error) {
    console.error("Error in verification", error);
    return {
      status: "FAILED",
      message: error.message,
    };
  }
};
