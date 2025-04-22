import React, { useState, useEffect } from 'react';
import SongList from './components/SongList';
import PlayerModal from './components/PlayerModal';
import SearchBar from './components/SearchBar';
import SongForm from './components/SongForm';
import SetlistForm from './components/SetlistForm';
import LoginModal from './components/LoginModal';
import SortFilter from './components/SortFilter';
import BibleVerse from './components/BibleVerse';
import SongDetails from './components/SongDetails';
import { auth, songs as songsApi, setlists as setlistsApi } from './supabase';

function App() {
  const [songs, setSongs] = useState([]);
  const [setlists, setSetlists] = useState([]);
  const [selectedSong, setSelectedSong] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [showSongForm, setShowSongForm] = useState(false);
  const [showSetlistForm, setShowSetlistForm] = useState(false);
  const [editingSong, setEditingSong] = useState(null);
  const [editingSetlist, setEditingSetlist] = useState(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedSetlist, setSelectedSetlist] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar sesión al cargar
  useEffect(() => {
    checkUser();
    loadData();
  }, []);

  // Efecto para cerrar el sidebar al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Si el menú está abierto y el clic no fue dentro del sidebar ni en el botón de menú
      if (showMobileMenu && 
          !event.target.closest('.sidebar') && 
          !event.target.closest('.mobile-menu-button')) {
        setShowMobileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMobileMenu]);

  const checkUser = async () => {
    try {
      const { session } = await auth.getSession();
      setUser(session?.user || null);
    } catch (error) {
      console.error('Error al verificar sesión:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadData = async () => {
    try {
      const [songsResponse, setlistsResponse] = await Promise.all([
        songsApi.getAll(),
        setlistsApi.getAll()
      ]);

      if (songsResponse.error) throw songsResponse.error;
      if (setlistsResponse.error) throw setlistsResponse.error;

      setSongs(songsResponse.data || []);
      setSetlists(setlistsResponse.data || []);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    }
  };

  const handleLogin = async (data) => {
    if (data?.data?.user) {
      setUser(data.data.user);
      setShowLoginModal(false);
      await loadData();
    } else {
      console.error('Error: Datos de usuario no válidos', data);
      alert('Error al iniciar sesión');
    }
  };

  const handleLogout = async () => {
    const { error } = await auth.signOut();
    if (!error) {
      setUser(null);
      await loadData();
    }
  };

  const handleSaveSong = async (songData) => {
    try {
      // Asegurarse de que los campos requeridos estén presentes
      if (!songData.title) {
        throw new Error('El título es requerido');
      }

      // Formatear los datos antes de enviarlos
      const formattedSong = {
        title: songData.title,
        artist: songData.artist || '',
        bpm: songData.bpm ? parseInt(songData.bpm) : null,
        key: songData.key || '',
        genre: songData.genre || '',
        youtubeUrl: songData.youtubeUrl || '',
        lyrics: songData.lyrics || ''
      };

      let response;
      if (editingSong) {
        response = await songsApi.update(editingSong.id, formattedSong);
      } else {
        response = await songsApi.create(formattedSong);
      }

      if (response.error) {
        console.error('Error de Supabase:', response.error);
        throw response.error;
      }

      await loadData();
      setShowSongForm(false);
      setEditingSong(null);
    } catch (error) {
      console.error('Error al guardar canción:', error);
      alert(error.message);
    }
  };

  const handleDeleteSong = async (id) => {
    try {
      const { error } = await songsApi.delete(id);
      if (error) throw error;
      await loadData();
    } catch (error) {
      console.error('Error al eliminar canción:', error);
    }
  };

  const handleDuplicateSong = async (songData) => {
    try {
      // Formatear los datos antes de enviarlos
      const formattedSong = {
        title: songData.title,
        artist: songData.artist || '',
        bpm: songData.bpm ? parseInt(songData.bpm) : null,
        key: songData.key || '',
        genre: songData.genre || '',
        youtubeUrl: songData.youtubeUrl || '',
        lyrics: songData.lyrics || ''
      };

      const { data, error } = await songsApi.create(formattedSong);
      if (error) throw error;
      await loadData();
      setSelectedSong(null); // Cerrar el modal después de duplicar
    } catch (error) {
      console.error('Error al duplicar canción:', error);
      alert('Error al duplicar la canción');
    }
  };

  const handleSaveSetlist = async (setlistData) => {
    try {
      let response;
      if (editingSetlist) {
        response = await setlistsApi.update(editingSetlist.id, setlistData);
      } else {
        response = await setlistsApi.create(setlistData);
      }

      if (response.error) throw response.error;

      if (setlistData.songs?.length > 0) {
        const { error } = await setlistsApi.addSongs(response.data[0].id, setlistData.songs);
        if (error) throw error;
      }

      await loadData();
      setShowSetlistForm(false);
      setEditingSetlist(null);
    } catch (error) {
      console.error('Error al guardar setlist:', error);
    }
  };

  const handleDeleteSetlist = async (id) => {
    try {
      const { error } = await setlistsApi.delete(id);
      if (error) throw error;
      await loadData();
      setSelectedSetlist(null);
    } catch (error) {
      console.error('Error al eliminar setlist:', error);
    }
  };

  const handleAddToSetlist = async (setlistId, songId) => {
    try {
      const { error } = await setlistsApi.addSongs(setlistId, [songId]);
      if (error) throw error;
      await loadData();
    } catch (error) {
      console.error('Error al añadir canción al setlist:', error);
    }
  };

  const filteredSongs = selectedSetlist 
    ? songs.filter(song => selectedSetlist.songs?.includes(song.id))
    : songs.filter(song => {
        const searchTermLower = searchTerm.toLowerCase().trim();
        if (!searchTermLower) return true;
        
        const matchesSearch = 
          song.title?.toLowerCase().includes(searchTermLower) ||
          song.artist?.toLowerCase().includes(searchTermLower) ||
          song.genre?.toLowerCase().includes(searchTermLower) ||
          song.key?.toLowerCase().includes(searchTermLower);
        
        return matchesSearch;
      }).sort((a, b) => {
        if (!sortBy) return 0;
        const aValue = a[sortBy] || '';
        const bValue = b[sortBy] || '';
        if (sortBy === 'bpm') {
          return (Number(aValue) || 0) - (Number(bValue) || 0);
        }
        return aValue.toString().localeCompare(bValue.toString());
      });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0f1420]">
        <div className="text-[#FBAE00] text-xl">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f1420] text-white">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-black transform ${showMobileMenu ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-200 ease-in-out`}>
        <div className="flex flex-col h-full border-r border-gray-800">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-3">
              <img src="/favicon.png" alt="GI Logo" className="w-8 h-8" />
              <span className="text-xl font-semibold text-[#FBAE00]">GI Setlist</span>
            </div>
            <button
              onClick={() => setShowMobileMenu(false)}
              className="md:hidden text-gray-400 hover:text-white"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="px-4 py-2">
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">CANCIONES</h2>
              {user && (
                <button
                  onClick={() => {
                    setEditingSong(null);
                    setShowSongForm(true);
                  }}
                  className="flex items-center space-x-2 text-[#FBAE00] hover:text-[#ffc03d] w-full px-4 py-2 mt-2 rounded-lg hover:bg-gray-800"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                  </svg>
                  <span>Nueva canción</span>
                </button>
              )}
            </div>

            <div className="px-4 py-2 mt-4">
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">SETLISTS</h2>
              {user && (
                <button
                  onClick={() => {
                    setEditingSetlist(null);
                    setShowSetlistForm(true);
                  }}
                  className="flex items-center space-x-2 text-[#FBAE00] hover:text-[#ffc03d] w-full px-4 py-2 mt-2 rounded-lg hover:bg-gray-800"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                  </svg>
                  <span>Nuevo setlist</span>
                </button>
              )}

              <div className="mt-2 space-y-1">
                {setlists.map((setlist) => (
                  <div key={setlist.id} className="relative setlist-menu-container">
                    <button
                      onClick={() => setSelectedSetlist(selectedSetlist?.id === setlist.id ? null : setlist)}
                      className={`flex items-center justify-between w-full px-4 py-2 text-sm rounded-lg ${
                        selectedSetlist?.id === setlist.id
                          ? 'bg-gray-800 text-[#FBAE00]'
                          : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      }`}
                    >
                      <span className="truncate">{setlist.name}</span>
                      {user && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId(openMenuId === setlist.id ? null : setlist.id);
                          }}
                          className="p-1 hover:text-[#FBAE00]"
                        >
                          <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                          </svg>
                        </button>
                      )}
                    </button>

                    {openMenuId === setlist.id && user && (
                      <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 z-50">
                        <div className="py-1">
                          <button
                            onClick={() => {
                              setEditingSetlist(setlist);
                              setShowSetlistForm(true);
                              setOpenMenuId(null);
                            }}
                            className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                          >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                              <path fill="currentColor" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                            </svg>
                            <span>Editar</span>
                          </button>
                          <button
                            onClick={() => {
                              handleDeleteSetlist(setlist.id);
                              setOpenMenuId(null);
                            }}
                            className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-400 hover:bg-gray-700 hover:text-red-300"
                          >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                              <path fill="currentColor" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                            </svg>
                            <span>Eliminar</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-gray-800">
            {!user ? (
              <button
                onClick={() => setShowLoginModal(true)}
                className="flex items-center space-x-2 text-[#FBAE00] hover:text-[#ffc03d] w-full px-4 py-2 rounded-lg hover:bg-gray-800"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
                <span>Acceso admin</span>
              </button>
            ) : (
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-red-400 hover:text-red-300 w-full px-4 py-2 rounded-lg hover:bg-gray-800"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
                </svg>
                <span>Cerrar sesión</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 md:ml-64">
        {/* Header móvil */}
        <div className="sticky top-0 z-30 md:hidden bg-black border-b border-gray-800 px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowMobileMenu(true)}
              className="mobile-menu-button p-2 -ml-2 text-gray-400 hover:text-white"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path fill="currentColor" d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
              </svg>
            </button>
            <img src="/favicon.png" alt="GI Logo" className="w-8 h-8" />
            {user ? (
              <button
                onClick={handleLogout}
                className="p-2 -mr-2 text-gray-400 hover:text-white"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
                </svg>
              </button>
            ) : (
              <button
                onClick={() => setShowLoginModal(true)}
                className="p-2 -mr-2 text-gray-400 hover:text-white"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Contenido */}
        <div className="p-4">
          <BibleVerse />
          
          <div className="mt-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4">
              <SearchBar value={searchTerm} onChange={setSearchTerm} />
              <SortFilter value={sortBy} onChange={setSortBy} />
            </div>

            <SongList
              songs={filteredSongs}
              onSongSelect={setSelectedSong}
              onEditSong={user ? (song) => {
                setEditingSong(song);
                setShowSongForm(true);
              } : null}
              onDeleteSong={user ? handleDeleteSong : null}
              setlists={setlists}
              onAddToSetlist={handleAddToSetlist}
              isAdmin={!!user}
            />
          </div>
        </div>
      </div>

      {/* Modales */}
      {showSongForm && (
        <SongForm
          initialData={editingSong}
          onSubmit={handleSaveSong}
          onCancel={() => {
            setShowSongForm(false);
            setEditingSong(null);
          }}
        />
      )}

      {showSetlistForm && (
        <SetlistForm
          initialData={editingSetlist}
          onSubmit={handleSaveSetlist}
          onCancel={() => {
            setShowSetlistForm(false);
            setEditingSetlist(null);
          }}
          songs={songs}
        />
      )}

      {showLoginModal && (
        <LoginModal 
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onLogin={handleLogin}
        />
      )}

      {selectedSong && (
        <SongDetails
          song={selectedSong}
          onClose={() => setSelectedSong(null)}
          onDuplicateSong={user ? handleDuplicateSong : null}
          isAdmin={!!user}
        />
      )}
    </div>
  );
}

export default App;

// DONE