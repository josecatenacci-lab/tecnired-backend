import nodemailer from 'nodemailer';
import { env } from '../../config/env.js';
import { logger } from '../../utils/logger.js';

// =========================
// SMTP TRANSPORT
// =========================

const transporter =
  nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: Number(
      env.SMTP_PORT,
    ),
    secure:
      env.SMTP_SECURE ===
      true,
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS,
    },
  });

// =========================
// HELPERS
// =========================

const wrapTemplate = (
  title,
  content,
) => `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:24px;border:1px solid #ddd;border-radius:10px;">
  <h2 style="margin-bottom:16px;">${title}</h2>
  <div style="font-size:14px;line-height:1.6;">
    ${content}
  </div>
  <hr style="margin:24px 0;" />
  <p style="font-size:12px;color:#777;">
    TecniRed • Plataforma técnica profesional
  </p>
</div>
`;

// =========================
// EMAIL SERVICE
// =========================

export const emailService = {
  async verify() {
    try {
      await transporter.verify();
      return true;
    } catch (error) {
      logger.error(
        'email.verify error',
        error,
      );
      return false;
    }
  },

  async sendEmail({
    to,
    subject,
    html,
    text,
  }) {
    try {
      if (
        !to ||
        !subject ||
        (!html && !text)
      ) {
        throw new Error(
          'Incomplete email payload',
        );
      }

      const result =
        await transporter.sendMail({
          from:
            env.SMTP_FROM ||
            `"TecniRed" <${env.SMTP_USER}>`,
          to,
          subject,
          html,
          text,
        });

      return result;
    } catch (error) {
      logger.error(
        'email.send error',
        error,
      );
      return null;
    }
  },

  async sendWelcomeEmail(
    to,
    name,
  ) {
    return this.sendEmail({
      to,
      subject:
        'Bienvenido a TecniRed',
      html: wrapTemplate(
        `Hola ${name}`,
        `
        <p>Bienvenido a TecniRed.</p>
        <p>Tu comunidad profesional para técnicos GPS, telemetría y conocimiento real de terreno.</p>
      `,
      ),
    });
  },

  async sendPasswordResetEmail(
    to,
    resetLink,
  ) {
    return this.sendEmail({
      to,
      subject:
        'Restablecer contraseña',
      html: wrapTemplate(
        'Recuperación de acceso',
        `
        <p>Solicitaste restablecer tu contraseña.</p>
        <p><a href="${resetLink}">Haz clic aquí para continuar</a></p>
      `,
      ),
    });
  },

  async sendNotificationEmail(
    to,
    title,
    message,
  ) {
    return this.sendEmail({
      to,
      subject: title,
      html: wrapTemplate(
        title,
        `<p>${message}</p>`,
      ),
    });
  },
};