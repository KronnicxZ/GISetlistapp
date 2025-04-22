import React from 'react';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-70 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-gray-900 rounded-lg w-full max-w-md p-6 shadow-xl border border-gray-800">
        <h3 className="text-lg font-medium text-white mb-4">
          {title}
        </h3>
        
        <p className="text-gray-400 mb-6">
          {message}
        </p>
        
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-400 hover:text-white bg-gray-800 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm text-red-400 hover:text-red-300 bg-gray-800 rounded-lg transition-colors"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal; 