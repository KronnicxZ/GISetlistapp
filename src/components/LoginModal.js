import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

const ADMIN_EMAIL = 'admin@gisetlist.com';

export default function LoginModal({ isOpen, onClose }) {
  const [email, setEmail] = useState(ADMIN_EMAIL);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (email !== ADMIN_EMAIL) {
        throw new Error('Solo el administrador puede iniciar sesión');
      }

      const { data, error } = isRegistering
        ? await supabase.auth.signUp({
            email,
            password,
          })
        : await supabase.auth.signInWithPassword({
            email,
            password,
          });

      if (error) throw error;

      if (data) {
        onClose();
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-[#1a1f2e] rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-[#FBAE00]">
          {isRegistering ? 'Registro' : 'Iniciar Sesión'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full p-2 rounded bg-[#0f1420] text-white border border-gray-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 rounded bg-[#0f1420] text-white border border-gray-700"
              required
            />
          </div>
          {error && (
            <p className="text-red-500 text-sm mt-2">{error}</p>
          )}
          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-[#FBAE00] text-black rounded hover:bg-[#ffc03d] disabled:opacity-50"
            >
              {loading
                ? 'Cargando...'
                : isRegistering
                ? 'Registrarse'
                : 'Iniciar Sesión'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 