import { Request, Response } from "express";
import { db } from "../config/db";

// Récupérer toutes les notifications
export const getNotification = async (req: Request, res: Response) => {
  const query = `SELECT * FROM notifications`;

  db.query(query, (error, results) => {
    if (error) {
      return res
        .status(500)
        .json({ error: "Erreur lors de la récupération des notifications" });
    }
    res.status(200).json(results);
  });
};
