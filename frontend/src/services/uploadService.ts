import { api } from './api';

/**
 * Faz o upload de arquivos para o servidor.
 * @param {FileList} files - A lista de arquivos para upload.
 * @returns {Promise<string[]>} - Uma promessa que resolve para um array de URLs dos arquivos.
 */
export const uploadFiles = async (files: FileList): Promise<string[]> => {
  const formData = new FormData();
  for (let i = 0; i < files.length; i++) {
    formData.append('attachments', files[i]);
  }

  try {
    const response = await api.post('/upload/attachments', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response.data && Array.isArray(response.data.files)) {
      // Extrai as URLs do array de objetos de arquivo
      return response.data.files.map((file: { url: string }) => file.url);
    }

    return [];
  } catch (error) {
    console.error('Erro no upload de arquivos:', error);
    throw new Error('Não foi possível fazer o upload dos arquivos. Tente novamente.');
  }
}; 