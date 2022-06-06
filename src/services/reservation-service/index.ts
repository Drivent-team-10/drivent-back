import { notFoundError } from '@/errors';
import reservationRepository from '@/repositories/reservation-repository';
import { Reservation } from '@prisma/client';
import enrollmentsService from '../enrollments-service';
import eventsService from '../events-service';

export type ReservationType = 'online' | 'presential';

export interface ReservationData {
  type: ReservationType;
  accommodation: boolean;
  userId: number;
}

async function createNewReservation(reservationData: ReservationData) {
  const { type, accommodation, userId } = reservationData;

  const enrollment = await enrollmentsService.findEnrollmentByUserId(userId);

  if (!enrollment) {
    throw notFoundError();
  }

  const event = await eventsService.getFirstEvent(); // Because the application manages only one event at the moment

  const amount = type === 'online' ? event.onlineEventValue : event.presentialEventValue;

  const reservation: Reservation = await reservationRepository.createReservation({
    type,
    accommodation,
    enrollmentId: enrollment.id,
    eventId: event.id,
    amount,
  });

  return reservation;
}

async function findReservationById(id: number) {
  const reservation = await reservationRepository.findById(id);

  if (!reservation) {
    throw notFoundError();
  }

  return reservation;
}

const reservationService = {
  createNewReservation,
  findReservationById,
};

export default reservationService;
