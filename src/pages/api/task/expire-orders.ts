// src/pages/api/task/expire-orders.ts

import type { NextApiRequest, NextApiResponse } from "next";
import { expireOldOrdersJob } from "@/jobs/expireOldOrders.job";
import { logger } from "@/server/logging";

// 🔐 Endpoint seguro para rodar o job via cron (requer x-api-key)
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = req.headers["x-api-key"];

  if (apiKey !== process.env.INTERNAL_TASK_SECRET) {
    return res.status(403).json({ error: "Unauthorized" });
  }

  try {
    await expireOldOrdersJob();
    return res.status(200).json({ message: "✅ Expired old orders successfully" });
  } catch (error) {
    logger.error("❌ Failed to expire orders", { error });
    return res.status(500).json({ error: "Failed to process expired orders" });
  }
}
