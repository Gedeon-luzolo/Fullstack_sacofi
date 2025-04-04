import { Request, Response } from "express";
import { db } from "../config/db";
import bcrypt from "bcryptjs"; // Importer bcrypt pour le hachage

// Récupérer tous les utilisateurs
export const getAgents = async (req: Request, res: Response) => {
  const query = `SELECT * FROM user`;

  db.query(query, (error, results) => {
    if (error) {
      return res
        .status(500)
        .json({ error: "Erreur lors de la récupération des utilisateurs" });
    }
    res.status(200).json(results);
  });
};

// Supprimer un utilisateur
export const deleteAgent = async (req: Request, res: Response) => {
  const { id } = req.params;
  const query = `DELETE FROM user WHERE id = ?`;

  db.query(query, [id], (error) => {
    if (error) {
      return res
        .status(500)
        .json({ error: "Erreur lors de la suppression de l'utilisateur" });
    }
    res.status(204).send();
  });
};

// Mettre à jour un utilisateur
export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params; // Récupérer l'ID de l'utilisateur à partir des paramètres de la requête
  const { name, email, role, phone, titre, password } = req.body; // Récupérer les nouvelles informations

  try {
    // Vérifier si l'utilisateur existe
    db.query("SELECT * FROM user WHERE id = ?", [id], (err, results) => {
      if (err) {
        return res.status(500).json({
          message: "Erreur lors de la vérification de l'utilisateur",
        });
      }
      if (results.length === 0) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }

      const existingUser = results[0];

      // Préparer les valeurs pour la mise à jour
      const updateValues: any[] = [
        name || existingUser.name,
        email || existingUser.email,
        role || existingUser.role,
        phone || existingUser.phone,
        titre || existingUser.titre,
        id,
      ];

      // Si un nouveau mot de passe est fourni, le hacher et l'ajouter aux valeurs de mise à jour
      if (password) {
        const hashedPassword = bcrypt.hashSync(password, 10); // Hacher le mot de passe
        updateValues.splice(5, 0, hashedPassword); // Insérer le mot de passe haché à la bonne position
        db.query(
          "UPDATE user SET name = ?, email = ?, role = ?, phone = ?, titre = ?, password = ? WHERE id = ?",
          [...updateValues],
          (err) => {
            if (err) {
              return res.status(500).json({
                message: "Erreur lors de la mise à jour de l'utilisateur",
              });
            }
            res.status(200).json({
              message: "Utilisateur mis à jour avec succès",
            });
          }
        );
      } else {
        // Si aucun mot de passe n'est fourni, mettre à jour sans changer le mot de passe
        db.query(
          "UPDATE user SET name = ?, email = ?, role = ?, phone = ?, titre = ? WHERE id = ?",
          updateValues.slice(0, 5), // Exclure le mot de passe
          (err) => {
            if (err) {
              return res.status(500).json({
                message: "Erreur lors de la mise à jour de l'utilisateur",
              });
            }
            res.status(200).json({
              message: "Utilisateur mis à jour avec succès",
            });
          }
        );
      }
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la mise à jour de l'utilisateur" });
  }
};
