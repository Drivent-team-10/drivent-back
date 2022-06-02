import { ReservationInsertData } from '@/repositories/reservation-repository';
import Joi from 'joi';

export const createReservationSchema = Joi.object<ReservationInsertData>({
  type: Joi.string()
    .pattern(/^online$|^presential$/)
    .required(),
  accommodation: Joi.boolean(),
});
