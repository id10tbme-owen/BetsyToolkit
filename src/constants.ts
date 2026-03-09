import { ModuleId, Module } from './types';

export const MODULES: Module[] = [
  {
    id: ModuleId.DEVICE,
    name: 'Device',
    icon: 'Smartphone',
    actions: [
      { id: 'battery', label: 'Battery Info', icon: 'Battery', description: 'Check battery status and level.' },
      { id: 'storage', label: 'Storage Info', icon: 'HardDrive', description: 'View available storage space.' },
      { id: 'apps', label: 'Installed Apps', icon: 'AppWindow', description: 'List all installed packages.' },
      { id: 'airplane', label: 'Airplane Mode', icon: 'Plane', description: 'Toggle airplane mode status.' }
    ]
  },
  {
    id: ModuleId.NETWORK,
    name: 'Network',
    icon: 'Globe',
    actions: [
      { id: 'ip', label: 'IP Lookup', icon: 'MapPin', description: 'Get current public and local IP.' },
      { id: 'ping', label: 'Ping Host', icon: 'Activity', description: 'Test connectivity to a host.' },
      { id: 'dns', label: 'DNS Lookup', icon: 'Search', description: 'Resolve domain names.' },
      { id: 'speedtest', label: 'Speed Test', icon: 'Zap', description: 'Measure network throughput.' }
    ]
  },
  {
    id: ModuleId.TOOLS,
    name: 'Tools',
    icon: 'Wrench',
    actions: [
      { id: 'screenshot', label: 'Screen Capture', icon: 'Camera', description: 'Take a screenshot of the current view.' },
      { id: 'clipboard', label: 'Clipboard', icon: 'Clipboard', description: 'Read or write to system clipboard.' },
      { id: 'vibrate', label: 'Vibration Test', icon: 'SmartphoneNfc', description: 'Trigger device vibration.' },
      { id: 'notify', label: 'Send Notification', icon: 'Bell', description: 'Trigger a system notification.' }
    ]
  },
  {
    id: ModuleId.AUTOMATION,
    name: 'Automation',
    icon: 'Cpu',
    actions: [
      { id: 'tasks', label: 'Scheduled Tasks', icon: 'Calendar', description: 'Manage automated routines.' },
      { id: 'macros', label: 'Macro Builder', icon: 'MousePointer2', description: 'Create custom action sequences.' }
    ]
  },
  {
    id: ModuleId.SYSTEM_INFO,
    name: 'System Info',
    icon: 'Info',
    actions: [
      { id: 'os', label: 'OS Version', icon: 'Cpu', description: 'View operating system details.' },
      { id: 'hardware', label: 'Hardware Specs', icon: 'Monitor', description: 'View CPU, RAM, and GPU info.' },
      { id: 'dump', label: 'System Dump', icon: 'FileText', description: 'Generate a full system properties report.' }
    ]
  },
  {
    id: ModuleId.SCRIPTS,
    name: 'Scripts',
    icon: 'Code',
    actions: [
      { id: 'run_termux', label: 'Run Termux Script', icon: 'Terminal', description: 'Execute a script in Termux environment.' },
      { id: 'custom_sh', label: 'Custom Shell', icon: 'ChevronRight', description: 'Run a custom shell command.' }
    ]
  }
];
