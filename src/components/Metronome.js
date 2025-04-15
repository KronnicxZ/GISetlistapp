import React, { useState, useEffect, useCallback } from 'react';
import * as Tone from 'tone';

const TIME_SIGNATURES = {
  '4/4': { beats: 4, value: 4 },
  '3/4': { beats: 3, value: 4 },
  '6/8': { beats: 6, value: 8 }
};

const Metronome = ({ initialBpm = 120, initialTimeSignature = '4/4' }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(initialBpm);
  const [timeSignature, setTimeSignature] = useState(initialTimeSignature);
  const [currentBeat, setCurrentBeat] = useState(0);
  const [synth, setSynth] = useState(null);

  // Crear el sintetizador una sola vez
  useEffect(() => {
    const newSynth = new Tone.Synth({
      oscillator: {
        type: 'triangle'
      },
      envelope: {
        attack: 0.001,
        decay: 0.1,
        sustain: 0,
        release: 0.1
      }
    }).toDestination();
    setSynth(synth => {
      if (synth) synth.dispose();
      return newSynth;
    });

    return () => {
      if (newSynth) newSynth.dispose();
    };
  }, []);

  const playClick = useCallback(() => {
    if (!synth) return;

    const timeSignatureInfo = TIME_SIGNATURES[timeSignature];
    const isFirstBeat = currentBeat === 0;
    
    if (isFirstBeat) {
      synth.triggerAttackRelease('C5', '32n', Tone.now(), 0.5);
    } else {
      synth.triggerAttackRelease('G4', '32n', Tone.now(), 0.3);
    }

    setCurrentBeat((prevBeat) => (prevBeat + 1) % timeSignatureInfo.beats);
  }, [currentBeat, timeSignature, synth]);

  useEffect(() => {
    let timer;
    if (isPlaying) {
      const interval = (60 / bpm) * 1000;
      timer = setInterval(playClick, interval);
    }
    return () => clearInterval(timer);
  }, [isPlaying, bpm, playClick]);

  const handleBpmChange = (event) => {
    const newBpm = parseInt(event.target.value, 10);
    if (newBpm >= 30 && newBpm <= 250) {
      setBpm(newBpm);
    }
  };

  const togglePlay = async () => {
    if (!isPlaying) {
      await Tone.start();
    }
    setIsPlaying(!isPlaying);
    setCurrentBeat(0);
  };

  return (
    <div className="flex items-center gap-4">
      <button 
        onClick={togglePlay}
        className="w-8 h-8 flex items-center justify-center text-white hover:text-[#FBAE00] transition-colors"
      >
        {isPlaying ? (
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="currentColor" d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
          </svg>
        ) : (
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="currentColor" d="M8 5v14l11-7z"/>
          </svg>
        )}
      </button>

      <select
        value={timeSignature}
        onChange={(e) => setTimeSignature(e.target.value)}
        className="bg-transparent text-white border border-gray-700 rounded px-2 py-1 text-sm hover:border-[#FBAE00] focus:border-[#FBAE00] focus:outline-none cursor-pointer"
      >
        <option value="4/4" className="bg-[#1a1f2e]">4/4</option>
        <option value="3/4" className="bg-[#1a1f2e]">3/4</option>
        <option value="6/8" className="bg-[#1a1f2e]">6/8</option>
      </select>

      <div className="flex items-center gap-2">
        <input
          type="number"
          value={bpm}
          onChange={handleBpmChange}
          className="w-16 bg-transparent text-white border border-gray-700 rounded px-2 py-1 text-sm hover:border-[#FBAE00] focus:border-[#FBAE00] focus:outline-none"
          min="30"
          max="250"
        />
        <span className="text-sm text-gray-400">BPM</span>
      </div>

      <div className="flex gap-1">
        {Array.from({ length: TIME_SIGNATURES[timeSignature].beats }).map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-colors ${
              currentBeat === index && isPlaying
                ? 'bg-[#FBAE00]'
                : 'bg-gray-700'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Metronome; 