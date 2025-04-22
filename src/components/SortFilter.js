import React, { useState, useRef, useEffect } from 'react';

const SortFilter = ({ onSortChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('Recientes');
  const dropdownRef = useRef(null);

  const options = [
    { value: '', label: 'Recientes' },
    { value: 'title', label: 'Título' },
    { value: 'artist', label: 'Artista' },
    { value: 'genre', label: 'Género' },
    { value: 'bpm', label: 'BPM' },
    { value: 'key', label: 'Tono' },
    { value: 'duration', label: 'Duración' }
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    setSelectedOption(option.label);
    onSortChange(option.value);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-10 px-4 text-left text-white bg-gray-900 border border-gray-800 rounded-lg hover:bg-gray-800 focus:outline-none focus:border-[#FBAE00] flex items-center justify-between"
      >
        <span className="text-sm">Ordenar por: {selectedOption}</span>
        <svg 
          className={`w-4 h-4 transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-gray-900 border border-gray-800 rounded-lg shadow-lg">
          <div className="py-1">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSelect(option)}
                className={`w-full px-4 py-2 text-sm text-left hover:bg-gray-800 ${
                  selectedOption === option.label ? 'text-[#FBAE00]' : 'text-white'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SortFilter; 