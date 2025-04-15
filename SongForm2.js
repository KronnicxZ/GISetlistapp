import React, { useState } from 'react';

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
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const fetchVideoData = async () => {
    if (!formData.youtubeUrl) return;
    
    try {
      setIsFetching(true);
      setFetchError(null);
      
      const videoId = formData.youtubeUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1];
      
      if (!videoId) {
        throw new Error('URL de YouTube no válida');
      }
      
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
      
      setFormData(prev => ({
        ...prev,
        title: songTitle,
        artist: artist
      }));
      
    } catch (error) {
      setFetchError(error.message);
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-lg w-full max-w-lg">
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h2 className="text-xl font-semibold">
            {initialData ? 'Editar Canción' : 'Nueva Canción'}
          </h2>
          <button 
            onClick={onCancel}
            className="text-gray-400 hover:text-white"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-4">
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

            <div className="grid grid-cols-2 gap-4">
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

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Letra con acordes
              </label>
              <textarea
                name="lyrics"
                value={formData.lyrics || ''}
                onChange={handleChange}
                rows="6"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#FBAE00]"
                placeholder="[Am] Letra de la canción..."
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
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