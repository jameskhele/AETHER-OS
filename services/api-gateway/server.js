const { WebSocketServer } = require('ws');
const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");

const wss = new WebSocketServer({ port: 8000 });

// Initialize Real Google Brain securely
const model = new ChatGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
  modelName: "gemini-1.5-flash",
  maxOutputTokens: 200,
});

console.log("\n💠 AETHER OS COMMAND CORE IS LIVE");
console.log("🧠 GOOGLE GEMINI ENGINE CONNECTED & READY");
console.log("⚡ Awaiting Ingress Signals...\n");

wss.on('connection', function connection(ws) {
  console.log("[LINK] Dashboard Secured.");
  ws.send("SYSTEMS NOMINAL :: BRAIN ENGAGED");

  ws.on('message', async function message(data) {
    console.log(`[RX] Command Detected.`);
    
    const stream = (m) => ws.send(m);

    try {
      stream("[ORCHESTRATOR] Routing Mission Request to Gemini Neural Cluster...");
      
      // Live Real AI Call!
      const response = await model.invoke("You are an elite autonomous military intelligence AI. Briefly in 3 short lines output a critical analysis report on 'Global AI Competition Risks'. No markdown.");
      
      const lines = response.content.toString().split('\n').filter(l => l.trim().length > 0);
      
      setTimeout(() => stream(`[RESEARCH] ${lines[0] || 'Data Secure.'}`), 500);
      setTimeout(() => stream(`[STRATEGY] ${lines[1] || 'Path Optimized.'}`), 1500);
      setTimeout(() => stream(`[RISK_AGENT] ${lines[2] || 'Calculus Confirmed.'}`), 2500);
      setTimeout(() => stream(">>> REAL INTELLIGENCE MISSION CONCLUDED. <<<"), 3500);

      console.log("[AI] Real response served to client.");

    } catch (error) {
      console.error("AI Fail:", error);
      stream("[ERROR] Failed to wake up the Google Brain. Ensure Key is set.");
    }
  });
});
