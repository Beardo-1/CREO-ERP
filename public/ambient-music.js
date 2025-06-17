// Ambient Music Generator using Web Audio API
class AmbientMusicGenerator {
  constructor() {
    this.audioContext = null;
    this.isPlaying = false;
    this.masterGain = null;
    this.oscillators = [];
    this.noiseBuffer = null;
    this.rainSource = null;
    this.windSource = null;
  }

  async init() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.masterGain = this.audioContext.createGain();
      this.masterGain.connect(this.audioContext.destination);
      this.masterGain.gain.setValueAtTime(0.3, this.audioContext.currentTime);
      
      // Create noise buffer for rain/wind sounds
      await this.createNoiseBuffer();
      
      return true;
    } catch (error) {
      console.error('Failed to initialize audio context:', error);
      return false;
    }
  }

  async createNoiseBuffer() {
    const bufferSize = this.audioContext.sampleRate * 2; // 2 seconds of noise
    this.noiseBuffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
    const output = this.noiseBuffer.getChannelData(0);
    
    // Generate pink noise (more natural than white noise)
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
      b6 = white * 0.115926;
    }
  }

  createTone(frequency, type = 'sine', volume = 0.1) {
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
    
    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume, this.audioContext.currentTime + 2);
    
    oscillator.connect(gainNode);
    gainNode.connect(this.masterGain);
    
    return { oscillator, gainNode };
  }

  createRainSound() {
    const source = this.audioContext.createBufferSource();
    const filter = this.audioContext.createBiquadFilter();
    const gainNode = this.audioContext.createGain();
    
    source.buffer = this.noiseBuffer;
    source.loop = true;
    
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, this.audioContext.currentTime);
    filter.Q.setValueAtTime(0.5, this.audioContext.currentTime);
    
    gainNode.gain.setValueAtTime(0.15, this.audioContext.currentTime);
    
    source.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.masterGain);
    
    return { source, filter, gainNode };
  }

  createWindSound() {
    const source = this.audioContext.createBufferSource();
    const filter = this.audioContext.createBiquadFilter();
    const gainNode = this.audioContext.createGain();
    
    source.buffer = this.noiseBuffer;
    source.loop = true;
    
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(200, this.audioContext.currentTime);
    filter.Q.setValueAtTime(1, this.audioContext.currentTime);
    
    gainNode.gain.setValueAtTime(0.08, this.audioContext.currentTime);
    
    source.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.masterGain);
    
    return { source, filter, gainNode };
  }

  async play() {
    if (this.isPlaying) return;
    
    if (!this.audioContext) {
      const initialized = await this.init();
      if (!initialized) return;
    }

    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }

    this.isPlaying = true;

    // Create ambient tones (soft pad sounds)
    const tones = [
      { freq: 110, type: 'sine', vol: 0.08 },    // Deep bass
      { freq: 220, type: 'triangle', vol: 0.06 }, // Low harmony
      { freq: 330, type: 'sine', vol: 0.05 },    // Mid tone
      { freq: 440, type: 'triangle', vol: 0.04 }, // Higher harmony
      { freq: 660, type: 'sine', vol: 0.03 },    // Bright accent
    ];

    tones.forEach(({ freq, type, vol }) => {
      const tone = this.createTone(freq, type, vol);
      tone.oscillator.start();
      this.oscillators.push(tone);
    });

    // Add nature sounds
    this.rainSource = this.createRainSound();
    this.rainSource.source.start();

    this.windSource = this.createWindSound();
    this.windSource.source.start();

    // Add subtle frequency modulation for organic feel
    this.addModulation();
  }

  addModulation() {
    // Create LFO for subtle frequency modulation
    const lfo = this.audioContext.createOscillator();
    const lfoGain = this.audioContext.createGain();
    
    lfo.frequency.setValueAtTime(0.1, this.audioContext.currentTime); // Very slow modulation
    lfoGain.gain.setValueAtTime(2, this.audioContext.currentTime); // Subtle modulation depth
    
    lfo.connect(lfoGain);
    
    // Apply modulation to some oscillators
    this.oscillators.forEach((tone, index) => {
      if (index % 2 === 0) { // Modulate every other oscillator
        lfoGain.connect(tone.oscillator.frequency);
      }
    });
    
    lfo.start();
    this.oscillators.push({ oscillator: lfo, gainNode: lfoGain });
  }

  stop() {
    if (!this.isPlaying) return;
    
    this.isPlaying = false;
    
    // Fade out and stop all oscillators
    this.oscillators.forEach(({ oscillator, gainNode }) => {
      try {
        gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 1);
        setTimeout(() => {
          oscillator.stop();
        }, 1000);
      } catch (error) {
        // Oscillator might already be stopped
      }
    });
    
    // Stop nature sounds
    if (this.rainSource) {
      this.rainSource.gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 1);
      setTimeout(() => {
        try {
          this.rainSource.source.stop();
        } catch (error) {
          // Source might already be stopped
        }
      }, 1000);
    }
    
    if (this.windSource) {
      this.windSource.gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 1);
      setTimeout(() => {
        try {
          this.windSource.source.stop();
        } catch (error) {
          // Source might already be stopped
        }
      }, 1000);
    }
    
    // Clear arrays
    setTimeout(() => {
      this.oscillators = [];
      this.rainSource = null;
      this.windSource = null;
    }, 1100);
  }

  setVolume(volume) {
    if (this.masterGain) {
      this.masterGain.gain.setValueAtTime(volume, this.audioContext.currentTime);
    }
  }
}

// Make it globally available
window.AmbientMusicGenerator = AmbientMusicGenerator; 