import { expireOldOrders } from "@/server/services/order.service";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await expireOldOrders();
    res.status(200).json({ message: "Expired orders processed." });
  } catch (error) {
    console.error("❌ Failed to expire orders:", error);
    res.status(500).json({ error: "Failed to process expired orders" });
  }
}
