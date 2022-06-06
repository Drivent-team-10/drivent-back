import bcrypt from 'bcrypt';
import faker from '@faker-js/faker';
import dayjs from 'dayjs';

import { insertOnlineReservation } from './reservation-factory';
import { prisma } from '@/config';

export async function createPaymentData() {
  const reservation = await insertOnlineReservation();

  const { user, insertedReservation } = reservation;

  const dateNow = new Date();

  const validDate = dayjs(dateNow).add(5, 'year').format('MM/YY');

  const paymentInsertData = {
    number: faker.finance.creditCardNumber('mastercard'),
    name: faker.finance.currencyName(),
    validThru: validDate,
    cvc: faker.finance.creditCardCVV(),
    reservationId: insertedReservation.id,
  };

  return {
    user,
    reservationId: insertedReservation.id,
    paymentInsertData,
  };
}

export async function insertPayment() {
  const payment = await createPaymentData();

  const { user, paymentInsertData } = payment;

  const insertData = {
    number: bcrypt.hashSync(paymentInsertData.number, 10),
    name: faker.finance.currencyName(),
    validThru: paymentInsertData.validThru,
    cvc: bcrypt.hashSync(paymentInsertData.cvc, 10),
    reservationId: paymentInsertData.reservationId,
  };

  const insertedPayment = await prisma.payment.create({
    data: insertData,
  });

  return {
    user,
    payment,
    insertedPayment,
  };
}
