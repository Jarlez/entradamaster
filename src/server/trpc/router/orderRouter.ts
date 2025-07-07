// src/server/trpc/router/orderRouter.ts

import { createTRPCRouter, protectedProcedure } from "../trpc";
import {
  createOrderSchema,
  getOrderSchema,
  listOrdersSchema,
} from "@/server/schema/order.schema";
import {
  createOrderService,
  getOrderByIdService,
  listOrdersService,
} from "@/server/services/order.service";

// tRPC router for orders (authenticated only)
export const orderRouter = createTRPCRouter({
  // Create a new order (authenticated user only)
  createOrder: protectedProcedure
    .input(createOrderSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      return createOrderService(input, userId);
    }),

  // Get a single order by ID (only if it belongs to current user)
  getOrder: protectedProcedure
    .input(getOrderSchema)
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      return getOrderByIdService(input.id, userId);
    }),

  // List all orders from current user, with optional pagination
  listOrders: protectedProcedure
    .input(listOrdersSchema)
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const skip = input.skip ?? 0;
      const take = Math.min(input.take ?? 10, 50); // Segurança: máximo de 50 registros por página
      return listOrdersService(userId, skip, take);
    }),
});
