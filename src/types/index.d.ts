import { FastifyRequest } from 'fastify';

export interface ITokenPayload {
  userId: string;
  email: string;
}

export interface IJwtOptions {
  issuer: string;
  expiresIn: string | number | undefined;
}

declare global {
  interface IRequest extends FastifyRequest {
    user?: string; // NOTE: userID value, it is present when user is authenticated.
  }
}
