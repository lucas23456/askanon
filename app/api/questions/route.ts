import { NextRequest, NextResponse } from 'next/server';
import { createQuestion, getQuestions } from '@/app/lib/supabase';
import { isAuthenticated } from '@/app/lib/auth';

// POST /api/questions - Create a new question
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    if (!body.content || typeof body.content !== 'string') {
      return NextResponse.json(
        { error: 'Question content is required' },
        { status: 400 }
      );
    }
    
    // Sanitize input by trimming excess whitespace
    const sanitizedContent = body.content.trim();
    
    // Validate content length
    if (sanitizedContent.length < 2 || sanitizedContent.length > 1000) {
      return NextResponse.json(
        { error: 'Question must be between 2 and 1000 characters' },
        { status: 400 }
      );
    }
    
    // Create question in database
    const question = await createQuestion(sanitizedContent);
    
    return NextResponse.json({ 
      message: 'Question submitted successfully',
      question 
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating question:', error);
    return NextResponse.json(
      { error: 'Failed to submit question' },
      { status: 500 }
    );
  }
}

// GET /api/questions - Get all questions (requires admin authentication)
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    if (!isAuthenticated()) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Get status filter from query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') as 'pending' | 'answered' | 'archived' | undefined;
    
    // Get questions from database
    const questions = await getQuestions(status);
    
    return NextResponse.json({ questions });
  } catch (error) {
    console.error('Error fetching questions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch questions' },
      { status: 500 }
    );
  }
}

// OPTIONS /api/questions - Handle preflight requests for CORS
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
} 