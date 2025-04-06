import express, { Request, Response } from "express";
import { createPaymentSession } from "../controllers/paymentController";

const router = express.Router();


router.post("/pay", createPaymentSession);

export default router;
