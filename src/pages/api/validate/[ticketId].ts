// src/pages/api/ticket/[ticketId].ts

import { prisma } from "@/server/db/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { getServerAuthSessionApi } from "@/server/auth";
import { logger } from "@/server/logging";

const ticketIdSchema = z.string().cuid("Invalid ticket ID format (expected CUID)");
const deviceSchema = z.string().min(3, "Device identifier too short").max(100, "Device identifier too long");

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerAuthSessionApi(req, res);

  if (!session || session.user.role !== "ADMIN") {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const ticketId = req.query.ticketId as string;
  const device = req.body.device;

  const parsedTicketId = ticketIdSchema.safeParse(ticketId);
  const parsedDevice = deviceSchema.safeParse(device);

  if (!parsedTicketId.success) {
    return res.status(400).json({ message: parsedTicketId.error.message });
  }

  if (!parsedDevice.success) {
    return res.status(400).json({ message: parsedDevice.error.message });
  }

  try {
    const ticket = await prisma.ticket.findUnique({
      where: { id: parsedTicketId.data },
      include: {
        orderItem: {
          include: {
            order: {
              include: {
                user: true,
                event: true,
              },
            },
          },
        },
      },
    });

    if (!ticket) {
      return res.status(404).json({ valid: false, message: "Ticket not found" });
    }

    if (ticket.usedAt) {
      return res.status(200).json({
        valid: false,
        message: "Ticket already used",
        usedAt: ticket.usedAt,
      });
    }

    const now = new Date();

    await prisma.ticket.update({
      where: { id: parsedTicketId.data },
      data: {
        usedAt: now,
        validatedById: session.user.id,
        device: parsedDevice.data,
      },
    });

    logger.info(
      { ticketId: parsedTicketId.data, validatedBy: session.user.id, device: parsedDevice.data },
      "✅ Ticket validated successfully"
    );

    return res.status(200).json({
      valid: true,
      ticketId: parsedTicketId.data,
      usedAt: now,
      device: parsedDevice.data,
      validatedById: session.user.id,
      user: {
        name: ticket.orderItem.order.user.name,
        email: ticket.orderItem.order.user.email,
      },
      event: {
        name: ticket.orderItem.order.event.name,
        date: ticket.orderItem.order.event.date,
      },
    });
  } catch (error) {
    logger.error({ error, ticketId }, "❌ Failed to validate ticket");
    return res.status(500).json({ message: "Internal server error during ticket validation" });
  }
}
