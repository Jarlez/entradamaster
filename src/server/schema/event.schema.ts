import { z } from "zod";

export const createEventSchema = z.object({
  name: z.string().min(3),
  slug: z.string().min(3),
  description: z.string().optional(),
  city: z.string().min(2),
  theater: z.string().min(2),
  price: z.number().min(0),
  date: z.string().datetime(),
  saleStart: z.string().datetime(),
  saleEnd: z.string().datetime(),
  capacity: z.number().min(1),
  organizerId: z.string().cuid("Invalid organizer ID"),
});

export type CreateEventInput = z.infer<typeof createEventSchema>;
