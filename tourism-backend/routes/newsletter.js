const express = require("express");
const router = express.Router();
const db = require("../db");
const nodemailer = require("nodemailer");

router.post("/subscribe", (req, res) => {
  const { email } = req.body;

  if (!email || !email.includes("@")) {
    return res.status(400).json({ message: "Please provide a valid email address." });
  }

  const sql = "INSERT INTO newsletter (email) VALUES (?)";

  db.query(sql, [email], async (err, result) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        console.log(`⚠️ Duplicate subscription attempt: ${email}`);
        return res.status(400).json({ message: "⚠️ You're already subscribed!" });
      }
      console.error("❌ Database error:", err);
      return res.status(500).json({ message: "❌ Database error, try again later." });
    }

    // Send confirmation email if credentials are provided
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
        connectionTimeout: 10000,
      });

      try {
        let info = await transporter.sendMail({
          from: `"Desidwar Travel" <${process.env.EMAIL_USER}>`,
          to: email,
          subject: "Welcome to Desidwar Travel Updates!",
          html: `
            <h2>🎉 Thank you for subscribing!</h2>
            <p>You’ll now receive the latest Indian travel inspiration, tips, and deals straight to your inbox.</p>
            <p>🌍 <strong>Explore India with Desidwar!</strong></p>
          `,
        });
        console.log(`✅ Email sent successfully to ${email} (ID: ${info.messageId})`);
      } catch (mailErr) {
        console.error(`⚠️ Email notice for ${email}:`, mailErr.message);
      }
    } else {
      console.log(`ℹ️ EMAIL_USER or EMAIL_PASS not set; skipping welcome email for ${email}`);
    }

    return res.json({ message: "✅ Subscribed successfully! Welcome to Desidwar." });
  });
});

module.exports = router;
