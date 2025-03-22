import { NextRequest, NextResponse } from 'next/server';
import { clearAuthCookie } from '@/app/lib/auth';

// POST /api/admin/logout - Log out admin
export async function POST(request: NextRequest) {
  try {
    // Clear auth cookie
    clearAuthCookie();
    
    return NextResponse.json({ 
      message: 'Logout successful'
    });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    );
  }
} 