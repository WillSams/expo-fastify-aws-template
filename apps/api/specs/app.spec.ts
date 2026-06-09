import supertest from 'supertest';
import { fastify } from '#src/app';

describe('GET /', () => {
  const originalAboutMessage = process.env.ABOUT_MESSAGE;

  beforeAll(async () => {
    process.env.ABOUT_MESSAGE = 'This is a test message';
    await fastify.ready();
  });

  afterAll(async () => {
    process.env.ABOUT_MESSAGE = originalAboutMessage;
    await fastify.close();
  });

  it('should return status Success and the ABOUT_MESSAGE', async () => {
    const response = await supertest(fastify.server).get('/');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: 'Success',
      result: 'This is a test message',
    });
  });
});
