/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Activity, 
  Library, 
  Sliders, 
  BookOpen, 
  Play, 
  Square, 
  ChevronRight, 
  Plus,
  Clock,
  Zap,
  History,
  Settings2
} from 'lucide-react';
import { format } from 'date-fns';
import { 
  FrequencyBand, 
  PresetSession, 
  SessionLog, 
  PRESET_SESSIONS, 
  BANDS 
} from './types';
import { audioEngine } from './services/audioEngine';
import { Visualizer } from './components/Visualizer';
import { Button, Card } from './components/UI';
import { cn } from './lib/utils';

type Screen = 'dashboard' | 'presets' | 'tuner' | 'journal';

export default function App() {
  // Navigation
  const [currentScreen, setCurrentScreen] = useState<Screen>('dashboard');
  
  // Session State
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [currentFrequency, setCurrentFrequency] = useState(14);
  const [selectedBand, setSelectedBand] = useState<FrequencyBand>('beta');
  const [sessionElapsed, setSessionElapsed] = useState(0);
  const [currentPreset, setCurrentPreset] = useState<PresetSession | null>(null);
  const [guidedModeEnabled, setGuidedModeEnabled] = useState(false);
  
  // Data
  const [logs, setLogs] = useState<SessionLog[]>([]);
  const [showLogForm, setShowLogForm] = useState(false);
  const [newLog, setNewLog] = useState({ moodBefore: 'Neutral', moodAfter: 'Neutral', notes: '' });

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Persistence
  useEffect(() => {
    const savedLogs = localStorage.getItem('melsonique_logs');
    if (savedLogs) setLogs(JSON.parse(savedLogs));
  }, []);

  useEffect(() => {
    localStorage.setItem('melsonique_logs', JSON.stringify(logs));
  }, [logs]);

  // Audio Control
  const startSession = useCallback((freq: number, band: FrequencyBand, preset?: PresetSession) => {
    audioEngine.start(freq);
    setCurrentFrequency(freq);
    setSelectedBand(band);
    setCurrentPreset(preset || null);
    setIsSessionActive(true);
    setSessionElapsed(0);
    
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setSessionElapsed(prev => prev + 1);
    }, 60000); // Increment every minute
  }, []);

  const stopSession = useCallback(() => {
    audioEngine.stop();
    setIsSessionActive(false);
    if (timerRef.current) clearInterval(timerRef.current);
    setShowLogForm(true);
  }, []);

  const handleSaveLog = () => {
    const log: SessionLog = {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString(),
      presetId: currentPreset?.id,
      presetName: currentPreset?.title || 'Custom Session',
      durationMinutes: sessionElapsed,
      frequenciesUsed: [currentFrequency],
      moodBefore: newLog.moodBefore,
      moodAfter: newLog.moodAfter,
      notes: newLog.notes,
    };
    setLogs([log, ...logs]);
    setShowLogForm(false);
    setNewLog({ moodBefore: 'Neutral', moodAfter: 'Neutral', notes: '' });
  };

  // UI Components
  const NavItem = ({ id, icon: Icon, label }: { id: Screen; icon: any; label: string }) => (
    <button
      onClick={() => setCurrentScreen(id)}
      className={cn(
        'flex flex-col items-center gap-1 p-2 transition-colors',
        currentScreen === id ? 'text-[#ff2fb8]' : 'text-white/40 hover:text-white/60'
      )}
    >
      <Icon size={20} />
      <span className="text-[10px] uppercase tracking-widest font-medium">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-[#050513] text-white font-sans selection:bg-[#ff2fb8]/30">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex justify-between items-center bg-[#050513]/80 backdrop-blur-md border-bottom border-white/5">
        <div>
          <h1 className="text-lg font-bold tracking-tighter bg-gradient-to-r from-[#ff2fb8] to-[#18a0ff] bg-clip-text text-transparent">
            MELSONIQUE
          </h1>
          <p className="text-[10px] text-white/40 uppercase tracking-[0.3em]">Frequency Reactor</p>
        </div>
        <div className="flex items-center gap-4">
          {isSessionActive && (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff2fb8]/10 border border-[#ff2fb8]/20">
              <div className="w-1.5 h-1.5 rounded-full bg-[#ff2fb8] animate-pulse" />
              <span className="text-xs font-mono text-[#ff2fb8]">{sessionElapsed}m</span>
            </div>
          )}
          <button className="text-white/40 hover:text-white"><Settings2 size={20} /></button>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-32 px-6 max-w-2xl mx-auto">
        <AnimatePresence mode="wait">
          {currentScreen === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <Visualizer intensity={isSessionActive ? 1 : 0.2} frequency={currentFrequency} />
              
              <div className="grid grid-cols-3 gap-4">
                <Card className="flex flex-col items-center justify-center py-4">
                  <span className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Freq</span>
                  <span className="text-xl font-mono text-[#18a0ff]">{currentFrequency}<span className="text-xs ml-0.5 opacity-50">Hz</span></span>
                </Card>
                <Card className="flex flex-col items-center justify-center py-4">
                  <span className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Mode</span>
                  <span className="text-sm font-medium uppercase tracking-wider">{selectedBand}</span>
                </Card>
                <Card className="flex flex-col items-center justify-center py-4">
                  <span className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Time</span>
                  <span className="text-xl font-mono text-[#f5d878]">{sessionElapsed}<span className="text-xs ml-0.5 opacity-50">m</span></span>
                </Card>
              </div>

              <div className="flex flex-col gap-3">
                {!isSessionActive ? (
                  <Button onClick={() => startSession(14, 'beta')} className="w-full py-4">
                    <Play size={18} fill="currentColor" />
                    Start Quick Session
                  </Button>
                ) : (
                  <Button variant="dangerGhost" onClick={stopSession} className="w-full py-4">
                    <Square size={18} fill="currentColor" />
                    Stop Session
                  </Button>
                )}
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="ghost" onClick={() => setCurrentScreen('presets')}>
                    <Library size={18} />
                    Browse Presets
                  </Button>
                  <Button variant="ghost" onClick={() => setCurrentScreen('tuner')}>
                    <Sliders size={18} />
                    Custom Tuning
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {currentScreen === 'presets' && (
            <motion.div
              key="presets"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-light tracking-tight">Session Library</h2>
                <div className="text-[10px] text-white/40 uppercase tracking-widest">{PRESET_SESSIONS.length} Presets</div>
              </div>
              
              <div className="space-y-4">
                {PRESET_SESSIONS.map((preset) => (
                  <Card key={preset.id} className="group hover:border-[#ff2fb8]/30 transition-colors cursor-pointer" onClick={() => startSession(preset.primaryFrequencyHz, preset.frequencyBand, preset)} >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium">{preset.title}</h3>
                        <p className="text-sm text-white/50">{preset.subtitle}</p>
                      </div>
                      <div className="p-2 rounded-full bg-white/5 group-hover:bg-[#ff2fb8]/20 group-hover:text-[#ff2fb8] transition-colors">
                        <Play size={20} fill="currentColor" />
                      </div>
                    </div>
                    <div className="mt-6 flex items-center gap-4 text-[10px] uppercase tracking-widest font-mono">
                      <div className="flex items-center gap-1.5 text-[#18a0ff]">
                        <Clock size={12} />
                        {preset.durationMinutes}m
                      </div>
                      <div className="flex items-center gap-1.5 text-[#f5d878]">
                        <Activity size={12} />
                        {preset.primaryFrequencyHz}Hz
                      </div>
                      <div className="flex items-center gap-1.5 text-white/30">
                        <Zap size={12} />
                        {preset.targetState}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {currentScreen === 'tuner' && (
            <motion.div
              key="tuner"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <h2 className="text-2xl font-light tracking-tight">Live Tuning</h2>
              
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-white/40">Frequency Band</label>
                  <div className="grid grid-cols-5 gap-2">
                    {(Object.keys(BANDS) as FrequencyBand[]).map((band) => (
                      <button
                        key={band}
                        onClick={() => {
                          setSelectedBand(band);
                          const mid = (BANDS[band].min + BANDS[band].max) / 2;
                          setCurrentFrequency(Math.round(mid));
                          if (isSessionActive) audioEngine.updateFrequency(mid);
                        }}
                        className={cn(
                          'py-3 rounded-xl text-[10px] font-bold uppercase transition-all border',
                          selectedBand === band 
                            ? 'bg-[#ff2fb8] border-[#ff2fb8] text-white shadow-[0_0_15px_rgba(255,47,184,0.3)]' 
                            : 'bg-white/5 border-white/10 text-white/40 hover:border-white/20'
                        )}
                      >
                        {band}
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] text-white/30 italic">{BANDS[selectedBand].description}</p>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-white/40">Frequency (Hz)</label>
                    <span className="text-2xl font-mono text-[#18a0ff]">{currentFrequency}</span>
                  </div>
                  <input
                    type="range"
                    min={BANDS[selectedBand].min}
                    max={BANDS[selectedBand].max}
                    step="0.1"
                    value={currentFrequency}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      setCurrentFrequency(val);
                      if (isSessionActive) audioEngine.updateFrequency(val);
                    }}
                    className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#ff2fb8]"
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div>
                    <div className="text-sm font-medium">Guided Mode</div>
                    <div className="text-[10px] text-white/40 uppercase tracking-wider">Prompts & Affirmations</div>
                  </div>
                  <button 
                    onClick={() => setGuidedModeEnabled(!guidedModeEnabled)}
                    className={cn(
                      'w-12 h-6 rounded-full transition-colors relative',
                      guidedModeEnabled ? 'bg-[#ff2fb8]' : 'bg-white/10'
                    )}
                  >
                    <div className={cn(
                      'absolute top-1 w-4 h-4 rounded-full bg-white transition-all',
                      guidedModeEnabled ? 'left-7' : 'left-1'
                    )} />
                  </button>
                </div>

                <div className="pt-4 flex flex-col gap-3">
                  {!isSessionActive ? (
                    <Button onClick={() => startSession(currentFrequency, selectedBand)} className="w-full">
                      Start Custom Session
                    </Button>
                  ) : (
                    <Button variant="dangerGhost" onClick={stopSession} className="w-full">
                      Stop Session
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {currentScreen === 'journal' && (
            <motion.div
              key="journal"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-light tracking-tight">Cosmic Journal</h2>
                <div className="text-[10px] text-white/40 uppercase tracking-widest">{logs.length} Entries</div>
              </div>

              <div className="space-y-4">
                {logs.length === 0 ? (
                  <div className="text-center py-20 text-white/20">
                    <History size={48} className="mx-auto mb-4 opacity-10" />
                    <p className="text-sm uppercase tracking-widest">No entries recorded yet</p>
                  </div>
                ) : (
                  logs.map((log) => (
                    <Card key={log.id} className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-[10px] text-white/40 uppercase tracking-widest font-mono">
                            {format(new Date(log.date), 'MMM dd, yyyy • HH:mm')}
                          </div>
                          <h3 className="text-lg font-medium">{log.presetName}</h3>
                        </div>
                        <div className="text-xs font-mono text-[#f5d878]">{log.durationMinutes}m</div>
                      </div>
                      <div className="flex gap-2">
                        <span className="px-2 py-0.5 rounded bg-white/5 text-[9px] uppercase tracking-widest text-white/40">
                          Before: {log.moodBefore}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-[#ff2fb8]/10 text-[9px] uppercase tracking-widest text-[#ff2fb8]">
                          After: {log.moodAfter}
                        </span>
                      </div>
                      {log.notes && (
                        <p className="text-sm text-white/60 italic leading-relaxed">
                          "{log.notes}"
                        </p>
                      )}
                    </Card>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Log Modal */}
      <AnimatePresence>
        {showLogForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#050513]/90 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full max-w-md space-y-6"
            >
              <div className="text-center">
                <h2 className="text-2xl font-light tracking-tight">Session Complete</h2>
                <p className="text-sm text-white/40 mt-1 uppercase tracking-widest">Record your resonance</p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-white/40">Mood Before</label>
                    <select 
                      value={newLog.moodBefore}
                      onChange={(e) => setNewLog({ ...newLog, moodBefore: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#ff2fb8]"
                    >
                      {['Anxious', 'Neutral', 'Calm', 'Elevated'].map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-white/40">Mood After</label>
                    <select 
                      value={newLog.moodAfter}
                      onChange={(e) => setNewLog({ ...newLog, moodAfter: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#ff2fb8]"
                    >
                      {['Anxious', 'Neutral', 'Calm', 'Elevated'].map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-white/40">Notes</label>
                  <textarea
                    placeholder="Visions, sensations, ideas..."
                    value={newLog.notes}
                    onChange={(e) => setNewLog({ ...newLog, notes: e.target.value })}
                    className="w-full h-32 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#ff2fb8] resize-none"
                  />
                </div>

                <div className="flex flex-col gap-3 pt-2">
                  <Button onClick={handleSaveLog}>Save to Journal</Button>
                  <Button variant="ghost" onClick={() => setShowLogForm(false)}>Discard</Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 px-6 py-4 bg-[#050513]/80 backdrop-blur-md border-t border-white/5">
        <div className="max-w-md mx-auto flex justify-between items-center">
          <NavItem id="dashboard" icon={Activity} label="Reactor" />
          <NavItem id="presets" icon={Library} label="Library" />
          <NavItem id="tuner" icon={Sliders} label="Tuner" />
          <NavItem id="journal" icon={BookOpen} label="Journal" />
        </div>
      </nav>
    </div>
  );
}
