import nodemailer from 'nodemailer';
import { env } from '../../config/env.js';

// =========================
// EMAIL SERVICE (SMTP)
// =========================

// 🔥 TRANSPORTER
const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: Number(env.SMTP_PORT),
  secure: false,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
});

// =========================
// SEND EMAIL GENERIC
// =========================
export const emailService = {
  async sendEmail({ to, subject, html }) {
    try {
      if (!to || !subject || !html) {
        throw new Error('Datos de email incompletos');
      }

      const result = await transporter.sendMail({
        from: `"TecniRed" <${env.SMTP_USER}>`,
        to,
        subject,
        html,
      });

      return result;
    } catch (error) {
      console.error('email.send error:', error.message);
      return null;
    }
  },

  // =========================
  // TEMPLATE: BIENVENIDA
  // =========================
  async sendWelcomeEmail(to, name) {
    return this.sendEmail({
      to,
      subject: 'Bienvenido a TecniRed',
      html: `
        <div>
          <h2>Hola ${name}</h2>
          <p>Bienvenido a la red técnica de instaladores GPS.</p>
        </div>
      `,
    });
  },
};