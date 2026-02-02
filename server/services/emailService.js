import { Resend } from 'resend';

const getBaseUrl = () => {
  return process.env.SERVER_URL || process.env.API_URL || 'http://localhost:5000';
};

const isResendConfigured = () => {
  return Boolean(process.env.RESEND_API_KEY);
};

export const sendVerificationEmail = async (email, token) => {
  const baseUrl = getBaseUrl();
  const verifyUrl = `${baseUrl}/api/auth/verify-email?token=${token}`;

  if (!isResendConfigured()) {
    console.warn('RESEND_API_KEY not configured. Verification link:', verifyUrl);
    return { sent: false, verifyUrl };
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  await resend.emails.send({
    to: email,
    from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
    subject: 'Verify your StellarSoil email',
    text: `Verify your email by visiting: ${verifyUrl}`,
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h2>Verify your email</h2>
        <p>Thanks for signing up for StellarSoil. Click the button below to verify your email.</p>
        <p><a href="${verifyUrl}" style="background:#d97706;color:#fff;padding:10px 16px;border-radius:6px;text-decoration:none;">Verify Email</a></p>
        <p>If the button doesn't work, paste this URL into your browser:</p>
        <p>${verifyUrl}</p>
      </div>
    `
  });
  return { sent: true, verifyUrl };
};
