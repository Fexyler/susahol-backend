import dotenv from 'dotenv';
import ms from 'ms';
import jwt from 'jsonwebtoken';
import { IJwtOptions, ITokenPayload } from '../types';
import { client } from '../database/redisConnection';
import config from 'config';

dotenv.config({ path: `./.env/.${process.env.NODE_ENV}` });

export const getAccessToken = async (userId: string, email: string) => {
  const payload: ITokenPayload = {
    userId,
    email,
  };

  const secret = config.accessTokenPrivateKey;

  const options: IJwtOptions = {
    issuer: config.tokenIssuer,
    expiresIn: config.accessTokenExpire,
  };

  const token = jwt.sign(payload, secret, options);
  return token;
};

export const getRefreshToken = async (userId: string, email: string) => {
  const payload: ITokenPayload = {
    userId,
    email,
  };

  const secret = config.refreshTokenPrivateKey;

  const options: IJwtOptions = {
    issuer: config.tokenIssuer,
    expiresIn: config.refreshTokenExpire
  };

  const token = jwt.sign(payload, secret, options);
  await client.SET(userId, token, { EX: ms(config.refreshTokenExpire) / 1000 });
  return token;
};

export const verifyAccessToken = (accessToken: string): ITokenPayload | null => {
  try {
    const secret = config.accessTokenPrivateKey;
    const payload = jwt.verify(accessToken, secret) as ITokenPayload;

    if (payload) {
      return {
        userId: payload.userId,
        email: payload.email,
      };
    }

    return null;
  } catch (e) {
    return null;
  }
};

export const verifyRefreshToken = async (refreshToken: string) => {
  try {
    const secret = config.refreshTokenPrivateKey;
    const payload = jwt.verify(refreshToken, secret) as ITokenPayload;

    const refreshTokenValue = await client.get(payload.userId);
    if (refreshTokenValue && refreshTokenValue === refreshToken) {
      return payload;
    }
    return null;
  } catch {
    return null;
  }
};