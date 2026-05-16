import { normalizeRole, normalizeUser } from './auth';

describe('auth utils', () => {
  it('normalizes any admin-like role to ADMIN', () => {
    expect(normalizeRole('GitHub Admin')).toBe('ADMIN');
    expect(normalizeRole('manager')).toBe('CUSTOMER');
  });

  it('normalizes user objects into the frontend shape', () => {
    expect(
      normalizeUser({
        userId: 7,
        email: 'reader@example.com',
        fullName: 'Reader One',
        role: 'platform admin',
        mobile: 9876543210,
        createdAt: null,
      } as any),
    ).toEqual({
      userId: 7,
      email: 'reader@example.com',
      fullName: 'Reader One',
      role: 'ADMIN',
      mobile: '9876543210',
      createdAt: '',
    });
  });
});
