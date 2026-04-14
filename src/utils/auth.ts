import { User } from '../types/auth';

type UserLike = Partial<User> & {
  role?: string | null;
  mobile?: string | number | null;
  createdAt?: string | null;
};

export const normalizeRole = (role?: string | null): User['role'] => {
  return String(role || '').toUpperCase().includes('ADMIN') ? 'ADMIN' : 'CUSTOMER';
};

export const normalizeUser = (user: UserLike): User => {
  return {
    userId: Number(user.userId ?? 0),
    email: String(user.email ?? ''),
    fullName: String(user.fullName ?? ''),
    role: normalizeRole(user.role),
    mobile: user.mobile == null ? '' : String(user.mobile),
    createdAt: String(user.createdAt ?? ''),
  };
};
