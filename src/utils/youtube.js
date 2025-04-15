// Función para extraer el ID del video de una URL de YouTube
export const extractYoutubeVideoId = (url) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url?.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

// Función para convertir la duración de YouTube (ISO 8601) a formato legible
export const formatDuration = (duration) => {
  if (!duration) return '-';
  
  // Convertir duración ISO 8601 a minutos y segundos
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  
  if (!match) return '-';
  
  const hours = (match[1] || '').replace('H', '');
  const minutes = (match[2] || '').replace('M', '');
  const seconds = (match[3] || '').replace('S', '');

  let result = '';
  
  if (hours) {
    result += `${hours}:`;
    result += `${minutes.padStart(2, '0')}:`;
  } else if (minutes) {
    result += `${minutes}:`;
  } else {
    result += '0:';
  }
  
  result += seconds.padStart(2, '0');
  
  return result;
};

// Función para obtener la duración del video
export const getVideoDuration = async (videoId) => {
  if (!videoId) return '-';
  
  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=contentDetails&key=${process.env.REACT_APP_YOUTUBE_API_KEY}`
    );
    const data = await response.json();
    
    if (data.items && data.items.length > 0) {
      return formatDuration(data.items[0].contentDetails.duration);
    }
    return '-';
  } catch (error) {
    console.error('Error fetching video duration:', error);
    return '-';
  }
}; 