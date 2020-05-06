import { Request, Response, NextFunction } from 'express';

import authConfig from '../config/auth';
import { verify } from 'jsonwebtoken';

import AppErro from '../errors/AppErro';

interface TokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

export default function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppErro('Token não informado', 401);
  }

  const [, token] = authHeader.split(' ');
  const { secret } = authConfig.jwt;

  try {
    const decoded = verify(token, secret);
    const { sub } = decoded as TokenPayload;

    request.user = {
      id: sub,
    };

    return next();
  } catch {
    throw new AppErro('Token Inválido', 401);
  }
}
