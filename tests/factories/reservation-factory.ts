import { User } from '@prisma/client';

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
