import React, { useState, useEffect } from 'react';
import { extractYoutubeVideoId } from '../utils/youtube';

const SongForm = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState(initialData || {
    title: '',
    artist: '',
    bpm: '',
    key: '',
    genre: '',
    youtubeUrl: '',
    lyrics: ''
  });
  const [isFetching, setIsFetching] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    // Formatear el texto para mostrar
    const formatDisplayText = (text) => {
      if (!text) return '';
      return text.split('\n').map(line => {
        // Detectar si es una etiqueta de sección
        if (line.match(/^\[(Intro|Verso|Coro|Pre-Coro|Puente|Instrumental|Final)\]/i)) {
          return `<div class="text-[#FBAE00] font-semibold mt-4 mb-2">${line}</div>`;
        }
        
        // Resaltar acordes
        return line.replace(/(\[[^\]]+\])/g, '<span class="text-[#4a9eff]">$1</span>');
      }).join('\n');
    };

    setDisplayText(formatDisplayText(formData.lyrics));
  }, [formData.lyrics]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const formatPastedLyrics = (text) => {
    // Lista de acordes comunes
    const commonChords = [
      'A', 'Am', 'A7', 'Am7', 'Amaj7', 'A/C#', 'A/E', 'A/G#',
      'B', 'Bm', 'B7', 'Bm7', 'Bmaj7', 'B/D#', 'B/F#',
      'C', 'Cm', 'C7', 'Cm7', 'Cmaj7', 'C/E', 'C/G',
      'D', 'Dm', 'D7', 'Dm7', 'Dmaj7', 'D/F#', 'D/A',
      'E', 'Em', 'E7', 'Em7', 'Emaj7', 'E/G#', 'E/B',
      'F', 'Fm', 'F7', 'Fm7', 'Fmaj7', 'F/A', 'F/C',
      'G', 'Gm', 'G7', 'Gm7', 'Gmaj7', 'G/B', 'G/D'
    ];

    // Dividir el texto en líneas
    const lines = text.split('\n');
    
    // Procesar cada línea
    const formattedLines = lines.map(line => {
      // Si la línea está vacía, devolverla tal cual
      if (!line.trim()) return line;

      // Verificar si la línea contiene solo acordes (sin texto)
      const words = line.trim().split(/\s+/);
      const isChordOnlyLine = words.every(word => {
        const trimmedWord = word.trim();
        return commonChords.some(chord => 
          trimmedWord.toUpperCase() === chord.toUpperCase() ||
          trimmedWord.toUpperCase().startsWith(chord.toUpperCase() + '/')
        );
      });

      if (isChordOnlyLine && words.length > 0) {
        // Si es una línea solo de acordes, formatear cada palabra como acorde
        return words.map(word => `[${word}]`).join(' ');
      }

      // Para líneas con texto, solo formatear palabras que son definitivamente acordes
      // (están solas o al principio de la línea)
      const formattedWords = words.map((word, index) => {
        const trimmedWord = word.trim();
        const isFirstWord = index === 0;
        const isPreviousWordEmpty = index > 0 && !words[index - 1].trim();
        const isAlone = isFirstWord || isPreviousWordEmpty;

        // Solo formatear como acorde si:
        // 1. Es una palabra sola al principio de la línea o después de espacios
        // 2. Coincide exactamente con un acorde conocido
        if (isAlone && commonChords.some(chord => 
          trimmedWord.toUpperCase() === chord.toUpperCase() ||
          trimmedWord.toUpperCase().startsWith(chord.toUpperCase() + '/')
        )) {
          return `[${word}]`;
        }
        return word;
      });
      
      return formattedWords.join(' ');
    });
    
    return formattedLines.join('\n');
  };

  const handlePaste = (e) => {
    if (e.target.name === 'lyrics') {
      e.preventDefault();
      const pastedText = e.clipboardData.getData('text');
      const formattedText = formatPastedLyrics(pastedText);
      
      // Insertar el texto formateado en la posición del cursor
      const textarea = e.target;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = formData.lyrics;
      const before = text.substring(0, start);
      const after = text.substring(end);
      
      setFormData(prev => ({
        ...prev,
        lyrics: before + formattedText + after
      }));
      
      // Restaurar el foco y la posición del cursor
      setTimeout(() => {
        textarea.focus();
        const newCursorPos = start + formattedText.length;
        textarea.setSelectionRange(newCursorPos, newCursorPos);
      }, 0);
    }
  };

  const fetchVideoData = async () => {
    if (!formData.youtubeUrl) return;
    
    try {
      setIsFetching(true);
      setFetchError(null);
      
      const videoId = extractYoutubeVideoId(formData.youtubeUrl);
      console.log('ID del video extraído:', videoId);
      
      if (!videoId) {
        throw new Error('URL de YouTube no válida');
      }
      
      // Obtener título y artista
      const response = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);
      
      if (!response.ok) {
        throw new Error('No se pudieron obtener los datos del video');
      }
      
      const data = await response.json();
      const title = data.title;
      
      // Intenta separar artista y título (formato común: "Artista - Título Canción")
      const titleParts = title.split(' - ');
      let artist = '';
      let songTitle = title;
      
      if (titleParts.length >= 2) {
        artist = titleParts[0];
        songTitle = titleParts.slice(1).join(' - ');
      } else if (titleParts.length === 1) {
        songTitle = titleParts[0];
      }

      setFormData(prev => {
        const newData = {
          ...prev,
          title: songTitle,
          artist: artist
        };
        console.log('Actualizando formulario con:', newData);
        return newData;
      });
      
    } catch (error) {
      console.error('Error al obtener datos del video:', error);
      setFetchError(error.message);
    } finally {
      setIsFetching(false);
    }
  };

  const insertSectionTag = (sectionType) => {
    const textarea = document.getElementById('lyrics');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = formData.lyrics;
    const before = text.substring(0, start);
    const selection = text.substring(start, end);
    const after = text.substring(end);
    
    // Crear el tag de sección
    const sectionTag = `[${sectionType}]\n`;
    
    // Insertar el tag y mantener el texto seleccionado
    const newText = before + sectionTag + selection + after;
    
    // Actualizar el estado
    setFormData(prev => ({ ...prev, lyrics: newText }));
    
    // Restaurar el foco y la posición del cursor
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + sectionTag.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos + selection.length);
    }, 0);
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onCancel();
        }
      }}
    >
      <div className="bg-[#0f1420] w-full max-w-4xl rounded-lg overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-800">
          <h2 className="text-xl font-semibold">
            {initialData ? 'Editar Canción' : 'Nueva Canción'}
          </h2>
          <button 
            onClick={onCancel}
            className="text-gray-400 hover:text-white p-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                URL de YouTube
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  name="youtubeUrl"
                  value={formData.youtubeUrl || ''}
                  onChange={handleChange}
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#FBAE00]"
                  placeholder="https://www.youtube.com/watch?v=..."
                />
                <button
                  type="button"
                  onClick={fetchVideoData}
                  disabled={isFetching || !formData.youtubeUrl}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    isFetching || !formData.youtubeUrl
                      ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                      : 'bg-[#FBAE00] hover:bg-[#ffc03d] text-black'
                  }`}
                >
                  {isFetching ? 'Buscando...' : 'Obtener datos'}
                </button>
              </div>
              {fetchError && (
                <p className="mt-1 text-sm text-red-500">{fetchError}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Título
              </label>
              <input
                type="text"
                name="title"
                value={formData.title || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#FBAE00]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Artista
              </label>
              <input
                type="text"
                name="artist"
                value={formData.artist || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#FBAE00]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  BPM
                </label>
                <input
                  type="number"
                  name="bpm"
                  value={formData.bpm || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#FBAE00]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Tonalidad
                </label>
                <input
                  type="text"
                  name="key"
                  value={formData.key || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#FBAE00]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Género
                </label>
                <select
                  name="genre"
                  value={formData.genre || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#FBAE00]"
                >
                  <option value="">Seleccionar categoría</option>
                  <option value="adoracion">Adoración</option>
                  <option value="alabanza">Alabanza</option>
                  <option value="ofrenda">Ofrenda</option>
                </select>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-400">
                  Letra con acordes
                </label>
                <div className="flex flex-wrap gap-1">
                  <button 
                    type="button" 
                    onClick={() => insertSectionTag('Intro')}
                    className="px-2 py-1 text-xs bg-gray-800 text-gray-300 rounded hover:bg-gray-700"
                  >
                    Intro
                  </button>
                  <button 
                    type="button" 
                    onClick={() => insertSectionTag('Verso')}
                    className="px-2 py-1 text-xs bg-gray-800 text-gray-300 rounded hover:bg-gray-700"
                  >
                    Verso
                  </button>
                  <button 
                    type="button" 
                    onClick={() => insertSectionTag('Pre-Coro')}
                    className="px-2 py-1 text-xs bg-gray-800 text-gray-300 rounded hover:bg-gray-700"
                  >
                    Pre-Coro
                  </button>
                  <button 
                    type="button" 
                    onClick={() => insertSectionTag('Coro')}
                    className="px-2 py-1 text-xs bg-gray-800 text-gray-300 rounded hover:bg-gray-700"
                  >
                    Coro
                  </button>
                  <button 
                    type="button" 
                    onClick={() => insertSectionTag('Puente')}
                    className="px-2 py-1 text-xs bg-gray-800 text-gray-300 rounded hover:bg-gray-700"
                  >
                    Puente
                  </button>
                  <button 
                    type="button" 
                    onClick={() => insertSectionTag('Instrumental')}
                    className="px-2 py-1 text-xs bg-gray-800 text-gray-300 rounded hover:bg-gray-700"
                  >
                    Instrumental
                  </button>
                  <button 
                    type="button" 
                    onClick={() => insertSectionTag('Final')}
                    className="px-2 py-1 text-xs bg-gray-800 text-gray-300 rounded hover:bg-gray-700"
                  >
                    Final
                  </button>
                </div>
              </div>
              <div className="relative">
                <textarea
                  id="lyrics"
                  name="lyrics"
                  value={formData.lyrics || ''}
                  onChange={handleChange}
                  onPaste={handlePaste}
                  rows="6"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#FBAE00] lyrics-text opacity-0 absolute inset-0 z-10"
                  placeholder="[Am] Letra de la canción..."
                />
                <div 
                  className="w-full h-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white font-mono text-sm whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{ __html: displayText || '<span class="text-gray-500">[Am] Letra de la canción...</span>' }}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6 p-4 md:p-6 border-t border-gray-800">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white bg-gray-800 rounded-lg focus:outline-none"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-black bg-[#FBAE00] rounded-lg hover:bg-[#ffc03d] focus:outline-none"
            >
              {initialData ? 'Guardar cambios' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SongForm;

// DONE