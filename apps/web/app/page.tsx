'use client';
import { useState, useEffect, useRef } from 'react';

export default function Home() {
  const [logs, setLogs] = useState<string[]>([]);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8000/ws/stream');
    socketRef.current = socket;

    socket.onopen = () => {
      setConnected(true);
      setLogs(p => [...p, "[NETWORK] Secure Link Established."]);
    };

    socket.onmessage = (e) => setLogs(p => [...p, `[SYSTEM] ${e.data}`]);
    socket.onerror = () => setLogs(p => [...p, "[NETWORK] ERROR: Run Backend Server."]);

    return () => socket.close();
  }, []);

  const transmit = () => {
    if (socketRef.current && connected) {
      setLogs(p => [...p, "--- LAUNCHING MISSION ---"]);
      socketRef.current.send("INIT");
    }
  };

  return (
    <div style={{
      width: '100vw', height: '100vh', background: '#050505', 
      fontFamily: 'monospace', color: '#fff', display: 'flex', 
      alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
      position: 'relative'
    }}>
      
      {/* Ultra-Stable Animated Neon Grid Background */}
      <div style={{
        position: 'absolute', width: '200%', height: '200%',
        backgroundImage: 'linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        transform: 'perspective(500px) rotateX(60deg)',
        animation: 'moveGrid 20s linear infinite',
        zIndex: 0, top: '-50%'
      }}></div>

      <div style={{
        position: 'relative', zIndex: 10, background: 'rgba(10, 10, 15, 0.85)',
        border: `1px solid ${connected ? '#22c55e' : '#ef4444'}`,
        borderRadius: '8px', padding: '40px', width: '450px',
        boxShadow: `0 0 60px rgba(${connected ? '34, 197, 94' : '239, 68, 68'}, 0.15)`,
        backdropFilter: 'blur(12px)', textAlign: 'center'
      }}>
        <h1 style={{ margin: 0, letterSpacing: '12px', fontSize: '2.5rem', textShadow: '0 0 10px rgba(255,255,255,0.2)' }}>AETHER</h1>
        <p style={{ color: connected ? '#4ade80' : '#f87171', fontSize: '0.7rem', letterSpacing: '3px', margin: '10px 0 30px 0', opacity: 0.8 }}>
          {connected ? '● CORE ONLINE' : '● GATEWAY OFFLINE'}
        </p>

        <div style={{ 
          background: '#000', border: '1px solid #1e293b', padding: '15px', height: '140px', 
          textAlign: 'left', fontSize: '0.75rem', overflowY: 'auto', marginBottom: '25px', color: '#94a3b8'
        }}>
          {logs.map((l, i) => (
            <div key={i} style={{ marginBottom: '6px', color: l.includes('>>>') ? '#22c55e' : '#94a3b8' }}>{l}</div>
          ))}
        </div>

        <button 
          onClick={transmit}
          disabled={!connected}
          style={{
            background: connected ? 'rgba(34, 197, 94, 0.1)' : 'transparent', 
            border: `1px solid ${connected ? '#22c55e' : '#475569'}`,
            color: connected ? '#22c55e' : '#64748b',
            padding: '15px 30px', width: '100%', cursor: connected ? 'pointer' : 'not-allowed',
            fontWeight: 'bold', letterSpacing: '2px', transition: 'all 0.2s'
          }}>
          {connected ? 'INITIALIZE MISSION COMMAND' : 'LOCKED // SYNC REQ'}
        </button>
      </div>

      <style>{`
        @keyframes moveGrid {
          0% { background-position: 0 0; }
          100% { background-position: 0 40px; }
        }
      `}</style>
    </div>
  );
}
