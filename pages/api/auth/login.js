import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { generateToken } from "../../../utils/services/auth";
import withCors from "@/utils/cors";

const prisma = new PrismaClient();

async function handler(req, res) {
  if (req.method === "POST") {
    const { email, password } = req.body;

    // Find participant by email
    const participant = await prisma.participant.findUnique({
      where: { email },
    });

    // If no participant is found, return error
    if (!participant) {
      return res.status(404).json({ message: "Invalid credentials" });
    }

    // Compare the provided password with the hashed password stored in the database
    const passwordMatches = await bcrypt.compare(password, participant.password);

    if (passwordMatches) {
      // Generate a token and send the response
      const token = generateToken(email);
      return res.status(200).json({
        status: "Success",
        message: "Login successful",
        role: participant.role,
        participantId: participant.participantId,
        token: token
      });
    } else {
      return res.status(404).json({ message: "Invalid credentials" });
    }
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}

export default withCors(handler);
