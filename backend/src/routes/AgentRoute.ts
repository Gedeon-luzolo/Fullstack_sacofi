import { Router } from "express";
import {
  getAgents,
  deleteAgent,
  updateUser,
} from "../controllers/AgentController";

const router = Router();

router.get("/agent", getAgents);
router.delete("/agent/:id", deleteAgent);
router.put("/agent/:id", updateUser);

export default router;
