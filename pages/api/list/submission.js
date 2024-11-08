import withCors from "@/utils/cors";
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

async function handler(req, res) {
  const method = req.method;
  const tableName = "submission";

  if (method === "GET") {
    const participantToken = req.headers.authorization?.split(" ")[1];

    if (!participantToken) {
      return res.status(400).json({ error: 'Participant token is required in authorization header' });
    }

    try {
      const decoded = jwt.verify(participantToken, process.env.JWT_SECRET_KEY);

      const email = decoded.email;

      // Fetch participant details using email
      const participant = await prisma.participant.findUnique({
        where: {
          email: email,
        },
      });

      if (!participant) {
        return res.status(404).json({ error: "Participant not found" });
      }

      const participantId = participant.participantId;

      // Fetch all submissions except the user's own submission
      const submissions = await prisma.submission.findMany({
        where: {
          participantId: {
            not: participantId,  // Exclude submissions from the current user
          },
        },
      });

      return res.status(200).json(submissions);
    } catch (error) {
      console.error("Error in fetching submissions:", error);
      return res.status(401).json({ error: 'Invalid participant token or authentication failed' });
    }
  }

  // Return method not allowed if the method is not GET
  return res.status(405).json({ error: `Method ${method} Not Allowed` });
}

export default withCors(handler);
