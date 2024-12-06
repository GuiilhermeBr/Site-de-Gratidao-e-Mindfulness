import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy, limit, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import toast from 'react-hot-toast';
import { checkAndUpdateNotificationStatus } from '../lib/notifications';

interface Notification {
  id: string;
  message: string;
  scheduleDate: Date;
  isExpired: boolean;
  isAutomatic?: boolean;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeTab, setActiveTab] = useState<'pending' | 'expired'>('pending');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const fetchNotifications = async () => {
        await loadNotifications();
      };

      fetchNotifications();

      const interval = setInterval(async () => {
        try {
          await checkAndUpdateNotificationStatus(user.uid);
          await loadNotifications();
        } catch (error) {
          console.error('Interval error:', error);
        }
      }, 60000);

      return () => clearInterval(interval);
    }
  }, [user]);

  const loadNotifications = async () => {
    if (!user) return;

    try {
      setLoading(true);
      await checkAndUpdateNotificationStatus(user.uid);

      const notificationQuery = query(
        collection(db, 'notifications'),
        where('userId', '==', user.uid),
        where('isExpired', '==', activeTab === 'expired'),
        orderBy('scheduleDate', activeTab === 'expired' ? 'desc' : 'asc'),
        limit(50)
      );

      const querySnapshot = await getDocs(notificationQuery);
      const loadedNotifications = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          scheduleDate: (data.scheduleDate as Timestamp).toDate(),
        } as Notification;
      });

      setNotifications(loadedNotifications);
    } catch (error) {
      console.error('Error loading notifications:', error);
      toast.error('Erro ao carregar notificações. Verifique sua conexão e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Minhas Notificações</h1>

        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2 rounded-md ${
              activeTab === 'pending'
                ? 'bg-rose-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Pendentes
          </button>
          <button
            onClick={() => setActiveTab('expired')}
            className={`px-4 py-2 rounded-md ${
              activeTab === 'expired'
                ? 'bg-rose-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Expiradas
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">
                  {activeTab === 'pending'
                    ? 'Nenhuma notificação pendente'
                    : 'Nenhuma notificação expirada'}
                </p>
                {activeTab === 'pending' && (
                  <a
                    href="/nova-mensagem"
                    className="text-rose-600 hover:text-rose-700 font-medium"
                  >
                    Criar nova mensagem de gratidão
                  </a>
                )}
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`bg-white p-6 rounded-lg shadow-sm border border-gray-100 ${
                    notification.isAutomatic ? 'border-l-4 border-l-rose-500' : ''
                  }`}
                >
                  <p className="text-gray-800 text-lg">{notification.message}</p>
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-sm text-gray-500">
                      {activeTab === 'pending' ? 'Agendada para: ' : 'Expirada em: '}
                      {format(notification.scheduleDate, "d 'de' MMMM 'de' yyyy 'às' HH:mm", {
                        locale: ptBR,
                      })}
                    </p>
                    {notification.isAutomatic && (
                      <span className="text-xs text-rose-600 bg-rose-50 px-2 py-1 rounded-full">
                        Automática
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
