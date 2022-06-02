import { AuthenticatedRequest } from '@/middlewares';
import reservationService from '@/services/reservation-service';
import { Response } from 'express';
import httpStatus from 'http-status';

export async function reservationsPost(req: AuthenticatedRequest, res: Response) {
  const { type, accommodation } = req.body;
  const { userId } = req;

  const reservation = await reservationService.createNewReservation({ type, accommodation: !!accommodation, userId });
  res.status(httpStatus.CREATED).json(reservation);
}
