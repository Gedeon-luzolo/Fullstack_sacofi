import { RequestHandler, Router } from "express";
import {
  createPayment,
  getPayments,
  getPaymentById,
  updatePayment,
  deletePayment,
  countPaymentsByReason,
  countConstruction,
  getTotal,
} from "../controllers/PaymentControllers";

const router = Router();

// Routes pour les paiements
router.post("/payment", createPayment);
router.get("/payments", getPayments);
router.get("/payment/cont/construction", countConstruction);
router.get("/payment/cont/reson", countPaymentsByReason);
router.get("/payment/total", getTotal);
router.get("/payment/:id", getPaymentById as RequestHandler);
router.put("/payment/:id", updatePayment);
router.delete("/payment/:id", deletePayment);

export default router;
