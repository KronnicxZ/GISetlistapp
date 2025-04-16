import React from 'react';

const ChordDiagram = ({ chord, onClose }) => {
  // Base de datos de acordes (podemos expandirla más adelante)
  const chordDatabase = {
    'A': {
      positions: [
        {
          name: 'A',
          frets: 'x02220',
          fingers: '---123',
          description: 'La Mayor'
        }
      ]
    },
    'Am': {
      positions: [
        {
          name: 'Am',
          frets: 'x02210',
          fingers: '---321',
          description: 'La menor'
        }
      ]
    },
    'C': {
      positions: [
        {
          name: 'C',
          frets: 'x32010',
          fingers: '-32-1-',
          description: 'Do Mayor'
        }
      ]
    },
    'C/E': {
      positions: [
        {
          name: 'C/E',
          frets: '032010',
          fingers: '-32-1-',
          description: 'Do Mayor con bajo en Mi'
        }
      ]
    },
    'D': {
      positions: [
        {
          name: 'D',
          frets: 'xx0232',
          fingers: '---132',
          description: 'Re Mayor'
        }
      ]
    },
    'Dm': {
      positions: [
        {
          name: 'Dm',
          frets: 'xx0231',
          fingers: '---231',
          description: 'Re menor'
        }
      ]
    },
    'Em': {
      positions: [
        {
          name: 'Em',
          frets: '022000',
          fingers: '-23---',
          description: 'Mi menor'
        }
      ]
    },
    'F': {
      positions: [
        {
          name: 'F',
          frets: '133211',
          fingers: '134211',
          description: 'Fa Mayor'
        }
      ]
    },
    'G': {
      positions: [
        {
          name: 'G',
          frets: '320003',
          fingers: '21---3',
          description: 'Sol Mayor'
        }
      ]
    }
  };

  const chordData = chordDatabase[chord]?.positions[0];
  if (!chordData) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-[#0f1420] rounded-lg p-6 max-w-sm w-full">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-bold text-white">{chordData.name}</h3>
            <p className="text-gray-400 text-sm">{chordData.description}</p>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>

        <div className="relative mb-6">
          {/* Diagrama del acorde */}
          <div className="border border-gray-700 rounded-lg p-4">
            {/* Cuerdas y trastes */}
            <div className="relative">
              {/* Marcadores de cuerdas superiores */}
              <div className="flex justify-between mb-2">
                {[...chordData.frets].map((value, i) => (
                  <div key={`top-${i}`} className="w-8 text-center">
                    {value === 'x' ? (
                      <span className="text-red-500 font-bold text-lg">×</span>
                    ) : value === '0' ? (
                      <span className="text-green-500 font-bold text-lg">○</span>
                    ) : null}
                  </div>
                ))}
              </div>

              {/* Mástil */}
              <div className="relative">
                {/* Líneas verticales (cuerdas) */}
                <div className="absolute inset-0 flex justify-between">
                  {[...Array(6)].map((_, i) => (
                    <div key={`string-${i}`} className="w-px bg-gray-600 h-full"/>
                  ))}
                </div>

                {/* Líneas horizontales (trastes) */}
                <div className="space-y-8">
                  {[...Array(4)].map((_, i) => (
                    <div key={`fret-${i}`} className="h-px bg-gray-600"/>
                  ))}
                </div>

                {/* Puntos de dedos */}
                <div className="absolute inset-0 -mt-4">
                  <div className="grid grid-cols-6 gap-x-2">
                    {[...chordData.frets].map((fret, stringIndex) => (
                      <div key={`finger-${stringIndex}`} className="relative h-32">
                        {fret !== 'x' && fret !== '0' && (
                          <div 
                            className="absolute w-6 h-6 bg-[#FBAE00] rounded-full flex items-center justify-center transform -translate-x-3"
                            style={{ top: `${(parseInt(fret) - 1) * 32 + 16}px` }}
                          >
                            <span className="text-xs text-black font-bold">
                              {chordData.fingers[stringIndex] !== '-' ? chordData.fingers[stringIndex] : ''}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Números de trastes */}
              <div className="absolute -left-6 top-0 h-full flex flex-col justify-around text-gray-500 text-sm">
                {[1, 2, 3].map(num => (
                  <div key={`fret-num-${num}`} className="h-8 flex items-center">
                    {num}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-[#FBAE00] text-black font-medium py-2 rounded-lg hover:bg-[#ffc03d]"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default ChordDiagram; 