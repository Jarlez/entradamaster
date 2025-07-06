import type { NextApiRequest, NextApiResponse } from "next";
import { buffer } from "micro";
import Stripe from "stripe";
import { handleStripeWebhook } from "@/server/services/payments/stripe.service";
import { env } from "@/env/server.mjs";

const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-06-30.basil",
  typescript: true,
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).end("Method Not Allowed");
  }

  const buf = await buffer(req);
  const sig = req.headers["stripe-signature"];
  let event: Stripe.Event;

  try {
    if (process.env.NODE_ENV === "production") {
      if (!sig || typeof sig !== "string") {
        throw new Error("Missing Stripe signature header.");
      }

      event = stripe.webhooks.constructEvent(buf, sig, env.STRIPE_WEBHOOK_SECRET);
    } else {
      // Em desenvolvimento, parseia diretamente o corpo como JSON
      event = JSON.parse(buf.toString()) as Stripe.Event;
    }
  } catch (err) {
    console.error("❌ Stripe signature verification failed:", err);
    return res.status(400).send(`Webhook Error: ${(err as Error).message}`);
  }

  try {
    await handleStripeWebhook(event);
    res.status(200).json({ received: true });
  } catch (err) {
    console.error("❌ Stripe webhook handler failed:", err);
    res.status(500).send("Webhook handler failed.");
  }
}
