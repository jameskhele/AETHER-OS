const { WebSocketServer } = require('ws');
const https = require('https');

const wss = new WebSocketServer({ port: 8000 });
const API_KEY = "AIzaSyB9HYFnFeHNvzdQYSuQm1m6_O2PlO46WjE";

console.log("\n💠 AETHER OS COMMAND CORE IS LIVE");
console.log("🚀 DYNAMIC GOOGLE AI DISCOVERY ACTIVE");
console.log("⚡ Awaiting Ingress Signals...\n");

wss.on('connection', function connection(ws) {
  console.log("[LINK] Dashboard Connected.");
  ws.send("SYSTEMS NOMINAL :: AUTO-DISCOVERY ENABLED");

  ws.on('message', function message(data) {
    console.log(`[RX] Query Detected. Self-Discovering best model...`);
    ws.send("[ORCHESTRATOR] Analyzing dynamic Google capability array...");

    // 1. Dynamically query exactly which models Google wants us to use
    https.get(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`, (res) => {
      let body = '';
      res.on('data', (d) => body += d);
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          const modelList = json.models || [];
          // Find the absolute best supported Gemini model automatically
          const found = modelList.find(m => m.name.includes('gemini') && m.supportedGenerationMethods.includes('generateContent'));
          
          if (!found) throw new Error("No Gemini found.");
          
          const bestModel = found.name;
          console.log(`[SYS] Model Identified: ${bestModel}`);
          ws.send(`[SYS] Neural path secured to ${bestModel}`);

          // Define the 3 Specialized Brain Persona Waves!
          const agents = [
            { name: "RESEARCHER", prefix: "🔍", role: "Act as a genius analyst. Provide one critical global data point about this: " },
            { name: "STRATEGIST", prefix: "💼", role: "Act as a greedy Wall Street Shark investor. Give one high-profit strategy for this: " },
            { name: "RISK_OFFICER", prefix: "⚠️", role: "Act as a paranoid security officer. Give one dangerous warning regarding this: " }
          ];

          // Function to prompt Google for one single agent logic wave
          const runAgent = async (agent) => {
            return new Promise((resolve) => {
              ws.send(`[DEPLOYING] Waking up the ${agent.name}...`);
              const postData = JSON.stringify({
                contents: [{ parts: [{ text: `${agent.role} "${data}". Output EXACTLY one brief sentence. Plain text.` }] }]
              });
              const options = {
                hostname: 'generativelanguage.googleapis.com',
                path: `/v1beta/${bestModel}:generateContent?key=${API_KEY}`,
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
              };
              const req = https.request(options, (res2) => {
                let r = '';
                res2.on('data', (d) => r += d);
                res2.on('end', () => {
                  try {
                    const j = JSON.parse(r);
                    const txt = j.candidates[0].content.parts[0].text.replace(/\n/g, ' ').trim();
                    ws.send(`[${agent.name}] ${agent.prefix} ${txt}`);
                    resolve();
                  } catch (err) { ws.send(`[${agent.name}] Logic Fault.`); resolve(); }
                });
              });
              req.write(postData); req.end();
            });
          };

          // Execute the Sequence Sequentially (Wait for each agent to finish their thought!)
          (async () => {
            for (const agent of agents) {
              await runAgent(agent);
              await new Promise(r => setTimeout(r, 800)); // Brief pause for dramatic dashboard effect!
            }
            ws.send(">>> FULL AGENT DEBATE COMPLETE <<<");
            console.log("[SERVER] Multi-Agent cycle finished.");
          })();

        } catch (e) {
          console.log("Discovery Error:", body);
          ws.send("[ERROR] Self-Discovery system failure.");
        }
      });
    });
  });
});
