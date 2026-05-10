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
          
          const bestModel = found.name; // e.g. "models/gemini-1.5-flash"
          console.log(`[SUCCESS] Auto-Discovered Active Model: ${bestModel}`);
          ws.send(`[SYS] Locked to active model: ${bestModel}`);

          // 2. Fire the real payload using that exact found model
          const postData = JSON.stringify({
            contents: [{ parts: [{ text: "Briefly in 3 short plain text bullet points output a critical risk analysis for Global Economy. No markdown." }] }]
          });

          const options = {
            hostname: 'generativelanguage.googleapis.com',
            path: `/v1beta/${bestModel}:generateContent?key=${API_KEY}`,
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
          };

          const req = https.request(options, (res2) => {
            let resp = '';
            res2.on('data', (d) => resp += d);
            res2.on('end', () => {
              try {
                const final = JSON.parse(resp);
                const txt = final.candidates[0].content.parts[0].text;
                const lines = txt.split('\n').filter(l => l.trim().length > 0);
                ws.send(`[RESEARCH] ${lines[0] || 'Ready.'}`);
                setTimeout(() => ws.send(`[STRATEGY] ${lines[1] || 'Armed.'}`), 500);
                setTimeout(() => ws.send(`[RISK] ${lines[2] || 'Final.'}`), 1000);
                setTimeout(() => ws.send(">>> LIVE INTELLIGENCE SECURED. <<<"), 1500);
                console.log("[DONE] Response Served.");
              } catch (ex) {
                ws.send("[ERROR] Brain failed to generate.");
                console.log("Final error:", resp);
              }
            });
          });
          req.write(postData);
          req.end();

        } catch (e) {
          console.log("Discovery Error:", body);
          ws.send("[ERROR] Self-Discovery system failure.");
        }
      });
    });
  });
});
