import Contact from "../models/Contact.js";
import nodemailer from "nodemailer";

export const sendContactMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    console.log("📩 Contact request received");

    // 1️⃣ Save to DB FIRST (fast)
    const contact = await Contact.create({
      name,
      email,
      subject,
      message,
    });

    console.log("✅ Saved to DB");

    // 2️⃣ Create transporter (NO verify)
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // 3️⃣ Send mail with TIMEOUT protection
    await Promise.race([
      transporter.sendMail({
        from: `"Website Contact" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_USER,
        replyTo: email,
        subject: `📩 New Contact: ${subject}`,
        html: `
          <p><b>Name:</b> ${name}</p>
          <p><b>Email:</b> ${email}</p>
          <p><b>Message:</b> ${message}</p>
        `,
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Mail timeout")), 10000)
      ),
    ]);

    console.log("✅ Email sent");

    return res.status(201).json({
      success: true,
      message: "Message sent successfully",
    });
  } catch (error) {
    console.error("❌ CONTACT ERROR:", error.message);

    return res.status(500).json({
      success: false,
      message: "Email service temporarily unavailable",
    });
  }
};
