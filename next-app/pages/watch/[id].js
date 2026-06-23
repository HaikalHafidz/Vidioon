import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function WatchPage() {
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (!id) return;
    const video = document.getElementById('player');
    const hlsUrl = `/videos/${id}/playlist.m3u8`;

    const isNative = video.canPlayType('application/vnd.apple.mpegurl');
    if (isNative) {
      video.src = hlsUrl;
    } else {
      // dynamic import hls.js
      import('hls.js').then(HlsModule => {
        const Hls = HlsModule.default || HlsModule;
        if (Hls.isSupported()) {
          const hls = new Hls();
          hls.loadSource(hlsUrl);
          hls.attachMedia(video);
        } else {
          console.error('HLS not supported');
        }
      });
    }
  }, [id]);

  return (
    <div style={{ maxWidth: 1000, margin: '2rem auto' }}>
      <h1>Tonton</h1>
      <video id="player" controls style={{ width: '100%', height: 'auto', background: '#000' }} />
    </div>
  );
}
