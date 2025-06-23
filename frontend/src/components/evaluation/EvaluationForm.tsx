import { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import axios from 'axios';
import type { FormEvent } from 'react';
import { useParams } from 'react-router-dom';

const EvaluationForm = () => {
  const [sistema, setSistema] = useState(0);
  const [atendimento, setAtendimento] = useState(0);
  const [hoverSistema, setHoverSistema] = useState(0);
  const [hoverAtendimento, setHoverAtendimento] = useState(0);
  const [enviado, setEnviado] = useState(false);
  const [comentario, setComentario] = useState('');
  const { token } = useParams();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    console.log('Token enviado:', token);
    
    try {
      await axios.post('http://localhost:3001/avaliacoes', {
        sistema,
        atendimento,
        comentario,
        token
      });
      
      setEnviado(true);
      setSistema(0);
      setAtendimento(0);
      setComentario('');
      
      setTimeout(() => {
        setEnviado(false);
      }, 3000);
    } catch (error) {
      console.error('Erro ao enviar avaliação:', error);
      if (axios.isAxiosError(error) && error.response?.data?.error) {
        alert(error.response.data.error);
      } else {
        alert('Erro ao enviar avaliação. Tente novamente.');
      }
    }
  };

  const renderStars = (
    value: number,
    setValue: (value: number) => void,
    hoverValue: number,
    setHoverValue: (value: number) => void
  ) => {
    return [...Array(5)].map((_, index) => {
      const ratingValue = index + 1;
      
      return (
        <FaStar
          key={index}
          className={`cursor-pointer text-4xl transition-transform duration-150 ${ratingValue <= (hoverValue || value) ? 'scale-110' : ''}`}
          color={ratingValue <= (hoverValue || value) ? "#a855f7" : "#e4e5e9"}
          onMouseEnter={() => setHoverValue(ratingValue)}
          onMouseLeave={() => setHoverValue(0)}
          onClick={() => setValue(ratingValue)}
        />
      );
    });
  };

  return (
    <div className="max-w-xl w-full mx-auto mt-16 p-10 bg-white rounded-3xl shadow-2xl flex flex-col items-center border border-gray-100">
      <h2 className="text-3xl font-extralight mb-8 text-center text-gray-900 tracking-tight drop-shadow-sm">Avaliação NPS</h2>
      <form onSubmit={handleSubmit} className="w-full space-y-8">
        <div className="flex flex-col items-center gap-2">
          <label className="block text-lg font-semibold text-gray-700 mb-2">Como você avalia o nosso sistema?</label>
          <div className="flex gap-3">
            {renderStars(sistema, setSistema, hoverSistema, setHoverSistema)}
          </div>
        </div>

        <div className="flex flex-col items-center gap-2">
          <label className="block text-lg font-semibold text-gray-700 mb-2">Como você avalia o atendimento?</label>
          <div className="flex gap-3">
            {renderStars(atendimento, setAtendimento, hoverAtendimento, setHoverAtendimento)}
          </div>
        </div>

        <div className="flex flex-col items-center gap-2">
          <label className="block text-lg text-gray-700 mb-2">Descrição <span className="text-gray-400 text-sm">(opcional)</span></label>
          <textarea
            className="w-full max-w-lg border border-gray-200 rounded-xl p-3 min-h-[90px] resize-none focus:ring-2 focus:ring-purple-300 focus:border-transparent bg-gray-50 text-gray-700 shadow-sm"
            placeholder="Deixe seu comentário sobre o atendimento ou o sistema..."
            value={comentario}
            onChange={e => setComentario(e.target.value)}
            maxLength={500}
          />
        </div>

        <button
          type="submit"
          disabled={!sistema || !atendimento}
          className={`w-full py-3 px-4 rounded-xl text-white font-bold text-lg shadow-md transition-all duration-200 ${
            !sistema || !atendimento
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600'
          }`}
        >
          Enviar Avaliação
        </button>
      </form>

      {enviado && (
        <div className="mt-8 p-4 bg-green-50 text-green-700 rounded-xl text-center text-lg font-semibold shadow-sm border border-green-200 animate-fade-in">
          Avaliação enviada com sucesso!
        </div>
      )}
    </div>
  );
};

export default EvaluationForm; 