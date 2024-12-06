import React from 'react';
import { Download } from 'lucide-react';
import { useInstallPrompt } from '../hooks/useInstallPrompt';

export default function InstallPrompt() {
  const { isInstallable, installApp } = useInstallPrompt();

  if (!isInstallable) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-white rounded-lg shadow-lg p-4 flex items-center justify-between">
      <div className="flex-1">
        <h3 className="font-medium text-gray-900">Instalar Aplicativo</h3>
        <p className="text-sm text-gray-500">
          Instale o Gratidão para uma melhor experiência
        </p>
      </div>
      <button
        onClick={installApp}
        className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
      >
        <Download className="h-5 w-5 mr-2" />
        Instalar
      </button>
    </div>
  );
}