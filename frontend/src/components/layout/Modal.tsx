import React, { useEffect } from 'react';
import type { ReactNode } from 'react';

interface ModalProps {
  onClose: () => void;
  children: ReactNode;
}

export default function Modal({ onClose, children }: ModalProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/40 backdrop-blur-sm transition-colors duration-300" onClick={onClose}>
      <div
        className="bg-white rounded-xl shadow-2xl p-6 relative min-w-[320px] max-w-full animate-modal-in"
        onClick={e => e.stopPropagation()}
        tabIndex={-1}
      >
        <button
          className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-400 text-gray-400 hover:text-purple-600 text-2xl font-bold transition-all duration-200"
          onClick={onClose}
          aria-label="Fechar"
        >
          ×
        </button>
        {children}
      </div>
      <style>{`
        @keyframes modal-in {
          from { opacity: 0; transform: translateY(40px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-modal-in { animation: modal-in 0.25s cubic-bezier(.4,1.7,.7,1) both; }
      `}</style>
    </div>
  );
} 