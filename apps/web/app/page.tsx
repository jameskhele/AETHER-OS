'use client';
import { useState, useEffect, useRef } from 'react';

export default function Home() {
  const [logs, setLogs] = useState<string[]>([]);
  const [connected, setConnected] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [score, setScore] = useState(0);
  const [activeAgent, setActiveAgent] = useState(''); // For the pulsing effect!
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const speakText = (t: string) => {
      if (!('speechSynthesis' in window)) return;
      let clean = t.replace(/\[.*?\]/g, '').replace(/🔍|💼|⚠️|👑|>>>|---/g, '').trim();
      if (clean.length < 3) return;
      window.speechSynthesis.cancel(); 
      const u = new SpeechSynthesisUtterance(clean);
      u.rate = 1.05; u.pitch = 0.95;
      window.speechSynthesis.speak(u);
    };

    const socket = new WebSocket('ws://localhost:8000/ws/stream');
    socketRef.current = socket;

    socket.onopen = () => {
      setConnected(true);
      setLogs(p => [...p, "[NETWORK] Secure Link Established."]);
      speakText("Neural Connection Established.");
    };

    socket.onmessage = (e) => {
      const rawData = e.data as string;
      setLogs(p => [...p, `[SYSTEM] ${rawData}`]);
      
      // Detection for Active Glowing Agent!
      if (rawData.includes('[RESEARCHER]')) setActiveAgent('RESEARCHER');
      if (rawData.includes('[STRATEGIST]')) setActiveAgent('STRATEGIST');
      if (rawData.includes('[RISK_OFFICER]')) setActiveAgent('RISK_OFFICER');
      if (rawData.includes('[DIRECTOR]')) setActiveAgent('DIRECTOR');

      const scoreMatch = rawData.match(/\[SCORE:\s*(\d+)\]/i);
      if (scoreMatch) {
        setScore(Number(scoreMatch[1]));
      }

      if (rawData.includes(']') && !rawData.includes('DEPLOYING') && !rawData.includes('Analyzing')) {
        speakText(rawData);
      }
    };
    return () => socket.close();
  }, []);

  const transmit = () => {
    if (socketRef.current && connected && prompt.trim().length > 0) {
      setScore(0);
      setActiveAgent('');
      setLogs(p => [...p, `--- MISSION LAUNCH: ${prompt} ---`]);
      socketRef.current.send(prompt);
    }
  };

  const downloadBrief = () => {
    const content = `JK SYSTEMS - AETHER OS EXECUTIVE BRIEF\nDATE: ${new Date().toLocaleString()}\nDIRECTIVE: ${prompt}\n\nREPORT LOGS:\n` + logs.join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `JK_AETHER_BRIEF_${Date.now()}.txt`;
    link.click();
  };

  return (
    <div style={{
      width: '100vw', height: '100vh', background: '#030305', 
      fontFamily: 'monospace', color: '#e2e8f0', display: 'flex', flexDirection: 'column',
      overflow: 'hidden', position: 'relative'
    }}>
      
      {/* BACKGROUND PULSE */}
      <div style={{
        position: 'absolute', width: '200%', height: '200%',
        backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(29, 78, 216, 0.12) 0%, transparent 50%)',
        animation: 'pulse 8s ease-in-out infinite', zIndex: 0, top: '-50%', left: '-50%'
      }}></div>

      {/* TOP ENTERPRISE BAR WITH JK BRANDING */}
      <div style={{ 
        height: '60px', background: 'rgba(10, 15, 30, 0.95)', borderBottom: '1px solid #1e293b', 
        zIndex: 20, display: 'flex', alignItems: 'center', padding: '0 30px', justifyContent: 'space-between',
        boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          {/* NEON JK LOGO */}
          <div style={{
            width: '35px', height: '35px', borderRadius: '4px', border: '2px solid #eab308',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900',
            fontSize: '1.1rem', color: '#eab308', boxShadow: '0 0 15px rgba(234,179,8,0.3)', background: 'rgba(234,179,8,0.1)'
          }}>JK</div>
          <div>
            <div style={{ letterSpacing: '4px', fontWeight: '900', fontSize: '0.95rem', color: '#fff' }}>AETHER//OS</div>
            <div style={{ fontSize: '0.6rem', color: '#eab308', letterSpacing: '1px', opacity: 0.8 }}>JK GLOBAL SYSTEMS DIVISION</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '6px', height: '6px', background: connected ? '#10b981' : '#ef4444', borderRadius: '50%' }}></div>
            {connected ? 'OPERATIONAL' : 'OFFLINE'}
          </span>
          <button onClick={downloadBrief} style={{
            background: 'transparent', border: '1px solid #334155', color: '#cbd5e1',
            padding: '6px 15px', fontSize: '0.65rem', cursor: 'pointer', borderRadius: '3px',
            transition: 'all 0.2s', letterSpacing: '1px'
          }} onMouseOver={(e) => e.currentTarget.style.borderColor = '#eab308'} onMouseOut={(e) => e.currentTarget.style.borderColor = '#334155'}>
            EXPORT BRIEF
          </button>
        </div>
      </div>

      {/* MAIN VIEWPORT */}
      <div style={{ flex: 1, display: 'flex', zIndex: 10, position: 'relative' }}>
        
        {/* LEFT NEURAL STACK */}
        <div style={{ width: '280px', background: 'rgba(5, 10, 20, 0.8)', borderRight: '1px solid #1e293b', padding: '20px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '0.7rem', color: '#64748b', letterSpacing: '2px', marginBottom: '15px' }}>NEURAL CLUSTERS</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '25px' }}>
            {[
              { id: 'RESEARCHER', c: '#3b82f6', i: '🔍 ANALYZER' },
              { id: 'STRATEGIST', c: '#eab308', i: '💼 INVESTOR' },
              { id: 'RISK_OFFICER', c: '#ef4444', i: '⚠️ SECURITY' },
              { id: 'DIRECTOR', c: '#c084fc', i: '👑 CHAIRMAN' }
            ].map(a => {
              const isActive = activeAgent === a.id;
              return (
                <div key={a.id} style={{ 
                  border: `1px solid ${isActive ? a.c : '#1e293b'}`, 
                  padding: '12px', background: 'rgba(0,0,0,0.4)', borderRadius: '6px',
                  transition: 'all 0.4s ease',
                  transform: isActive ? 'scale(1.03)' : 'scale(1)',
                  boxShadow: isActive ? `0 0 25px ${a.c}44` : 'none',
                  animation: isActive ? 'pulseCard 1s ease-in-out infinite' : 'none'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: a.c, fontSize: '0.75rem', fontWeight: 'bold', letterSpacing: '1px' }}>{a.id.replace('_',' ')}</span>
                    {isActive && <div style={{ width: '8px', height: '8px', background: a.c, borderRadius: '50%', animation: 'pulseGlow 1s infinite' }} />}
                  </div>
                  <div style={{ fontSize: '0.6rem', color: '#94a3b8', marginTop: '4px' }}>{a.i}</div>
                </div>
              );
            })}
          </div>

          {/* PROBABILITY METER */}
          <div style={{ flex: 1, borderTop: '1px dashed #334155', paddingTop: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center' }}>
            <h4 style={{ fontSize: '0.65rem', color: '#94a3b8', letterSpacing: '2px', marginBottom: '10px' }}>PROBABILITY CONFLUENCE</h4>
            <div style={{ 
              fontSize: '4rem', fontWeight: '900', color: score > 70 ? '#10b981' : (score > 40 ? '#eab308' : '#ef4444'),
              textShadow: `0 0 30px ${score > 70 ? 'rgba(16,185,129,0.4)' : 'rgba(239,68,68,0.4)'}`, transition: 'all 1.5s cubic-bezier(0.16, 1, 0.3, 1)',
              fontFamily: 'sans-serif'
            }}>
              {score}<span style={{ fontSize: '1.5rem', opacity: 0.4 }}>%</span>
            </div>
            
            <div style={{ height: '8px', width: '100%', background: '#000', borderRadius: '10px', overflow: 'hidden', border: '1px solid #1e293b', marginTop: '10px' }}>
              <div style={{ 
                height: '100%', width: `${score}%`, 
                background: `linear-gradient(90deg, #2563eb, ${score > 60 ? '#10b981' : '#ef4444'})`, 
                transition: 'width 2s ease-out', boxShadow: '0 0 15px rgba(37,99,235,0.5)'
              }}></div>
            </div>
          </div>
        </div>

        {/* CENTER STAGE */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '25px', gap: '20px', background: 'rgba(0,0,0,0.2)' }}>
          
          <div style={{ background: 'rgba(15, 23, 42, 0.4)', padding: '20px', border: '1px solid #1e293b', borderRadius: '8px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
            <div style={{ fontSize: '0.65rem', color: '#eab308', marginBottom: '10px', letterSpacing: '3px', fontWeight: 'bold' }}>GLOBAL DIRECTIVE INGRESS</div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input 
                type="text"
                placeholder="ENTER MISSION CRITICAL COMMAND..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={!connected}
                style={{
                  flex: 1, padding: '18px', background: '#000', border: '1px solid #334155',
                  color: '#fff', fontFamily: 'monospace', fontSize: '1rem', outline: 'none',
                  boxShadow: 'inset 0 0 10px rgba(0,0,0,0.5)'
                }}
              />
              <button onClick={transmit} disabled={!connected || prompt.trim().length === 0} style={{
                  background: connected && prompt.length > 0 ? 'linear-gradient(135deg, #eab308, #ca8a04)' : '#1e293b',
                  color: '#000', border: 'none', padding: '0 35px', cursor: 'pointer',
                  fontWeight: '900', letterSpacing: '2px', fontSize: '0.8rem', boxShadow: '0 0 20px rgba(234,179,8,0.2)'
                }}>LAUNCH</button>
            </div>
          </div>

          <div style={{ 
            flex: 1, background: 'linear-gradient(to bottom, #000, #050505)', border: '1px solid #1e293b', padding: '20px', 
            overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', boxShadow: 'inset 0 0 40px rgba(0,0,0,1)'
          }}>
            {logs.map((l, i) => {
              let color = '#94a3b8';
              if (l.includes('[RESEARCHER]')) color = '#60a5fa';
              if (l.includes('[STRATEGIST]')) color = '#facc15';
              if (l.includes('[RISK_OFFICER]')) color = '#f87171';
              if (l.includes('[DIRECTOR]')) color = '#c084fc';
              if (l.includes('>>>')) color = '#10b981';
              if (l.includes('---')) color = '#fff';

              return (
                <div key={i} style={{ color, fontSize: '0.85rem', borderLeft: `2px solid ${color}`, paddingLeft: '15px', background: l.includes('[SYSTEM]') ? 'rgba(255,255,255,0.02)' : 'transparent', padding: '8px 15px' }}>
                  <span style={{ opacity: 0.4, fontSize: '0.7rem', marginRight: '15px' }}>{new Date().toLocaleTimeString()}</span>
                  {l}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CYBER MARKET TICKER FOOTER */}
      <div style={{ height: '30px', background: '#000', borderTop: '1px solid #1e293b', display: 'flex', alignItems: 'center', zIndex: 30, overflow: 'hidden' }}>
        <div style={{ background: '#ef4444', color: '#fff', fontWeight: 'bold', padding: '0 10px', fontSize: '0.65rem', height: '100%', display: 'flex', alignItems: 'center', zIndex: 31 }}>LIVE FEED</div>
        <div className="ticker-wrap" style={{ flex: 1, overflow: 'hidden' }}>
          <div className="ticker" style={{ display: 'inline-block', whiteSpace: 'nowrap', paddingLeft: '100%', animation: 'tickerAnimation 30s linear infinite', color: '#22c55e', fontSize: '0.75rem', letterSpacing: '1px' }}>
            ▲ NASDAQ +1.4% // DATA FLOOD DETECTED IN SECTOR 7 // ☢️ ALERT: CROSS-BORDER INFRASTRUCTURE UNDER LOAD // QUANTUM COMPUTE PEAK 99.8% // GLOBAL SENTIMENT: CRITICAL // OPT-IN NETWORK ENGAGED...
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.6; } }
        @keyframes tickerAnimation { 0% { transform: translate3d(0, 0, 0); } 100% { transform: translate3d(-100%, 0, 0); } }
        @keyframes pulseCard { 0%, 100% { border-color: inherit; } 50% { border-color: #fff; } }
        @keyframes pulseGlow { 0% { transform: scale(0.8); opacity: 0.5; } 50% { transform: scale(1.2); opacity: 1; } 100% { transform: scale(0.8); opacity: 0.5; } }
        input:focus { border-color: #eab308 !important; box-shadow: 0 0 15px rgba(234, 179, 8, 0.2) !important; }
      `}</style>
    </div>
  );
}
