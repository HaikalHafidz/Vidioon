import { randomUUID } from 'crypto';

const ADMIN_USER = {
  id: 1,
  name: 'Admin Vidioon',
  email: 'admin@vidioon.com',
  password: 'Admin1234!',
  role: 'admin',
};

const sessions = new Map();

export function verifyAdminCredentials(email, password) {
  if (email === ADMIN_USER.email && password === ADMIN_USER.password) {
    return { id: ADMIN_USER.id, name: ADMIN_USER.name, email: ADMIN_USER.email, role: ADMIN_USER.role };
  }
  return null;
}

export function createSession(user) {
  const token = randomUUID();
  sessions.set(token, { ...user, createdAt: Date.now() });
  return token;
}

export function getSession(token) {
  if (!token) return null;
  const session = sessions.get(token);
  if (!session) return null;
  return session;
}

export function invalidateSession(token) {
  sessions.delete(token);
}

export function adminInfo() {
  return {
    email: ADMIN_USER.email,
    password: ADMIN_USER.password,
    name: ADMIN_USER.name,
  };
}
