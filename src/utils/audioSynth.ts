// Web Audio API Synthesizer for Ambient Soundscapes

let audioCtx: AudioContext | null = null;
let currentNodes: {
  sources: (AudioNode | AudioScheduledSourceNode)[];
  gainNode: GainNode;
} | null = null;

export type AmbientSoundType = 'rain' | 'forest' | 'waves' | 'fire' | 'off';

export function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function stopAmbientSound() {
  if (currentNodes) {
    try {
      currentNodes.gainNode.gain.setTargetAtTime(0, getAudioContext().currentTime, 0.5);
      setTimeout(() => {
        currentNodes?.sources.forEach((src) => {
          if ('stop' in src && typeof src.stop === 'function') {
            try {
              src.stop();
            } catch {
              // ignore
            }
          }
          src.disconnect();
        });
        currentNodes = null;
      }, 600);
    } catch {
      currentNodes = null;
    }
  }
}

export function playAmbientSound(type: AmbientSoundType, volume = 0.3) {
  stopAmbientSound();
  if (type === 'off') return;

  const ctx = getAudioContext();
  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(0, ctx.currentTime);
  masterGain.gain.setTargetAtTime(volume, ctx.currentTime, 0.5);
  masterGain.connect(ctx.destination);

  const sources: (AudioNode | AudioScheduledSourceNode)[] = [];

  if (type === 'rain') {
    // Pink noise buffer for rain
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      output[i] *= 0.11;
      b6 = white * 0.115926;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1000;

    whiteNoise.connect(filter);
    filter.connect(masterGain);
    whiteNoise.start();
    sources.push(whiteNoise, filter);
  } else if (type === 'waves') {
    // Modulated ocean noise
    const bufferSize = ctx.sampleRate * 3;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 400;

    // LFO for wave swelling
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.12; // wave speed
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 300;

    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    noise.connect(filter);
    filter.connect(masterGain);

    lfo.start();
    noise.start();
    sources.push(noise, filter, lfo, lfoGain);
  } else if (type === 'forest') {
    // Gentle wind tone + soft high frequencies
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = 180;

    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.2;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 20;

    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 300;

    osc.connect(filter);
    filter.connect(masterGain);

    osc.start();
    lfo.start();
    sources.push(osc, filter, lfo, lfoGain);
  } else if (type === 'fire') {
    // Crackling fire noise
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      // Crackle pops
      output[i] = Math.random() < 0.02 ? (Math.random() * 2 - 1) * 0.8 : (Math.random() * 2 - 1) * 0.05;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 800;

    noise.connect(filter);
    filter.connect(masterGain);
    noise.start();
    sources.push(noise, filter);
  }

  currentNodes = {
    sources,
    gainNode: masterGain,
  };
}

// Gentle bell chime for meditation
export function playMeditationChime() {
  const ctx = getAudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(528, ctx.currentTime); // 528Hz Solfeggio frequency for healing

  gain.gain.setValueAtTime(0.3, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 3.5);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 3.6);
}
