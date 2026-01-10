import Contact from "../models/Contact.js";
import nodemailer from "nodemailer";

export const sendContactMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    console.log("📩 Contact request received");

    // 1️⃣ Save to DB
    const contact = await Contact.create({
      name,
      email,
      subject,
      message,
    });

    console.log("✅ Saved to DB");

    let emailStatus = "skipped";

    try {
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: `"Website Contact" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_USER,
        replyTo: email,
        subject: `📩 New Contact: ${subject}`,
        html: `
          <p><b>Name:</b> ${name}</p>
          <p><b>Email:</b> ${email}</p>
          <p><b>Message:</b> ${message}</p>
        `,
      });

      emailStatus = "sent";
      console.log("✅ Email sent");

    } catch (mailErr) {
      emailStatus = "failed";
      console.error("⚠️ Email failed:", mailErr.message);
    }

    // ✅ ALWAYS return success
    return res.status(201).json({
      success: true,
      message: "Message received successfully",
      emailStatus,
    });

  } catch (error) {
    console.error("❌ CONTACT ERROR:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

