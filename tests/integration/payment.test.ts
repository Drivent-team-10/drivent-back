import app, { init } from '@/app';
import supertest from 'supertest';
import * as jwt from 'jsonwebtoken';

import { cleanDb, generateValidToken } from '../helpers';
import httpStatus from 'http-status';
import faker from '@faker-js/faker';
import { createPaymentData, insertPayment } from '../factories/payment-factory';
import dayjs from 'dayjs';

beforeAll(async () => {
  await init();
  await cleanDb();
});

const server = supertest(app);

describe('POST /reservations/:id/payment', () => {
  beforeEach(async () => {
    await cleanDb();
  });

  it('should respond with status 401 if no token is given', async () => {
    const payment = await createPaymentData();
    const { reservationId, paymentInsertData } = payment;

    const response = await server.post(`/reservations/${reservationId}/payment`).send({
      ...paymentInsertData,
    });

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const payment = await createPaymentData();
    const { reservationId, paymentInsertData } = payment;

    const token = faker.lorem.word();

    const response = await server
      .post(`/reservations/${reservationId}/payment`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        ...paymentInsertData,
      });

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const payment = await createPaymentData();
    const { user, reservationId, paymentInsertData } = payment;

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);

    const response = await server
      .post(`/reservations/${reservationId}/payment`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        ...paymentInsertData,
      });

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 400 when there is no body', async () => {
    const payment = await createPaymentData();
    const { user, reservationId } = payment;
    const token = await generateValidToken(user);

    const response = await server
      .post(`/reservations/${reservationId}/payment`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.status).toBe(httpStatus.BAD_REQUEST);
  });

  it('should respond with status 400 for invalid body', async () => {
    const payment = await createPaymentData();
    const { user, reservationId, paymentInsertData } = payment;
    const token = await generateValidToken(user);

    delete paymentInsertData.cvc;

    const response = await server
      .post(`/reservations/${reservationId}/payment`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        ...paymentInsertData,
      });

    expect(response.status).toBe(httpStatus.BAD_REQUEST);
  });

  it('should respond with status 403 for invalid date', async () => {
    const payment = await createPaymentData();
    const { user, reservationId, paymentInsertData } = payment;
    const token = await generateValidToken(user);

    const dateNow = new Date();
    paymentInsertData.validThru = dayjs(dateNow).subtract(1, 'year').format('MM/YY');

    const response = await server
      .post(`/reservations/${reservationId}/payment`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        ...paymentInsertData,
      });

    expect(response.status).toBe(httpStatus.FORBIDDEN);
  });

  it('should respond with 409 status when payment is already made', async () => {
    const paymentData = await insertPayment();
    const { user, payment, insertedPayment } = paymentData;
    const { paymentInsertData } = payment;
    const token = await generateValidToken(user);

    const response = await server
      .post(`/reservations/${insertedPayment.reservationId}/payment`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        ...paymentInsertData,
      });

    expect(response.status).toBe(httpStatus.CONFLICT);
  });

  it('should respond with status 201 when there is a valid body', async () => {
    const payment = await createPaymentData();
    const { user, reservationId, paymentInsertData } = payment;
    const token = await generateValidToken(user);

    const response = await server
      .post(`/reservations/${reservationId}/payment`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        ...paymentInsertData,
      });

    expect(response.status).toBe(httpStatus.CREATED);
    expect(response.body).toEqual(
      expect.objectContaining({
        id: response.body.id,
        name: paymentInsertData.name,
        reservationId: paymentInsertData.reservationId,
        validThru: paymentInsertData.validThru,
      }),
    );
  });
});
