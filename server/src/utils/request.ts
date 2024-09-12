import { FastifyRequest } from 'fastify';

export function getStringHeader(request: FastifyRequest, header: string) {
  return typeof request.headers[header] === 'string'
    ? (request.headers[header] as string)
    : null;
}
