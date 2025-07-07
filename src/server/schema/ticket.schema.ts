import { z } from "zod";

/**
 * Schema: Criação de Ticket
 * Exige pelo menos uma URL (PDF ou Wallet Pass) além do QR Code
 */
export const createTicketSchema = z
  .object({
    orderItemId: z
      .string()
      .cuid({ message: "ID do item do pedido inválido (esperado CUID)" }),

    qrCodeUrl: z
      .string()
      .url({ message: "QR Code URL inválido" }),

    pdfUrl: z
      .string()
      .url({ message: "URL do PDF inválida" })
      .optional(),

    walletPassUrl: z
      .string()
      .url({ message: "URL do Wallet Pass inválida" })
      .optional(),
  })
  .refine((data) => data.pdfUrl || data.walletPassUrl, {
    message: "Pelo menos um formato (PDF ou Wallet Pass) deve ser fornecido.",
    path: ["pdfUrl", "walletPassUrl"],
  });

export type CreateTicketInput = z.infer<typeof createTicketSchema>;

// Schema: Buscar Tickets por OrderItem
export const getTicketsByOrderItemSchema = z.object({
  orderItemId: z
    .string()
    .cuid({ message: "ID do item do pedido inválido (esperado CUID)" }),
});

export type GetTicketsByOrderItemInput = z.infer<
  typeof getTicketsByOrderItemSchema
>;

// Schema: Marcar Ticket como usado
export const markTicketAsUsedSchema = z.object({
  ticketId: z
    .string()
    .cuid({ message: "ID do ingresso inválido (esperado CUID)" }),
});

export type MarkTicketAsUsedInput = z.infer<typeof markTicketAsUsedSchema>;

// Schema: Validar ingresso por QR Code
export const validateTicketSchema = z.object({
  qrCodeId: z
    .string()
    .min(8, { message: "QR Code inválido — mínimo 8 caracteres" })
    .max(64, { message: "QR Code inválido — máximo 64 caracteres" }),
});

export type ValidateTicketInput = z.infer<typeof validateTicketSchema>;
