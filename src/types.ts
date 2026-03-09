export enum ModuleId {
  DEVICE = 'device',
  NETWORK = 'network',
  TOOLS = 'tools',
  AUTOMATION = 'automation',
  SYSTEM_INFO = 'system_info',
  SCRIPTS = 'scripts',
  SETTINGS = 'settings',
  LOGS = 'logs'
}

export interface Action {
  id: string;
  label: string;
  icon: string;
  description?: string;
  command?: string;
  handler?: () => Promise<void> | void;
}

export interface Module {
  id: ModuleId;
  name: string;
  icon: string;
  actions: Action[];
}

export interface LogEntry {
  timestamp: string;
  module: string;
  action: string;
  output: string;
  type: 'info' | 'error' | 'success' | 'command';
}
