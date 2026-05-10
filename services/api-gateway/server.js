const { WebSocketServer } = require('ws');
const https = require('https');
const { PrismaClient } = require('@prisma/client');

// 🏛️ Establish Centralized SQL Connection
const prisma = new PrismaClient();

const wss = new WebSocketServer({ port: 8000 });
const API_KEY = "AIzaSyB9HYFnFeHNvzdQYSuQm1m6_O2PlO46WjE";

// HEALING PROTOCOL: Automatically ensures a functional multi-tenant sandbox exists!
async function resolveActiveTenant() {
  let org = await prisma.organization.findFirst();
  if (!org) org = await prisma.organization.create({ data: { name: "JK GLOBAL ENTERPRISE", slug: "jk-global" } });
  
  let user = await prisma.user.findFirst({ where: { organizationId: org.id } });
  if (!user) user = await prisma.user.create({ data: { email: "james@jk-global.dev", name: "James Architect", organizationId: org.id, role: "OWNER" } });
  
  return { orgId: org.id, userId: user.id };
}

console.log("\n💠 AETHER OS COMMAND CORE IS LIVE");
console.log("💾 SQL TRANSACTIONAL PIPELINE LINKED");
console.log("⚡ Awaiting Ingress Signals...\n");

wss.on('connection', function connection(ws) {
  console.log("[LINK] Dashboard Connected.");
  ws.send(JSON.stringify({ 
    type: 'NETWORK', 
    content: 'SYSTEMS NOMINAL :: AUTO-DISCOVERY ENABLED', 
    timestamp: new Date().toISOString() 
  }));

  ws.on('message', async function message(data) {
    console.log(`[RX] Query Detected. Persisting to SQL Vault...`);
    
    // 1. Instantiate SQL Context
    const tenant = await resolveActiveTenant();
    const mission = await prisma.mission.create({
      data: {
        prompt: data.toString(),
        organizationId: tenant.orgId,
        creatorId: tenant.userId,
        status: "IN_PROGRESS"
      }
    });

    // Helper to dynamically insert telemetry streams!
    const persistLog = async (type, sender, content) => {
      try {
        await prisma.logEntry.create({
          data: { missionId: mission.id, type, sender, content: String(content) }
        });
      } catch (e) { console.error("DB Write Failed", e.message); }
    };

    await persistLog("SYSTEM", "ORCHESTRATOR", "MISSION TRANSACTION INITIATED");
    ws.send(JSON.stringify({ 
      type: 'SYSTEM', 
      sender: 'ORCHESTRATOR', 
      content: 'Analyzing dynamic Google capability array...', 
      timestamp: new Date().toISOString() 
    }));

    // 1. Dynamically query exactly which models Google wants us to use
    https.get(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`, (res) => {
      let body = '';
      res.on('data', (d) => body += d);
      res.on('end', async () => {
        try {
          const j = JSON.parse(body);
          
          // 1. EVENT: INVENTORY MANIFEST
          const allModels = j.models ? j.models.map(m => m.name.replace('models/','')).join(', ') : 'None';
          ws.send(JSON.stringify({ type: 'INVENTORY', content: allModels, timestamp: new Date().toISOString() }));
          await persistLog('INVENTORY', null, allModels);

          const targetOrder = [
            'gemini-flash-lite-latest', 
            'gemini-flash-latest', 
            'gemini-3.1-flash-lite'
          ];
          
          let found = null;
          for (const target of targetOrder) {
            found = j.models.find(m => 
              m.supportedGenerationMethods.includes('generateContent') && 
              m.name.includes(target)
            );
            if (found) break;
          }
          if (!found) {
             found = j.models.find(m => m.supportedGenerationMethods.includes('generateContent') && !m.name.includes('gemma'));
          }
          if (!found) throw new Error("NO COMPATIBLE BRAINS FOUND.");
          
          const bestModel = found.name;
          console.log(`[SYS] Model Identified: ${bestModel}`);

          // 2. EVENT: SYSTEM LINK
          ws.send(JSON.stringify({ type: 'SYSTEM', sender: 'SYS', content: `Neural path secured to ${bestModel}`, timestamp: new Date().toISOString() }));
          await persistLog('SYSTEM', 'SYS', `Neural path secured to ${bestModel}`);

          const agents = [
            { name: "RESEARCHER", prefix: "🔍", role: "Act as analyst. Give 1 global data point. Include 1 relevant emoji: " },
            { name: "STRATEGIST", prefix: "💼", role: "Act as greedy investor. Give 1 high-profit step. Include 1 money emoji: " },
            { name: "RISK_OFFICER", prefix: "⚠️", role: "Act as security head. Give 1 dire warning. Include 1 danger emoji: " },
            { name: "DIRECTOR", prefix: "👑", role: "Act as Chief Director. Combine logic into one final sentence plus [SCORE: XX]: " }
          ];

          const runAgent = async (agent) => {
            return new Promise(async (resolve) => {
              // 3. EVENT: DEPLOY NOTIFICATION
              ws.send(JSON.stringify({ type: 'DEPLOY', content: `Directing stream to ${agent.name}...`, timestamp: new Date().toISOString() }));
              await persistLog('DEPLOY', agent.name, `Directing stream to ${agent.name}...`);
              
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
                res2.on('end', async () => {
                  try {
                    const responseJson = JSON.parse(r);
                    if (responseJson.error) throw new Error(responseJson.error.message);
                    const txt = responseJson.candidates[0].content.parts[0].text.replace(/\n/g, ' ').trim();
                    
                    // 4. EVENT: ANALYSIS RESULT
                    ws.send(JSON.stringify({ 
                      type: 'ANALYSIS', 
                      sender: agent.name, 
                      content: `${agent.prefix} ${txt}`,
                      timestamp: new Date().toISOString()
                    }));
                    await persistLog('ANALYSIS', agent.name, `${agent.prefix} ${txt}`);
                    resolve();
                  } catch (err) { 
                    console.log(`[AGENT FAILED] Raw Body: ${r}`);
                    ws.send(JSON.stringify({ 
                      type: 'ERROR', 
                      sender: agent.name, 
                      content: `Upstream Issue: ${r.substring(0, 60)}`,
                      timestamp: new Date().toISOString()
                    })); 
                    await persistLog('ERROR', agent.name, `Exception: ${r.substring(0, 60)}`);
                    resolve(); 
                  }
                });
              });
              req.write(postData); req.end();
            });
          };

          (async () => {
            for (const agent of agents) {
              await runAgent(agent);
              await new Promise(r => setTimeout(r, 900)); 
            }
            // 5. EVENT: COMPLETION
            ws.send(JSON.stringify({ type: 'SYSTEM', content: ">>> ALL NODES SYNCHRONIZED. CONSULT SCORE MATRIX. <<<", timestamp: new Date().toISOString() }));
            await persistLog('SYSTEM', null, "ALL NODES SYNCHRONIZED.");
            
            // Seal the Mission record with definitive Finality!
            await prisma.mission.update({
              where: { id: mission.id },
              data: { status: "COMPLETED", completedAt: new Date() }
            });
            
            console.log(`[CYBER] Mission ${mission.id} successfully persisted to SQL.`);
          })();

        } catch (e) {
          console.log("Discovery Error:", body);
          ws.send("[ERROR] Self-Discovery system failure.");
        }
      });
    });
  });
});
