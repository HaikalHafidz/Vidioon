import { getAllContent, addContent } from '../../../lib/contentStore';
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
  if (req.method === 'GET') {
    return res.status(200).json({ data: getAllContent() });
  }

  if (req.method === 'POST') {
    const user = requireAdmin(req, res);
    if (!user) return;

    const content = req.body;
    if (!content || !content.title || !content.desc || !content.type) {
      return res.status(400).json({ message: 'Data konten tidak lengkap' });
    }

    const item = addContent(content);
    return res.status(201).json({ message: 'Konten berhasil ditambahkan', content: item });
  }

  res.status(405).json({ message: 'Method not allowed' });
}
