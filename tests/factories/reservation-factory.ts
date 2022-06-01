import dayjs from 'dayjs';
import faker from '@faker-js/faker';
import { Reservation, User } from '@prisma/client';
import { prisma } from '@/config';

import { createEnrollmentWithAddress, createUser } from '../factories';
import { ReservationInsertData } from '@/repositories/reservation-repository';

export async function createReservationData(): Promise<{
  user: User;
  reservationInsertData: ReservationInsertData;
}> {
  const user = await createUser();
  const enrollment = await createEnrollmentWithAddress(user);

  const reservationInsertData = {
    type: 'online',
    accommodation: false,
    enrollmentId: enrollment.id,
  };

  return {
    user,
    reservationInsertData,
  };

  // prisma.reservation.create({
  //   data: {
  //     title: params.title || faker.lorem.sentence(),
  //     backgroundImageUrl: params.backgroundImageUrl || faker.image.imageUrl(),
  //     logoImageUrl: params.logoImageUrl || faker.image.imageUrl(),
  //     startsAt: params.startsAt || dayjs().subtract(1, 'day').toDate(),
  //     endsAt: params.endsAt || dayjs().add(5, 'days').toDate(),
  //   },
  // });
}
