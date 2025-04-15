import React, { useState } from 'react';
import { transposeText, NOTES } from '../utils/chordTransposer';

const PlayerModal = ({ song, onClose }) => {
  const [semitones, setSemitones] = useState(0);
  const [transposedLyrics, setTransposedLyrics] = useState(song?.lyrics || '');

  if (!song) return null;

  const videoId = song.youtubeUrl ? song.youtubeUrl.split('v=')[1]?.split('&')[0] : null;

  const handleTranspose = (steps) => {
    setSemitones(steps);
    setTransposedLyrics(transposeText(song.lyrics || '', steps));
  };

  // Encontrar el índice de la tonalidad original
  const originalKeyIndex = NOTES.indexOf(song.key?.replace('m', '') || 'C');
  
  // Calcular la nueva tonalidad
  const newKeyIndex = (originalKeyIndex + semitones + 12) % 12;
  const newKey = NOTES[newKeyIndex] + (song.key?.includes('m') ? 'm' : '');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 overflow-y-auto">
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-gray-900 rounded-lg w-full max-w-4xl my-8 relative">
          <div className="sticky top-0 z-10 bg-gray-900 p-6 flex justify-between items-center border-b border-gray-800">
            <div>
              <h3 className="text-lg font-bold text-white">{song.title}</h3>
              <p className="text-gray-400">{song.artist}</p>
            </div>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
            </button>
          </div>
          
          <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="lg:sticky lg:top-28 space-y-4">
              {videoId ? (
                <div className="aspect-w-16 aspect-h-9">
                  <iframe
                    width="100%"
                    height="315"
                    src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="rounded-lg"
                  ></iframe>
                </div>
              ) : (
                <div className="aspect-w-16 aspect-h-9 bg-gray-800 rounded-lg flex items-center justify-center">
                  <p className="text-gray-400">No hay video disponible</p>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-800 p-4 rounded-lg">
                  <p className="text-sm text-gray-400 mb-1">BPM</p>
                  <p className="font-bold text-[#FBAE00]">{song.bpm}</p>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg">
                  <p className="text-sm text-gray-400 mb-1">Tonalidad</p>
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-[#FBAE00]">{newKey}</p>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleTranspose(semitones - 1)}
                        className="text-gray-400 hover:text-white p-1"
                      >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                          <path fill="currentColor" d="M19 13H5v-2h14v2z"/>
                        </svg>
                      </button>
                      <button
                        onClick={() => handleTranspose(0)}
                        className="text-xs text-gray-400 hover:text-white px-2 py-1 rounded border border-gray-700"
                      >
                        Reset
                      </button>
                      <button
                        onClick={() => handleTranspose(semitones + 1)}
                        className="text-gray-400 hover:text-white p-1"
                      >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                          <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-lg flex flex-col h-[60vh] lg:h-[70vh]">
              <h4 className="font-medium text-white sticky top-0 bg-gray-800 p-4 border-b border-gray-700">
                Letra con acordes
              </h4>
              <div className="p-4 overflow-y-auto flex-1">
                <pre className="whitespace-pre-wrap font-sans text-gray-300">
                  {transposedLyrics}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerModal;