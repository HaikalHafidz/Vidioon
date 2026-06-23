import { verifyAdminCredentials, createSession } from '../../../lib/auth';

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email dan password wajib diisi' });
  }

  const user = verifyAdminCredentials(email, password);
  if (!user) {
    return res.status(401).json({ message: 'Email atau password salah' });
  }

  const token = createSession(user);
  res.status(200).json({ token, user });
}
