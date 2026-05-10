const { WebSocketServer } = require('ws');
const https = require('https');

const wss = new WebSocketServer({ port: 8000 });
const API_KEY = "AIzaSyB9HYFnFeHNvzdQYSuQm1m6_O2PlO46WjE";

console.log("\n💠 AETHER OS COMMAND CORE IS LIVE");
console.log("🚀 DIRECT GOOGLE DIRECT-LINK ARMED");
console.log("⚡ Awaiting Ingress Signals...\n");

wss.on('connection', function connection(ws) {
  console.log("[LINK] Dashboard Connected.");
  ws.send("SYSTEMS NOMINAL :: DIRECT LINK READY");

  ws.on('message', function message(data) {
    console.log(`[RX] Command Received. Blasting to Google REST Edge...`);
    
    ws.send("[ORCHESTRATOR] Using DIRECT HTTP RAY to Google Edge...");

    const postData = JSON.stringify({
      contents: [{ parts: [{ text: "You are elite AI. Output 3 SHORT bullet points on AI Risk Analysis. No intro, plain text." }] }]
    });

    const options = {
      hostname: 'generativelanguage.googleapis.com',
      path: `/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (d) => body += d);
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          const txt = json.candidates[0].content.parts[0].text;
          const lines = txt.split('\n').filter(l => l.trim().length > 0);
          
          ws.send(`[RESEARCH] ${lines[0] || 'Data Safe.'}`);
          setTimeout(() => ws.send(`[STRATEGY] ${lines[1] || 'Optimized.'}`), 500);
          setTimeout(() => ws.send(`[RISK] ${lines[2] || 'Secure.'}`), 1000);
          setTimeout(() => ws.send(">>> MISSION COMPLETE. <<<"), 1500);
          console.log("[TX] Real Google intelligence relayed.");
        } catch (e) {
          console.log("Google Data Error:", body);
          ws.send("[ERROR] Google server error. Check key status.");
        }
      });
    });

    req.on('error', (e) => {
      console.error(e);
      ws.send("[ERROR] Connection Timed Out.");
    });

    req.write(postData);
    req.end();
  });
});
