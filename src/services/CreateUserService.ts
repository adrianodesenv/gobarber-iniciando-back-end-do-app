import { getRepository } from 'typeorm';

import { hash } from 'bcryptjs';

import AppErro from '../errors/AppErro';

import User from '../models/User';

interface Request {
  name: string;
  email: string;
  password: string;
}
class CreateUser {
  public async execute({ name, email, password }: Request): Promise<User> {
    const usersRepository = getRepository(User);

    const checkUserExists = await usersRepository.findOne({
      where: { email },
    });

    if (checkUserExists) {
      throw new AppErro('Endereço de email já cadastrado.');
    }

    const hashedPassword = await hash(password, 8);

    const user = usersRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    await usersRepository.save(user);
    return user;
  }
}

export default CreateUser;
