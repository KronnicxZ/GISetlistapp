const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const FLAT_NOTES = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

// Función para normalizar un acorde a su forma con sostenidos
const normalizeChord = (chord) => {
  const flatToSharp = {
    'Db': 'C#',
    'Eb': 'D#',
    'Gb': 'F#',
    'Ab': 'G#',
    'Bb': 'A#'
  };

  // Separar la nota base del modificador (m, 7, maj7, etc.)
  const match = chord.match(/^([A-G][b#]?)(.*)$/);
  if (!match) return chord;

  const [, note, modifier] = match;
  const normalizedNote = flatToSharp[note] || note;
  return normalizedNote + modifier;
};

// Función para transponer un acorde
const transposeChord = (chord, semitones) => {
  // Normalizar el acorde primero
  const normalizedChord = normalizeChord(chord);
  
  // Separar la nota base del modificador
  const match = normalizedChord.match(/^([A-G][#]?)(.*)$/);
  if (!match) return chord;

  const [, note, modifier] = match;
  
  // Encontrar el índice de la nota en el array de notas
  const noteIndex = NOTES.indexOf(note);
  if (noteIndex === -1) return chord;
  
  // Calcular la nueva posición
  const newIndex = (noteIndex + semitones + 12) % 12;
  
  // Retornar el nuevo acorde
  return NOTES[newIndex] + modifier;
};

// Función para transponer texto con acordes
const transposeText = (text, semitones) => {
  // Buscar acordes entre corchetes [Am] [C] [G7]
  return text.replace(/\[([^\]]+)\]/g, (match, chord) => {
    const transposedChord = transposeChord(chord, semitones);
    return `[${transposedChord}]`;
  });
};

export { transposeText, transposeChord, NOTES }; 