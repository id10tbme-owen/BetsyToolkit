/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Smartphone, Globe, Wrench, Cpu, Info, Code, Settings, 
  Terminal as TerminalIcon, Battery, HardDrive, AppWindow, Plane,
  MapPin, Activity, Search, Zap, Camera, Clipboard, SmartphoneNfc,
  Bell, Calendar, MousePointer2, Monitor, FileText, ChevronRight,
  Menu, X, Shield, RefreshCw, Trash2, Power
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ModuleId, LogEntry, Action } from './types';
import { MODULES } from './constants';

const IconMap: Record<string, React.ElementType> = {
  Smartphone, Globe, Wrench, Cpu, Info, Code, Settings, 
  Terminal: TerminalIcon, Battery, HardDrive, AppWindow, Plane,
  MapPin, Activity, Search, Zap, Camera, Clipboard, SmartphoneNfc,
  Bell, Calendar, MousePointer2, Monitor, FileText, ChevronRight
};

export default function App() {
  const [activeModule, setActiveModule] = useState<ModuleId>(ModuleId.DEVICE);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isTerminalExpanded, setIsTerminalExpanded] = useState(false);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  const addLog = (module: string, action: string, output: string, type: LogEntry['type'] = 'info') => {
    const newLog: LogEntry = {
      timestamp: new Date().toLocaleTimeString(),
      module,
      action,
      output,
      type
    };
    setLogs(prev => [...prev.slice(-99), newLog]);
  };

  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  const handleAction = async (action: Action, moduleName: string) => {
    addLog(moduleName, action.label, `Executing command: ${action.id}...`, 'command');
    
    // Simulate command execution
    try {
      switch (action.id) {
        case 'battery':
          if ('getBattery' in navigator) {
            const battery: any = await (navigator as any).getBattery();
            addLog(moduleName, action.label, `Level: ${Math.round(battery.level * 100)}%, Charging: ${battery.charging ? 'Yes' : 'No'}`, 'success');
          } else {
            addLog(moduleName, action.label, "Battery API not supported in this browser.", 'error');
          }
          break;
        case 'storage':
          if ('storage' in navigator && 'estimate' in navigator.storage) {
            const estimate = await navigator.storage.estimate();
            const used = Math.round((estimate.usage || 0) / (1024 * 1024));
            const total = Math.round((estimate.quota || 0) / (1024 * 1024));
            addLog(moduleName, action.label, `Used: ${used}MB / Total: ${total}MB`, 'success');
          } else {
            addLog(moduleName, action.label, "Storage API not supported.", 'error');
          }
          break;
        case 'ip':
          addLog(moduleName, action.label, "Fetching network details...", 'info');
          const res = await fetch('https://api.ipify.org?format=json');
          const data = await res.json();
          addLog(moduleName, action.label, `Public IP: ${data.ip}`, 'success');
          break;
        case 'screenshot':
          try {
            const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
            addLog(moduleName, action.label, "Screen capture stream initialized.", 'success');
            stream.getTracks().forEach(track => track.stop());
          } catch (e) {
            addLog(moduleName, action.label, `Capture failed: ${e instanceof Error ? e.message : 'Unknown error'}`, 'error');
          }
          break;
        case 'clipboard':
          const text = await navigator.clipboard.readText();
          addLog(moduleName, action.label, `Clipboard content: "${text.substring(0, 50)}${text.length > 50 ? '...' : ''}"`, 'success');
          break;
        case 'vibrate':
          if ('vibrate' in navigator) {
            navigator.vibrate([200, 100, 200]);
            addLog(moduleName, action.label, "Vibration triggered.", 'success');
          } else {
            addLog(moduleName, action.label, "Vibration not supported.", 'error');
          }
          break;
        case 'notify':
          if ('Notification' in window) {
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
              new Notification("Betsy Toolkit", { body: "System action completed successfully." });
              addLog(moduleName, action.label, "Notification sent.", 'success');
            } else {
              addLog(moduleName, action.label, "Notification permission denied.", 'error');
            }
          }
          break;
        case 'os':
          addLog(moduleName, action.label, `Platform: ${navigator.platform}, Agent: ${navigator.userAgent}`, 'success');
          break;
        default:
          setTimeout(() => {
            addLog(moduleName, action.label, `Command ${action.id} completed with status 0`, 'success');
          }, 800);
      }
    } catch (err) {
      addLog(moduleName, action.label, `Error: ${err instanceof Error ? err.message : 'Unknown error'}`, 'error');
    }
  };

  const currentModule = MODULES.find(m => m.id === activeModule) || MODULES[0];

  return (
    <div className="flex h-screen w-full bg-kali-dark text-kali-text cyber-grid relative overflow-hidden">
      <div className="scanline"></div>

      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 240 : 64 }}
        className="bg-kali-panel border-r border-kali-border flex flex-col z-20 relative"
      >
        <div className="p-4 flex items-center justify-between border-b border-kali-border">
          {isSidebarOpen && (
            <div className="flex items-center gap-2 text-kali-blue font-bold tracking-tighter">
              <Shield size={20} />
              <span>BETSY TOOLKIT</span>
            </div>
          )}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1 hover:bg-kali-blue/10 rounded text-kali-blue"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 py-4 overflow-y-auto">
          {MODULES.map(module => {
            const Icon = IconMap[module.icon] || Smartphone;
            const isActive = activeModule === module.id;
            return (
              <button
                key={module.id}
                onClick={() => setActiveModule(module.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 transition-colors relative group ${
                  isActive ? 'text-kali-blue bg-kali-blue/5' : 'text-kali-text/60 hover:text-kali-text hover:bg-white/5'
                }`}
              >
                {isActive && <motion.div layoutId="active-indicator" className="absolute left-0 w-1 h-full bg-kali-blue" />}
                <Icon size={20} className={isActive ? 'drop-shadow-[0_0_8px_rgba(0,204,255,0.5)]' : ''} />
                {isSidebarOpen && <span className="text-sm font-medium uppercase tracking-wider">{module.name}</span>}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-kali-border">
          <button 
            onClick={() => setActiveModule(ModuleId.SETTINGS)}
            className={`w-full flex items-center gap-3 px-0 py-2 transition-colors ${
              activeModule === ModuleId.SETTINGS ? 'text-kali-blue' : 'text-kali-text/60 hover:text-kali-text'
            }`}
          >
            <Settings size={20} />
            {isSidebarOpen && <span className="text-sm font-medium uppercase tracking-wider">Settings</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 relative">
        {/* Header */}
        <header className="h-14 border-b border-kali-border bg-kali-panel/50 backdrop-blur-md flex items-center justify-between px-6 z-10">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-bold uppercase tracking-widest text-kali-blue flex items-center gap-2">
              {currentModule.name}
              <span className="text-[10px] bg-kali-blue/20 px-1.5 py-0.5 rounded text-kali-blue border border-kali-blue/30">v2.4.0</span>
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1 bg-kali-border rounded-full text-[10px] font-mono text-kali-blue/70 border border-kali-blue/10">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              SYSTEM_ONLINE
            </div>
            <button className="p-2 hover:bg-kali-blue/10 rounded text-kali-text/60 hover:text-kali-blue transition-colors">
              <RefreshCw size={18} />
            </button>
            <button className="p-2 hover:bg-red-500/10 rounded text-kali-text/60 hover:text-red-500 transition-colors">
              <Power size={18} />
            </button>
          </div>
        </header>

        {/* Panel Area */}
        <div className="flex-1 p-6 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeModule}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {currentModule.actions.map(action => {
                const ActionIcon = IconMap[action.icon] || Smartphone;
                return (
                  <div 
                    key={action.id}
                    className="cyber-panel p-5 group hover:border-kali-blue/50 transition-all cursor-pointer"
                    onClick={() => handleAction(action, currentModule.name)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 bg-kali-border rounded-lg text-kali-blue group-hover:shadow-[0_0_15px_rgba(0,204,255,0.2)] transition-all">
                        <ActionIcon size={24} />
                      </div>
                      <div className="text-[10px] font-mono text-kali-text/30 uppercase tracking-tighter">
                        ID: {action.id}
                      </div>
                    </div>
                    <h3 className="text-base font-bold text-kali-text mb-1 group-hover:text-kali-blue transition-colors">
                      {action.label}
                    </h3>
                    <p className="text-xs text-kali-text/50 leading-relaxed">
                      {action.description}
                    </p>
                    <div className="mt-4 pt-4 border-t border-kali-border flex justify-end">
                      <div className="flex items-center gap-1 text-[10px] font-bold text-kali-blue opacity-0 group-hover:opacity-100 transition-opacity">
                        EXECUTE <ChevronRight size={12} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Terminal / Logs */}
        <motion.div 
          animate={{ height: isTerminalExpanded ? '60%' : '180px' }}
          className="bg-black/90 border-t border-kali-blue/30 relative z-10 flex flex-col"
        >
          <div className="flex items-center justify-between px-4 py-2 bg-kali-panel border-b border-kali-border">
            <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-kali-blue">
              <TerminalIcon size={14} />
              SYSTEM_LOGS
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setLogs([])}
                className="p-1 hover:bg-white/10 rounded text-kali-text/40 hover:text-kali-text"
              >
                <Trash2 size={14} />
              </button>
              <button 
                onClick={() => setIsTerminalExpanded(!isTerminalExpanded)}
                className="p-1 hover:bg-white/10 rounded text-kali-text/40 hover:text-kali-text"
              >
                {isTerminalExpanded ? <ChevronRight size={14} className="rotate-90" /> : <ChevronRight size={14} className="-rotate-90" />}
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 font-mono text-[11px] space-y-1 scrollbar-thin">
            {logs.length === 0 && (
              <div className="text-kali-text/20 italic">Waiting for system input...</div>
            )}
            {logs.map((log, i) => (
              <div key={i} className="flex gap-3 animate-in fade-in slide-in-from-left-2 duration-300">
                <span className="text-kali-text/30 shrink-0">[{log.timestamp}]</span>
                <span className={`shrink-0 font-bold ${
                  log.type === 'error' ? 'text-red-500' : 
                  log.type === 'success' ? 'text-green-500' : 
                  log.type === 'command' ? 'text-kali-blue' : 'text-kali-text/50'
                }`}>
                  {log.type === 'command' ? '>' : log.type.toUpperCase()}
                </span>
                <span className="text-kali-text/40 shrink-0">[{log.module}/{log.action}]</span>
                <span className={log.type === 'error' ? 'text-red-400' : 'text-kali-text/80'}>
                  {log.output}
                </span>
              </div>
            ))}
            <div ref={terminalEndRef} />
          </div>
        </motion.div>
      </main>
    </div>
  );
}
