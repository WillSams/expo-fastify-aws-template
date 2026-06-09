import Fastify, { FastifyRequest, FastifyReply } from 'fastify';
import cors from '@fastify/cors';

export const fastify = Fastify({
  logger: process.env.ENV !== 'test',
});

await fastify.register(cors, {
  origin: process.env.ALLOWED_ORIGINS?.split(',') ?? true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
});

fastify.get('/', async (_request: FastifyRequest, _reply: FastifyReply) => {
  return {
    status: 'Success',
    result: process.env.ABOUT_MESSAGE ?? '',
  };
});
