import { getRepository } from 'typeorm';

import { compare } from 'bcryptjs';

import { sign } from 'jsonwebtoken';
import authConfig from '../config/auth';

import User from '../models/User';

import AppErro from '../errors/AppErro';

interface Request {
  email: string;
  password: string;
}
interface Response {
  user: User;
  token: string;
}
class CreateSession {
  public async execute({ email, password }: Request): Promise<Response> {
    const usersRepository = getRepository(User);

    const user = await usersRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new AppErro('Email ou senha está incorreto.', 401);
    }

    const passwordMatched = await compare(password, user.password);

    if (!passwordMatched) {
      throw new AppErro('Email ou senha está incorreto.', 401);
    }

    const { secret, expiresIn } = authConfig.jwt;
    const token = sign({}, secret, {
      subject: user.id,
      expiresIn,
    });

    return {
      user,
      token,
    };
  }
}

export default CreateSession;
