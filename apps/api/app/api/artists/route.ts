import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongoose';
import { Artist } from '@/lib/models';

export async function GET() {
  await connectToDatabase();
  const artists = await Artist.find({}).limit(500);
  return NextResponse.json(artists);
}

export async function POST(request: NextRequest) {
  await connectToDatabase();
  const artist = await Artist.create(await request.json());
  return NextResponse.json(artist, { status: 201 });
}
