import reservationService from '@/services/reservation-service';
import { Request, Response } from 'express';
import httpStatus from 'http-status';

export async function reservationsPost(req: Request, res: Response) {
  const { type, accommodation, enrollmentId } = req.body;

  const reservation = await reservationService.createNewReservation({ type, accommodation, enrollmentId });
  res.status(httpStatus.CREATED).json(reservation);
}
