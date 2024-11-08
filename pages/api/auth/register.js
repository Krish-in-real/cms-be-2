import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { firstName, lastName, email, password, role, description, expertise } = req.body;

    // Check if the email is already registered
    const existingParticipant = await prisma.participant.findUnique({
      where: { email },
    });

    if (existingParticipant) {
      return res.status(400).json({ message: "Email is already in use" });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      // Create new participant
      const participant = await prisma.participant.create({
        data: {
          firstName,
          lastName,
          email,
          password: hashedPassword,
          role,
          description,
          expertise,
        },
      });

      return res.status(201).json({ message: "Registration Successful", participantId: participant.participantId });
    } catch (error) {
      return res.status(500).json({ message: "Error creating participant", error: error.message });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
