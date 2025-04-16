import { createClient } from '@supabase/supabase-js'
import { supabase } from './supabaseClient'
import { extractYoutubeVideoId, getVideoDuration } from './utils/youtube'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY

console.log('Supabase URL:', supabaseUrl)
console.log('Supabase Key exists:', !!supabaseAnonKey)

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Error: Faltan las variables de entorno de Supabase')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Funciones auxiliares para interactuar con Supabase
export const auth = {
  signIn: async (email, password) => {
    try {
      console.log('Intentando iniciar sesión con:', { email });
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('Error al iniciar sesión:', error);
      } else {
        console.log('Inicio de sesión exitoso:', data);
      }
      
      return { data, error };
    } catch (err) {
      console.error('Error inesperado al iniciar sesión:', err);
      return { data: null, error: err };
    }
  },

  signUp: async (email, password) => {
    // Solo permitir registro con el email del administrador
    const adminEmail = process.env.REACT_APP_ADMIN_EMAIL;
    if (email !== adminEmail) {
      return { 
        data: null, 
        error: { message: 'El registro está deshabilitado. Solo el administrador puede crear una cuenta.' }
      };
    }
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    return { data, error }
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  getSession: async () => {
    const { data: { session }, error } = await supabase.auth.getSession()
    return { session, error }
  }
}

export const songs = {
  getAll: async () => {
    try {
      const { data, error } = await supabase
        .from('songs')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('Error al obtener canciones:', error)
      }
      return { data, error }
    } catch (err) {
      console.error('Error inesperado al obtener canciones:', err)
      return { data: null, error: err }
    }
  },

  create: async (song) => {
    try {
      console.log('Intentando crear canción:', song)
      
      // Si hay una URL de YouTube, obtener la duración
      let duration = null;
      if (song.youtubeUrl) {
        console.log('Obteniendo duración para:', song.youtubeUrl);
        const videoId = extractYoutubeVideoId(song.youtubeUrl);
        if (videoId) {
          console.log('ID del video:', videoId);
          duration = await getVideoDuration(videoId);
          console.log('Duración obtenida:', duration);
          song.duration = duration;
        }
      }

      const { data, error } = await supabase
        .from('songs')
        .insert([song])
        .select()
      
      if (error) {
        console.error('Error al crear canción:', error)
      } else {
        console.log('Canción creada exitosamente:', data)
      }
      return { data, error }
    } catch (err) {
      console.error('Error inesperado al crear canción:', err)
      return { data: null, error: err }
    }
  },

  update: async (id, updates) => {
    const { data, error } = await supabase
      .from('songs')
      .update(updates)
      .eq('id', id)
      .select()
    return { data, error }
  },

  delete: async (id) => {
    const { error } = await supabase
      .from('songs')
      .delete()
      .eq('id', id)
    return { error }
  }
}

export const setlists = {
  getAll: async () => {
    try {
      console.log('Obteniendo todos los setlists...');
      // Primero obtenemos los setlists
      const { data: setlistsData, error: setlistsError } = await supabase
        .from('setlists')
        .select('*')
        .order('date', { ascending: false });
      
      if (setlistsError) {
        console.error('Error al obtener setlists:', setlistsError);
        return { data: null, error: setlistsError };
      }

      // Para cada setlist, obtenemos sus canciones
      const setlistsWithSongs = await Promise.all(
        setlistsData.map(async (setlist) => {
          const { data: songsData } = await supabase
            .from('setlist_songs')
            .select('songs (*)')
            .eq('setlist_id', setlist.id);

          return {
            ...setlist,
            songs: songsData?.map(item => item.songs.id) || []
          };
        })
      );

      console.log('Setlists con canciones:', setlistsWithSongs);
      return { data: setlistsWithSongs, error: null };
    } catch (err) {
      console.error('Error inesperado al obtener setlists:', err);
      return { data: null, error: err };
    }
  },

  create: async (setlist) => {
    try {
      console.log('Datos recibidos para crear setlist:', setlist);
      
      // Preparar los datos para inserción
      const setlistData = {
        name: setlist.name,
        date: setlist.date,
        description: setlist.description || null
      };
      
      console.log('Datos preparados para inserción:', setlistData);
      
      const { data, error } = await supabase
        .from('setlists')
        .insert([setlistData])
        .select();
      
      if (error) {
        console.error('Error al crear setlist:', error);
        return { data: null, error };
      }
      
      console.log('Setlist creado exitosamente:', data);
      
      // Si hay canciones seleccionadas, agregarlas al setlist
      if (setlist.songs && setlist.songs.length > 0 && data && data[0]) {
        console.log('Agregando canciones al setlist:', setlist.songs);
        const { error: songsError } = await setlists.addSongs(data[0].id, setlist.songs);
        if (songsError) {
          console.error('Error al agregar canciones al setlist:', songsError);
          return { data, error: songsError };
        }
      }
      
      return { data, error: null };
    } catch (err) {
      console.error('Error inesperado al crear setlist:', err);
      return { data: null, error: err };
    }
  },

  update: async (id, updates) => {
    try {
      console.log('Actualizando setlist:', id, updates);
      const { data, error } = await supabase
        .from('setlists')
        .update(updates)
        .eq('id', id)
        .select();
      
      if (error) {
        console.error('Error al actualizar setlist:', error);
      } else {
        console.log('Setlist actualizado exitosamente:', data);
      }
      return { data, error };
    } catch (err) {
      console.error('Error inesperado al actualizar setlist:', err);
      return { data: null, error: err };
    }
  },

  delete: async (id) => {
    try {
      console.log('Eliminando setlist:', id);
      const { error } = await supabase
        .from('setlists')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error al eliminar setlist:', error);
      } else {
        console.log('Setlist eliminado exitosamente');
      }
      return { error };
    } catch (err) {
      console.error('Error inesperado al eliminar setlist:', err);
      return { error: err };
    }
  },

  addSongs: async (setlistId, songIds) => {
    try {
      console.log('Agregando canciones al setlist:', { setlistId, songIds });
      
      // Primero eliminamos cualquier canción existente para este setlist
      const { error: deleteError } = await supabase
        .from('setlist_songs')
        .delete()
        .eq('setlist_id', setlistId);

      if (deleteError) {
        console.error('Error al limpiar canciones existentes:', deleteError);
        return { error: deleteError };
      }

      // Si no hay canciones para agregar, terminamos aquí
      if (!songIds || songIds.length === 0) {
        return { data: [], error: null };
      }

      // Creamos las nuevas entradas
      const entries = songIds.map((songId, index) => ({
        setlist_id: setlistId,
        song_id: songId,
        order_number: index + 1
      }));

      console.log('Insertando nuevas canciones:', entries);

      const { data, error } = await supabase
        .from('setlist_songs')
        .insert(entries)
        .select(`
          id,
          order_number,
          songs (
            id,
            title,
            artist,
            bpm,
            key,
            genre,
            youtubeUrl
          )
        `);

      if (error) {
        console.error('Error al agregar canciones:', error);
        return { data: null, error };
      }

      console.log('Canciones agregadas exitosamente:', data);
      return { data, error: null };
    } catch (err) {
      console.error('Error inesperado al agregar canciones:', err);
      return { data: null, error: err };
    }
  },

  getSongs: async (setlistId) => {
    try {
      console.log('Obteniendo canciones para el setlist:', setlistId);
      
      const { data, error } = await supabase
        .from('setlist_songs')
        .select(`
          id,
          order_number,
          song_id,
          songs (
            id,
            title,
            artist,
            bpm,
            key,
            genre,
            youtubeUrl
          )
        `)
        .eq('setlist_id', setlistId)
        .order('order_number');

      if (error) {
        console.error('Error al obtener canciones del setlist:', error);
        return { data: null, error };
      }

      console.log('Canciones obtenidas:', data);
      return { data, error: null };
    } catch (err) {
      console.error('Error inesperado al obtener canciones:', err);
      return { data: null, error: err };
    }
  }
} 