import { prisma } from "@/server/db/client";
import { TRPCError } from "@trpc/server";
import { generateTicketAssets } from "./ticket/ticketGeneration.service";

// Generate and persist a ticket with assets (QR, PDF, Wallet)
export async function generateAndSaveTicket(
  orderItemId: string,
  orderId: string,
  userName?: string
) {
  if (!orderItemId || !orderId) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Missing orderItemId or orderId.",
    });
  }

  try {
    const assets = await generateTicketAssets(orderId, prisma, { orderId, userName });

    return await prisma.ticket.create({
      data: {
        orderItemId,
        qrCodeUrl: assets.qrCodeUrl,
        pdfUrl: assets.pdfUrl,
        walletPassUrl: assets.walletPassUrl,
      },
    });
  } catch (error) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to generate and save ticket.",
      cause: error,
    });
  }
}

// Generate all tickets for a given order
export async function generateTicketsFromOrder(order: {
  id: string;
  items: { id: string; quantity: number }[];
}) {
  try {
    const createdTickets = await Promise.all(
      order.items.flatMap((item) =>
        Array.from({ length: item.quantity }).map(() =>
          generateAndSaveTicket(item.id, order.id)
        )
      )
    );

    return createdTickets;
  } catch (error) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to generate tickets from order.",
      cause: error,
    });
  }
}

// List all tickets for a given order item
export async function getTicketsByOrderItemService(orderItemId: string) {
  if (!orderItemId) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Missing orderItemId",
    });
  }

  return prisma.ticket.findMany({
    where: { orderItemId },
  });
}

// Mark a ticket as used (entrance validation)
export async function markTicketAsUsedService(ticketId: string) {
  if (!ticketId) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Missing ticketId",
    });
  }

  const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } });

  if (!ticket) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Ticket not found.",
    });
  }

  if (ticket.usedAt) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Ticket has already been used.",
    });
  }

  return prisma.ticket.update({
    where: { id: ticketId },
    data: { usedAt: new Date() },
  });
}

// Validate a ticket using its QR code ID (from the URL)
export async function validateTicketByQrService(qrCodeId: string) {
  if (!qrCodeId || typeof qrCodeId !== "string") {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Invalid QR Code ID",
    });
  }

  const ticket = await prisma.ticket.findFirst({
    where: {
      qrCodeUrl: {
        contains: qrCodeId,
      },
    },
    include: {
      orderItem: {
        include: {
          order: {
            include: {
              event: true,
              user: true,
            },
          },
        },
      },
    },
  });

  if (!ticket) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Ticket not found.",
    });
  }

  if (ticket.usedAt) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Ticket has already been used.",
    });
  }

  const usedAt = new Date();

  await prisma.ticket.update({
    where: { id: ticket.id },
    data: { usedAt },
  });

  return {
    status: "valid",
    usedAt,
    ticketId: ticket.id,
    eventName: ticket.orderItem.order.event.name,
    userEmail: ticket.orderItem.order.user.email,
  };
}
