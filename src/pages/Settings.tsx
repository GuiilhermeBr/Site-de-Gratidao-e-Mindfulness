import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';
import toast from 'react-hot-toast';
import { Bell, AlertCircle } from 'lucide-react';
import { requestNotificationPermission } from '../lib/notifications';

interface UserSettings {
  enableNotifications: boolean;
  enableAutoNotifications: boolean;
}

export default function Settings() {
  const { user } = useAuth();
  const [settings, setSettings] = useState<UserSettings>({
    enableNotifications: true,
    enableAutoNotifications: false
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadSettings();
    }
  }, [user]);

  const loadSettings = async () => {
    if (!user) return;

    try {
      const docRef = doc(db, 'userSettings', user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setSettings(docSnap.data() as UserSettings);
      } else {
        await setDoc(docRef, settings);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      toast.error('Erro ao carregar configurações');
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = async (setting: keyof UserSettings) => {
    if (!user || loading) return;

    try {
      if (setting === 'enableNotifications') {
        const permission = await requestNotificationPermission();
        if (!permission) {
          toast.error('Permissão de notificação negada. Verifique as configurações do seu navegador.');
          return;
        }
      }

      const newSettings = {
        ...settings,
        [setting]: !settings[setting]
      };

      await setDoc(doc(db, 'userSettings', user.uid), newSettings);
      setSettings(newSettings);
      toast.success('Configurações atualizadas com sucesso');
    } catch (error) {
      console.error('Error updating settings:', error);
      toast.error('Erro ao atualizar configurações');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Configurações</h1>

        <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Bell className="h-6 w-6 text-gray-400" />
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-gray-900">Notificações</h3>
                  <p className="text-sm text-gray-500">
                    Receba notificações das suas mensagens de gratidão
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleSettingChange('enableNotifications')}
                className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 ${
                  settings.enableNotifications ? 'bg-rose-600' : 'bg-gray-200'
                }`}
              >
                <span className="sr-only">Ativar notificações</span>
                <span
                  className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
                    settings.enableNotifications ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <AlertCircle className="h-6 w-6 text-gray-400" />
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-gray-900">Notificações Automáticas</h3>
                  <p className="text-sm text-gray-500">
                    Receba uma mensagem inspiradora diariamente
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleSettingChange('enableAutoNotifications')}
                className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 ${
                  settings.enableAutoNotifications ? 'bg-rose-600' : 'bg-gray-200'
                }`}
              >
                <span className="sr-only">Ativar notificações automáticas</span>
                <span
                  className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
                    settings.enableAutoNotifications ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}