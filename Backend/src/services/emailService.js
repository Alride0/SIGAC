const nodemailer = require('nodemailer');

// Configure le transporter (utilisé pour envoyer les emails)
const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASSWORD 
  }
});

const sendResetPasswordEmail = async (email, resetToken, userName) => {
  
  const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; background-color: #f5f5f5; }
          .container { max-width: 600px; margin: 0 auto; background-color: white; padding: 2rem; border-radius: 8px; }
          .header { text-align: center; margin-bottom: 2rem; }
          .logo { font-size: 1.5rem; font-weight: bold; color: #3E2723; }
          .content { color: #333; line-height: 1.6; }
          .button { display: inline-block; background-color: #F7B801; color: #333; padding: 1rem 2rem; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 1.5rem 0; }
          .footer { text-align: center; color: #999; font-size: 0.85rem; margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #E0D5C7; }
          .warning { background-color: #fff3cd; border: 1px solid #ffc107; color: #856404; padding: 1rem; border-radius: 4px; margin: 1rem 0; font-size: 0.9rem; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">Atelier Gen's Couture</div>
          </div>

          <div class="content">
            <h2>Réinitialiser votre mot de passe</h2>
            <p>Bonjour ${userName},</p>
            <p>Vous avez demandé la réinitialisation de votre mot de passe. Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe :</p>

            <center>
              <a href="${resetLink}" class="button">Réinitialiser mon mot de passe</a>
            </center>

            <p>Ou copiez ce lien dans votre navigateur :</p>
            <p style="word-break: break-all; background-color: #f5f5f5; padding: 1rem; border-radius: 4px;">
              ${resetLink}
            </p>

            <div class="warning">
              Ce lien expire dans 1 heure. Si vous n'avez pas demandé cette réinitialisation, ignorez simplement cet email.
            </div>

            <p>Pour des raisons de sécurité, ne partagez jamais ce lien avec quelqu'un d'autre.</p>
          </div>

          <div class="footer">
            <p>© 2026 Atelier Gen's Couture. Tous droits réservés.</p>
            <p>Sécurisé par JWT • Vos données sont confidentielles</p>
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Réinitialiser votre mot de passe - Atelier Gen\'s Couture',
      html: htmlContent
    });

    console.log(`Email de reset envoyé à ${email}`);
    return true;
  } catch (error) {
    console.error(`Erreur lors de l'envoi du email à ${email}:`, error);
    return false;
  }
};

module.exports = { sendResetPasswordEmail };