
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const contacts = require("./contacts");

const app = express();
app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

app.post("/send", async (req, res) => {
  const { contactId, message } = req.body;
  const contact = contacts.find(c => c.id === contactId);
  if (!contact) return res.status(404).json({ error: "Contacto no encontrado" });

  try {
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: contact.email,
      subject: "Nuevo mensaje",
      text: message
    });
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: "Error enviando el mail" });
  }
});

app.listen(3001, () => console.log("Backend en http://localhost:3001"));
