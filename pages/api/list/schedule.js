import withCors from "@/utils/cors";
import { listItem } from "../../../utils/crud";

async function handler(req, res) {
  const method = req.method;
  const tableName = "schedule";

  try {
    if (method === "GET") {
      // Handle GET request by calling listItem with additional options
      return await listItem(tableName, req, res, { event: true });
    }

    // Return method not allowed for unsupported methods
    return res.status(405).json({ error: `Method ${method} Not Allowed` });
  } catch (error) {
    console.error("Error in schedule handler:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

export default withCors(handler);
