import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { purpose, service, name, company, email, phone, message } = req.body;

  if (!purpose || !name || !email || !phone || !message) {
    return res.status(400).json({ success: false, error: 'Please fill in all required fields.' });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    // 1. Email sent to your inbox (Reply-To goes directly to the visitor)
    await transporter.sendMail({
      from: `"Krishi Prakriti Website" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: `[${purpose}] New Inquiry from ${name}`,
      text: [
        `Purpose: ${purpose}`,
        `Service: ${service || 'None'}`,
        `Name: ${name}`,
        `Company/Org: ${company || 'N/A'}`,
        `Email: ${email}`,
        `Phone: ${phone}`,
        ``,
        `Message:`,
        message,
      ].join('\n'),
    });

    // 2. Confirmation email sent to the email address the person provided
    await transporter.sendMail({
      from: `"Krishi Prakriti" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'We received your inquiry - Krishi Prakriti',
      text: [
        `Hi ${name},`,
        ``,
        `Thank you for contacting Krishi Prakriti. We have received your inquiry regarding "${purpose}" and will get back to you shortly.`,
        ``,
        `Summary of your request:`,
        `Service: ${service || 'Not Applicable'}`,
        `Message: ${message}`,
        ``,
        `Best regards,`,
        `Team Krishi Prakriti`,
      ].join('\n'),
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Email sending failed:', error);
    return res.status(500).json({ success: false, error: 'Failed to send email. Please try again later.' });
  }
}
