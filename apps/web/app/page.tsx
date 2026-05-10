'use client';
import { useState, useEffect, useRef } from 'react';

export default function Home() {
  const [logs, setLogs] = useState<string[]>([]);
  const [connected, setConnected] = useState(false);
  const [prompt, setPrompt] = useState('');
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const speakText = (t: string) => {
      if (!('speechSynthesis' in window)) return;
      // Clean out the bracketed names so it sounds natural!
      let clean = t.replace(/\[.*?\]/g, '').replace(/🔍|💼|⚠️|>>>|---/g, '').trim();
      if (clean.length < 3) return;

      window.speechSynthesis.cancel(); // Cut off prev speech for real-time pace!
      const utterance = new SpeechSynthesisUtterance(clean);
      utterance.rate = 1.05; // Crisp, rapid delivery
      utterance.pitch = 0.95; // Slightly futuristic deeper resonance
      window.speechSynthesis.speak(utterance);
    };

    const socket = new WebSocket('ws://localhost:8000/ws/stream');
    socketRef.current = socket;

    socket.onopen = () => {
      setConnected(true);
      setLogs(p => [...p, "[NETWORK] Secure Link Established."]);
      speakText("Neural Connection Established.");
    };

    socket.onmessage = (e) => {
      setLogs(p => [...p, `[SYSTEM] ${e.data}`]);
      // Trigger immediate narrative playback of agent logic!
      if (e.data.includes(']') && !e.data.includes('DEPLOYING') && !e.data.includes('Analyzing')) {
        speakText(e.data);
      }
    };

    return () => socket.close();
  }, []);

  const transmit = () => {
    if (socketRef.current && connected && prompt.trim().length > 0) {
      setLogs(p => [...p, `--- MISSION LAUNCH: ${prompt} ---`]);
      socketRef.current.send(prompt); // Push user text up the wire!
    }
  };

  return (
    <div style={{
      width: '100vw', height: '100vh', background: '#030305', 
      fontFamily: 'monospace', color: '#e2e8f0', display: 'flex', flexDirection: 'column',
      overflow: 'hidden', position: 'relative'
    }}>
      
      {/* BACKGROUND ANIMATION */}
      <div style={{
        position: 'absolute', width: '200%', height: '200%',
        backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(29, 78, 216, 0.15) 0%, transparent 50%)',
        animation: 'pulse 10s ease-in-out infinite', zIndex: 0, top: '-50%', left: '-50%'
      }}></div>

      {/* TOP BAR */}
      <div style={{ 
        height: '50px', background: 'rgba(15, 23, 42, 0.9)', borderBottom: '1px solid #1e293b', 
        zIndex: 20, display: 'flex', alignItems: 'center', padding: '0 25px', justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '8px', height: '8px', background: connected ? '#10b981' : '#ef4444', borderRadius: '50%', boxShadow: connected ? '0 0 8px #10b981' : 'none' }}></div>
          <span style={{ letterSpacing: '3px', fontWeight: 'bold', fontSize: '0.9rem', color: '#fff' }}>AETHER//OS v1.0</span>
        </div>
        <span style={{ fontSize: '0.7rem', color: '#64748b' }}>{connected ? 'STABLE CHANNEL // GEMINI-DETECT' : 'CONNECTING...'}</span>
      </div>

      {/* MAIN SPLIT LAYOUT */}
      <div style={{ flex: 1, display: 'flex', zIndex: 10, position: 'relative' }}>
        
        {/* LEFT SIDEBAR: AGENT DIAGNOSTICS */}
        <div style={{ width: '280px', background: 'rgba(2, 6, 23, 0.6)', borderRight: '1px solid #1e293b', padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <h3 style={{ fontSize: '0.7rem', color: '#64748b', letterSpacing: '2px', margin: '0 0 5px 0' }}>ACTIVE NEURAL NODES</h3>
          
          {[
            { n: 'RESEARCHER', c: '#3b82f6', i: '🔍 SCANNING' },
            { n: 'STRATEGIST', c: '#eab308', i: '📈 TRADING' },
            { n: 'RISK OFFICER', c: '#ef4444', i: '🛡️ SHIELDING' }
          ].map(a => (
            <div key={a.n} style={{ border: '1px solid #1e293b', padding: '12px', background: 'rgba(0,0,0,0.3)', borderRadius: '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ color: a.c, fontSize: '0.75rem', fontWeight: 'bold' }}>{a.n}</span>
                <span style={{ fontSize: '0.6rem', color: '#10b981' }}>ONLINE</span>
              </div>
              <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>{a.i}</div>
            </div>
          ))}
        </div>

        {/* CENTER: MAIN COMMAND THEATRE */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '30px', gap: '20px' }}>
          
          {/* INPUT AREA */}
          <div style={{ background: 'rgba(15, 23, 42, 0.4)', padding: '20px', border: '1px solid #1e293b', borderRadius: '6px' }}>
            <div style={{ fontSize: '0.7rem', color: '#3b82f6', marginBottom: '10px', letterSpacing: '2px' }}>COMMAND INPUT LINE</div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input 
                type="text"
                placeholder="TRANSMIT OPERATIONAL DIRECTIVE..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={!connected}
                style={{
                  flex: 1, padding: '15px', background: '#000', border: '1px solid #334155',
                  color: '#fff', fontFamily: 'monospace', fontSize: '0.9rem', outline: 'none'
                }}
              />
              <button 
                onClick={transmit}
                disabled={!connected || prompt.trim().length === 0}
                style={{
                  background: connected && prompt.length > 0 ? '#1e40af' : '#1e293b',
                  color: '#fff', border: 'none', padding: '0 30px', cursor: 'pointer',
                  fontWeight: 'bold', letterSpacing: '1px', transition: 'all 0.2s'
                }}>
                DEPLOY
              </button>
            </div>
          </div>

          {/* OUTPUT LOGS CONSOLE */}
          <div style={{ 
            flex: 1, background: '#000', border: '1px solid #1e293b', padding: '20px', 
            overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', boxShadow: 'inset 0 0 20px rgba(0,0,0,0.8)'
          }}>
            {logs.map((l, i) => {
              let color = '#94a3b8';
              if (l.includes('[RESEARCHER]')) color = '#60a5fa';
              if (l.includes('[STRATEGIST]')) color = '#facc15';
              if (l.includes('[RISK_OFFICER]')) color = '#f87171';
              if (l.includes('>>>')) color = '#22c55e';
              if (l.includes('---')) color = '#c084fc';

              return (
                <div key={i} style={{ color, fontSize: '0.85rem', borderLeft: `2px solid ${color}`, paddingLeft: '10px' }}>
                  <span style={{ opacity: 0.5, marginRight: '10px' }}>[{new Date().toLocaleTimeString()}]</span>
                  {l}
                </div>
              );
            })}
            <div style={{ height: '1px' }} id="scroll-anchor" />
          </div>

        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.1); }
        }
        input:focus { border-color: #3b82f6 !important; box-shadow: 0 0 15px rgba(59, 130, 246, 0.3); }
      `}</style>
    </div>
  );
}
