import { NextRequest, NextResponse } from 'next/server';
import { verifyPassword, generateToken, setAuthCookie } from '@/app/lib/auth';

// POST /api/admin/login - Authenticate admin
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    if (!body.password) {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      );
    }
    
    // Verify password (direct comparison with hardcoded password)
    const isValid = verifyPassword(body.password, '');
    
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }
    
    // Generate and set auth token
    const token = generateToken();
    setAuthCookie(token);
    
    return NextResponse.json({ 
      message: 'Login successful'
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
} 