import awsLambdaFastify from '@fastify/aws-lambda';
import { APIGatewayEvent, Context } from 'aws-lambda';
import { fastify } from '#src/app';

const proxy = awsLambdaFastify(fastify);

export function handler(event: APIGatewayEvent, context: Context) {
  return proxy(event, context);
}
