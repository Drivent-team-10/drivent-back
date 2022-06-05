import { User } from '@prisma/client';
import { prisma } from '@/config';

import { createEnrollmentWithAddress, createUser } from '../factories';
import { ReservationInsertData } from '@/repositories/reservation-repository';
import { createEvent } from './events-factory';

export async function createOnlineReservationData(
  type: string,
  accommodation: boolean,
): Promise<{
  user: User;
  reservationInsertData: ReservationInsertData;
}> {
  const user = await createUser();
  const enrollment = await createEnrollmentWithAddress(user);
  const event = await createEvent();

  const amount = type === 'online' ? event.onlineEventValue : event.presentialEventValue;

  const reservationInsertData = {
    type,
    eventId: event.id,
    accommodation,
    enrollmentId: enrollment.id,
    amount,
  };

  return {
    user,
    reservationInsertData,
  };
}

export async function insertOnlineReservation() {
  const reservation = await createOnlineReservationData('online', false);

  const { user, reservationInsertData } = reservation;

  const insertedReservation = await prisma.reservation.create({
    data: reservationInsertData,
  });

  return {
    user,
    insertedReservation,
  };
}
