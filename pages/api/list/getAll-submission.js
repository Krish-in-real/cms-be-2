import { listItem } from "../../../utils/crud";

export default async function handler(req, res) {
  const method = req.method;
  const tableName = "submission";

  try {
    if (method === "GET") {
      // Handle GET request by calling listItem
      return await listItem(tableName, req, res);
    }

    // Return method not allowed for unsupported methods
    return res.status(405).json({ error: `Method ${method} Not Allowed` });
  } catch (error) {
    console.error("Error in submission handler:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
