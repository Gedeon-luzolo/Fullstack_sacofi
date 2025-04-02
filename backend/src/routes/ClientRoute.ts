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
router.post("/client", upload.single("photo"), createClient); // 'photo' est le nom du champ dans le formulaire
router.get("/client", getClients);
router.get("/client/:id", getClientById as RequestHandler);
router.put("/client/:id", upload.single("photo"), updateClient); // 'photo' est le nom du champ dans le formulaire
router.delete("/client/:id", deleteClient);

export default router;
