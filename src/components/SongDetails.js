import React, { useState } from 'react';
import Metronome from './Metronome';
import { transposeText, NOTES } from '../utils/chordTransposer';
import { useAuth } from '../context/AuthContext';
import ChordDiagram from './ChordDiagram';

const SongDetails = ({ song, onClose, onDuplicateSong }) => {
  const [semitones, setSemitones] = useState(0);
  const [transposedLyrics, setTransposedLyrics] = useState(song?.lyrics || '');
  const [selectedChord, setSelectedChord] = useState(null);
  const { isAdmin } = useAuth();

  // Encontrar el índice de la tonalidad original
  const originalKeyIndex = NOTES.indexOf(song.key?.replace('m', '') || 'C');
  
  // Calcular la nueva tonalidad
  const newKeyIndex = (originalKeyIndex + semitones + 12) % 12;
  const newKey = NOTES[newKeyIndex] + (song.key?.includes('m') ? 'm' : '');

  const handleTranspose = (steps) => {
    const newSemitones = steps === 0 ? 0 : semitones + steps;
    setSemitones(newSemitones);
    setTransposedLyrics(transposeText(song.lyrics || '', newSemitones));
  };

  const handleDuplicateWithNewKey = () => {
    if (onDuplicateSong && semitones !== 0) {
      const duplicatedSong = {
        ...song,
        title: `${song.title} (${newKey})`,
        key: newKey,
        lyrics: transposedLyrics
      };
      onDuplicateSong(duplicatedSong);
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="bg-[#0f1420] w-full max-w-6xl max-h-[90vh] rounded-lg flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 flex justify-between items-start border-b border-gray-800">
          <div className="flex-1 min-w-0 pr-4">
            <h1 className="text-xl text-white font-medium break-words">{song.title}</h1>
            <p className="text-gray-400 text-sm mt-1">{song.artist}</p>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white p-2 flex-shrink-0"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          <div className="flex flex-col md:flex-row h-full">
            {/* Left Column */}
            <div className="md:w-1/2 p-4 space-y-4">
              {/* Video */}
              {song.youtubeUrl && (
                <div className="relative pb-[56.25%] h-0 bg-[#1a1f2e] rounded-lg overflow-hidden">
                  <iframe
                    src={`https://www.youtube.com/embed/${song.youtubeUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1]}`}
                    title={song.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute top-0 left-0 w-full h-full"
                  ></iframe>
                </div>
              )}

              {/* Controls Grid */}
              <div className="grid grid-cols-2 gap-4">
                {/* BPM */}
                <div className="bg-[#1a1f2e] p-4 rounded-lg">
                  <p className="text-gray-400 text-sm font-medium mb-1">BPM</p>
                  <p className="text-[#FBAE00] text-2xl font-bold tabular-nums">{song.bpm || '-'}</p>
                </div>

                {/* Key */}
                <div className="bg-[#1a1f2e] p-4 rounded-lg">
                  <p className="text-gray-400 text-sm font-medium mb-1">Tonalidad</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[#FBAE00] text-2xl font-bold">{newKey || '-'}</span>
                    {song.key && (
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => handleTranspose(-1)}
                          className="text-gray-400 hover:text-white text-lg w-6 h-6 flex items-center justify-center"
                        >
                          −
                        </button>
                        <button 
                          onClick={() => handleTranspose(0)}
                          className="text-gray-400 hover:text-white px-2 text-sm"
                        >
                          Reset
                        </button>
                        <button 
                          onClick={() => handleTranspose(1)}
                          className="text-gray-400 hover:text-white text-lg w-6 h-6 flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Duplicate Button */}
              {isAdmin && semitones !== 0 && (
                <button
                  onClick={handleDuplicateWithNewKey}
                  className="w-full bg-[#1a1f2e] hover:bg-[#242937] text-[#FBAE00] p-4 rounded-lg flex items-center justify-center space-x-2"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z"/>
                  </svg>
                  <span>Duplicar en {newKey}</span>
                </button>
              )}

              {/* Metronome */}
              {song.bpm && (
                <div className="bg-[#1a1f2e] p-4 rounded-lg">
                  <h3 className="text-gray-400 text-sm font-medium mb-4">Metrónomo</h3>
                  <Metronome initialBpm={parseInt(song.bpm, 10)} />
                </div>
              )}
            </div>

            {/* Right Column - Lyrics */}
            <div className="md:w-1/2 p-4">
              <div className="bg-[#1a1f2e] h-full rounded-lg">
                <div className="p-4">
                  <h3 className="text-gray-400 text-sm font-medium mb-4">Letra con acordes</h3>
                  <div className="text-white font-mono text-sm whitespace-pre-wrap lyrics-content">
                    {transposedLyrics.split('\n').map((line, index) => {
                      // Detectar si es una etiqueta de sección
                      if (line.match(/^\[(Intro|Verso|Coro|Pre-Coro|Puente|Instrumental|Final)\]/i)) {
                        return (
                          <div key={index} className="text-[#FBAE00] font-semibold mt-4 mb-2">
                            {line}
                          </div>
                        );
                      }
                      
                      // Resaltar acordes en el texto
                      const parts = line.split(/(\[[^\]]+\])/g);
                      return (
                        <div key={index} className="mb-1">
                          {parts.map((part, partIndex) => {
                            if (part.startsWith('[') && part.endsWith(']')) {
                              const chord = part.slice(1, -1);
                              return (
                                <button
                                  key={partIndex}
                                  onClick={() => setSelectedChord(chord)}
                                  className="text-[#4a9eff] hover:text-[#7ab8ff] cursor-pointer"
                                >
                                  {part}
                                </button>
                              );
                            }
                            return <span key={partIndex}>{part}</span>;
                          })}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {selectedChord && (
                  <ChordDiagram
                    chord={selectedChord}
                    onClose={() => setSelectedChord(null)}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SongDetails; 