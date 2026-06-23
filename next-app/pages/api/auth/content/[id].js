import { getContentById, deleteContentById } from '../../../lib/contentStore';
import { getSession } from '../../../lib/auth';

function requireAdmin(req, res) {
  const auth = req.headers.authorization;
  const token = auth?.split(' ')[1];
  const user = getSession(token);
  if (!user || user.role !== 'admin') {
    res.status(401).json({ message: 'Unauthorized' });
    return null;
  }
  return user;
}

export default function handler(req, res) {
  const { id } = req.query;
  const contentId = parseInt(id, 10);

  if (req.method === 'GET') {
    const item = getContentById(contentId);
    if (!item) return res.status(404).json({ message: 'Konten tidak ditemukan' });
    return res.status(200).json(item);
  }

  if (req.method === 'DELETE') {
    const user = requireAdmin(req, res);
    if (!user) return;

    const deleted = deleteContentById(contentId);
    if (!deleted) {
      return res.status(404).json({ message: 'Konten tidak ditemukan' });
    }
    return res.status(200).json({ message: 'Konten berhasil dihapus' });
  }

  res.status(405).json({ message: 'Method not allowed' });
}
