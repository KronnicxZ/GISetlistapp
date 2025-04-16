// Función para extraer el ID del video de una URL de YouTube
export const extractYoutubeVideoId = (url) => {
  if (!url) {
    console.log('URL no proporcionada');
    return null;
  }
  
  console.log('Procesando URL de YouTube:', url);
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url?.match(regExp);
  
  if (match && match[2].length === 11) {
    console.log('ID de video encontrado:', match[2]);
    return match[2];
  }
  
  console.log('No se pudo extraer el ID del video');
  return null;
};

// Función para convertir la duración de YouTube (ISO 8601) a formato legible
export const formatDuration = (duration) => {
  if (!duration) {
    console.log('Duración no proporcionada');
    return '-';
  }
  
  console.log('Formateando duración:', duration);
  
  // Convertir duración ISO 8601 a minutos y segundos
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  
  if (!match) {
    console.log('Formato de duración no válido');
    return '-';
  }
  
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
  
  console.log('Duración formateada:', result);
  return result;
};

// Función para obtener la duración del video
export const getVideoDuration = async (videoId) => {
  if (!videoId) {
    console.log('ID de video no proporcionado');
    return '-';
  }
  
  console.log('Obteniendo duración para el video:', videoId);
  
  if (!process.env.REACT_APP_YOUTUBE_API_KEY) {
    console.error('API key de YouTube no configurada');
    return '-';
  }
  
  try {
    const url = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=contentDetails&key=${process.env.REACT_APP_YOUTUBE_API_KEY}`;
    console.log('Realizando petición a YouTube API');
    
    const response = await fetch(url);
    const data = await response.json();
    
    console.log('Respuesta de YouTube:', data);
    
    if (data.error) {
      console.error('Error de la API de YouTube:', data.error);
      return '-';
    }
    
    if (data.items && data.items.length > 0) {
      const duration = data.items[0].contentDetails.duration;
      console.log('Duración obtenida:', duration);
      return formatDuration(duration);
    }
    
    console.log('No se encontró información del video');
    return '-';
  } catch (error) {
    console.error('Error al obtener la duración del video:', error);
    return '-';
  }
}; 