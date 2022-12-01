import dotenv from 'dotenv';
import { dbConnection } from './database';
import { redisConnection } from './database/redisConnection';
import app from './router';

dotenv.config({ path: `./.env.${process.env.NODE_ENV}` });

app.get('/healthcheck', async (req, res) => {
  return { status: true }
})


const start = async () => {
  try {
    redisConnection();
    dbConnection();
    await app.listen({ port: Number(process.env.PORT  || 4000) })
  } catch (err) {
    app.log.error(err)
    // kill all the process, let tini handle it.
    process.exit(1)
  }
}
start()