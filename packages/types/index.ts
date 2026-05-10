/**
 * 🛡️ AETHER // OS v2.5 STRICT CORE TYPES
 * This package acts as the single source of truth for all inter-service communication.
 */

export type AgentRole = 'RESEARCHER' | 'STRATEGIST' | 'RISK_OFFICER' | 'DIRECTOR';

export interface AgentDefinition {
  id: AgentRole;
  prefix: string;
  title: string;
  color: string;
}

export interface TelemetryState {
  dataVal: number;
  greedVal: number;
  dangerVal: number;
  confluenceScore: number;
}

export interface WebSocketMessage {
  timestamp: string;
  type: 'SYSTEM' | 'NETWORK' | 'DEPLOY' | 'ANALYSIS' | 'ERROR' | 'INVENTORY';
  sender?: AgentRole | 'ORCHESTRATOR' | 'SYS';
  content: string;
}

export interface MissionDirective {
  id: string;
  rawPrompt: string;
  initiatedAt: Date;
  status: 'IDLE' | 'RUNNING' | 'COMPLETED' | 'FAILED';
}
