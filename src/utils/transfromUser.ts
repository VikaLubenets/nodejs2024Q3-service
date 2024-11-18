import { PrismaUser as User, User as UserI } from '../modules/user/type';

export function transformUser(user: User): UserI {
  return {
    ...user,
    createdAt: user.createdAt.getTime(),
    updatedAt: user.updatedAt.getTime(),
  };
}
