import { prisma } from '@/config';
import { Reservation } from '@prisma/client';

export type ReservationInsertData = Omit<Reservation, 'id' | 'createdAt' | 'updatedAt'>;

async function createReservation(reservationData: ReservationInsertData): Promise<Reservation> {
  return prisma.reservation.create({
    data: reservationData,
  });
}

async function findById(id: number): Promise<Reservation> {
  return prisma.reservation.findFirst({
    where: { id },
  });
}

const reservationRepository = {
  createReservation,
  findById,
};

export default reservationRepository;
