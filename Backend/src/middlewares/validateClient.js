const { body, validationResult } = require("express-validator");

// Règles de validation pour créer/modifier un client
const clientValidationRules = () => {
  return [
    body("nom")
      .trim()
      .notEmpty().withMessage("Le nom est requis")
      .isLength({ min: 2, max: 50 }).withMessage("Le nom doit faire entre 2 et 50 caractères")
      .matches(/^[a-zA-ZÀ-ÿ\s'-]+$/).withMessage("Le nom contient des caractères non autorisés"),

    body("prenom")
      .trim()
      .notEmpty().withMessage("Le prénom est requis")
      .isLength({ min: 2, max: 50 }).withMessage("Le prénom doit faire entre 2 et 50 caractères")
      .matches(/^[a-zA-ZÀ-ÿ\s'-]+$/).withMessage("Le prénom contient des caractères non autorisés"),

    body("telephone")
      .trim()
      .notEmpty().withMessage("Le téléphone est requis")
      .matches(/^[0-9+\s]{8,15}$/).withMessage("Numéro de téléphone invalide"),

    body("adresse")
      .trim()
      .notEmpty().withMessage("L'adresse est requise")
      .isLength({ max: 255 }).withMessage("L'adresse est trop longue"),
  ];
};

// Middleware qui vérifie les résultats de la validation
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  return res.status(400).json({
    errors: errors.array().map(e => ({ field: e.path, message: e.msg }))
  });
};

module.exports = { clientValidationRules, validate };