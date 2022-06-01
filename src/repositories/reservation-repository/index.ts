import { prisma } from '@/config';
import { Reservation } from '@prisma/client';

export type ReservationInsertData = Omit<Reservation, 'id' | 'createdAt' | 'updatedAt'>;

async function createReservation(reservationData: ReservationInsertData): Promise<Reservation> {
  return prisma.reservation.create({
    data: reservationData,
  });
}

const reservationRepository = {
  createReservation,
};

export default reservationRepository;
