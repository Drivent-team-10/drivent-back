import { PaymentInsertData } from '@/repositories/payment-repository';
import Joi from 'joi';

export const createPaymentSchema = Joi.object<PaymentInsertData>({
  number: Joi.string().length(19).required(),
  name: Joi.string().max(45).required(),
  validThru: Joi.string().length(5).required(),
  cvc: Joi.string().length(3).required(),
  reservationId: Joi.number().required(),
});
