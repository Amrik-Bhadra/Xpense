import nodemailer from "nodemailer";

const hasSmtpConfig = Boolean(
  process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS,
);

const transporter = hasSmtpConfig
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT ?? 587),
      secure: process.env.SMTP_SECURE === "true",
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    })
  : null;

export async function sendOtpEmail(
  to: string,
  code: string,
  purpose: "REGISTER" | "RESET_PASSWORD",
) {
  if (!transporter) {
    console.log(`[dev] OTP for ${to} (${purpose}): ${code}`);
    return;
  }

  const heading = purpose === "REGISTER" ? "Verify your email" : "Reset your password";
  const body =
    purpose === "REGISTER"
      ? "Use the code below to verify your email and activate your Xpense account."
      : "Use the code below to reset your Xpense account password.";

  await transporter.sendMail({
    from: process.env.SMTP_FROM ?? '"Xpense" <no-reply@xpense.app>',
    to,
    subject: `${heading} — ${code}`,
    html: `
      <div style="font-family: sans-serif; max-width: 420px; margin: 0 auto;">
        <h2 style="color:#12131a;">${heading}</h2>
        <p style="color:#6b7280;">${body}</p>
        <div style="font-size: 32px; font-weight: 700; letter-spacing: 8px; background:#eeeefd; color:#5b5fef; padding: 16px 24px; border-radius: 12px; text-align:center; margin: 24px 0;">
          ${code}
        </div>
        <p style="color:#6b7280; font-size: 13px;">This code expires in 10 minutes. If you didn't request this, you can safely ignore this email.</p>
      </div>
    `,
  });
}