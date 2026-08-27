const { sendResetPasswordEmail } = require('../services/emailService');
const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const databaseError = (res, error) => {
  console.error('Erreur de base de données :', error);
  return res.status(500).json({ error: "Le service de base de données est momentanément indisponible" });
};


const register = (req, res) => {
  const { nom, email, password, passwordConfirm } = req.body;

  
  if (!nom || !email || !password || !passwordConfirm) {
    return res.status(400).json({ error: "Tous les champs sont obligatoires" });
  }

  if (password !== passwordConfirm) {
    return res.status(400).json({ error: "Les mots de passe ne correspondent pas" });
  }

  db.query('SELECT email FROM users WHERE email = ?', [email], async (error, results) => {
    if (error) {
      return databaseError(res, error);
    }

    if (results.length > 0) {
      return res.status(400).json({ error: "Cet email existe déjà" });
    }

    const hashedPassword = await bcrypt.hash(password, 8);

    db.query(
      'INSERT INTO users SET ?',
      { nom, email, password: hashedPassword },
      (error, results) => {
        if (error) {
          return databaseError(res, error);
        }

        return res.status(201).json({ message: "Utilisateur créé avec succès" });
      }
    );
  });
};

const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email et mot de passe requis" });
  }

  db.query('SELECT * FROM users WHERE email = ?', [email], async (error, results) => {
    if (error) {
      return databaseError(res, error);
    }

    if (results.length === 0 || !(await bcrypt.compare(password, results[0].password))) {
      return res.status(401).json({ error: "Email ou mot de passe incorrect" });
    }

    const user = results[0];
    const permissions = user.role === "admin"
  ? [
      "view_dashboard",
      "view_payments",
      "manage_settings",
      "manage_users"
    ]
  : [
      "view_clients",
      "view_mesures",
      "view_commandes"
    ];

   const token = jwt.sign(
    {
        id: user.id,
        email: user.email,
        nom: user.nom,
        role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
);

    res.status(200).json({
  message: "Connexion réussie",
  token,
  user: {
    id: user.id,
    nom: user.nom,
    email: user.email,
    role: user.role,
    permissions
  }
});
  });
};
const crypto = require('crypto');
const nodemailer = require('nodemailer'); 


  const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email requis" });
  }

  // Cherche l'utilisateur
  db.query('SELECT * FROM users WHERE email = ?', [email], async (error, results) => {
    if (error) {
      return databaseError(res, error);
    }

    // Pour la sécurité, on dit pas si l'email existe ou pas
    if (results.length === 0) {
      return res.status(200).json({ message: "Si cet email existe, un lien de réinitialisation a été envoyé" });
    }

    const user = results[0];

    // Génère un token unique
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Expiration : 1 heure
    const expiresAt = new Date(Date.now() + 3600000);

    // Stocke le token hashé dans la DB
    db.query(
      'UPDATE users SET password_reset_token = ?, password_reset_expires = ? WHERE id = ?',
      [resetTokenHash, expiresAt, user.id],
      async (error) => {
        if (error) {
          return databaseError(res, error);
        }

        // ENVOIE L'EMAIL AVEC LE LIEN
        const emailSent = await sendResetPasswordEmail(
          user.email,
          resetToken,
          user.nom
        );

        if (!emailSent) {
          return res.status(500).json({ error: "Erreur lors de l'envoi de l'email" });
        }

        res.status(200).json({ message: "Si cet email existe, un lien de réinitialisation a été envoyé" });
      }
    );
  });
};

// Réinitialiser le password avec le token
const resetPassword = (req, res) => {
  const { token, password, passwordConfirm } = req.body;

  if (!token || !password || !passwordConfirm) {
    return res.status(400).json({ error: "Tous les champs sont obligatoires" });
  }

  if (password !== passwordConfirm) {
    return res.status(400).json({ error: "Les mots de passe ne correspondent pas" });
  }

  // Importe la fonction de validation
  const { isPasswordStrong, getPasswordErrors } = require('../utils/passwordValidator');

  if (!isPasswordStrong(password)) {
    return res.status(400).json({ 
      error: "Mot de passe faible",
      requirements: getPasswordErrors(password)
    });
  }

  // Hash le token pour vérifier
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

  // Cherche l'utilisateur avec ce token valide
  db.query(
    'SELECT * FROM users WHERE password_reset_token = ? AND password_reset_expires > NOW()',
    [tokenHash],
    async (error, results) => {
      if (error) {
        return databaseError(res, error);
      }

      if (results.length === 0) {
        return res.status(400).json({ error: "Lien de réinitialisation invalide ou expiré" });
      }

      const user = results[0];
      const hashedPassword = await bcrypt.hash(password, 8);

      // Mise à jour du password et suppression du token
      db.query(
        'UPDATE users SET password = ?, password_reset_token = NULL, password_reset_expires = NULL WHERE id = ?',
        [hashedPassword, user.id],
        (error) => {
          if (error) {
            return databaseError(res, error);
          }

          res.status(200).json({ message: "Mot de passe réinitialisé avec succès" });
        }
      );
    }
  );
};

const getProfile = (req, res) => {
    const userId = req.user.id;

    db.query('SELECT id, nom, email, role FROM users WHERE id = ?', [userId], (err, results) => {
        if (err) return databaseError(res, err);
        if (results.length === 0) return res.status(404).json({ error: "Utilisateur non trouvé" });
        res.json({ user: results[0] });
    });
};

const changePassword = async (req, res) => {
    const userId = req.user.id;
    const { currentPassword, newPassword, newPasswordConfirm } = req.body;

    if (!currentPassword || !newPassword || !newPasswordConfirm) {
        return res.status(400).json({ error: "Tous les champs sont obligatoires" });
    }

    if (newPassword !== newPasswordConfirm) {
        return res.status(400).json({ error: "Les nouveaux mots de passe ne correspondent pas" });
    }

    const { isPasswordStrong, getPasswordErrors } = require('../utils/passwordValidator');
    if (!isPasswordStrong(newPassword)) {
        return res.status(400).json({ error: "Mot de passe faible", requirements: getPasswordErrors(newPassword) });
    }

    db.query('SELECT * FROM users WHERE id = ?', [userId], async (err, results) => {
        if (err) return databaseError(res, err);
        if (results.length === 0) return res.status(404).json({ error: "Utilisateur non trouvé" });

        const user = results[0];
        const match = await bcrypt.compare(currentPassword, user.password);
        if (!match) {
            return res.status(401).json({ error: "Mot de passe actuel incorrect" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 8);
        db.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, userId], (err) => {
            if (err) return databaseError(res, err);
            res.json({ message: "Mot de passe modifié avec succès" });
        });
    });
};

const getAllUsers = (req, res) => {
    db.query('SELECT id, nom, email, role, created_at FROM users ORDER BY created_at DESC', (err, results) => {
        if (err) return databaseError(res, err);
        res.json({ results });
    });
};

module.exports = { register, login, forgotPassword, resetPassword, getProfile, changePassword, getAllUsers };



