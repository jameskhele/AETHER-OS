import { create } from 'zustand';
import type { WebSocketMessage, AgentRole, TelemetryState } from '@aether/types';

interface AetherState {
  // Core Data
  logs: WebSocketMessage[];
  history: any[];
  connected: boolean;
  prompt: string;
  
  // Telemetry
  score: number;
  activeAgent: AgentRole | '';
  telemetry: TelemetryState;

  // Actions
  setConnected: (status: boolean) => void;
  setPrompt: (val: string) => void;
  addLog: (msg: WebSocketMessage) => void;
  setHistory: (h: any[]) => void;
  clearTelemetry: () => void;
  updateAgentActivity: (agent: AgentRole | '', data: number, greed: number, danger: number) => void;
  setScore: (val: number) => void;
}

export const useAetherStore = create<AetherState>((set) => ({
  logs: [],
  history: [],
  connected: false,
  prompt: '',
  score: 0,
  activeAgent: '',
  telemetry: { dataVal: 5, greedVal: 5, dangerVal: 5, confluenceScore: 0 },

  setConnected: (connected) => set({ connected }),
  setPrompt: (prompt) => set({ prompt }),
  addLog: (msg) => set((state) => ({ logs: [...state.logs, msg] })),
  setHistory: (history) => set({ history }),
  setScore: (score) => set({ score }),
  
  clearTelemetry: () => set({
    score: 0,
    activeAgent: '',
    telemetry: { dataVal: 5, greedVal: 5, dangerVal: 5, confluenceScore: 0 }
  }),

  updateAgentActivity: (activeAgent, dataVal, greedVal, dangerVal) => set((state) => ({
    activeAgent,
    telemetry: {
      ...state.telemetry,
      dataVal: dataVal || state.telemetry.dataVal,
      greedVal: greedVal || state.telemetry.greedVal,
      dangerVal: dangerVal || state.telemetry.dangerVal
    }
  }))
}));
