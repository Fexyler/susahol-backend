import Fastify from 'fastify'
import cookie from '@fastify/cookie'
import dotenv from 'dotenv';

dotenv.config({ path: `./.env.${process.env.NODE_ENV}` });

const app = Fastify({
  logger: {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      }
    }
  }
})

app.register(cookie, {
  parseOptions: {}
});

export default app;