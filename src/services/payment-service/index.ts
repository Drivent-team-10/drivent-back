import bcrypt from 'bcrypt';
import dayjs from 'dayjs';

import { conflictError, forbiddenError, notFoundError } from '@/errors';
import paymentRepository, { PaymentInsertData } from '@/repositories/payment-repository';
import { Payment } from '@prisma/client';
import reservationService from '../reservation-service';

async function verifyExpirationDate(expirationDate: string): Promise<void> {
  const now = dayjs().format('MM/YY');
  const isExpired = dayjs(now) > dayjs(expirationDate);

  if (isExpired) {
    throw forbiddenError('Date expired!');
  }
}

async function createNewPayment(paymentData: PaymentInsertData): Promise<Payment> {
  const { number, name, validThru, cvc, reservationId } = paymentData;

  const reservation = await reservationService.findReservationById(reservationId);

  if (!reservation) {
    throw notFoundError();
  }

  const paymentSearch = await paymentRepository.findPaymentByReservationId(reservationId);

  if (paymentSearch) {
    throw conflictError('Payment already made');
  }

  await verifyExpirationDate(validThru);

  const hashNumber = bcrypt.hashSync(number, 10);

  const hashCvc = bcrypt.hashSync(cvc, 10);

  const payment: Payment = await paymentRepository.createPayment({
    number: hashNumber,
    name,
    validThru,
    cvc: hashCvc,
    reservationId,
  });

  return payment;
}

const paymentService = {
  createNewPayment,
};

export default paymentService;
