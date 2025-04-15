import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY

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
    const { data, error } = await supabase
      .from('songs')
      .select('*')
      .order('created_at', { ascending: false })
    return { data, error }
  },

  create: async (song) => {
    const { data, error } = await supabase
      .from('songs')
      .insert([song])
      .select()
    return { data, error }
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