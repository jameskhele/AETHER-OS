'use client';
import { useState, useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as random from 'maath/random/dist/maath-random.esm';

function ParticleGrid(props: any) {
  const ref = useRef<any>();
  const sphere = useMemo(() => random.inSphere(new Float32Array(5000), { radius: 1.5 }), []);
  
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 10;
      ref.current.rotation.y -= delta / 15;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled {...props}>
        <PointMaterial
          transparent
          color="#3b82f6"
          size={0.005}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
}

export default function Home() {
  const [logs, setLogs] = useState<string[]>([]);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8000/ws/stream');
    socketRef.current = socket;

    socket.onopen = () => {
      setConnected(true);
      setLogs(p => [...p, "[NETWORK] Connected to Local Gateway."]);
    };

    socket.onmessage = (e) => setLogs(p => [...p, `[GATEWAY] > ${e.data}`]);
    socket.onerror = () => setLogs(p => [...p, "[NETWORK] Gateway Offline. Ready for Cloud Ingress."]);

    return () => socket.close();
  }, []);

  const transmit = () => {
    if (socketRef.current && connected) {
      setLogs(p => [...p, "[SYSTEM] Triggering sequence..."]);
      socketRef.current.send("INIT");
    }
  };

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', background: '#000', overflow: 'hidden', fontFamily: 'monospace' }}>
      
      {/* 3D Visualization Layer */}
      <div style={{ position: 'absolute', width: '100%', height: '100%', zIndex: 0 }}>
        <Canvas camera={{ position: [0, 0, 1] }}>
          <ParticleGrid />
        </Canvas>
      </div>

      {/* UI Overlay Layer */}
      <div style={{ 
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', 
        zIndex: 10, pointerEvents: 'all', textAlign: 'center'
      }}>
        
        <div style={{
          border: `1px solid ${connected ? 'rgba(34, 197, 94, 0.4)' : 'rgba(59, 130, 246, 0.3)'}`, 
          padding: '40px', borderRadius: '12px', background: 'rgba(0, 0, 0, 0.8)', 
          backdropFilter: 'blur(10px)', boxShadow: '0 0 40px rgba(0,0,0,0.5)', minWidth: '400px'
        }}>
          <h1 style={{ color: '#fff', letterSpacing: '8px', fontSize: '2.2rem', margin: 0 }}>AETHER OS</h1>
          <p style={{ color: '#3b82f6', fontSize: '0.75rem', letterSpacing: '2px', margin: '8px 0 30px 0' }}>NEURAL MESH ARCHITECTURE</p>

          <div style={{ height: '120px', overflow: 'hidden', background: 'rgba(0,0,0,0.4)', border: '1px solid #1e293b', padding: '10px', textAlign: 'left', fontSize: '0.7rem', marginBottom: '20px' }}>
            {logs.slice(-5).map((l, i) => <div key={i} style={{ color: '#94a3b8', marginBottom: '4px' }}>{l}</div>)}
          </div>

          <button 
            onClick={transmit}
            disabled={!connected}
            style={{
              background: 'transparent', border: `1px solid ${connected ? '#22c55e' : '#334155'}`,
              color: connected ? '#22c55e' : '#475569', padding: '12px 24px', cursor: connected ? 'pointer' : 'not-allowed'
            }}>
            {connected ? 'ACTIVATE CORE SYSTEM' : 'AWAITING COMMAND LINK'}
          </button>
        </div>
      </div>
    </div>
  );
}
