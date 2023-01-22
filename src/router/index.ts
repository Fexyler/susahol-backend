import Fastify from 'fastify'
import cors from '@fastify/cors'
import cookie from '@fastify/cookie'
import dotenv from 'dotenv';

dotenv.config({ path: `./.env` });

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

app.register(cors, { 
  origin: true,
  credentials: true,
})


app.register(cookie, {
  parseOptions: {}
});

export default app;
