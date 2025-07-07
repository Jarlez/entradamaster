// src/jobs/expireOldOrders.job.ts

import { prisma } from "@/server/db/client";
import { subMinutes } from "date-fns";

// 🔁 Atualiza status de pedidos PENDING criados há mais de 10 min para EXPIRED
export const expireOldOrdersJob = async () => {
  const threshold = subMinutes(new Date(), 10);

  const { count } = await prisma.order.updateMany({
    where: {
      status: "PENDING",
      createdAt: { lt: threshold },
    },
    data: { status: "EXPIRED" },
  });

  if (count > 0) {
    console.log(`🕒 Expired ${count} pending orders older than 10 minutes.`);
  }
};
