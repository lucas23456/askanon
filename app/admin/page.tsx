'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Question } from '@/app/lib/supabase';

export default function AdminDashboard() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'answered' | 'archived'>('all');
  const router = useRouter();

  const fetchQuestions = async () => {
    setLoading(true);
    setError('');
    
    try {
      const queryParam = statusFilter !== 'all' ? `?status=${statusFilter}` : '';
      const response = await fetch(`/api/questions${queryParam}`);
      
      if (!response.ok) {
        throw new Error('Не удалось загрузить вопросы');
      }
      
      const data = await response.json();
      setQuestions(data.questions || []);
    } catch (err) {
      console.error('Error fetching questions:', err);
      setError('Ошибка при загрузке вопросов');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [statusFilter]);

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      router.push('/admin/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const handleStatusChange = async (questionId: number, newStatus: 'pending' | 'answered' | 'archived') => {
    try {
      const response = await fetch(`/api/questions/${questionId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update question status');
      }
      
      // Refresh questions list
      fetchQuestions();
    } catch (err) {
      console.error('Error updating question:', err);
      setError('Ошибка при обновлении статуса вопроса');
    }
  };

  const handleDelete = async (questionId: number) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот вопрос?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/questions/${questionId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete question');
      }
      
      // Refresh questions list
      fetchQuestions();
    } catch (err) {
      console.error('Error deleting question:', err);
      setError('Ошибка при удалении вопроса');
    }
  };

  const translateStatus = (status: string) => {
    switch (status) {
      case 'pending':
        return 'В ожидании';
      case 'answered':
        return 'Отвечено';
      case 'archived':
        return 'Архивировано';
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-black text-white py-6">
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold">ПАНЕЛЬ АДМИНИСТРАТОРА</h1>
          <button
            onClick={handleLogout}
            className="border border-white px-4 py-1 hover:bg-white hover:text-black transition-colors"
          >
            ВЫЙТИ
          </button>
        </div>
      </header>
      
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-8 flex justify-between items-center">
          <h2 className="text-2xl font-bold uppercase">ВОПРОСЫ</h2>
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="p-2 bg-white border border-black uppercase text-sm focus:outline-none"
            >
              <option value="all">ВСЕ ВОПРОСЫ</option>
              <option value="pending">ОЖИДАЮЩИЕ</option>
              <option value="answered">ОТВЕЧЕННЫЕ</option>
              <option value="archived">АРХИВИРОВАННЫЕ</option>
            </select>
          </div>
        </div>
        
        {loading ? (
          <div className="text-center py-12 border border-black p-6">
            <p className="uppercase">Загрузка вопросов...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12 border border-black p-6">
            <p className="uppercase">{error}</p>
          </div>
        ) : questions.length === 0 ? (
          <div className="text-center py-12 border border-black p-6">
            <p className="uppercase">Вопросы не найдены</p>
          </div>
        ) : (
          <div className="space-y-4">
            {questions.map((question) => (
              <div 
                key={question.id} 
                className="border border-black p-6"
              >
                <div className="mb-4">
                  <p className="mb-4">{question.content}</p>
                  <div className="flex items-center text-sm space-x-8 uppercase">
                    <span>Статус: {translateStatus(question.status)}</span>
                    <span>Создан: {new Date(question.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {question.status !== 'answered' && (
                    <button
                      onClick={() => handleStatusChange(question.id, 'answered')}
                      className="border border-black px-3 py-1 text-sm hover:bg-black hover:text-white transition-colors"
                    >
                      ОТМЕЧЕН КАК ОТВЕЧЕННЫЙ
                    </button>
                  )}
                  {question.status !== 'archived' && (
                    <button
                      onClick={() => handleStatusChange(question.id, 'archived')}
                      className="border border-black px-3 py-1 text-sm hover:bg-black hover:text-white transition-colors"
                    >
                      АРХИВИРОВАТЬ
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(question.id)}
                    className="border border-black px-3 py-1 text-sm hover:bg-black hover:text-white transition-colors"
                  >
                    УДАЛИТЬ
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-16 text-center">
          <Link 
            href="/" 
            className="inline-block border border-black px-6 py-1 text-sm hover:bg-black hover:text-white transition-colors"
          >
            ГЛАВНАЯ
          </Link>
        </div>
      </main>
    </div>
  );
} 