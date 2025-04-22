import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import ConfirmationModal from './ConfirmationModal';
import { extractYoutubeVideoId, getVideoDuration } from '../utils/youtube';

const SongList = ({ 
  songs, 
  onSongSelect, 
  onEditSong, 
  onDeleteSong, 
  onDuplicateSong,
  setlists, 
  onAddToSetlist 
}) => {
  const [selectedSongs, setSelectedSongs] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [songToDelete, setSongToDelete] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const { isAdmin } = useAuth();

  // Efecto para cerrar el menú cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.song-menu')) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectSong = (e, songId) => {
    e.stopPropagation();
    setSelectedSongs(prev => {
      if (prev.includes(songId)) {
        return prev.filter(id => id !== songId);
      } else {
        return [...prev, songId];
      }
    });
  };

  const handleDeleteClick = (songId = null) => {
    setSongToDelete(songId);
    setIsDeleteModalOpen(true);
    setOpenMenuId(null);
  };

  const handleConfirmDelete = () => {
    if (songToDelete) {
      onDeleteSong(songToDelete);
    } else {
      selectedSongs.forEach(songId => onDeleteSong(songId));
      setSelectedSongs([]);
    }
    setIsDeleteModalOpen(false);
    setSongToDelete(null);
  };

  return (
    <div className="space-y-4">
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSongToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Confirmar eliminación"
        message={songToDelete 
          ? "¿Estás seguro de que quieres eliminar esta canción?"
          : `¿Estás seguro de que quieres eliminar ${selectedSongs.length} canción(es)?`
        }
      />

      {/* Barra de acciones */}
      {isAdmin && selectedSongs.length > 0 && (
        <div className="flex items-center justify-between bg-gray-900 p-4 rounded-lg">
          <div className="text-sm text-gray-400">
            {selectedSongs.length} {selectedSongs.length === 1 ? 'seleccionada' : 'seleccionadas'}
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => handleDeleteClick()}
              className="flex items-center space-x-2 px-3 py-1.5 text-sm text-red-400 hover:text-red-300 bg-gray-800 rounded-lg"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="currentColor" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
              </svg>
              <span>Eliminar</span>
            </button>
            {setlists && setlists.length > 0 && (
              <div className="relative group">
                <button
                  className="flex items-center space-x-2 px-3 py-1.5 text-sm text-[#FBAE00] hover:text-[#ffc03d] bg-gray-800 rounded-lg"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                  </svg>
                  <span>Agregar al setlist</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 py-2 bg-gray-800 rounded-lg shadow-xl invisible group-hover:visible">
                  {setlists.map(setlist => (
                    <button
                      key={setlist.id}
                      onClick={() => {
                        onAddToSetlist(setlist.id, selectedSongs);
                        setSelectedSongs([]);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-400 hover:text-white hover:bg-gray-700"
                    >
                      {setlist.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Vista de escritorio */}
      <div className="hidden md:block w-full">
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs text-gray-400 border-b border-gray-800">
              {isAdmin && (
                <th className="py-3 px-4 font-medium w-8">
                  <span className="sr-only">Seleccionar</span>
                </th>
              )}
              <th className="py-3 px-4 font-medium">Título</th>
              <th className="py-3 px-4 font-medium">Artista</th>
              <th className="py-3 px-4 font-medium">Género</th>
              <th className="py-3 px-4 font-medium">BPM</th>
              <th className="py-3 px-4 font-medium">Tono</th>
              {(onEditSong || onDeleteSong || onDuplicateSong) && (
                <th className="py-3 px-4 font-medium w-10">
                  <span className="sr-only">Acciones</span>
                </th>
              )}
            </tr>
          </thead>
          <tbody className="text-sm">
            {songs.map(song => (
              <tr
                key={song.id}
                className="border-b border-gray-800 hover:bg-gray-900 cursor-pointer group"
                onClick={() => onSongSelect(song)}
              >
                {isAdmin && (
                  <td className="py-4 px-4" onClick={e => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selectedSongs.includes(song.id)}
                      onChange={(e) => handleSelectSong(e, song.id)}
                      className={`w-4 h-4 text-[#FBAE00] bg-gray-700 border-gray-600 rounded focus:ring-[#FBAE00] focus:ring-2 
                        ${selectedSongs.length > 0 ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} 
                        transition-opacity duration-200`}
                    />
                  </td>
                )}
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-800 rounded flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-gray-400 group-hover:text-[#FBAE00]" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                      </svg>
                    </div>
                    <span className="truncate group-hover:text-[#FBAE00]">{song.title}</span>
                  </div>
                </td>
                <td className="py-4 px-4 text-gray-400">{song.artist || '-'}</td>
                <td className="py-4 px-4 text-gray-400">{song.genre || '-'}</td>
                <td className="py-4 px-4">{song.bpm || '-'}</td>
                <td className="py-4 px-4">{song.key || '-'}</td>
                {(onEditSong || onDeleteSong || onDuplicateSong) && (
                  <td className="py-4 px-4 relative" onClick={e => e.stopPropagation()}>
                    <div className="song-menu">
                      <button
                        onClick={() => setOpenMenuId(openMenuId === song.id ? null : song.id)}
                        className="p-1.5 text-gray-400 hover:text-[#FBAE00] rounded-full hover:bg-gray-800"
                      >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                          <path fill="currentColor" d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                        </svg>
                      </button>
                      {openMenuId === song.id && (
                        <div className="absolute right-0 mt-1 w-48 bg-gray-900 border border-gray-800 rounded-lg shadow-lg z-50 py-1">
                          {onEditSong && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onEditSong(song);
                                setOpenMenuId(null);
                              }}
                              className="w-full px-4 py-2 text-sm text-left text-white hover:bg-gray-800 flex items-center space-x-2"
                            >
                              <svg className="w-4 h-4" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                              </svg>
                              <span>Editar</span>
                            </button>
                          )}
                          {onDeleteSong && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteClick(song.id);
                              }}
                              className="w-full px-4 py-2 text-sm text-left text-red-400 hover:bg-gray-800 flex items-center space-x-2"
                            >
                              <svg className="w-4 h-4" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                              </svg>
                              <span>Eliminar</span>
                            </button>
                          )}
                          {onDuplicateSong && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onDuplicateSong(song);
                                setOpenMenuId(null);
                              }}
                              className="w-full px-4 py-2 text-sm text-left text-white hover:bg-gray-800 flex items-center space-x-2"
                            >
                              <svg className="w-4 h-4" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                              </svg>
                              <span>Duplicar</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Vista móvil */}
      <div className="md:hidden space-y-2">
        {songs.map(song => (
          <div
            key={song.id}
            className="bg-[#1a1f2e] rounded-lg overflow-hidden hover:bg-[#242937] transition-colors duration-200"
            onClick={() => onSongSelect(song)}
          >
            <div className="p-3">
              <div className="flex items-center space-x-3">
                {isAdmin && (
                  <input
                    type="checkbox"
                    checked={selectedSongs.includes(song.id)}
                    onChange={(e) => handleSelectSong(e, song.id)}
                    className="w-4 h-4 text-[#FBAE00] bg-gray-700 border-gray-600 rounded focus:ring-[#FBAE00] focus:ring-2"
                    onClick={e => e.stopPropagation()}
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-[#FBAE00]" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-medium truncate">{song.title}</h3>
                      <p className="text-sm text-gray-400 truncate">{song.artist || 'Sin artista'}</p>
                    </div>
                    {(onEditSong || onDeleteSong || onDuplicateSong) && (
                      <div className="song-menu" onClick={e => e.stopPropagation()}>
                        <button
                          onClick={() => setOpenMenuId(openMenuId === song.id ? null : song.id)}
                          className="p-2 text-gray-400 hover:text-[#FBAE00] rounded-full hover:bg-gray-800"
                        >
                          <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                          </svg>
                        </button>
                        {openMenuId === song.id && (
                          <div className="absolute right-0 mt-1 w-48 bg-gray-900 border border-gray-800 rounded-lg shadow-lg z-50 py-1">
                            {onEditSong && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onEditSong(song);
                                  setOpenMenuId(null);
                                }}
                                className="w-full px-4 py-2 text-sm text-left text-white hover:bg-gray-800 flex items-center space-x-2"
                              >
                                <svg className="w-4 h-4" viewBox="0 0 24 24">
                                  <path fill="currentColor" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                                </svg>
                                <span>Editar</span>
                              </button>
                            )}
                            {onDeleteSong && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteClick(song.id);
                                }}
                                className="w-full px-4 py-2 text-sm text-left text-red-400 hover:bg-gray-800 flex items-center space-x-2"
                              >
                                <svg className="w-4 h-4" viewBox="0 0 24 24">
                                  <path fill="currentColor" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                                </svg>
                                <span>Eliminar</span>
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2 text-sm text-gray-400">
                    {song.genre && (
                      <div className="flex items-center space-x-1 bg-gray-800 px-2 py-1 rounded">
                        <span>{song.genre}</span>
                      </div>
                    )}
                    {song.bpm && (
                      <div className="flex items-center space-x-1 bg-gray-800 px-2 py-1 rounded">
                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                          <path fill="currentColor" d="M12 20c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8m0-18A10 10 0 0 0 2 12a10 10 0 0 0 10 10 10 10 0 0 0 10-10A10 10 0 0 0 12 2m4.5 14H7.5v-1.5h9v1.5m-6.9-5l3.9-3.9 3.9 3.9-1.1 1.1-2.8-2.8-2.8 2.8-1.1-1.1z"/>
                        </svg>
                        <span>{song.bpm} BPM</span>
                      </div>
                    )}
                    {song.key && (
                      <div className="flex items-center space-x-1 bg-gray-800 px-2 py-1 rounded">
                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                          <path fill="currentColor" d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                        </svg>
                        <span>{song.key}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SongList; 