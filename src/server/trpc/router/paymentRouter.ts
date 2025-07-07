// src/server/trpc/router/paymentRouter.ts

import { createTRPCRouter, protectedProcedure } from "@/server/trpc/trpc";
import { createPayment } from "@/server/services/payment.service";
import { z } from "zod";

// Schema de entrada para criação de pagamento
const createPaymentSchema = z.object({
  provider: z.enum(["STRIPE"], {
    errorMap: () => ({ message: "Invalid payment provider (only STRIPE supported)." }),
  }),
  orderId: z.string().cuid({ message: "Invalid order ID format (CUID expected)." }),
  amount: z.number().positive({ message: "Amount must be a positive number." }),
});

export const paymentRouter = createTRPCRouter({
  // Cria um pagamento (apenas usuários autenticados)
  create: protectedProcedure
    .input(createPaymentSchema)
    .mutation(async ({ input }) => {
      return createPayment(input.provider, input.orderId, input.amount);
    }),
});
