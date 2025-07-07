// src/server/schemas/payment.schema.ts
import { z } from "zod";

const cuidMessage = "Invalid order ID format (CUID expected)";
const providerMessage = "Invalid payment provider (only STRIPE supported currently)";

// 🔁 Reusable JSON object validator
const jsonObject = z.record(z.unknown()).refine(
  (val) => typeof val === "object" && val !== null,
  { message: "Expected a valid JSON object." }
);

// ✅ Schema for creating a payment session
export const createPaymentSchema = z.object({
  orderId: z.string().cuid({ message: cuidMessage }),

  provider: z.enum(["STRIPE"], {
    errorMap: () => ({ message: providerMessage }),
  }),

  amount: z
    .number()
    .positive({ message: "Payment amount must be a positive number." }),
});

export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;

// ✅ Used to persist raw response from provider
export const internalPaymentPersistenceSchema = z.object({
  rawResponse: jsonObject,
});

// ✅ Used to fetch payment by order ID
export const getPaymentByOrderIdSchema = z.object({
  orderId: z.string().cuid({ message: cuidMessage }),
});

export type GetPaymentByOrderIdInput = z.infer<typeof getPaymentByOrderIdSchema>;

// ✅ Payload used internally for webhook processing
export const paymentWebhookSchema = z.object({
  provider: z.enum(["STRIPE"], {
    errorMap: () => ({ message: "Invalid webhook provider" }),
  }),

  payload: jsonObject,
});

export type PaymentWebhookInput = z.infer<typeof paymentWebhookSchema>;
