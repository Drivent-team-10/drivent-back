import app, { init } from '@/app';
import supertest from 'supertest';
import * as jwt from 'jsonwebtoken';

import { createEnrollmentWithAddress, createUser } from '../factories';
import { cleanDb, generateValidToken } from '../helpers';
import httpStatus from 'http-status';
import faker from '@faker-js/faker';
import { createReservationData } from '../factories/reservation-factory';

beforeAll(async () => {
  await init();
  await cleanDb();
});

const server = supertest(app);

describe('POST /reservations', () => {
  it('should respond with status 401 if no token is given', async () => {
    const createdData = await createReservationData();
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
      enrollmentId: 1,
    });

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const createdData = await createReservationData();
    const { reservationInsertData } = createdData;

    const response = await server
      .post('/reservations')
      .set('Authorization', `Bearer ${token}`)
      .send({
        ...reservationInsertData,
      });

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 201 when online reservation is done', async () => {
    const createdData = await createReservationData();
    const { user, reservationInsertData } = createdData;
    const token = await generateValidToken(user);

    const response = await server
      .post('/reservations')
      .set('Authorization', `Bearer ${token}`)
      .send({
        ...reservationInsertData,
      });

    expect(response.status).toBe(httpStatus.CREATED);
    expect(response.body).toEqual(
      expect.objectContaining({
        id: response.body.id,
        enrollmentId: reservationInsertData.enrollmentId,
        type: 'online',
        accommodation: false,
      }),
    );
  });
});
