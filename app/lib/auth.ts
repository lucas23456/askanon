import crypto from 'crypto';
import { cookies } from 'next/headers';
import { getAdminByUsername } from '@/app/lib/supabase';

const TOKEN_COOKIE_NAME = 'admin_token';
const ADMIN_PASSWORD = 'imadminfrfrfr'; // Hardcoded password as per requirements

// Simple hash function for password
export function hashPassword(password: string): string {
  // In a real app, you would use bcrypt, but for simplicity we're using SHA-256
  const hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('hex');
}

// Verify password
export function verifyPassword(inputPassword: string, storedPassword: string): boolean {
  // For the demo, we're directly comparing with the hardcoded password
  return inputPassword === ADMIN_PASSWORD;
}

// Generate session token
export function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Set session token in cookie
export function setAuthCookie(token: string): void {
  cookies().set({
    name: TOKEN_COOKIE_NAME,
    value: token,
    httpOnly: true,
    path: '/',
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 1 week
  });
}

// Clear auth cookie
export function clearAuthCookie(): void {
  cookies().delete(TOKEN_COOKIE_NAME);
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
  return !!cookies().get(TOKEN_COOKIE_NAME);
}

// Get current admin token
export function getAuthToken(): string | undefined {
  const cookie = cookies().get(TOKEN_COOKIE_NAME);
  return cookie?.value;
} 