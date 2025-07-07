import { z } from "zod";

// Enum validation for OrderStatus (matches Prisma enum)
export const orderStatusEnum = z.enum(["PENDING", "PAID", "CANCELLED", "EXPIRED"]);
export type OrderStatus = z.infer<typeof orderStatusEnum>;

// Schema: Create Order
export const createOrderSchema = z.object({
  eventId: z
    .string()
    .cuid({ message: "Invalid event ID (expected CUID format)" }),

  items: z
    .array(
      z.object({
        categoryId: z
          .string()
          .cuid({ message: "Invalid category ID (expected CUID)" }),

        ticketCategoryId: z
          .string()
          .cuid({ message: "Invalid ticket category ID (expected CUID)" }),

        quantity: z
          .number()
          .int({ message: "Quantity must be an integer" })
          .min(1, { message: "Minimum quantity per item is 1" })
          .max(10, { message: "Maximum quantity per item is 10" }),
      })
    )
    .min(1, { message: "At least one item is required" }),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;

// Schema: Get Order by ID
export const getOrderSchema = z.object({
  id: z
    .string()
    .cuid({ message: "Invalid order ID (expected CUID format)" }),
});

export type GetOrderInput = z.infer<typeof getOrderSchema>;

// Schema: List Orders with pagination
export const listOrdersSchema = z.object({
  skip: z
    .number()
    .int({ message: "Skip must be an integer" })
    .min(0, { message: "Skip cannot be negative" })
    .optional(),

  take: z
    .number()
    .int({ message: "Take must be an integer" })
    .min(1, { message: "Minimum take is 1" })
    .optional(),
});

export type ListOrdersInput = z.infer<typeof listOrdersSchema>;
