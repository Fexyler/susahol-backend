import { FastifyReply } from 'fastify';

export const BadRequestError = (res: FastifyReply, message: string | object | object[] = '', errorType: string = 'Bad Request') =>
  res.code(400).send({
    errorType,
    error: message,
  });

export const InternalServerError = (
  res: FastifyReply,
  message: string = 'There is an error about the request that you sent, please try again.',
  errorType: string = 'Internal Server Error',
) => res.code(500).send({
  errorType,
  error: message,
});

export const NotFoundError = (res: FastifyReply, message: string = '', errorType: string = 'Not Found') =>
  res.code(404).send({
    errorType,
    error: message,
  });

export const UnAuthorizedError = (res: FastifyReply, message: string = 'Token is invalid.', errorType: string = 'UnauthorizedError') =>
  res.code(403).send({
    errorType,
    error: message,
  });

export const ValidationError = (
  res: FastifyReply,
  message: string = 'There is a validation error about your request.',
  errorType: string = 'ValidationError',
) =>
  res.code(400).send({
    errorType,
    error: message,
  });

export const ContentIsNotChangedResponse = (res: FastifyReply, data: {}) => res.code(201).send(data);

export const RedirectionResponse = (res: FastifyReply, url: string) => res.code(301).redirect(url);
