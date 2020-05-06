import { getRepository } from 'typeorm';
import path from 'path';

import fs from 'fs';

import AppErro from '../errors/AppErro';

import uploadConfig from '../config/upload';

import User from '../models/User';

interface Request {
  user_id: string;
  avatarFilename: string;
}
class UploadUserAvatarService {
  public async execute({ user_id, avatarFilename }: Request): Promise<User> {
    const userRepository = getRepository(User);

    const user = await userRepository.findOne(user_id);

    if (!user) {
      throw new AppErro(
        'Somente usuários autenticados podem mudar o avatar',
        401,
      );
    }

    if (user.avatar) {
      // Deletar avatar
      const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar);

      const userAvatarFileExits = await fs.promises.stat(userAvatarFilePath);

      if (userAvatarFileExits) {
        await fs.promises.unlink(userAvatarFilePath);
      }
    }

    user.avatar = avatarFilename;

    await userRepository.save(user);

    return user;
  }
}

export default UploadUserAvatarService;
