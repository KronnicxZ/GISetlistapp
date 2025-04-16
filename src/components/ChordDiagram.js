import React from 'react';

const ChordDiagram = ({ chord, onClose }) => {
  // Base de datos de posiciones de acordes
  const chordPositions = {
    'A': {
      positions: [
        { fret: 'x', string: 6 },
        { fret: '0', string: 5 },
        { fret: '2', string: 4 },
        { fret: '2', string: 3 },
        { fret: '2', string: 2 },
        { fret: '0', string: 1 }
      ],
      description: 'Acorde de La Mayor'
    },
    'Am': {
      positions: [
        { fret: 'x', string: 6 },
        { fret: '0', string: 5 },
        { fret: '2', string: 4 },
        { fret: '2', string: 3 },
        { fret: '1', string: 2 },
        { fret: '0', string: 1 }
      ],
      description: 'Acorde de La menor'
    },
    'C': {
      positions: [
        { fret: 'x', string: 6 },
        { fret: '3', string: 5 },
        { fret: '2', string: 4 },
        { fret: '0', string: 3 },
        { fret: '1', string: 2 },
        { fret: '0', string: 1 }
      ],
      description: 'Acorde de Do Mayor'
    },
    'C/E': {
      positions: [
        { fret: '0', string: 6 },
        { fret: '3', string: 5 },
        { fret: '2', string: 4 },
        { fret: '0', string: 3 },
        { fret: '1', string: 2 },
        { fret: '0', string: 1 }
      ],
      description: 'Acorde de Do Mayor con bajo en Mi'
    },
    'D': {
      positions: [
        { fret: 'x', string: 6 },
        { fret: 'x', string: 5 },
        { fret: '0', string: 4 },
        { fret: '2', string: 3 },
        { fret: '3', string: 2 },
        { fret: '2', string: 1 }
      ],
      description: 'Acorde de Re Mayor'
    },
    'Dm': {
      positions: [
        { fret: 'x', string: 6 },
        { fret: 'x', string: 5 },
        { fret: '0', string: 4 },
        { fret: '2', string: 3 },
        { fret: '3', string: 2 },
        { fret: '1', string: 1 }
      ],
      description: 'Acorde de Re menor'
    },
    'Em': {
      positions: [
        { fret: '0', string: 6 },
        { fret: '2', string: 5 },
        { fret: '2', string: 4 },
        { fret: '0', string: 3 },
        { fret: '0', string: 2 },
        { fret: '0', string: 1 }
      ],
      description: 'Acorde de Mi menor'
    },
    'F': {
      positions: [
        { fret: '1', string: 6 },
        { fret: '3', string: 5 },
        { fret: '3', string: 4 },
        { fret: '2', string: 3 },
        { fret: '1', string: 2 },
        { fret: '1', string: 1 }
      ],
      description: 'Acorde de Fa Mayor'
    },
    'G': {
      positions: [
        { fret: '3', string: 6 },
        { fret: '2', string: 5 },
        { fret: '0', string: 4 },
        { fret: '0', string: 3 },
        { fret: '0', string: 2 },
        { fret: '3', string: 1 }
      ],
      description: 'Acorde de Sol Mayor'
    }
  };

  const chordData = chordPositions[chord];

  if (!chordData) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-[#0f1420] p-6 rounded-lg">
          <p className="text-white mb-4">No se encontró el diagrama para el acorde {chord}</p>
          <button
            onClick={onClose}
            className="bg-[#1a1f2e] hover:bg-[#242937] text-white px-4 py-2 rounded"
          >
            Cerrar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-[#0f1420] p-6 rounded-lg">
        <h3 className="text-white text-lg font-medium mb-4">{chord} - {chordData.description}</h3>
        
        {/* Diagrama del mástil */}
        <div className="relative w-48 h-64 bg-[#1a1f2e] rounded-lg p-4 mb-4">
          {/* Cuerdas */}
          {[...Array(6)].map((_, i) => (
            <div
              key={`string-${i}`}
              className="absolute left-4 right-4 h-px bg-gray-400"
              style={{ top: `${20 + i * 20}%` }}
            />
          ))}
          
          {/* Trastes */}
          {[...Array(5)].map((_, i) => (
            <div
              key={`fret-${i}`}
              className="absolute top-4 bottom-4 w-px bg-gray-600"
              style={{ left: `${20 + i * 20}%` }}
            />
          ))}
          
          {/* Posiciones de los dedos */}
          {chordData.positions.map((pos, i) => (
            <div
              key={`pos-${i}`}
              className="absolute"
              style={{
                top: `${20 + (pos.string - 1) * 20}%`,
                left: pos.fret === '0' || pos.fret === 'x' ? '10%' : `${20 + (parseInt(pos.fret) - 1) * 20}%`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              {pos.fret === 'x' ? (
                <span className="text-red-500 font-bold">×</span>
              ) : pos.fret === '0' ? (
                <span className="text-[#4a9eff] font-bold">○</span>
              ) : (
                <div className="w-4 h-4 rounded-full bg-[#4a9eff] flex items-center justify-center">
                  <span className="text-xs text-white">{pos.fret}</span>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <button
          onClick={onClose}
          className="bg-[#1a1f2e] hover:bg-[#242937] text-white px-4 py-2 rounded w-full"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default ChordDiagram; 