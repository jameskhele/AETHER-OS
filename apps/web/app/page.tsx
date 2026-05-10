'use client';
import { useState } from 'react';

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const bootSequence = () => {
    setIsLoaded(true);
    setLogs(["[SYSTEM] Booting Kernel...", "[SYSTEM] Establishing WebSocket Handshake..."]);
    
    setTimeout(() => setLogs(p => [...p, "[SYSTEM] Initializing LangGraph Nodes..."]), 1000);
    setTimeout(() => setLogs(p => [...p, "[AI] Research Node: ONLINE", "[AI] Risk Node: ONLINE"]), 2000);
    setTimeout(() => setLogs(p => [...p, ">> AETHER OS SUCCESSFULLY ARMED <<"]), 3500);
  };

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', 
      height: '100vh', background: 'radial-gradient(circle at center, #0f172a 0%, #000000 100%)', fontFamily: 'monospace'
    }}>
      
      <div style={{
        border: '1px solid #3b82f6', padding: '40px', borderRadius: '12px', 
        background: 'rgba(0,0,0,0.7)', boxShadow: '0 0 50px rgba(59, 130, 246, 0.25)', textAlign: 'center', minWidth: '400px'
      }}>
        <h1 style={{ fontSize: '2.5rem', letterSpacing: '10px', color: '#fff', margin: 0 }}>AETHER OS</h1>
        <p style={{ color: '#60a5fa', fontSize: '0.8rem', letterSpacing: '2px', margin: '10px 0 30px 0' }}>MULTI-AGENT INFRASTRUCTURE</p>

        {!isLoaded ? (
          <button 
            onClick={bootSequence}
            style={{
              background: 'transparent', border: '1px solid #22c55e', color: '#22c55e',
              padding: '15px 30px', cursor: 'pointer', fontSize: '1rem', letterSpacing: '2px',
              textShadow: '0 0 5px #22c55e', boxShadow: '0 0 10px rgba(34, 197, 94, 0.3)'
            }}>
            INITIALIZE CORE SYS //
          </button>
        ) : (
          <div style={{ background: '#000', border: '1px solid #1e293b', padding: '15px', textAlign: 'left', fontSize: '0.8rem' }}>
            {logs.map((l, i) => (
              <div key={i} style={{ color: l.includes('>>') ? '#22c55e' : '#94a3b8', margin: '4px 0' }}>
                {l}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
