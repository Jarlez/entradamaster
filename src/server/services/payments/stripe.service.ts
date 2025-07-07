// src/server/services/payments/stripe.service.ts

import Stripe from "stripe";
import { prisma } from "@/server/db/client";
import { toJsonValue } from "@/utils/toJsonValue";
import { TRPCError } from "@trpc/server";
import { PaymentProvider, PaymentStatus, OrderStatus } from "@prisma/client";
import { generateTicketsFromOrder } from "@/server/services/ticket.service";
import { env } from "@/env/server.mjs";

if (!env.STRIPE_SECRET_KEY) {
  throw new Error(" STRIPE_SECRET_KEY is not defined in environment variables.");
}

const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-06-30.basil",
  typescript: true,
});

// Cria um PaymentIntent do Stripe com metadata
export async function createStripePayment(orderId: string, amount: number) {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe usa centavos
      currency: "ars",
      metadata: { orderId },
    });

    if (!paymentIntent.client_secret) {
      throw new Error("Stripe did not return a client_secret.");
    }

    const payment = await prisma.payment.create({
      data: {
        orderId,
        provider: PaymentProvider.STRIPE,
        status: PaymentStatus.PENDING,
        amount,
        rawResponse: toJsonValue(paymentIntent),
      },
    });

    return {
      clientSecret: paymentIntent.client_secret,
      paymentId: payment.id,
    };
  } catch (error) {
    console.error(" Failed to create Stripe payment:", error);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to create payment session.",
      cause: error,
    });
  }
}

//  Processa o webhook do Stripe (payment_intent.succeeded)
export async function handleStripeWebhook(event: Stripe.Event) {
  // Armazena o webhook recebido para rastreamento
  await prisma.webhookLog.create({
    data: {
      provider: "stripe",
      eventType: event.type,
      payload: toJsonValue(event),
    },
  });

  if (event.type !== "payment_intent.succeeded") {
    console.log(` Unhandled Stripe event: ${event.type}`);
    return;
  }

  const intent = event.data.object as Stripe.PaymentIntent;
  const orderId = intent?.metadata?.orderId;

  if (!orderId || typeof orderId !== "string") {
    console.warn(" Webhook missing metadata.orderId.");
    throw new Error("Invalid Stripe webhook: no orderId metadata.");
  }

  try {
    await prisma.$transaction(async (tx) => {
      // Atualiza status do pagamento
      await tx.payment.updateMany({
        where: {
          orderId,
          provider: PaymentProvider.STRIPE,
        },
        data: {
          status: PaymentStatus.APPROVED,
        },
      });

      // Atualiza status do pedido para PAID
      const order = await tx.order.update({
        where: { id: orderId },
        data: { status: OrderStatus.PAID },
        include: {
          user: true,
          items: true,
        },
      });

      // Geração de ingressos (assíncrono por segurança)
      await generateTicketsFromOrder({
        id: orderId,
        items: order.items.map((item) => ({
          id: item.id,
          quantity: item.quantity,
        })),
      });

      console.log(` Payment processed and tickets generated for order ${orderId}`);
    });
  } catch (err) {
    console.error(" Error processing Stripe webhook:", err);
    throw new Error("Stripe webhook processing failed.");
  }
}
