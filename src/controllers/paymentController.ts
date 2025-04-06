import { Request, Response } from "express";
import Stripe from "stripe";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-02-24.acacia",
});


const transporter = nodemailer.createTransport({
  service: "gmail", 
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS, 
  },
});


const sendEmailNotification = async (email: string, sessionId: string) => {
  try {
    await transporter.sendMail({
      from: `"Upright Kids Foundation" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Payment Confirmation",
      html: `<h2>Thank you for your donation!</h2>
             <p>We appreciate your support.</p>
             <p>Your payment session ID: <strong>${sessionId}</strong></p>`,
    });
    console.log(`📧 Email sent to ${email}`);
  } catch (error) {
    console.error("❌ Failed to send email:", error);
  }
};

export const createPaymentSession = async (req: Request, res: Response): Promise<void> => {
  try {
    const { amount, email } = req.body;

    if (!amount || !email) {
      res.status(400).json({ error: "Amount and email are required" });
      return;
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/success`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Donation to Upright Kids Foundation",
            },
            unit_amount: amount * 100,
          },
          quantity: 1,
        },
      ],
    });

  
    await sendEmailNotification(email, session.id);

    res.status(200).json({ sessionId: session.id });
  } catch (error: any) {
    console.error("Stripe Checkout Error:", error);
    res.status(500).json({ error: error.message || "Failed to create payment session" });
  }
};
