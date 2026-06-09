import { fastify } from '#src/app';

const port = parseInt(process.env.API_PORT ?? '8080', 10);

fastify.listen({ port, host: '127.0.0.1' }, (err: Error | null) => {
  if (err) throw err;
  const address = fastify.server.address();
  if (typeof address === 'string') {
    fastify.log.info(`Server listening on ${address}`);
  } else if (address !== null) {
    fastify.log.info(`Server listening on port ${address.port}`);
  }
});
