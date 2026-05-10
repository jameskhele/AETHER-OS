'use client';

export default function Home() {
  return (
    <div style={{
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100vh', 
      textAlign: 'center',
      background: 'radial-gradient(circle at center, #111827 0%, #000000 100%)'
    }}>
      
      <div style={{
        border: '1px solid #3b82f6',
        padding: '40px',
        borderRadius: '12px',
        background: 'rgba(0,0,0,0.6)',
        boxShadow: '0 0 40px rgba(59, 130, 246, 0.2)'
      }}>
        <h1 style={{ fontSize: '3rem', letterSpacing: '8px', color: '#fff', margin: '0 0 10px 0' }}>AETHER OS</h1>
        <div style={{ color: '#3b82f6', fontSize: '0.9rem', letterSpacing: '2px', marginBottom: '30px' }}>
          // AUTONOMOUS MULTI-AGENT COMMAND CENTER
        </div>
        
        <div style={{ 
          padding: '15px', 
          border: '1px dashed #22c55e', 
          color: '#22c55e', 
          fontSize: '0.8rem',
          animation: 'pulse 2s infinite'
        }}>
          ● STATUS: INFRASTRUCTURE GENESIS LOADED SUCCESSFULLY
        </div>

        <p style={{ color: '#9ca3af', marginTop: '20px', fontSize: '0.8rem' }}>
          Ready to initialize neural mesh and visual grid.
        </p>
      </div>

      <style jsx global>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.6; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  )
}
