import { Request, Response } from "express";
import prisma from "../config/prisma"; // Assurez-vous que le chemin est correct

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
  } = req.body;

  try {
    const payment = await prisma.payment.create({
      data: {
        clientName,
        paymentReason,
        amount,
        currency,
        paymentMode,
        site,
        terrainNumber,
        clientNumber,
        email,
      },
    });
    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la création du paiement" });
  }
};

// Récupérer tous les paiements
export const getPayments = async (req: Request, res: Response) => {
  try {
    const payments = await prisma.payment.findMany();
    res.status(200).json(payments);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des paiements" });
  }
};

// Récupérer un paiement par ID
export const getPaymentById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const payment = await prisma.payment.findUnique({
      where: { id: Number(id) },
    });
    if (!payment) {
      return res.status(404).json({ error: "Paiement non trouvé" });
    }
    res.status(200).json(payment);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération du paiement" });
  }
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

  try {
    const payment = await prisma.payment.update({
      where: { id: Number(id) },
      data: {
        clientName,
        paymentReason,
        amount,
        currency,
        paymentMode,
        site,
        terrainNumber,
        clientNumber,
        email,
      },
    });
    res.status(200).json(payment);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erreur lors de la mise à jour du paiement" });
  }
};

// Supprimer un paiement
export const deletePayment = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.payment.delete({
      where: { id: Number(id) },
    });
    res.status(204).send();
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erreur lors de la suppression du paiement" });
  }
};
