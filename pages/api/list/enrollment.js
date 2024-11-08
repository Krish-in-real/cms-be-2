import withCors from "@/utils/cors";
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

// Helper function to decode participant from token
async function getParticipantFromToken(participantToken) {
  try {
    const decoded = jwt.verify(participantToken, process.env.JWT_SECRET_KEY);
    const participant = await prisma.participant.findUnique({
      where: {
        email: decoded.email,
      },
    });

    if (!participant) {
      throw new Error("Participant not found");
    }

    return participant;
  } catch (error) {
    throw new Error("Invalid participant token or authentication failed");
  }
}

async function handler(req, res) {
  const method = req.method;

  // Extract token from authorization header
  const participantToken = req.headers.authorization?.split(" ")[1];

  if (!participantToken) {
    return res.status(400).json({ error: 'Participant token is required in authorization header' });
  }

  try {
    // Get participant data based on token
    const participant = await getParticipantFromToken(participantToken);
    const participantId = participant.participantId;

    if (method === 'POST') {
      // Register participant for an event
      const { eventId } = req.body;

      if (!eventId) {
        return res.status(400).json({ error: 'Event ID is required' });
      }

      const enrollments = await prisma.enrollment.findMany({
        where: {
          participantId: participantId,
        },
      });

      const isAlreadyEnrolled = enrollments.some((enrollment) => enrollment.eventId === eventId);

      if (isAlreadyEnrolled) {
        return res.status(400).json({ error: 'Participant already enrolled in this event' });
      }

      const newEnrollment = await prisma.enrollment.create({
        data: {
          participantId: participantId,
          eventId,
          registrationDate: new Date(),
          ticketType: 'regular', // default ticket type or pass as needed
        },
      });

      return res.status(201).json({ message: 'Registration successful', enrollment: newEnrollment });

    } else if (method === "GET") {
      // Fetch participant enrollments
      const enrollments = await prisma.enrollment.findMany({
        where: {
          participantId: participantId,
        }
      });

      return res.status(200).json(enrollments);
    }

    return res.status(405).json({ error: `Method ${method} Not Allowed` });

  } catch (error) {
    console.error(error);
    return res.status(401).json({ error: error.message });
  }
}

export default withCors(handler);
