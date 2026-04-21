import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongoose';

export async function GET() {
  try {
    await connectToDatabase();
    return NextResponse.json({ status: 'ok', db: 'connected', timestamp: new Date().toISOString() });
  } catch {
    return NextResponse.json({ status: 'ok', db: 'error', timestamp: new Date().toISOString() });
  }
}
