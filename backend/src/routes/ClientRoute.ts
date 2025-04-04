import { RequestHandler, Router } from "express";
import multer from "multer";
import {
  createClient,
  getClients,
  getClientById,
  updateClient,
  deleteClient,
} from "../controllers/ClientController";

const router = Router();

// Configuration de multer pour le stockage des fichiers
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Dossier où les fichiers seront stockés
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Nom du fichier
  },
});

const upload = multer({ storage });

// Routes pour les clients
router.post("/client", upload.single("photo"), createClient as RequestHandler); // Créer un client avec photo
router.get("/client", getClients); // Récupérer tous les clients
router.get("/client/:id", getClientById as RequestHandler); // Récupérer un client par ID
router.put("/client/:id", upload.single("photo"), updateClient); // Mettre à jour un client avec photo
router.delete("/client/:id", deleteClient); // Supprimer un client

export default router;
