import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';
import toast from 'react-hot-toast';

export default function NewMessage() {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [scheduleDate, setScheduleDate] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !scheduleDate || !user) return;

    try {
      setLoading(true);
      await addDoc(collection(db, 'notifications'), {
        message: message.trim(),
        scheduleDate: new Date(scheduleDate),
        userId: user.uid,
        createdAt: new Date()
      });
      
      toast.success('Mensagem agendada com sucesso!');
      setMessage('');
      setScheduleDate('');
    } catch (error) {
      toast.error('Erro ao agendar mensagem. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Nova Mensagem de Gratidão</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
              Mensagem
            </label>
            <textarea
              id="message"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Por que você está grato hoje?"
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
              required
            />
          </div>

          <div>
            <label htmlFor="scheduleDate" className="block text-sm font-medium text-gray-700 mb-2">
              Data e hora da notificação
            </label>
            <input
              type="datetime-local"
              id="scheduleDate"
              value={scheduleDate}
              onChange={(e) => setScheduleDate(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              loading ? 'bg-rose-400 cursor-not-allowed' : 'bg-rose-600 hover:bg-rose-700'
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500`}
          >
            {loading ? 'Agendando...' : 'Agendar Mensagem'}
          </button>
        </form>
      </div>
    </Layout>
  );
}