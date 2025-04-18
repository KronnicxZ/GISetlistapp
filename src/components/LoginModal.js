import React, { useState } from 'react';
import { auth } from '../supabase';

const ADMIN_EMAIL = 'kronnicxz@gmail.com';

const LoginModal = ({ isOpen, onClose, onLogin }) => {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: signInError } = await auth.signIn(ADMIN_EMAIL, password);

      if (signInError) {
        console.error('Error de inicio de sesión:', signInError);
        throw signInError;
      }

      if (data) {
        console.log('Inicio de sesión exitoso:', data);
        onLogin();
        onClose();
      }
    } catch (err) {
      console.error('Error completo:', err);
      setError('Contraseña inválida');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-[#1a1f2e] rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">Acceso Administrador</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 bg-[#0f1420] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#FBAE00]"
              required
              placeholder="Ingresa la contraseña de administrador"
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 px-4 rounded-lg bg-[#FBAE00] text-white font-medium hover:bg-[#fbb827] focus:outline-none focus:ring-2 focus:ring-[#FBAE00] focus:ring-opacity-50 transition-colors
              ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginModal; 