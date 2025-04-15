import { createClient } from '@supabase/supabase-js'

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
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  },

  signUp: async (email, password) => {
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
    const { data, error } = await supabase
      .from('setlists')
      .select('*')
      .order('date', { ascending: false })
    return { data, error }
  },

  create: async (setlist) => {
    const { data, error } = await supabase
      .from('setlists')
      .insert([setlist])
      .select()
    return { data, error }
  },

  update: async (id, updates) => {
    const { data, error } = await supabase
      .from('setlists')
      .update(updates)
      .eq('id', id)
      .select()
    return { data, error }
  },

  delete: async (id) => {
    const { error } = await supabase
      .from('setlists')
      .delete()
      .eq('id', id)
    return { error }
  },

  addSongs: async (setlistId, songIds) => {
    const entries = songIds.map((songId, index) => ({
      setlist_id: setlistId,
      song_id: songId,
      order_number: index + 1
    }))

    const { data, error } = await supabase
      .from('setlist_songs')
      .insert(entries)
      .select()
    return { data, error }
  },

  getSongs: async (setlistId) => {
    const { data, error } = await supabase
      .from('setlist_songs')
      .select(`
        order_number,
        songs (*)
      `)
      .eq('setlist_id', setlistId)
      .order('order_number')
    return { data, error }
  }
} 