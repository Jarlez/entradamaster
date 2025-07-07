// src/server/services/order.service.ts

import { prisma } from "../db/client";
import type { CreateOrderInput } from "../schema/order.schema";
import { TRPCError } from "@trpc/server";
import { OrderStatus } from "@prisma/client";

const MAX_TICKETS_PER_USER = 10;

// Create a new order with validated stock and user limits
export const createOrderService = async (
  input: CreateOrderInput,
  userId: string
) => {
  return prisma.$transaction(async (tx) => {
    const event = await tx.event.findUnique({
      where: { id: input.eventId },
    });

    if (!event) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Event not found.",
      });
    }

    const uniqueCategoryIds = new Set(
      input.items.map((item) => item.ticketCategoryId)
    );

    if (uniqueCategoryIds.size !== input.items.length) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Duplicate ticket categories are not allowed.",
      });
    }

    const ticketCategories = await tx.ticketCategory.findMany({
      where: {
        id: { in: [...uniqueCategoryIds] },
        eventId: input.eventId,
      },
    });

    if (ticketCategories.length !== uniqueCategoryIds.size) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "One or more ticket categories are invalid or do not belong to this event.",
      });
    }

    const ticketsAlreadyPurchased = await tx.orderItem.aggregate({
      _sum: { quantity: true },
      where: {
        order: {
          userId,
          eventId: input.eventId,
        },
      },
    });

    const totalRequested = input.items.reduce((sum, item) => sum + item.quantity, 0);
    const totalOwned = ticketsAlreadyPurchased._sum.quantity ?? 0;
    const totalAfter = totalOwned + totalRequested;

    if (totalAfter > MAX_TICKETS_PER_USER) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: `Purchase limit exceeded. Max ${MAX_TICKETS_PER_USER} tickets per user.`,
      });
    }

    const itemsData = input.items.map((item) => {
      const category = ticketCategories.find((c) => c.id === item.ticketCategoryId);
      if (!category) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Ticket category ${item.ticketCategoryId} is invalid.`,
        });
      }
      return {
        ...item,
        price: category.price,
      };
    });

    const total = itemsData.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return tx.order.create({
      data: {
        userId,
        eventId: input.eventId,
        total,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes from now
        items: {
          create: itemsData,
        },
      },
      include: {
        items: true,
      },
    });
  });
};

// Retrieve a single order with full nested data
export const getOrderByIdService = async (
  orderId: string,
  userId: string
) => {
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      userId,
    },
    include: {
      items: {
        include: {
          Ticket: true,
          category: true,
          TicketCategory: true,
        },
      },
      Payment: true,
      Invoice: true,
      event: true,
    },
  });

  if (!order) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: `No order found with ID ${orderId}`,
    });
  }

  return order;
};

// List all orders from a user with pagination
export const listOrdersService = async (
  userId: string,
  skip = 0,
  take = 10
) => {
  return prisma.order.findMany({
    where: { userId },
    skip,
    take,
    orderBy: { createdAt: "desc" },
    include: {
      items: {
        include: {
          Ticket: true,
          category: true,
          TicketCategory: true,
        },
      },
      Payment: true,
      Invoice: true,
      event: true,
    },
  });
};

// Expire all pending orders past their expiration date
export const expireOldOrders = async () => {
  const result = await prisma.order.updateMany({
    where: {
      status: OrderStatus.PENDING,
      expiresAt: { lte: new Date() },
    },
    data: { status: OrderStatus.EXPIRED },
  });

  if (result.count > 0) {
    console.log(`⏳ ${result.count} pending order(s) expired.`);
  }
};
