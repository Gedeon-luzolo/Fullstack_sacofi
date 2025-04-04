import { Request, Response } from "express";
import { db } from "../config/db";
import { io } from "../app";

// Créer un paiement
export const createPayment = async (req: Request, res: Response) => {
  const {
    clientName,
    paymentReason,
    amount,
    currency,
    paymentMode,
    site,
    terrainNumber,
    clientNumber,
    email,
    agent,
  } = req.body;

  const query = `INSERT INTO payment (clientName, paymentReason, amount, currency, paymentMode, site, terrainNumber, clientNumber, email, agent) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  const values = [
    clientName,
    paymentReason,
    amount,
    currency,
    paymentMode,
    site,
    terrainNumber,
    clientNumber,
    email,
    agent,
  ];

  db.query(query, values, (error, results) => {
    if (error) {
      console.log("erreur lors de la création du paiement ", error);
      return res
        .status(500)
        .json({ error: "Erreur lors de la création du paiement" });
    }
    // Émettre une notification
    const notificationMessage = `Un nouveau paiement a été créé par l'utilisateur`;
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

// Récupérer tous les paiements
export const getPayments = async (req: Request, res: Response) => {
  const query = `SELECT * FROM payment`;

  db.query(query, (error, results) => {
    if (error) {
      return res
        .status(500)
        .json({ error: "Erreur lors de la récupération des paiements" });
    }
    res.status(200).json(results);
  });
};

// Récupérer un paiement par ID
export const getPaymentById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const query = `SELECT * FROM payment WHERE id = ?`;

  db.query(query, [id], (error, results) => {
    if (error) {
      return res
        .status(500)
        .json({ error: "Erreur lors de la récupération du paiement" });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "Paiement non trouvé" });
    }
    res.status(200).json(results[0]);
  });
};

// Mettre à jour un paiement
export const updatePayment = async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    clientName,
    paymentReason,
    amount,
    currency,
    paymentMode,
    site,
    terrainNumber,
    clientNumber,
    email,
  } = req.body;

  const query = `UPDATE payment SET clientName = ?, paymentReason = ?, amount = ?, currency = ?, paymentMode = ?, site = ?, terrainNumber = ?, clientNumber = ?, email = ? WHERE id = ?`;
  const values = [
    clientName,
    paymentReason,
    amount,
    currency,
    paymentMode,
    site,
    terrainNumber,
    clientNumber,
    email,
    id,
  ];

  db.query(query, values, (error, results) => {
    if (error) {
      return res
        .status(500)
        .json({ error: "Erreur lors de la mise à jour du paiement" });
    }
    res.status(200).json({ id, ...req.body });
  });
};

// Supprimer un paiement
export const deletePayment = async (req: Request, res: Response) => {
  const { id } = req.params;
  const query = `DELETE FROM payment WHERE id = ?`;

  db.query(query, [id], (error) => {
    if (error) {
      return res
        .status(500)
        .json({ error: "Erreur lors de la suppression du paiement" });
    }
    res.status(204).send();
  });
};

// Compter les paiements par paymentReason
export const countPaymentsByReason = async (req: Request, res: Response) => {
  const sql = "SELECT COUNT(*) as count FROM payment WHERE paymentReason = ?";

  db.query(sql, ["souscription"], (err, results) => {
    if (err) {
      console.error("Erreur lors de la récupération des données :", err);
      return res.status(500).json({ error: "Erreur serveur" });
    }
    const count = results[0].count;
    res.json({ count });
  });
};

export const countConstruction = async (req: Request, res: Response) => {
  const sql = "SELECT COUNT(*) as count FROM payment WHERE paymentReason = ?";

  db.query(sql, ["construction"], (err, results) => {
    if (err) {
      console.error(
        "Erreur lors de la récupération des données construction :",
        err
      );
      return res.status(500).json({ error: "Erreur serveur" });
    }
    const count = results[0].count;
    res.json({ count });
  });
};

export const getTotal = async (req: Request, res: Response) => {
  const sql =
    "SELECT currency, SUM(amount) AS total_amount FROM payment GROUP BY currency";

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Erreur lors de la récupération des totaux :", err);
      return res.status(500).json({ error: "Erreur serveur" });
    }

    res.json(results);
  });
};
