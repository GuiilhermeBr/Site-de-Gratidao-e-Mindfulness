import React from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { LogOut, Heart, Bell, PenSquare, Settings } from 'lucide-react';
import { auth } from '../lib/firebase';
import toast from 'react-hot-toast';

export default function Layout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/login');
      toast.success('Sessão encerrada com sucesso');
    } catch (error) {
      console.error('Erro ao sair:', error);
      toast.error('Erro ao encerrar sessão');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Heart className="h-8 w-8 text-rose-600" />
              <span className="ml-2 text-xl font-semibold text-gray-900">Gratidão</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  location.pathname === '/' 
                    ? 'text-rose-600 bg-rose-50' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Bell className="h-5 w-5 mr-1" />
                Notificações
              </Link>
              <Link
                to="/nova-mensagem"
                className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  location.pathname === '/nova-mensagem' 
                    ? 'text-rose-600 bg-rose-50' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <PenSquare className="h-5 w-5 mr-1" />
                Nova Mensagem
              </Link>
              <Link
                to="/configuracoes"
                className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  location.pathname === '/configuracoes' 
                    ? 'text-rose-600 bg-rose-50' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Settings className="h-5 w-5 mr-1" />
                Configurações
              </Link>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 rounded-md"
              >
                <LogOut className="h-5 w-5 mr-1" />
                Sair
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}