import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface ModalContent {
  title: string;
  body: ReactNode;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
}

interface ModalContextType {
  showModal: (content: ModalContent) => void;
  hideModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal deve ser usado dentro de um ModalProvider');
  }
  return context;
};

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [modalContent, setModalContent] = useState<ModalContent | null>(null);

  const showModal = (content: ModalContent) => {
    setModalContent(content);
  };

  const hideModal = () => {
    setModalContent(null);
  };

  const handleConfirm = () => {
    if (modalContent) {
      modalContent.onConfirm();
      hideModal();
    }
  };

  return (
    <ModalContext.Provider value={{ showModal, hideModal }}>
      {children}
      {modalContent && (
        <div className="fixed inset-0 bg-black/30 z-50 flex justify-center items-center backdrop-blur-md transition-opacity duration-300 animate-fade-in">
          <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-md m-4 transform transition-all animate-fade-in-up">
            <h2 className="text-xl font-bold text-gray-800 mb-4">{modalContent.title}</h2>
            <div className="text-gray-600 mb-6">{modalContent.body}</div>
            <div className="flex justify-end gap-4">
              <button
                onClick={hideModal}
                className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
              >
                {modalContent.cancelText || 'Cancelar'}
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 rounded-md bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors shadow-sm"
              >
                {modalContent.confirmText || 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </ModalContext.Provider>
  );
}; 