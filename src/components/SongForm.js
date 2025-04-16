import React, { useState } from 'react';
import { extractYoutubeVideoId } from '../utils/youtube';
import LyricsDisplay from './LyricsDisplay';

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

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e) => {
    const { name } = e.target;
    if (name === 'lyrics') {
      const value = e.target.innerHTML;
      // Formatear el texto mientras se escribe
      const formattedText = formatPastedLyrics(value);
      setFormData(prev => ({ ...prev, lyrics: formattedText }));
    } else {
      const value = e.target.value;
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const cleanText = (text) => {
    // Eliminar todos los estilos HTML y mantener solo el texto plano
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = text;
    return tempDiv.textContent || tempDiv.innerText || '';
  };

  const formatPastedLyrics = (text) => {
    // Primero limpiar cualquier formato HTML
    const cleanedText = cleanText(text);

    // Lista de acordes comunes
    const commonChords = [
      'A', 'Am', 'A7', 'Am7', 'Amaj7', 'A/C#', 'A/E', 'A/G#',
      'B', 'Bm', 'B7', 'Bm7', 'Bmaj7', 'B/D#', 'B/F#',
      'C', 'Cm', 'C7', 'Cm7', 'Cmaj7', 'C/E', 'C/G',
      'D', 'Dm', 'D7', 'Dm7', 'Dmaj7', 'D/F#', 'D/A',
      'E', 'Em', 'E7', 'Em7', 'Emaj7', 'E/G#', 'E/B',
      'F', 'Fm', 'F7', 'Fm7', 'Fmaj7', 'F/A', 'F/C',
      'G', 'Gm', 'G7', 'Gm7', 'Gmaj7', 'G/B', 'G/D',
      // Variaciones con sostenidos y bemoles
      'A#', 'A#m', 'A#7', 'A#m7', 'A#maj7',
      'Bb', 'Bbm', 'Bb7', 'Bbm7', 'Bbmaj7',
      'C#', 'C#m', 'C#7', 'C#m7', 'C#maj7',
      'Db', 'Dbm', 'Db7', 'Dbm7', 'Dbmaj7',
      'D#', 'D#m', 'D#7', 'D#m7', 'D#maj7',
      'Eb', 'Ebm', 'Eb7', 'Ebm7', 'Ebmaj7',
      'F#', 'F#m', 'F#7', 'F#m7', 'F#maj7',
      'Gb', 'Gbm', 'Gb7', 'Gbm7', 'Gbmaj7',
      'G#', 'G#m', 'G#7', 'G#m7', 'G#maj7',
      'Ab', 'Abm', 'Ab7', 'Abm7', 'Abmaj7'
    ];

    // Lista de secciones
    const sections = [
      'Intro', 'Verso', 'Pre-Coro', 'Coro', 'Puente', 'Instrumental', 'Final',
      'Outro', 'Interludio', 'Solo'
    ];

    // Dividir el texto en líneas
    const lines = cleanedText.split('\n');
    
    // Procesar cada línea
    const formattedLines = lines.map(line => {
      // Si la línea está vacía, devolverla tal cual
      if (!line.trim()) return line;

      // Verificar si es una línea de sección
      const sectionMatch = line.trim().match(/^\[(.*?)\]$/);
      if (sectionMatch) {
        const sectionContent = sectionMatch[1];
        if (sections.some(section => 
          sectionContent.toLowerCase().includes(section.toLowerCase())
        )) {
          return `<span class="section">[${sectionContent}]</span>`;
        }
      }

      // Buscar acordes en la línea
      const words = line.trim().split(/\s+/);
      const formattedWords = words.map((word, index) => {
        const trimmedWord = word.trim();
        // Verificar si la palabra está entre corchetes
        const chordMatch = trimmedWord.match(/^\[(.*?)\]$/);
        if (chordMatch) {
          const chordContent = chordMatch[1];
          // Verificar si el contenido es un acorde conocido
          if (commonChords.some(chord => 
            chordContent.toUpperCase() === chord.toUpperCase() ||
            (chordContent.includes('/') && 
             commonChords.some(c => chordContent.toUpperCase().startsWith(c.toUpperCase() + '/')))
          )) {
            return `<span class="chord">[${chordContent}]</span>`;
          }
        } else if (commonChords.some(chord => 
          trimmedWord.toUpperCase() === chord.toUpperCase() ||
          (trimmedWord.includes('/') && 
           commonChords.some(c => trimmedWord.toUpperCase().startsWith(c.toUpperCase() + '/')))
        ) && (index === 0 || words[index - 1] === '')) {
          // Si es un acorde sin corchetes, agregárselos
          return `<span class="chord">[${word}]</span>`;
        }
        return word;
      });
      
      return formattedWords.join(' ');
    });
    
    return formattedLines.join('\n');
  };

  const handlePaste = (e) => {
    if (e.target.getAttribute('name') === 'lyrics') {
      e.preventDefault();
      const pastedText = e.clipboardData.getData('text');
      const formattedText = formatPastedLyrics(pastedText);
      
      // Insertar el texto formateado en la posición del cursor
      const selection = window.getSelection();
      const range = selection.getRangeAt(0);
      range.deleteContents();
      
      // Crear un elemento temporal para insertar el HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = formattedText;
      
      // Insertar cada nodo del contenido formateado
      while (tempDiv.firstChild) {
        range.insertNode(tempDiv.firstChild);
      }
      
      // Mover el cursor al final del texto insertado
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
      
      // Actualizar el estado
      const editor = document.getElementById('lyrics');
      setFormData(prev => ({
        ...prev,
        lyrics: editor.innerHTML
      }));
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
    const editor = document.getElementById('lyrics');
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    
    // Crear el tag de sección
    const sectionTag = `<span class="section">[${sectionType}]</span>\n`;
    
    // Crear un elemento temporal para insertar el HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = sectionTag;
    
    // Insertar el nodo de sección
    range.insertNode(tempDiv.firstChild);
    
    // Mover el cursor después del tag insertado
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);
    
    // Actualizar el estado
    setFormData(prev => ({
      ...prev,
      lyrics: editor.innerHTML
    }));
    
    // Mantener el foco en el editor
    editor.focus();
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
              <div
                id="lyrics"
                name="lyrics"
                contentEditable
                onInput={handleChange}
                onPaste={handlePaste}
                className="w-full min-h-[150px] px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#FBAE00] lyrics-text"
                dangerouslySetInnerHTML={{ __html: formData.lyrics || '' }}
              />
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