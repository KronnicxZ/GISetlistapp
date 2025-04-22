import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wznufcdcewgypvbveaig.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6bnVmY2RjZXdneXB2YnZlYWlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ3NDM0MDIsImV4cCI6MjA2MDMxOTQwMn0.4u3RjQY84HhlOZ7K3XxjN9oenSNHEk5eSevdLxqeLz4'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function setupAdmin() {
  const { data, error } = await supabase.auth.signUp({
    email: 'kronnicxz@gmail.com',
    password: 'H8e5n14r19y251.',
  })

  if (error) {
    console.error('Error al crear usuario admin:', error)
  } else {
    console.log('Usuario admin creado exitosamente:', data)
  }
}

setupAdmin() 