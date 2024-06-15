const nodemailer = require('nodemailer');

async function sendMailforResetPassword(email, username, resetLink) {
  try {
    const transporter = nodemailer.createTransport({
      service: 'yahoo',
      auth: {
        user: 'ghiarasim_alexandru03@yahoo.com',
        pass: 'icuwqxmhadczrppa'
      }
    });

    const mailOptions = {
      from: 'informatiX-website <ghiarasim_alexandru03@yahoo.com>',
      to: email,
      subject: 'Resetare Parolă - informatiX-website',
      html: `
        <p>Salut! ${username},</p>
        <p>Cererea pentru resetarea parolei a fost primită cu succes!</p>
        <p>Pentru a-ți reseta parola, te rog să accesezi următorul link:</p>
        <p><a href="${resetLink}">${resetLink}</a></p>
        <p>Dacă nu ai solicitat resetarea parolei, te rog să ignori acest mesaj.</p>
        <p>Cu drag,</p>
        <p>Echipa noastră</p>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

module.exports = { sendMailforResetPassword };
