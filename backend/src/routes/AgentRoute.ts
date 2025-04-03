import { Router } from "express";
import {
  createAgent,
  getAgents,
  getAgentById,
  updateAgent,
  deleteAgent,
} from "../controllers/AgentController";

const router = Router();

// Routes pour les utilisateurs
router.post("/agent", createAgent);
router.get("/agent", getAgents);
router.get("/agent/:id", getAgentById);
router.put("/agent/:id", updateAgent);
router.delete("/agent/:id", deleteAgent);

export default router;
