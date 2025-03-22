'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [question, setQuestion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!question.trim()) {
      setError('Пожалуйста, введите вопрос');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      const response = await fetch('/api/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: question }),
        cache: 'no-store',
        next: { revalidate: 0 }
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || `Ошибка: ${response.status}`);
      }
      
      setQuestion('');
      setSubmitSuccess(true);
      setShowForm(false);
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (err: any) {
      console.error('Error submitting question:', err);
      setError(err.message || 'Что-то пошло не так. Пожалуйста, попробуйте еще раз.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <main className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md px-6 py-12">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold mb-1">ASKMEANON</h1>
            <button 
              onClick={() => setShowForm(true)} 
              className="inline-block border border-black px-6 py-1 text-sm mb-12 hover:bg-black hover:text-white"
            >
              ЗАДАТЬ ВОПРОС
            </button>
          </div>
          
          {!showForm ? (
            <div className="flex justify-center">
              <div className="relative w-64 h-64">
                {/* Christian cross symbol */}
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <path 
                    d="M50,10 L50,90 M30,30 L70,30" 
                    stroke="black" 
                    strokeWidth="8" 
                    fill="none"
                  />
                </svg>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-black p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="question" className="block uppercase text-sm font-bold mb-2">
                    Ваш Вопрос
                  </label>
                  <textarea
                    id="question"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    rows={4}
                    className="w-full p-2 border border-black focus:outline-none"
                    placeholder="Введите ваш вопрос здесь..."
                    disabled={isSubmitting}
                  />
                </div>
                
                {error && (
                  <div className="text-black text-sm border border-black p-2">{error}</div>
                )}
                
                {submitSuccess && (
                  <div className="border border-black p-2 text-sm">
                    Ваш вопрос успешно отправлен!
                  </div>
                )}
                
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="border border-black px-6 py-1 hover:bg-black hover:text-white"
                  >
                    {isSubmitting ? 'ОТПРАВКА...' : 'ОТПРАВИТЬ'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="border border-black px-6 py-1 hover:bg-black hover:text-white"
                  >
                    ОТМЕНА
                  </button>
                </div>
              </form>
            </div>
          )}
          
          <div className="mt-16 text-center">
            <Link 
              href="/admin/login" 
              className="inline-block border border-black px-6 py-1 text-sm hover:bg-black hover:text-white"
            >
              АДМИН
            </Link>
            <p className="mt-4 uppercase text-xs">
              Все вопросы анонимны
            </p>
          </div>
        </div>
      </main>
    </div>
  );
} 