import { listItem } from "../../../utils/crud";

export default async function handler(req, res) {
  const method = req.method;
  const tableName = "user";

  if (method === "GET") {
    try {
      return listItem(tableName, req, res);  // Handle the GET request for "user"
    } catch (error) {
      console.error('Error fetching user data:', error);
      return res.status(500).json({ error: 'An error occurred while fetching user data' });
    }
  }

  return res.status(405).json({ error: `Method ${method} Not Allowed` });  // Handle unsupported methods
}
