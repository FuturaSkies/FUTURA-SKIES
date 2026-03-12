export type FrequencyBand = 'delta' | 'theta' | 'alpha' | 'beta' | 'gamma';

export interface PresetSession {
  id: string;
  title: string;
  subtitle: string;
  durationMinutes: number;
  targetState: string;
  primaryFrequencyHz: number;
  frequencyBand: FrequencyBand;
}

export interface SessionLog {
  id: string;
  date: string;
  presetId?: string;
  presetName: string;
  durationMinutes: number;
  frequenciesUsed: number[];
  moodBefore: string;
  moodAfter: string;
  notes: string;
}

export const BANDS: Record<FrequencyBand, { min: number; max: number; description: string }> = {
  delta: { min: 0.5, max: 4, description: 'Deep sleep, healing, detachment' },
  theta: { min: 4, max: 8, description: 'Meditation, intuition, memory' },
  alpha: { min: 8, max: 13, description: 'Relaxation, visualization, creativity' },
  beta: { min: 13, max: 32, description: 'Alertness, concentration, cognition' },
  gamma: { min: 32, max: 100, description: 'Inspiration, high-level processing' },
};

export const PRESET_SESSIONS: PresetSession[] = [
  {
    id: 'calm_the_storm',
    title: 'Calm the Storm',
    subtitle: 'Drift into deep relaxation',
    durationMinutes: 22,
    targetState: 'Deep Calm',
    primaryFrequencyHz: 4.5,
    frequencyBand: 'theta',
  },
  {
    id: 'omicron_focus_field',
    title: 'Omicron Focus Field',
    subtitle: 'Lock into crystalline concentration',
    durationMinutes: 18,
    targetState: 'Laser Focus',
    primaryFrequencyHz: 14,
    frequencyBand: 'beta',
  },
  {
    id: 'dreamwave_gateway',
    title: 'Dreamwave Gateway',
    subtitle: 'Prime your mind for lucid journeys',
    durationMinutes: 33,
    targetState: 'Pre-Sleep',
    primaryFrequencyHz: 8,
    frequencyBand: 'alpha',
  },
];
