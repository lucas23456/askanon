'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password) {
      setError('Пароль обязателен');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Ошибка входа');
      }
      
      // Redirect to admin dashboard on successful login
      router.push('/admin');
    } catch (err: any) {
      setError(err.message || 'Неверный пароль. Пожалуйста, попробуйте еще раз.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <main className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md px-6 py-12">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4">АДМИН</h1>
          </div>
          
          <div className="border border-white p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="password" className="block uppercase text-sm font-bold mb-2">
                  Пароль
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 border border-white bg-black text-white focus:outline-none"
                  placeholder="Введите пароль администратора"
                  disabled={isLoading}
                />
              </div>
              
              {error && (
                <div className="text-white text-sm border border-white p-2">
                  {error}
                </div>
              )}
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full border border-white px-6 py-2 uppercase hover:bg-white hover:text-black transition-colors"
              >
                {isLoading ? 'ВХОД...' : 'ВОЙТИ'}
              </button>
            </form>
          </div>
          
          <div className="mt-12 flex justify-center">
            {/* Simplified staircase icon */}
            <svg className="w-24 h-24" viewBox="0 0 100 100">
              <path 
                d="M20,80 L20,60 L40,60 L40,40 L60,40 L60,20 L80,20 L80,80 Z" 
                stroke="white" 
                strokeWidth="2" 
                fill="none"
              />
              <circle cx="70" cy="70" r="3" fill="white" />
              <circle cx="80" cy="70" r="3" fill="white" />
            </svg>
          </div>
          
          <div className="mt-8 text-center">
            <a 
              href="/"
              className="inline-block border border-white px-6 py-1 text-sm hover:bg-white hover:text-black transition-colors"
            >
              ГЛАВНАЯ
            </a>
          </div>
        </div>
      </main>
    </div>
  );
} 