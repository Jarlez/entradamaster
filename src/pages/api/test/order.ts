import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/server/db/client";
import { z } from "zod";

// 📦 Schema da requisição
const createOrderSchema = z.object({
  userId: z.string().cuid(),
  eventId: z.string().cuid(),
  items: z.array(
    z.object({
      ticketCategoryId: z.string().cuid(),
      quantity: z.number().int().min(1),
    })
  ),
});

export default async function createOrderHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const input = createOrderSchema.parse(req.body);

    const [user, event] = await Promise.all([
      prisma.user.findUnique({ where: { id: input.userId } }),
      prisma.event.findUnique({ where: { id: input.eventId } }),
    ]);

    if (!user || !event) {
      return res.status(404).json({ message: "User or Event not found" });
    }

    const ticketCategories = await prisma.ticketCategory.findMany({
      where: {
        id: { in: input.items.map((item) => item.ticketCategoryId) },
        eventId: input.eventId,
      },
    });

    if (ticketCategories.length !== input.items.length) {
      return res.status(400).json({ message: "Invalid ticket category ID(s)" });
    }

    // 🧮 Cálculo do total
    let total = 0;
    const orderItems = input.items.map((item) => {
      const category = ticketCategories.find((tc) => tc.id === item.ticketCategoryId);
      if (!category) throw new Error("Invalid ticket category");
      total += category.price * item.quantity;
      return {
        ticketCategoryId: category.id,
        categoryId: category.id, // ⚠️ Ajuste se tiver Category separado
        price: category.price,
        quantity: item.quantity,
      };
    });

    const order = await prisma.order.create({
      data: {
        userId: input.userId,
        eventId: input.eventId,
        total,
        items: {
          createMany: {
            data: orderItems,
          },
        },
      },
      include: {
        items: true,
      },
    });

    return res.status(201).json({ order });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res
        .status(400)
        .json({ message: "Validation error", errors: err.errors });
    }

    console.error("❌ Create order error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
