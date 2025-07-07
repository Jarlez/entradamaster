import { z } from "zod";

export const createEventSchema = z
  .object({
    name: z.string().min(3),
    slug: z.string().min(3).regex(/^[a-z0-9-]+$/, {
      message: "Slug must contain only lowercase letters, numbers, and hyphens",
    }),
    description: z.string().optional(),
    city: z.string().min(2),
    theater: z.string().min(2),
    date: z.string().datetime(),
    saleStart: z.string().datetime(),
    saleEnd: z.string().datetime(),
    capacity: z.number().min(1),
    organizerId: z.string().cuid("Invalid organizer ID"),
  })
  .refine((data) => new Date(data.saleStart) < new Date(data.saleEnd), {
    message: "Sale start must be before sale end",
    path: ["saleStart"],
  })
  .refine((data) => new Date(data.saleEnd) <= new Date(data.date), {
    message: "Sale end must be on or before event date",
    path: ["saleEnd"],
  });

export type CreateEventInput = z.infer<typeof createEventSchema>;
