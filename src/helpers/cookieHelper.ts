import { FastifyReply } from 'fastify';
import ms from 'ms';
import config from '../config';

export const setCookie = (res: FastifyReply, key: string, value: string, maxAge: number) => {
  res.cookie(key, value, {
    httpOnly: true,
    secure: true,
    maxAge,
    sameSite: true,
  });
};

const setResponseCookie = (res: FastifyReply, accessToken: string, refreshToken: string) => {
  setCookie(res, 'access_token', accessToken, ms(config.accessTokenExpire));
  setCookie(res, 'refresh_token', refreshToken, ms(config.refreshTokenExpire));
};

export default setResponseCookie;