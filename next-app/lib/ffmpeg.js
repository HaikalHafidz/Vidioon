const ffmpegPath = require('ffmpeg-static');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

function runCommand(cmd, args, opts = {}) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, opts);
    let stdout = '';
    let stderr = '';
    p.stdout && p.stdout.on('data', d => stdout += d.toString());
    p.stderr && p.stderr.on('data', d => stderr += d.toString());
    p.on('error', reject);
    p.on('close', code => {
      if (code === 0) resolve({ stdout, stderr });
      else reject(new Error(`ffmpeg exited ${code}: ${stderr}`));
    });
  });
}

async function processToHlsDash(inputFile, outDir) {
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const hlsPlaylist = path.join(outDir, 'playlist.m3u8');
  const dashManifest = path.join(outDir, 'manifest.mpd');

  // HLS
  const hlsArgs = [
    '-y',
    '-i', inputFile,
    '-preset', 'veryfast',
    '-g', '48',
    '-sc_threshold', '0',
    '-map', '0:v',
    '-map', '0:a?',
    '-c:v', 'libx264',
    '-c:a', 'aac',
    '-b:v', '1400k',
    '-maxrate', '1498k',
    '-bufsize', '2100k',
    '-hls_time', '6',
    '-hls_playlist_type', 'vod',
    '-hls_segment_filename', path.join(outDir, 'seg_%03d.ts'),
    hlsPlaylist
  ];

  // DASH
  const dashArgs = [
    '-y',
    '-i', inputFile,
    '-map', '0',
    '-c:v', 'libx264',
    '-c:a', 'aac',
    '-f', 'dash',
    dashManifest
  ];

  // Use ffmpeg-static binary
  const ff = ffmpegPath || 'ffmpeg';
  // Run HLS then DASH sequentially
  await runCommand(ff, hlsArgs);
  await runCommand(ff, dashArgs);
  return { hls: hlsPlaylist, dash: dashManifest };
}

module.exports = { processToHlsDash };
