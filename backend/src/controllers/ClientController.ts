import { Request, Response } from "express";
import { db } from "../config/db";
import { io } from "../app";

// Créer un client
export const createClient = async (req: Request, res: Response) => {
  const { name, site, terrainDimension, phone, email, numTerrain, agent } =
    req.body;

  const query = `INSERT INTO client (name, site, terrainDimension, phone, email, numTerrain, agent) VALUES (?, ?, ?, ?,?, ?, ?)`;
  const values = [
    name,
    site,
    terrainDimension,
    phone,
    email,
    numTerrain,
    agent,
  ];

  db.query(query, values, (error, results) => {
    if (error) {
      return res
        .status(500)
        .json({ error: "Erreur lors de la création du client" });
    }

    // Émettre une notification
    const notificationMessage = `Un nouveau client a été ajouté par l'utilisateur`;
    io.emit("notification", {
      message: notificationMessage,
      userId: agent,
    });

    // Stocker la notification dans la base de données
    const notificationQuery = `INSERT INTO notifications (message, userId) VALUES (?, ?)`;
    db.query(notificationQuery, [notificationMessage, agent], (err) => {
      if (err) {
        console.error(
          "Erreur lors de l'insertion de la notification dans la base de données",
          err
        );
      }
    });

    res.status(201).json({ id: results.insertId, ...req.body });
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
  const { name, site, terrainDimension, phone, email, numTerrain, userId } =
    req.body;

  const query = `UPDATE client SET name = ?, site = ?, terrainDimension = ?, phone = ?, email = ?, numTerrain = ? WHERE id = ?`;
  const values = [name, site, terrainDimension, phone, email, numTerrain, id];

  db.query(query, values, (error, results) => {
    if (error) {
      return res
        .status(500)
        .json({ error: "Erreur lors de la mise à jour du client" });
    }
    res.status(200).json({ id, ...req.body });
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
    // Émettre une notification
    io.emit("notification", {
      message: `Le client avec l'ID ${id} a été supprimé!`,
      agent: "admin", // Remplacez par l'ID de l'utilisateur qui a effectué l'action si disponible
    });
    res.status(204).send();
  });
};
