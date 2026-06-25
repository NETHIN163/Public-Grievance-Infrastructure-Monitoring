const nodemailer = require('nodemailer');
require('dotenv').config();

async function sendTestEmail() {
  console.log('Sending real OTP email via Gmail...');
  console.log('From:', process.env.SMTP_EMAIL);
  console.log('To:   anandhansanthiya3@gmail.com');

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD
    }
  });

  const otp = '738291'; // sample OTP for demo

  await transporter.sendMail({
    from: `"Grievance Portal Security" <${process.env.SMTP_EMAIL}>`,
    to: 'anandhansanthiya3@gmail.com',
    subject: 'Your Grievance Portal Verification Code',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:30px;background:#ffffff;border-radius:12px;border:1px solid #e2e8f0">
        <div style="text-align:center;border-bottom:2px solid #3b82f6;padding-bottom:15px;margin-bottom:20px">
          <h2 style="color:#1e3a8a;margin:0">Grievance REDRESSAL CELL</h2>
        </div>
        <p style="font-size:14px;color:#1e293b">Greetings,</p>
        <p style="font-size:14px;color:#1e293b">Your 6-digit OTP verification code is:</p>
        <div style="background:#eff6ff;padding:20px;border-radius:8px;text-align:center;font-size:32px;font-weight:bold;color:#1d4ed8;letter-spacing:10px;border:1px dashed #bfdbfe;margin:20px 0">
          ${otp}
        </div>
        <p style="font-size:12px;color:#ef4444;font-weight:bold">This code expires in 10 minutes. Do not share it with anyone.</p>
        <div style="border-top:1px solid #e2e8f0;padding-top:15px;text-align:center;font-size:11px;color:#94a3b8;margin-top:20px">
          © 2026 National Infrastructure & Grievance Redressal Cell
        </div>
      </div>
    `
  });

  console.log('\n✅ Email delivered successfully to anandhansanthiya3@gmail.com!');
  console.log('👉 Check your Gmail inbox now — the OTP is: ' + otp);
}

sendTestEmail().catch(e => {
  console.error('❌ Failed:', e.message);
});
