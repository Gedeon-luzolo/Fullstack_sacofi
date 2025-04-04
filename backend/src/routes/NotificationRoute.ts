import { Router } from "express";
import { getNotification } from "../controllers/NotificationController";

const router = Router();

router.get("/notification", getNotification);

export default router;
