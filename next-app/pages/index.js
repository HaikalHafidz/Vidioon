import { useState } from 'react';

export default function Home() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');
  const [result, setResult] = useState(null);

  async function submit(e) {
    e.preventDefault();
    if (!file) return alert('Pilih file video terlebih dahulu');
    setStatus('Uploading...');
    const form = new FormData();
    form.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: form });
    const data = await res.json();
    if (res.ok) {
      setResult(data);
      setStatus('Selesai');
    } else {
      setStatus('Gagal: ' + (data.error || res.statusText));
    }
  }

  return (
    <div style={{ maxWidth: 900, margin: '2rem auto', padding: 20 }}>
      <h1>Vidioon — Upload & Convert</h1>
      <form onSubmit={submit}>
        <input type="file" accept="video/*" onChange={e => setFile(e.target.files[0])} />
        <button type="submit">Upload</button>
      </form>
      <div style={{ marginTop: 16 }}>{status}</div>
      {result && (
        <div style={{ marginTop: 16 }}>
          <div>HLS: <a href={result.hls}>{result.hls}</a></div>
          <div>DASH: <a href={result.dash}>{result.dash}</a></div>
          <div style={{ marginTop: 8 }}>
            <a href={`/watch/${result.id}`}>Tonton HLS</a>
          </div>
        </div>
      )}

      <Chat />
    </div>
  );
}

function Chat() {
  const [ws, setWs] = useState(null);
  const [msg, setMsg] = useState('');
  const [logs, setLogs] = useState([]);

  function connect() {
    const s = new WebSocket((location.protocol === 'https:' ? 'wss' : 'ws') + '://' + location.host + '/api/ws');
    s.onmessage = e => setLogs(l => [...l, e.data]);
    setWs(s);
  }

  function send() {
    if (!ws) return alert('Connect first');
    ws.send(msg);
    setMsg('');
  }

  return (
    <div style={{ marginTop: 24 }}>
      <h3>Chat (WebSocket)</h3>
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={connect}>Connect</button>
        <input value={msg} onChange={e => setMsg(e.target.value)} placeholder="Pesan..." />
        <button onClick={send}>Kirim</button>
      </div>
      <div style={{ marginTop: 12, minHeight: 80, background: '#f6f6f6', padding: 8 }}>
        {logs.map((l, i) => <div key={i}>{l}</div>)}
      </div>
    </div>
  );
}
