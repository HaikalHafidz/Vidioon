import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
const { processToHlsDash } = require('../../lib/ffmpeg');

export const config = {
  api: {
    bodyParser: false,
  },
};

const VIDEOS_ROOT = path.join(process.cwd(), 'public', 'videos');

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const form = new formidable.IncomingForm();
  form.uploadDir = path.join(process.cwd(), 'uploads');
  form.keepExtensions = true;

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Upload error' });
    }

    const file = files.file;
    if (!file) return res.status(400).json({ error: 'No file uploaded' });

    try {
      // create id dir
      const id = Date.now().toString();
      const outDir = path.join(VIDEOS_ROOT, id);
      fs.mkdirSync(outDir, { recursive: true });

      // move uploaded file to temp location
      const tmpPath = file.path || file.filepath || file.file;
      const inputPath = path.join(outDir, path.basename(tmpPath));
      fs.renameSync(tmpPath, inputPath);

      // process with ffmpeg to HLS/DASH
      const result = await processToHlsDash(inputPath, outDir);

      return res.status(200).json({ id, hls: `/videos/${id}/playlist.m3u8`, dash: `/videos/${id}/manifest.mpd`, info: result });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: e.message });
    }
  });
}
