export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });
  res.status(400).json({ message: 'Pendaftaran akun tidak tersedia. Gunakan akun admin khusus.' });
}
