import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faTimes } from '@fortawesome/free-solid-svg-icons';
import { transposeText } from '../utils/chordTransposer';
import { useAuth } from '../context/AuthContext';

const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const SongDetails = ({ song, onClose, onDuplicateSong }) => {
  const [semitones, setSemitones] = useState(0);
  const [transposedLyrics, setTransposedLyrics] = useState(song.lyrics);
  const { isAdmin } = useAuth();

  useEffect(() => {
    setTransposedLyrics(transposeText(song.lyrics, semitones));
  }, [semitones, song.lyrics]);

  const handleTranspose = (steps) => {
    const newSemitones = semitones + steps;
    setSemitones(newSemitones);
  };

  const handleDuplicateWithNewKey = () => {
    if (!onDuplicateSong || semitones === 0) return;

    const originalKeyIndex = NOTES.indexOf(song.key.replace('m', ''));
    if (originalKeyIndex === -1) return;

    let newKeyIndex = (originalKeyIndex + semitones) % 12;
    if (newKeyIndex < 0) newKeyIndex += 12;
    const newKey = NOTES[newKeyIndex] + (song.key.includes('m') ? 'm' : '');

    const duplicatedSong = {
      ...song,
      key: newKey,
      lyrics: transposedLyrics,
      title: `${song.title} (${newKey})`
    };

    onDuplicateSong(duplicatedSong);
  };

  const formatLyrics = (text) => {
    return text.split('\n').map((line, index) => {
      if (line.trim().startsWith('[') && line.trim().endsWith(']')) {
        return <div key={index} className="section-tag">{line}</div>;
      }
      
      // Detectar líneas que solo contienen acordes
      const isChordLine = line.trim() && !line.trim().match(/[a-z]/i);
      if (isChordLine) {
        return <div key={index} className="chord-line">{line}</div>;
      }
      
      return <div key={index}>{line}</div>;
    });
  };

  if (!song) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-95 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-xl">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-white">{song.title}</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-gray-300 mb-2">Artista: {song.artist}</p>
              {song.video && (
                <div className="aspect-w-16 aspect-h-9 mb-4">
                  <iframe
                    src={`https://www.youtube.com/embed/${song.video}`}
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="rounded"
                  ></iframe>
                </div>
              )}
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
              {formatLyrics(transposedLyrics || '-')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SongDetails; 