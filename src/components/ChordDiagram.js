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

  const renderFret = (fret, string) => {
    const value = chordData.frets[string];
    const finger = chordData.fingers[string];
    
    return (
      <div className="relative w-6 h-6 flex items-center justify-center">
        {value === 'x' ? (
          <span className="text-red-500 font-bold">×</span>
        ) : value === '0' ? (
          <span className="text-green-500 font-bold">○</span>
        ) : (
          <>
            <div className="absolute w-4 h-4 bg-[#FBAE00] rounded-full flex items-center justify-center">
              <span className="text-xs text-black font-bold">{finger !== '-' ? finger : ''}</span>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-[#0f1420] rounded-lg p-6 max-w-sm w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-white">{chordData.name}</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>
        
        <div className="mb-4">
          <p className="text-gray-400 text-sm">{chordData.description}</p>
        </div>

        <div className="relative">
          {/* Diagrama del acorde */}
          <div className="border border-gray-700 rounded-lg p-4">
            <div className="grid grid-cols-6 gap-2">
              {/* Números de cuerdas */}
              {[6,5,4,3,2,1].map(string => (
                <div key={`string-${string}`} className="text-center text-xs text-gray-500 mb-2">
                  {string}
                </div>
              ))}
              
              {/* Trastes */}
              {[0,1,2,3].map(fret => (
                <React.Fragment key={`fret-${fret}`}>
                  {[5,4,3,2,1,0].map(string => (
                    <div 
                      key={`fret-${fret}-string-${string}`}
                      className="border-t border-gray-700"
                    >
                      {fret === 0 && renderFret(fret, string)}
                    </div>
                  ))}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4">
          <button
            onClick={onClose}
            className="w-full bg-[#FBAE00] text-black font-medium py-2 rounded-lg hover:bg-[#ffc03d]"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChordDiagram; 