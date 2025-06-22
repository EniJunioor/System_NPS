import { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import axios from 'axios';
import type { FormEvent } from 'react';

const EvaluationForm = () => {
  const [sistema, setSistema] = useState(0);
  const [atendimento, setAtendimento] = useState(0);
  const [hoverSistema, setHoverSistema] = useState(0);
  const [hoverAtendimento, setHoverAtendimento] = useState(0);
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      await axios.post('http://localhost:3001/api/avaliacoes', {
        sistema,
        atendimento
      });
      
      setEnviado(true);
      setSistema(0);
      setAtendimento(0);
      
      setTimeout(() => {
        setEnviado(false);
      }, 3000);
    } catch (error) {
      console.error('Erro ao enviar avaliação:', error);
      alert('Erro ao enviar avaliação. Tente novamente.');
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
          className="cursor-pointer text-2xl"
          color={ratingValue <= (hoverValue || value) ? "#ffc107" : "#e4e5e9"}
          onMouseEnter={() => setHoverValue(ratingValue)}
          onMouseLeave={() => setHoverValue(0)}
          onClick={() => setValue(ratingValue)}
        />
      );
    });
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Avaliação NPS</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-700 mb-2">Como você avalia o sistema?</label>
          <div className="flex gap-2">
            {renderStars(sistema, setSistema, hoverSistema, setHoverSistema)}
          </div>
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Como você avalia o atendimento?</label>
          <div className="flex gap-2">
            {renderStars(atendimento, setAtendimento, hoverAtendimento, setHoverAtendimento)}
          </div>
        </div>

        <button
          type="submit"
          disabled={!sistema || !atendimento}
          className={`w-full py-2 px-4 rounded-md text-white font-medium ${
            !sistema || !atendimento
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          Enviar Avaliação
        </button>
      </form>

      {enviado && (
        <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-md text-center">
          Avaliação enviada com sucesso!
        </div>
      )}
    </div>
  );
};

export default EvaluationForm; 