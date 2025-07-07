// src/server/services/payment.service.ts

import { PaymentProvider } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { createStripePayment } from "./payments/stripe.service";

/**
 * Handles creation of a payment session based on the selected provider.
 * Currently supports Stripe only.
 */
export async function createPayment(
  provider: PaymentProvider,
  orderId: string,
  amount: number
) {
  switch (provider) {
    case PaymentProvider.STRIPE:
      return createStripePayment(orderId, amount);

    // Future provider integrations (e.g., MercadoPago, Pagotic) can be added here.

    default:
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: `Unsupported payment provider: ${provider}`,
      });
  }
}
