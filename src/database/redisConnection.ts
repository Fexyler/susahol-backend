import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config({ path: `./.env` });

export const client = createClient({
  url: process.env.REDIS_URI,
  disableOfflineQueue: true,
});

export const redisConnection = async () => {
  client.on('connected', () => {
    console.log('Client connected to the Redis');
  });
  client.on('ready', () => {
    console.log('Redis is ready to use');
  });
  client.on('error', (err: any) => {
    console.log(`Error ${err}`);
  });
  await client.connect();
};
