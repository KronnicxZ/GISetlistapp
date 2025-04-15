import React, { useState, useEffect } from 'react';
import { verses } from '../constants/verses';

const BIBLE_VERSIONS = {
  'RVR1960': '592420522e16049f-01', // Reina Valera 1960
  'NVI': 'c61ead81cd1e82c1-01',     // Nueva Versión Internacional
  'LBLA': 'b32b9d1b64b4ef29-01',    // La Biblia de las Américas
  'RVA': '592420522e16049f-02',     // Reina Valera Actualizada
  'PDT': '592420522e16049f-03',     // Palabra de Dios para Todos
};

const BibleVerse = () => {
  const [currentVerseIndex, setCurrentVerseIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  // Efecto para seleccionar un versículo aleatorio al montar el componente
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * verses.length);
    setCurrentVerseIndex(randomIndex);
  }, []);

  // Efecto para el cambio automático de versículos
  useEffect(() => {
    let interval;
    if (isAutoPlay) {
      interval = setInterval(() => {
        setCurrentVerseIndex((prevIndex) => 
          prevIndex === verses.length - 1 ? 0 : prevIndex + 1
        );
      }, 8000); // 8 segundos
    }
    return () => clearInterval(interval);
  }, [isAutoPlay]);

  const handlePreviousVerse = () => {
    setIsAutoPlay(false); // Detiene la reproducción automática al navegar manualmente
    setCurrentVerseIndex((prevIndex) => 
      prevIndex === 0 ? verses.length - 1 : prevIndex - 1
    );
  };

  const handleNextVerse = () => {
    setIsAutoPlay(false); // Detiene la reproducción automática al navegar manualmente
    setCurrentVerseIndex((prevIndex) => 
      prevIndex === verses.length - 1 ? 0 : prevIndex + 1
    );
  };

  if (!verses[currentVerseIndex]) return null;

  return (
    <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 relative">
      <div className="max-w-3xl mx-auto">
        <p className="text-gray-300 text-lg italic mb-3">"{verses[currentVerseIndex].verse}"</p>
        <div className="flex flex-col space-y-2">
          <div className="flex justify-between items-center">
            <p className="text-[#FBAE00] text-sm font-medium">
              - {verses[currentVerseIndex].reference}
            </p>
            <div className="flex space-x-4 items-center">
              <button
                onClick={() => setIsAutoPlay(!isAutoPlay)}
                className={`text-gray-400 hover:text-[#FBAE00] transition-colors duration-200 focus:outline-none ${isAutoPlay ? 'text-[#FBAE00]' : ''}`}
                aria-label={isAutoPlay ? "Pausar reproducción automática" : "Activar reproducción automática"}
              >
                {isAutoPlay ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </button>
              <button
                onClick={handlePreviousVerse}
                className="text-gray-400 hover:text-[#FBAE00] transition-colors duration-200 focus:outline-none"
                aria-label="Versículo anterior"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={handleNextVerse}
                className="text-gray-400 hover:text-[#FBAE00] transition-colors duration-200 focus:outline-none"
                aria-label="Siguiente versículo"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BibleVerse; 