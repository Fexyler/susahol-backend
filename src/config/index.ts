import dotenv from 'dotenv';

dotenv.config({ path: `./.env.${process.env.NODE_ENV || 'development'}` });

export default {
  accessTokenExpire: '30m',
  accessTokenPrivateKey: process.env.ACCESS_TOKEN_SECRET as string,
  refreshTokenExpire: '1d',
  refreshTokenPrivateKey: process.env.REFRESH_TOKEN_SECRET as string,
  origins: (process.env.ORIGINS as string).split(','),
  mongoDbConnectionUri: process.env.MONGODB_CONNECTION_URI as string,
  redisConnectionUri: process.env.REDIS_CONNECTION_URI as string,
  reCaptchaSecret: process.env.RECAPTCHA_SECRET as string,
  tokenIssuer: 'su-sahol.org'
}