import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuthContext } from '../contexts/AuthContext';

const Auth = () => {
  const navigate = useNavigate();
  const { login, register, isLoading } = useAuthContext();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (mode === 'register' && !formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'E-mail inválido';
    }
    if (!formData.password.trim()) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 6) {
      newErrors.password = 'A senha deve ter pelo menos 6 caracteres';
    }
    if (mode === 'register' && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    
    try {
      let result;
      
      if (mode === 'login') {
        result = await login({
          email: formData.email,
          senha: formData.password
        });
      } else {
        result = await register({
          nome: formData.name,
          email: formData.email,
          senha: formData.password,
          tipo: 'USER'
        });
      }
      
      if (result.success) {
        navigate('/dashboard');
      } else {
        setErrors({ general: result.error });
      }
    } catch (error: any) {
      setErrors({ general: error.message || 'Erro inesperado na autenticação' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
    if (errors.general) setErrors(prev => ({ ...prev, general: '' }));
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="w-full max-w-lg mx-auto px-4 sm:px-8 md:px-12 lg:px-0">
        <div className="bg-white/50 backdrop-blur-sm border-none shadow-lg rounded-xl p-8 md:p-12">
          {/* Nome do sistema com gradiente dentro do card */}
          <h1 className="text-3xl sm:text-4xl font-extrabold text-center mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent select-none" style={{ backgroundImage: 'linear-gradient(to right, #2563eb, #9333ea)' }}>
            NPS System
          </h1>
          {/* Alternância entre Login e Cadastro */}
          <div className="flex justify-center mb-8 gap-0">
            <button
              className={`flex-1 py-2 px-0 sm:px-6 text-base font-semibold rounded-l-lg border border-r-0 border-gray-200 transition-all duration-200 focus:outline-none
                ${mode === 'login'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg z-10'
                  : 'bg-white text-gray-600 hover:bg-gray-100'}
              `}
              style={mode === 'login' ? { backgroundImage: 'linear-gradient(to right, #2563eb, #9333ea)' } : {}}
              onClick={() => setMode('login')}
              disabled={mode === 'login'}
              type="button"
            >
              Login
            </button>
            <button
              className={`flex-1 py-2 px-0 sm:px-6 text-base font-semibold rounded-r-lg border border-l-0 border-gray-200 transition-all duration-200 focus:outline-none
                ${mode === 'register'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg z-10'
                  : 'bg-white text-gray-600 hover:bg-gray-100'}
              `}
              style={mode === 'register' ? { backgroundImage: 'linear-gradient(to right, #2563eb, #9333ea)' } : {}}
              onClick={() => setMode('register')}
              disabled={mode === 'register'}
              type="button"
            >
              Criar conta
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {mode === 'login' ? 'Login' : 'Criar conta'}
              </h1>
              <p className="text-gray-500">
                {mode === 'login' ? 'Faça login para continuar' : 'Crie uma conta para continuar'}
              </p>
            </div>

            {errors.general && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                <p className="font-medium">{errors.general}</p>
              </div>
            )}

            <div className="space-y-6">
              {mode === 'register' && (
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Nome
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm transition-all duration-300 focus:scale-105 focus:ring-2 focus:ring-blue-500/20 ${errors.name ? 'border-red-300' : 'border-gray-300'}`}
                    placeholder="Digite seu nome"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>
              )}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  E-mail
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm transition-all duration-300 focus:scale-105 focus:ring-2 focus:ring-blue-500/20 ${errors.email ? 'border-red-300' : 'border-gray-300'}`}
                  placeholder={mode === 'login' ? 'Seu melhor e-mail' : 'Digite seu e-mail'}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Senha
                </label>
                <input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm transition-all duration-300 focus:scale-105 focus:ring-2 focus:ring-blue-500/20 ${errors.password ? 'border-red-300' : 'border-gray-300'}`}
                  placeholder="Digite sua senha"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>
              {mode === 'register' && (
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirmar Senha
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm transition-all duration-300 focus:scale-105 focus:ring-2 focus:ring-blue-500/20 ${errors.confirmPassword ? 'border-red-300' : 'border-gray-300'}`}
                    placeholder="Confirme sua senha"
                  />
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                  )}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-2 px-4 rounded-md shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed border-0"
              style={{ backgroundImage: 'linear-gradient(to right, #2563eb, #9333ea)' }}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {mode === 'login' ? 'Entrando...' : 'Criando conta...'}
                </span>
              ) : (
                mode === 'login' ? 'Entrar' : 'Criar conta'
              )}
            </button>

            {/* Divisor */}
            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">
                  ou continue com
                </span>
              </div>
            </div>

            {/* Botões Sociais */}
            <div className="grid grid-cols-2 gap-4 w-full">
              <button
                type="button"
                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-300 transform hover:scale-105"
                // onClick={handleGoogleLogin}
              >
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </button>
              <button
                type="button"
                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-300 transform hover:scale-105"
              >
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                Apple
              </button>
            </div>
          </form>

          {/* Link azul no rodapé para alternar entre login/cadastro */}
          <div className="text-center mt-6">
            {mode === 'login' ? (
              <button
                type="button"
                onClick={() => setMode('register')}
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
              >
                Não tem uma conta? Cadastre-se
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
              >
                Já tem uma conta? Faça login
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth; 