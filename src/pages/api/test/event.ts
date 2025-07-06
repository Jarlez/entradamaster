import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/server/db/client";
import { z } from "zod";

const createEventSchema = z.object({
  name: z.string().min(3),
  slug: z.string().min(3),
  description: z.string().optional(),
  city: z.string().min(2),
  theater: z.string().min(2),
  price: z.number().positive(),
  date: z.string().datetime(),
  saleStart: z.string().datetime(),
  saleEnd: z.string().datetime(),
  capacity: z.number().min(1),
  organizerId: z.string().cuid("Invalid organizer ID"),
});

export default async function createEventHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const input = createEventSchema.parse(req.body);

    const organizer = await prisma.user.findUnique({
      where: { id: input.organizerId },
    });

    if (!organizer || organizer.role !== "ORGANIZER") {
      return res.status(400).json({ message: "Invalid organizer" });
    }

    const event = await prisma.event.create({
      data: {
        name: input.name,
        slug: input.slug,
        description: input.description ?? "",
        city: input.city,
        theater: input.theater,
        price: input.price,
        date: new Date(input.date),
        saleStart: new Date(input.saleStart),
        saleEnd: new Date(input.saleEnd),
        capacity: input.capacity,
        status: "DRAFT",
        user: {
          connect: { id: input.organizerId },
        },
      },
    });

    return res.status(201).json({ event });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ message: "Validation error", errors: err.errors });
    }

    console.error("❌ Create event error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
