import type { Order, User, Seat, TicketCategory, OrderItem } from "@prisma/client";
import { formatPagoTICDate, addMinutes, generateExternalTransactionId } from "./pagotic.utils";
import type { CreatePagoPayload } from "./pagotic.schema";

export function buildPagoPayload(
  order: Order & {
    orderItems: (OrderItem & {
      seat: (Seat & { ticketCategory: TicketCategory }) | null;
    })[];
  },
  user: User
): CreatePagoPayload {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!appUrl) throw new Error("Missing NEXT_PUBLIC_APP_URL");
  if (!user.email) throw new Error("Usuário sem e-mail.");
  if (!user.dni) throw new Error("Usuário sem DNI.");

  const external_transaction_id = generateExternalTransactionId(order.id);

  // datas no formato exigido: yyyy-MM-dd'T'HH:mm:ssZ (offset sem “:”)
  const due_date = formatPagoTICDate(addMinutes(new Date(), 30));
  const last_due_date = formatPagoTICDate(addMinutes(new Date(), 60));

  const payload: CreatePagoPayload = {
    type: "online",
    return_url: `${appUrl}/payment/success`,
    back_url: `${appUrl}/payment/cancel`,
    notification_url: `${appUrl}/api/webhooks/pagotic`,

    number: order.id,
    external_transaction_id,
    due_date,
    last_due_date,

    // ✅ incluir moeda conforme doc
    currency_id: "ARS",

    payment_methods: [{ method: "credit" }],

    details: [
      {
        concept_id: "woocommerce",
        concept_description: `Compra de ingressos - Pedido ${order.id}`,
        amount: Number(order.total.toFixed(2)),
        external_reference: order.id,
      },
    ],

    payer: {
      name: user.name ?? "Comprador",
      email: user.email,
      identification: { type: "DNI", number: user.dni, country: "AR" },
    },
  };

  return payload;
}
