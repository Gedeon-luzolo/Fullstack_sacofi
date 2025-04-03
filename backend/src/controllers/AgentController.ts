import { Request, Response } from "express";
import { db } from "../config/db";

// Créer un utilisateur
export const createAgent = async (req: Request, res: Response) => {
  const { email, name, role, phone, titre } = req.body;

  const query = `INSERT INTO user (email, name, role, phone, titre) VALUES (?, ?, ?, ?, ?)`;
  const values = [email, name, role, phone, titre];

  db.query(query, values, (error, results) => {
    if (error) {
      return res
        .status(500)
        .json({ error: "Erreur lors de la création de l'utilisateur" });
    }
    res.status(201).json({ id: results.insertId, ...req.body });
  });
};

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

// Récupérer un utilisateur par ID
export const getAgentById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const query = `SELECT * FROM user WHERE id = ?`;

  db.query(query, [id], (error, results) => {
    if (error) {
      return res
        .status(500)
        .json({ error: "Erreur lors de la récupération de l'utilisateur" });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }
    res.status(200).json(results[0]);
  });
};

// Mettre à jour un utilisateur
export const updateAgent = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { email, name, role, phone } = req.body;

  const query = `UPDATE user SET email = ?, name = ?, role = ?, phone = ? , titre = ? WHERE id = ?`;
  const values = [email, name, role, phone, id];

  db.query(query, values, (error, results) => {
    if (error) {
      return res
        .status(500)
        .json({ error: "Erreur lors de la mise à jour de l'utilisateur" });
    }
    res.status(200).json({ id, ...req.body });
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
