// src/server/services/ticketGeneration.service.ts

import { createWriteStream, existsSync, mkdirSync } from "fs";
import path from "path";
import QRCode from "qrcode";
import PDFDocument from "pdfkit";
import { createId } from "@paralleldrive/cuid2";
import { logger } from "@/server/logging";
import type { Prisma } from "@prisma/client";

type TicketAsset = {
  qrCodeUrl: string;
  pdfUrl: string;
  walletPassUrl?: string;
};

interface TicketData {
  orderId: string;
  userName?: string;
}

/**
 * 🎟️ Generates QR code + PDF assets for a ticket.
 * Output: /public/tickets/<ticketId>-qr.png and <ticketId>.pdf
 */
export async function generateTicketAssets(
  orderId: string,
  tx: Prisma.TransactionClient,
  ticketData: TicketData
): Promise<TicketAsset> {
  const ticketId = createId();
  const ticketsDir = path.join(process.cwd(), "public", "tickets");

  // Ensure directory exists
  try {
    if (!existsSync(ticketsDir)) {
      mkdirSync(ticketsDir, { recursive: true });
      logger.info("📁 Created directory: /public/tickets");
    }
  } catch (err) {
    logger.error("❌ Failed to create tickets directory:", err);
    throw new Error("Ticket directory initialization failed.");
  }

  // === Generate QR Code ===
  const qrFilename = `${ticketId}-qr.png`;
  const qrPath = path.join(ticketsDir, qrFilename);
  const qrCodeUrl = `/tickets/${qrFilename}`;
  const qrContent = `https://entrada.app/validate/${ticketId}`;

  try {
    await QRCode.toFile(qrPath, qrContent);
  } catch (err) {
    logger.error("❌ QR code generation failed:", err);
    throw new Error("QR code generation failed.");
  }

  // === Generate PDF ===
  const pdfFilename = `${ticketId}.pdf`;
  const pdfPath = path.join(ticketsDir, pdfFilename);
  const pdfUrl = `/tickets/${pdfFilename}`;

  try {
    const doc = new PDFDocument();
    const stream = createWriteStream(pdfPath);
    doc.pipe(stream);

    doc.fontSize(20).text("🎫 EntradaMaster Ticket", { underline: true });
    doc.moveDown();
    doc.fontSize(12).text(`Order ID: ${ticketData.orderId}`);
    if (ticketData.userName) {
      doc.text(`Name: ${ticketData.userName}`);
    }

    doc.image(qrPath, {
      width: 150,
      align: "center",
    });

    doc.end();

    // Wait for stream to finish writing PDF
    await new Promise<void>((resolve, reject) => {
      stream.on("finish", resolve);
      stream.on("error", reject);
    });
  } catch (err) {
    logger.error("❌ PDF ticket generation failed:", err);
    throw new Error("PDF generation failed.");
  }

  logger.info({ ticketId, qrCodeUrl, pdfUrl }, "✅ Ticket assets generated");

  return {
    qrCodeUrl,
    pdfUrl,
    walletPassUrl: undefined, // Placeholder for future .pkpass
  };
}
