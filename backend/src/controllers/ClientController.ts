import { Request, Response } from "express";
import prisma from "../config/prisma"; // Assurez-vous que le chemin est correct
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

  try {
    const client = await prisma.client.create({
      data: {
        name,
        site,
        terrainDimension,
        phone,
        email,
        numTerrain,
        photo: photoPath, // Enregistrer le chemin de l'image
      },
    });
    res.status(201).json(client);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la création du client" });
  }
};

// Récupérer tous les clients
export const getClients = async (req: Request, res: Response) => {
  try {
    const clients = await prisma.client.findMany();
    res.status(200).json(clients);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des clients" });
  }
};

// Récupérer un client par ID
export const getClientById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const client = await prisma.client.findUnique({
      where: { id: Number(id) },
    });
    if (!client) {
      return res.status(404).json({ error: "Client non trouvé" });
    }
    res.status(200).json(client);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération du client" });
  }
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

  try {
    const client = await prisma.client.update({
      where: { id: Number(id) },
      data: {
        name,
        site,
        terrainDimension,
        phone,
        email,
        numTerrain,
        photo: photoPath, // Mettre à jour le chemin de l'image
      },
    });
    res.status(200).json(client);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la mise à jour du client" });
  }
};

// Supprimer un client
export const deleteClient = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.client.delete({
      where: { id: Number(id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la suppression du client" });
  }
};
