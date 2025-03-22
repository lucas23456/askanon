import { createClient } from '@supabase/supabase-js';

// Ensure environment variables are available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please check your .env file.');
}

// Create a single supabase client for the entire app
export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || ''
);

// Type definitions to match your existing SQLite schema
export interface Question {
  id: number;
  content: string;
  status: 'pending' | 'answered' | 'archived';
  created_at: string;
  updated_at: string;
}

export interface Admin {
  id: number;
  username: string;
  password_hash: string;
  created_at: string;
}

// Questions CRUD operations

// Get questions with optional status filter
export const getQuestions = async (status?: 'pending' | 'answered' | 'archived') => {
  let query = supabase
    .from('questions')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (status) {
    query = query.eq('status', status);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching questions:', error);
    return [];
  }
  
  return data as Question[];
};

// Get question by ID
export const getQuestionById = async (id: number) => {
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('Error fetching question:', error);
    return undefined;
  }
  
  return data as Question;
};

// Create a new question
export const createQuestion = async (content: string) => {
  const now = new Date().toISOString();
  
  const { data, error } = await supabase
    .from('questions')
    .insert([
      { 
        content, 
        status: 'pending', 
        created_at: now,
        updated_at: now
      }
    ])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating question:', error);
    throw new Error('Failed to create question');
  }
  
  return data as Question;
};

// Update question status
export const updateQuestionStatus = async (id: number, status: 'pending' | 'answered' | 'archived') => {
  const now = new Date().toISOString();
  
  const { data, error } = await supabase
    .from('questions')
    .update({ status, updated_at: now })
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating question:', error);
    return undefined;
  }
  
  return data as Question;
};

// Delete question
export const deleteQuestion = async (id: number) => {
  const { error } = await supabase
    .from('questions')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting question:', error);
    return false;
  }
  
  return true;
};

// Admin operations
export const getAdminByUsername = async (username: string) => {
  const { data, error } = await supabase
    .from('admins')
    .select('*')
    .eq('username', username)
    .single();
  
  if (error) {
    console.error('Error fetching admin:', error);
    return undefined;
  }
  
  return data as Admin;
}; 