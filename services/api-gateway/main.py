from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from typing import List
import uvicorn
import logging

# --- AETHER OS GATEWAY FOUNDATION ---
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("AetherGateway")

app = FastAPI(
    title="Aether OS API Gateway",
    description="Core high-ingress gateway forwarding logical queries to active LangGraph agent clusters.",
    version="0.0.1-alpha"
)

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        logger.info(f"New kinetic link established. Pool size: {len(self.active_connections)}")

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)
        logger.info("Kinetic link severed.")

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)

manager = ConnectionManager()

@app.get("/health")
async def health():
    return {"status": "nominal", "gateway": "operational"}

@app.websocket("/ws/stream")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            # Propagation of broadcast back to command center (Placeholder logic)
            await manager.broadcast(f"[GATEWAY-ECHO] Input vector captured: {data}")
    except WebSocketDisconnect:
        manager.disconnect(websocket)

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
