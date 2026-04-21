import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongoose';
import { Show } from '@/lib/models';

export async function GET(request: NextRequest) {
  await connectToDatabase();
  const { searchParams } = new URL(request.url);
  const query: Record<string, unknown> = {};

  const status = searchParams.get('status');
  const artistId = searchParams.get('artistId');
  const from = searchParams.get('from');
  const to = searchParams.get('to');

  if (status) query.status = status;
  if (artistId) query.artistId = artistId;
  if (from || to) {
    query.showDate = {};
    if (from) (query.showDate as Record<string, Date>).$gte = new Date(from);
    if (to) (query.showDate as Record<string, Date>).$lte = new Date(to);
  }

  const shows = await Show.find(query).sort({ showDate: 1 }).limit(200);
  return NextResponse.json(shows);
}

export async function POST(request: NextRequest) {
  await connectToDatabase();
  const payload = await request.json();
  const show = await Show.create(payload);
  return NextResponse.json(show, { status: 201 });
}
