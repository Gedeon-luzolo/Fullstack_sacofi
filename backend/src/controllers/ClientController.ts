import { Request, Response } from "express";
import { db } from "../config/db"; // Importer la connexion à la base de données
import { v4 as uuidv4 } from "uuid"; // Pour générer un nom de fichier unique
import path from "path";
import fs from "fs";

// Créer un client
export const createClient = async (req: Request, res: Response) => {
  const { name, site, terrainDimension, phone, email, numTerrain } = req.body;
  const photo = req.file; // Récupérer le fichier téléchargé

  let photoPath = null;
  if (photo) {
    // Générer un nom de fichier unique
    const fileName = `${uuidv4()}${path.extname(photo.originalname)}`;
    photoPath = `uploads/${fileName}`;

    // Déplacer le fichier vers le dossier de destination
    fs.renameSync(photo.path, path.join(__dirname, "../../uploads", fileName));
  }

  const query = `INSERT INTO client (name, site, terrainDimension, phone, email, numTerrain, photo) VALUES (?, ?, ?, ?, ?, ?, ?)`;
  const values = [
    name,
    site,
    terrainDimension,
    phone,
    email,
    numTerrain,
    photoPath,
  ];

  db.query(query, values, (error, results) => {
    if (error) {
      return res
        .status(500)
        .json({ error: "Erreur lors de la création du client" });
    }
    res
      .status(201)
      .json({ id: results.insertId, ...req.body, photo: photoPath });
  });
};

// Récupérer tous les clients
export const getClients = async (req: Request, res: Response) => {
  const query = `SELECT * FROM client`;

  db.query(query, (error, results) => {
    if (error) {
      return res
        .status(500)
        .json({ error: "Erreur lors de la récupération des clients" });
    }
    res.status(200).json(results);
  });
};

// Récupérer un client par ID
export const getClientById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const query = `SELECT * FROM client WHERE id = ?`;

  db.query(query, [id], (error, results) => {
    if (error) {
      return res
        .status(500)
        .json({ error: "Erreur lors de la récupération du client" });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "Client non trouvé" });
    }
    res.status(200).json(results[0]);
  });
};

// Mettre à jour un client
export const updateClient = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, site, terrainDimension, phone, email, numTerrain } = req.body;
  const photo = req.file; // Récupérer le fichier téléchargé

  let photoPath = null;
  if (photo) {
    const fileName = `${uuidv4()}${path.extname(photo.originalname)}`;
    photoPath = `uploads/${fileName}`;
    fs.renameSync(photo.path, path.join(__dirname, "../../uploads", fileName));
  }

  const query = `UPDATE client SET name = ?, site = ?, terrainDimension = ?, phone = ?, email = ?, numTerrain = ?, photo = ? WHERE id = ?`;
  const values = [
    name,
    site,
    terrainDimension,
    phone,
    email,
    numTerrain,
    photoPath,
    id,
  ];

  db.query(query, values, (error, results) => {
    if (error) {
      return res
        .status(500)
        .json({ error: "Erreur lors de la mise à jour du client" });
    }
    res.status(200).json({ id, ...req.body, photo: photoPath });
  });
};

// Supprimer un client
export const deleteClient = async (req: Request, res: Response) => {
  const { id } = req.params;
  const query = `DELETE FROM client WHERE id = ?`;

  db.query(query, [id], (error) => {
    if (error) {
      return res
        .status(500)
        .json({ error: "Erreur lors de la suppression du client" });
    }
    res.status(204).send();
  });
};
