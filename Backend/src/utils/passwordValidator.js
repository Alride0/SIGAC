// Valide si le password est fort
const isPasswordStrong = (password) => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return regex.test(password);
};

// Retourne les erreurs de validation du password
const getPasswordErrors = (password) => {
  const errors = [];

  if (password.length < 8) {
    errors.push("Au minimum 8 caractères");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("Au moins 1 lettre majuscule (A-Z)");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("Au moins 1 lettre minuscule (a-z)");
  }
  if (!/\d/.test(password)) {
    errors.push("Au moins 1 chiffre (0-9)");
  }
  if (!/[@$!%*?&]/.test(password)) {
    errors.push("Au moins 1 caractère spécial (@, #, $, !, %, etc.)");
  }

  return errors;
};

module.exports = { isPasswordStrong, getPasswordErrors };