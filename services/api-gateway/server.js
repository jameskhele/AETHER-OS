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
          const j = JSON.parse(body);
          
          // DUMP THE ENTIRE LIST OF MODELS TO THE UI SO WE CAN SEE OUR CHOICES!
          const allModels = j.models ? j.models.map(m => m.name.replace('models/','')).join(', ') : 'None';
          ws.send(`[INVENTORY] AVAILABLE MODELS: ${allModels}`);

          // THE ULTIMATE VERIFIED MODEL FALLBACK ARRAY FROM YOUR INVENTORY!
          const targetOrder = [
            'gemini-flash-lite-latest',  // High-volume stable king!
            'gemini-flash-latest', 
            'gemini-3.1-flash-lite'     // The new super-experimental fallback!
          ];
          
          let found = null;
          for (const target of targetOrder) {
            found = j.models.find(m => 
              m.supportedGenerationMethods.includes('generateContent') && 
              m.name.includes(target)
            );
            if (found) break;
          }
          
          // LAST RESORT FROM YOUR ACTUAL MANIFEST
          if (!found) {
             found = j.models.find(m => m.supportedGenerationMethods.includes('generateContent') && !m.name.includes('gemma'));
          }

          if (!found) throw new Error("NO COMPATIBLE BRAINS FOUND.");
          
          const bestModel = found.name;
          console.log(`[SYS] Model Identified: ${bestModel}`);
          ws.send(`[SYS] Neural path secured to ${bestModel}`);

          // Define the 4 Brain Persona Waves, including the Final Boss (Director)!
          const agents = [
            { name: "RESEARCHER", prefix: "🔍", role: "Act as analyst. Give 1 global data point. Include 1 relevant emoji: " },
            { name: "STRATEGIST", prefix: "💼", role: "Act as greedy investor. Give 1 high-profit step. Include 1 money emoji: " },
            { name: "RISK_OFFICER", prefix: "⚠️", role: "Act as security head. Give 1 dire warning. Include 1 danger emoji: " },
            { name: "DIRECTOR", prefix: "👑", role: "Act as Chief Director. Combine the logic into one summary sentence with emojis, and AT THE VERY END of the line you MUST include exactly '[SCORE: XX]' replacing XX with a calculated number from 0 to 100 representing success chance of this prompt: " }
          ];

          // Function to prompt Google for one single agent logic wave
          const runAgent = async (agent) => {
            return new Promise((resolve) => {
              ws.send(`[DEPLOYING] Directing current stream to ${agent.name}...`);
              const postData = JSON.stringify({
                contents: [{ parts: [{ text: `${agent.role} "${data}". Brief one-sentence reply.` }] }],
                safetySettings: [
                  { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
                  { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
                  { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
                  { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }
                ]
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
                    if (j.error) throw new Error(j.error.message);
                    const txt = j.candidates[0].content.parts[0].text.replace(/\n/g, ' ').trim();
                    ws.send(`[${agent.name}] ${agent.prefix} ${txt}`);
                    resolve();
                  } catch (err) { 
                    console.log(`[AGENT FAILED] Raw Body: ${r}`);
                    // Expose real error to user so we can fix it!
                    ws.send(`[${agent.name}] ERROR: ${r.substring(0, 120).replace(/\n/g, '')}`); 
                    resolve(); 
                  }
                });
              });
              req.write(postData); req.end();
            });
          };

          // Execute the full 4-person debate cycle
          (async () => {
            for (const agent of agents) {
              await runAgent(agent);
              await new Promise(r => setTimeout(r, 900)); // Beautiful paced dashboard effect
            }
            ws.send(">>> ALL NODES SYNCHRONIZED. CONSULT SCORE MATRIX. <<<");
            console.log("[CYBER] Complete operational sequence satisfied.");
          })();

        } catch (e) {
          console.log("Discovery Error:", body);
          ws.send("[ERROR] Self-Discovery system failure.");
        }
      });
    });
  });
});
