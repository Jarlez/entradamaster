// src/server/trpc/router/ticketRouter.ts

import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/trpc/trpc";

import {
  getTicketsByOrderItemSchema,
  markTicketAsUsedSchema,
} from "@/server/schema/ticket.schema";

import {
  generateAndSaveTicket,
  getTicketsByOrderItemService,
  markTicketAsUsedService,
  validateTicketByQrService,
} from "@/server/services/ticket.service";

export const ticketRouter = createTRPCRouter({
  // Generate a new ticket and save assets (QR, PDF, Wallet)
  create: protectedProcedure
    .input(
      z.object({
        orderItemId: z.string().cuid("Invalid orderItemId"),
        orderId: z.string().cuid("Invalid orderId"),
        userName: z.string().optional(),
      })
    )
    .mutation(({ input }) =>
      generateAndSaveTicket(input.orderItemId, input.orderId, input.userName)
    ),

  // Get all tickets by order item ID
  getByOrderItem: protectedProcedure
    .input(getTicketsByOrderItemSchema)
    .query(({ input }) =>
      getTicketsByOrderItemService(input.orderItemId)
    ),

  // Mark a ticket as used
  markAsUsed: protectedProcedure
    .input(markTicketAsUsedSchema)
    .mutation(({ input }) =>
      markTicketAsUsedService(input.ticketId)
    ),

  // Validate ticket by QR ID (public for entrance scanning)
  validateByQrId: publicProcedure
    .input(
      z.object({
        qrId: z.string().min(1, "QR ID is required"),
      })
    )
    .mutation(({ input }) =>
      validateTicketByQrService(input.qrId)
    ),
});
