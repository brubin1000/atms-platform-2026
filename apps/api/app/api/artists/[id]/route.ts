import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongoose';
import { Artist } from '@/lib/models';

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await connectToDatabase();
  const { id } = await params;
  const artist = await Artist.findById(id);
  if (!artist) {
    return NextResponse.json({ error: 'Artist not found' }, { status: 404 });
  }
  return NextResponse.json(artist);
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await connectToDatabase();
  const { id } = await params;
  const artist = await Artist.findByIdAndUpdate(id, await request.json(), { new: true });
  if (!artist) {
    return NextResponse.json({ error: 'Artist not found' }, { status: 404 });
  }
  return NextResponse.json(artist);
}
