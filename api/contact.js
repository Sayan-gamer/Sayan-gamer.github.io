import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { purpose, service, name, company, email, phone, message } = req.body;

  if (!purpose || !name || !email || !phone || !message) {
    return res.status(400).json({ success: false, error: 'Please fill in all required fields.' });
  }

  try {
    // 1. Email sent to your inbox (Reply-To goes directly to the visitor)
    const { error: adminError } = await resend.emails.send({
      from: 'Krishi Prakriti Website <onboarding@resend.dev>',
      to: [process.env.CONTACT_EMAIL],
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

    if (adminError) {
      console.error('Resend error:', adminError);
      return res.status(500).json({ success: false, error: 'Failed to send email. Please try again later.' });
    }

    /*
    // 2. Confirmation email to the visitor
    // NOTE: Uncomment this ONLY after you verify your own custom domain in Resend
    // and replace "onboarding@resend.dev" with your domain email (e.g., contact@krishiprakriti.com).
    // Resend's free test address (onboarding@resend.dev) can only send to your own account email.

    const { error: userError } = await resend.emails.send({
      from: 'Krishi Prakriti <contact@yourdomain.com>',
      to: [email],
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

    if (userError) {
      console.error('Confirmation email failed:', userError);
    }
    */

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Email sending failed:', error);
    return res.status(500).json({ success: false, error: 'Failed to send email. Please try again later.' });
  }
}
