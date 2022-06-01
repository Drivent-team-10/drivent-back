import { notFoundError } from '@/errors';
import reservationRepository, { ReservationInsertData } from '@/repositories/reservation-repository';
import { Reservation } from '@prisma/client';
import enrollmentsService from '../enrollments-service';

async function createNewReservation(reservationData: ReservationInsertData) {
  const { enrollmentId } = reservationData;

  const enrollment = await enrollmentsService.findEnrollmentById(enrollmentId);

  if (!enrollment) {
    throw notFoundError();
  }

  const reservation: Reservation = await reservationRepository.createReservation(reservationData);

  return reservation;
}

const reservationService = {
  createNewReservation,
};

export default reservationService;
