import React, { useState, useEffect } from 'react';
import { mockSongs, mockSetlists } from './mock/data';
import Header from './components/Header';
import Tabs from './components/Tabs';
import SongCard from './components/SongCard';
import SongForm from './components/SongForm';
import SetlistForm from './components/SetlistForm';
import PlayerModal from './components/PlayerModal';
import './styles/globals.css';

const App = () => {
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode !== null) {
      return savedMode === 'true';
    }
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  // ... (resto del código de App.js)

  return (
    <div className="container">
      <Header 
        darkMode={darkMode} 
        onToggleDarkMode={() => setDarkMode(!darkMode)} 
      />
      
      <main className="p-4">
        {/* ... (resto del JSX) */}
      </main>
      
      {currentSong && (
        <PlayerModal 
          song={currentSong}
          onClose={() => setCurrentSong(null)}
          darkMode={darkMode}
        />
      )}
    </div>
  );
};

export default App;

// DONE