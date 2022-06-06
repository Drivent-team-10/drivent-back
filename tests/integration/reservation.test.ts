import app, { init } from '@/app';
import supertest from 'supertest';
import * as jwt from 'jsonwebtoken';

import { createUser } from '../factories';
import { cleanDb, generateValidToken } from '../helpers';
import httpStatus from 'http-status';
import faker from '@faker-js/faker';
import { createOnlineReservationData } from '../factories/reservation-factory';

beforeAll(async () => {
  await init();
  await cleanDb();
});

const server = supertest(app);

describe('POST /reservations', () => {
  beforeEach(async () => {
    await cleanDb();
  });

  it('should respond with status 401 if no token is given', async () => {
    const createdData = await createOnlineReservationData('online', false);
    const { reservationInsertData } = createdData;

    const response = await server.post('/reservations').send({
      ...reservationInsertData,
    });

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.post('/reservations').set('Authorization', `Bearer ${token}`).send({
      type: 'online',
      accommodation: false,
    });

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const createdData = await createOnlineReservationData('online', false);
    const { reservationInsertData } = createdData;

    const response = await server.post('/reservations').set('Authorization', `Bearer ${token}`).send({
      type: reservationInsertData.type,
      accommodation: reservationInsertData.accommodation,
    });

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 400 when there is no body', async () => {
    const createdData = await createOnlineReservationData('online', false);
    const { user } = createdData;
    const token = await generateValidToken(user);

    const response = await server.post('/reservations').set('Authorization', `Bearer ${token}`).send();

    expect(response.status).toBe(httpStatus.BAD_REQUEST);
  });

  it('should respond with status 400 for invalid body', async () => {
    const createdData = await createOnlineReservationData('online', false);
    const { user, reservationInsertData } = createdData;
    const token = await generateValidToken(user);

    const response = await server.post('/reservations').set('Authorization', `Bearer ${token}`).send({
      accommodation: reservationInsertData.accommodation,
    });

    expect(response.status).toBe(httpStatus.BAD_REQUEST);
  });

  it('should respond with status 201 when there is no hosting data and the ticket is online', async () => {
    const createdData = await createOnlineReservationData('online', false);
    const { user, reservationInsertData } = createdData;
    const token = await generateValidToken(user);

    const response = await server.post('/reservations').set('Authorization', `Bearer ${token}`).send({
      type: 'online',
    });

    expect(response.status).toBe(httpStatus.CREATED);
    expect(response.body).toEqual(
      expect.objectContaining({
        id: response.body.id,
        enrollmentId: reservationInsertData.enrollmentId,
        type: 'online',
        accommodation: false,
        amount: reservationInsertData.amount,
        eventId: reservationInsertData.eventId,
      }),
    );
  });

  it('should respond with status 201 when online reservation is done', async () => {
    const createdData = await createOnlineReservationData('online', false);
    const { user, reservationInsertData } = createdData;
    const token = await generateValidToken(user);

    const response = await server.post('/reservations').set('Authorization', `Bearer ${token}`).send({
      type: reservationInsertData.type,
      accommodation: reservationInsertData.accommodation,
    });

    expect(response.status).toBe(httpStatus.CREATED);
    expect(response.body).toEqual(
      expect.objectContaining({
        id: response.body.id,
        enrollmentId: reservationInsertData.enrollmentId,
        type: 'online',
        accommodation: false,
        amount: reservationInsertData.amount,
        eventId: reservationInsertData.eventId,
      }),
    );
  });

  it('should respond with status 201 when the body is valid and the ticket is presential', async () => {
    const createdData = await createOnlineReservationData('presential', true);
    const { user, reservationInsertData } = createdData;
    const token = await generateValidToken(user);

    const response = await server.post('/reservations').set('Authorization', `Bearer ${token}`).send({
      type: 'presential',
      accommodation: true,
    });

    expect(response.status).toBe(httpStatus.CREATED);
    expect(response.body).toEqual(
      expect.objectContaining({
        id: response.body.id,
        enrollmentId: reservationInsertData.enrollmentId,
        type: 'presential',
        accommodation: true,
        amount: reservationInsertData.amount,
        eventId: reservationInsertData.eventId,
      }),
    );
  });
});
