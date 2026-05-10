'use client';
import { useEffect, useRef } from 'react';
import type { WebSocketMessage } from '@aether/types';
import { useAetherStore } from '../store/useAetherStore';

export default function Home() {
  // ATOMIC SELECTORS FROM ZUSTAND MASTER STORE
  const { 
    logs, history, connected, prompt, score, activeAgent, 
    setConnected, setPrompt, addLog, setHistory, clearTelemetry, updateAgentActivity, setScore 
  } = useAetherStore();
  
  const { dataVal, greedVal, dangerVal } = useAetherStore((s) => s.telemetry);

  const socketRef = useRef<WebSocket | null>(null);

  // 🛰️ SYNC: Load Historical Archives from SQL!
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const res = await fetch('/api/history').then(r => r.json());
        if (res.success) setHistory(res.data);
      } catch (e) { console.error("ARCHIVE LOAD FAILURE", e); }
    };
    loadHistory();
    
    // Periodically poll every 30s for total consistency
    const itvl = setInterval(loadHistory, 30000);
    return () => clearInterval(itvl);
  }, [setHistory]);

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
      addLog({ type: 'NETWORK', content: 'SECURE LINK ESTABLISHED', timestamp: new Date().toISOString() });
      speakText("Neural Connection Established.");
    };

    socket.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data) as WebSocketMessage;
        addLog(msg);

        if (msg.sender === 'RESEARCHER') {
          updateAgentActivity('RESEARCHER', Math.floor(Math.random() * 25) + 70, 0, 0);
        } else if (msg.sender === 'STRATEGIST') {
          updateAgentActivity('STRATEGIST', 0, Math.floor(Math.random() * 20) + 80, 0);
        } else if (msg.sender === 'RISK_OFFICER') {
          updateAgentActivity('RISK_OFFICER', 0, 0, Math.floor(Math.random() * 40) + 50);
        } else if (msg.sender === 'DIRECTOR') {
          updateAgentActivity('DIRECTOR', 0, 0, 0);
        }

        const scoreMatch = msg.content.match(/\[SCORE:\s*(\d+)\]/i);
        if (scoreMatch) {
          setScore(Number(scoreMatch[1]));
        }

        if (msg.type === 'ANALYSIS') {
          speakText(msg.content);
        }
      } catch (err) {
        console.error("MALFORMED FRAME RECEIVED:", e.data);
      }
    };
    return () => socket.close();
  }, [addLog, setConnected, setScore, updateAgentActivity]);

  const transmit = () => {
    if (socketRef.current && connected && prompt.trim().length > 0) {
      clearTelemetry();
      addLog({ type: 'SYSTEM', content: `--- MISSION LAUNCH: ${prompt} ---`, timestamp: new Date().toISOString() });
      socketRef.current.send(prompt);
    }
  };

  const downloadBrief = () => {
    const logText = logs.map(m => `[${m.timestamp}] ${m.sender || 'SYSTEM'}: ${m.content}`).join('\n');
    const content = `JK SYSTEMS - AETHER OS EXECUTIVE BRIEF\nDATE: ${new Date().toLocaleString()}\nDIRECTIVE: ${prompt}\n\nREPORT LOGS:\n\n${logText}`;
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

      {/* MAIN THREE-COLUMN VIEWPORT */}
      <div style={{ flex: 1, display: 'flex', zIndex: 10, position: 'relative' }}>
        
        {/* LEFT NEURAL STACK (Column 1) */}
        <div style={{ width: '260px', background: 'rgba(5, 10, 20, 0.8)', borderRight: '1px solid #1e293b', padding: '20px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '0.65rem', color: '#64748b', letterSpacing: '2px', marginBottom: '15px' }}>NEURAL CLUSTERS</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
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
                  padding: '10px', background: 'rgba(0,0,0,0.4)', borderRadius: '4px',
                  transition: 'all 0.4s ease',
                  transform: isActive ? 'scale(1.02)' : 'scale(1)',
                  boxShadow: isActive ? `0 0 20px ${a.c}33` : 'none',
                  animation: isActive ? 'pulseCard 1s ease-in-out infinite' : 'none'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: a.c, fontSize: '0.7rem', fontWeight: 'bold' }}>{a.id.replace('_',' ')}</span>
                  </div>
                  <div style={{ fontSize: '0.55rem', color: '#64748b', marginTop: '2px' }}>{a.i}</div>
                </div>
              );
            })}
          </div>

          {/* PROBABILITY METER */}
          <div style={{ borderTop: '1px dashed #334155', paddingTop: '15px', marginBottom: '20px', textAlign: 'center' }}>
            <h4 style={{ fontSize: '0.6rem', color: '#94a3b8', letterSpacing: '2px', marginBottom: '5px' }}>CONFLUENCE</h4>
            <div style={{ 
              fontSize: '3rem', fontWeight: '900', color: score > 70 ? '#10b981' : (score > 40 ? '#eab308' : '#ef4444'),
              textShadow: `0 0 25px ${score > 70 ? 'rgba(16,185,129,0.4)' : 'rgba(239,68,68,0.4)'}`, transition: 'all 1.5s',
              fontFamily: 'sans-serif'
            }}>
              {score}<span style={{ fontSize: '1rem', opacity: 0.4 }}>%</span>
            </div>
            <div style={{ height: '6px', width: '100%', background: '#000', borderRadius: '10px', overflow: 'hidden', border: '1px solid #1e293b', marginTop: '5px' }}>
              <div style={{ 
                height: '100%', width: `${score}%`, 
                background: `linear-gradient(90deg, #2563eb, ${score > 60 ? '#10b981' : '#ef4444'})`, 
                transition: 'width 2s ease-out', boxShadow: '0 0 10px rgba(37,99,235,0.5)'
              }}></div>
            </div>
          </div>

          {/* 🏛️ MISSION ARCHIVE DECK */}
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '5px', borderTop: '1px solid #1e293b', paddingTop: '15px' }}>
            <h3 style={{ fontSize: '0.65rem', color: '#64748b', letterSpacing: '2px', marginBottom: '8px' }}>HISTORY VAULT</h3>
            
            {history.length === 0 ? (
              <div style={{ fontSize: '0.6rem', opacity: 0.4, fontStyle: 'italic' }}>NO PRIOR MISSIONS</div>
            ) : (
              history.map((h: any) => (
                <div key={h.id} style={{ 
                  padding: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid #0f172a', 
                  borderRadius: '3px', cursor: 'pointer'
                }} onMouseOver={(e) => e.currentTarget.style.borderColor = '#3b82f6'} onMouseOut={(e) => e.currentTarget.style.borderColor = '#0f172a'}
                   onClick={() => setPrompt(h.prompt)}>
                  <div style={{ fontSize: '0.7rem', color: '#e2e8f0', fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {h.prompt}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.55rem', color: '#475569', marginTop: '3px' }}>
                    <span>{new Date(h.createdAt).toLocaleDateString()}</span>
                    <span style={{ color: '#10b981' }}>{h._count?.logs || 0} LOGS</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* CENTER STAGE (Column 2) */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '20px', gap: '15px', background: 'rgba(0,0,0,0.2)' }}>
          
          <div style={{ background: 'rgba(15, 23, 42, 0.4)', padding: '15px', border: '1px solid #1e293b', borderRadius: '6px' }}>
            <div style={{ fontSize: '0.6rem', color: '#eab308', marginBottom: '8px', letterSpacing: '3px', fontWeight: 'bold' }}>DIRECTIVE INPUT</div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input 
                type="text" placeholder="AWAITING OPERATIONAL COMMAND..." value={prompt} onChange={(e) => setPrompt(e.target.value)} disabled={!connected}
                style={{ flex: 1, padding: '12px', background: '#000', border: '1px solid #334155', color: '#fff', fontSize: '0.9rem', outline: 'none' }}
              />
              <button onClick={transmit} disabled={!connected || prompt.trim().length === 0} style={{
                  background: connected && prompt.length > 0 ? 'linear-gradient(135deg, #eab308, #ca8a04)' : '#1e293b',
                  color: '#000', border: 'none', padding: '0 25px', cursor: 'pointer', fontWeight: '900', letterSpacing: '2px', fontSize: '0.75rem'
                }}>LAUNCH</button>
            </div>
          </div>

          <div style={{ 
            flex: 1, background: 'linear-gradient(to bottom, #000, #050505)', border: '1px solid #1e293b', padding: '15px', 
            overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', boxShadow: 'inset 0 0 30px rgba(0,0,0,1)'
          }}>
            {logs.map((m, i) => {
              let color = '#94a3b8'; // Default
              if (m.sender === 'RESEARCHER') color = '#60a5fa';
              if (m.sender === 'STRATEGIST') color = '#facc15';
              if (m.sender === 'RISK_OFFICER') color = '#f87171';
              if (m.sender === 'DIRECTOR') color = '#c084fc';
              if (m.type === 'NETWORK' || m.sender === 'SYS') color = '#10b981';
              if (m.type === 'DEPLOY') color = '#334155';
              if (m.type === 'ERROR') color = '#ef4444';

              const timeLabel = m.timestamp ? new Date(m.timestamp).toLocaleTimeString() : new Date().toLocaleTimeString();

              return (
                <div key={i} style={{ 
                  color, 
                  fontSize: '0.8rem', 
                  borderLeft: `2px solid ${color}`, 
                  padding: '6px 12px', 
                  background: m.type === 'SYSTEM' ? 'rgba(255,255,255,0.02)' : 'transparent',
                  fontFamily: 'monospace'
                }}>
                  <span style={{ opacity: 0.3, fontSize: '0.6rem', marginRight: '10px' }}>[{timeLabel}]</span>
                  {m.sender && <span style={{ fontWeight: 'bold', letterSpacing: '1px', opacity: 0.7, marginRight: '8px' }}>[{m.sender}]</span>}
                  <span style={{ color: '#fff', opacity: m.type === 'DEPLOY' ? 0.5 : 1 }}>{m.content}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COMMAND DECK (Column 3) */}
        <div style={{ width: '280px', background: 'rgba(5, 10, 20, 0.9)', borderLeft: '1px solid #1e293b', padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* VISUAL ANALYTICS GRAPHS */}
          <div>
            <h3 style={{ fontSize: '0.65rem', color: '#64748b', letterSpacing: '2px', marginBottom: '15px' }}>SENTIMENT DENSITY</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', height: '120px', alignItems: 'flex-end', padding: '0 10px', borderBottom: '1px solid #334155' }}>
              {[
                { label: 'DATA', val: dataVal, color: '#3b82f6' },
                { label: 'GREED', val: greedVal, color: '#eab308' },
                { label: 'DANGER', val: dangerVal, color: '#ef4444' }
              ].map(b => (
                <div key={b.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '30%' }}>
                  <div style={{ 
                    width: '100%', height: `${b.val}%`, background: b.color, 
                    transition: 'height 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)', boxShadow: `0 0 15px ${b.color}55`,
                    borderRadius: '2px 2px 0 0'
                  }} />
                  <div style={{ fontSize: '0.55rem', color: '#94a3b8', marginTop: '6px' }}>{b.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* AUTONOMOUS ACTIONS */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px', borderTop: '1px dashed #334155', paddingTop: '20px' }}>
            <h3 style={{ fontSize: '0.65rem', color: '#eab308', letterSpacing: '2px', marginBottom: '5px' }}>AUTONOMOUS ACTION</h3>
            
            {[
              { t: '🟢 INITIATE SCALE', a: 'Expedite scaling and launch immediate funding round.', c: '#10b981' },
              { t: '🔴 ABORT MISSION', a: 'Execute immediate failsafe protocols and halt all actions.', c: '#ef4444' },
              { t: '🔵 RE-SCAN VECTOR', a: 'Perform deep audit scanning for alternative data vectors.', c: '#3b82f6' }
            ].map(act => (
              <button key={act.t} 
                onClick={() => { setPrompt(act.a); setTimeout(() => transmit(), 100); }}
                disabled={!connected || score === 0}
                style={{
                  background: 'rgba(0,0,0,0.3)', border: `1px solid ${score > 0 ? act.c : '#334155'}`,
                  color: score > 0 ? act.c : '#64748b', padding: '12px', fontSize: '0.65rem', textAlign: 'left',
                  cursor: score > 0 ? 'pointer' : 'not-allowed', borderRadius: '4px', transition: 'all 0.2s',
                  fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase'
                }}
                onMouseOver={(e) => score > 0 && (e.currentTarget.style.background = act.c + '22')}
                onMouseOut={(e) => score > 0 && (e.currentTarget.style.background = 'rgba(0,0,0,0.3)')}
              >
                {act.t}
              </button>
            ))}
            <p style={{ fontSize: '0.55rem', color: '#64748b', fontStyle: 'italic', marginTop: '5px' }}>
              *Actions lock until Node Consensus is satisfied.
            </p>
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
