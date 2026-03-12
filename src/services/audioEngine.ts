class AudioEngine {
  private audioCtx: AudioContext | null = null;
  private oscillator: OscillatorNode | null = null;
  private gainNode: GainNode | null = null;
  private analyser: AnalyserNode | null = null;

  init() {
    if (this.audioCtx) return;
    this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.analyser = this.audioCtx.createAnalyser();
    this.analyser.fftSize = 256;
  }

  start(frequency: number) {
    this.init();
    if (!this.audioCtx) return;

    this.stop();

    this.oscillator = this.audioCtx.createOscillator();
    this.gainNode = this.audioCtx.createGain();

    this.oscillator.type = 'sine';
    this.oscillator.frequency.setValueAtTime(frequency, this.audioCtx.currentTime);

    this.gainNode.gain.setValueAtTime(0, this.audioCtx.currentTime);
    this.gainNode.gain.linearRampToValueAtTime(0.1, this.audioCtx.currentTime + 0.1);

    this.oscillator.connect(this.gainNode);
    this.gainNode.connect(this.analyser!);
    this.analyser!.connect(this.audioCtx.destination);

    this.oscillator.start();
  }

  updateFrequency(frequency: number) {
    if (this.oscillator && this.audioCtx) {
      this.oscillator.frequency.setTargetAtTime(frequency, this.audioCtx.currentTime, 0.1);
    }
  }

  stop() {
    if (this.oscillator && this.audioCtx) {
      const now = this.audioCtx.currentTime;
      this.gainNode?.gain.linearRampToValueAtTime(0, now + 0.1);
      this.oscillator.stop(now + 0.2);
      this.oscillator = null;
    }
  }

  getAnalyser() {
    return this.analyser;
  }

  getFrequencyData() {
    if (!this.analyser) return new Uint8Array(0);
    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(dataArray);
    return dataArray;
  }
}

export const audioEngine = new AudioEngine();
