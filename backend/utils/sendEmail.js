import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  const required = ['SMTP_HOST', 'SMTP_USER', 'SMTP_PASS', 'FROM_EMAIL'];
  const missing = required.filter((key) => !process.env[key]?.trim());

  if (missing.length > 0) {
    throw new Error(`Email service is not configured: ${missing.join(', ')}`);
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: `${process.env.FROM_NAME || 'AI Interview Coach'} <${process.env.FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    html: options.html,
  });
};

export default sendEmail;
