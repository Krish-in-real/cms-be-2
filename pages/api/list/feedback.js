import { listItem } from "../../../utils/crud";

export default async function handler(req, res) {
  const method = req.method;
  const tableName = "feedback";

  try {
    if (method === "GET") {
      // Delegate the GET request handling to listItem
      return await listItem(tableName, req, res);
    }

    // Return method not allowed for unsupported methods
    return res.status(405).json({ error: `Method ${method} Not Allowed` });

  } catch (error) {
    console.error("Error in feedback handler:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}




//rating comments in feedback rating comment evaluator id(participant id)  submissionId 