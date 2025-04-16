import React from 'react';

const LyricsDisplay = ({ content, onChange, placeholder, className }) => {
  return (
    <div
      contentEditable
      onInput={(e) => onChange({ target: { name: 'lyrics', value: e.currentTarget.innerHTML } })}
      dangerouslySetInnerHTML={{ __html: content }}
      placeholder={placeholder}
      className={`${className} lyrics-text`}
    />
  );
};

export default LyricsDisplay; 