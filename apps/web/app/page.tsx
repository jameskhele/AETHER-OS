'use client';
import { useState, useEffect, useRef } from 'react';

export default function Home() {
  const [logs, setLogs] = useState<string[]>([]);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Establish immediate link to internal logic gateway
    const socket = new WebSocket('ws://localhost:8000/ws/stream');
    socketRef.current = socket;

    socket.onopen = () => {
      setConnected(true);
      setLogs(p => [...p, "[NETWORK] Kinetic Gateway Found: Connection Established."]);
    };

    socket.onmessage = (event) => {
      setLogs(p => [...p, `[GATEWAY] Payload Detected: ${event.data}`]);
    };

    socket.onerror = () => {
      setLogs(p => [...p, "[NETWORK] FATAL: Local API Gateway (Python) Offline on Port 8000."]);
    };

    return () => socket.close();
  }, []);

  const transmitVector = () => {
    if (socketRef.current && connected) {
      setLogs(p => [...p, "[CLIENT] Dispatching Vector Ingress Command..."]);
      socketRef.current.send("INITIALIZE_SEQUENCE_ALPHA");
    }
  };

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', 
      height: '100vh', background: 'radial-gradient(circle at center, #0f172a 0%, #000000 100%)', fontFamily: 'monospace'
    }}>
      
      <div style={{
        border: `1px solid ${connected ? '#22c55e' : '#ef4444'}`, padding: '40px', borderRadius: '12px', 
        background: 'rgba(0,0,0,0.7)', boxShadow: `0 0 50px rgba(${connected ? '34, 197, 94' : '239, 68, 68'}, 0.2)`, textAlign: 'center', minWidth: '450px'
      }}>
        <h1 style={{ fontSize: '2.5rem', letterSpacing: '10px', color: '#fff', margin: 0 }}>AETHER OS</h1>
        <p style={{ color: connected ? '#4ade80' : '#f87171', fontSize: '0.8rem', letterSpacing: '2px', margin: '10px 0 30px 0' }}>
          {connected ? 'API LINK SECURED' : 'AWAITING BACKEND SYNCHRONIZATION'}
        </p>

        <div style={{ 
          background: '#000', border: '1px solid #1e293b', padding: '15px', 
          textAlign: 'left', fontSize: '0.8rem', height: '150px', overflowY: 'auto', marginBottom: '20px' 
        }}>
          {logs.map((l, i) => (
            <div key={i} style={{ color: l.includes('[NETWORK] FATAL') ? '#ef4444' : '#94a3b8', margin: '4px 0' }}>
              {l}
            </div>
          ))}
        </div>

        <button 
          onClick={transmitVector}
          disabled={!connected}
          style={{
            background: 'transparent', border: `1px solid ${connected ? '#22c55e' : '#475569'}`, 
            color: connected ? '#22c55e' : '#475569', opacity: connected ? 1 : 0.5,
            padding: '15px 30px', cursor: connected ? 'pointer' : 'not-allowed', fontSize: '1rem', letterSpacing: '2px',
          }}>
          TRANSMIT CORE SIGNAL //
        </button>
      </div>
    </div>
  );
}
