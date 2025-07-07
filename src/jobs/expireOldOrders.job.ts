// src/jobs/expireOldOrders.job.ts

import { prisma } from "@/server/db/client";
import { subMinutes } from "date-fns";
import { OrderStatus } from "@prisma/client";
import { logger } from "@/server/logging";

// 🔁 Atualiza status de pedidos PENDING criados há mais de 10 min para EXPIRED
export const expireOldOrdersJob = async () => {
  const threshold = subMinutes(new Date(), 10);

  try {
    const { count } = await prisma.order.updateMany({
      where: {
        status: OrderStatus.PENDING,
        createdAt: { lt: threshold },
      },
      data: { status: OrderStatus.EXPIRED },
    });

    if (count > 0) {
      logger.info(`🕒 Expired ${count} pending orders older than 10 minutes.`);
    }
  } catch (error) {
    logger.error("Failed to expire old orders", { error });
    throw error;
  }
};
