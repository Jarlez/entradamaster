import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/server/db/client";
import { z } from "zod";

const createTicketCategorySchema = z.object({
  title: z.string().min(3),
  price: z.number().positive(),
  stock: z.number().int().min(1),
  eventId: z.string().cuid("Invalid event ID"),
});

export default async function createTicketCategoryHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const input = createTicketCategorySchema.parse(req.body);

    const event = await prisma.event.findUnique({
      where: { id: input.eventId },
    });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const ticketCategory = await prisma.ticketCategory.create({
      data: {
        title: input.title,
        price: input.price,
        stock: input.stock,
        event: {
          connect: { id: input.eventId },
        },
      },
    });

    return res.status(201).json({ ticketCategory });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res
        .status(400)
        .json({ message: "Validation error", errors: err.errors });
    }

    console.error("❌ Create ticket category error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
