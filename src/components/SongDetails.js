import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import Metronome from './Metronome';
import { transposeText, NOTES } from '../utils/chordTransposer';
import { useAuth } from '../context/AuthContext';

const SongDetails = ({ song, onClose, onDuplicateSong }) => {
  const [semitones, setSemitones] = useState(0);
  const [transposedLyrics, setTransposedLyrics] = useState(song?.lyrics || '');
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

  const formatLyrics = (text) => {
    return text.split('\n').map((line, index) => {
      // Detectar si es una etiqueta de sección
      if (line.trim().match(/^\[(INTRO|VERSO|PRE-?CORO|CORO|PUENTE|INSTRUMENTAL|FINAL)\]$/i)) {
        return <div key={index} className="section">{line}</div>;
      }
      
      // Resaltar acordes en el texto
      const parts = line.split(/(\[[^\]]+\])/g);
      return (
        <div key={index} className="mb-1">
          {parts.map((part, partIndex) => {
            if (part.startsWith('[') && part.endsWith(']')) {
              return <span key={partIndex} className="chord">{part}</span>;
            }
            return <span key={partIndex}>{part}</span>;
          })}
        </div>
      );
    });
  };

  if (!song) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-95 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-xl">
        <div className="p-4 border-b border-gray-700">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-white">{song.title}</h2>
              <p className="text-gray-400">{song.artist}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <p className="text-gray-300">BPM: {song.bpm || '-'}</p>
            <div className="flex items-center gap-2">
              <p className="text-gray-300">Tono: {song.key || '-'}</p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleTranspose(-1)}
                  className="p-1 text-gray-400 hover:text-white"
                >
                  <FontAwesomeIcon icon={faChevronLeft} />
                </button>
                <span className="text-gray-300 w-6 text-center">{semitones}</span>
                <button
                  onClick={() => handleTranspose(1)}
                  className="p-1 text-gray-400 hover:text-white"
                >
                  <FontAwesomeIcon icon={faChevronRight} />
                </button>
              </div>
              {isAdmin && semitones !== 0 && (
                <button
                  onClick={handleDuplicateWithNewKey}
                  className="ml-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Duplicar en nuevo tono
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="lyrics-container overflow-y-auto max-h-[60vh] p-4 bg-gray-900 rounded">
          <div className="lyrics-text">
            {formatLyrics(transposedLyrics || '-')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SongDetails; 