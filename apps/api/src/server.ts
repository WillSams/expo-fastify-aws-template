import { fastify } from '#src/app';

const port = parseInt(process.env.API_PORT ?? '8080', 10);

fastify.listen({ port, host: '0.0.0.0' }, (err: Error | null) => {
  if (err) throw err;
  fastify.log.info(`API running on http://localhost:${port}`);
});
