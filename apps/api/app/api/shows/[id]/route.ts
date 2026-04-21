import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongoose';
import { Show } from '@/lib/models';

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await connectToDatabase();
  const { id } = await params;
  const show = await Show.findById(id).populate('artistId').populate('venueId').populate('sourceEmailId');
  if (!show) {
    return NextResponse.json({ error: 'Show not found' }, { status: 404 });
  }
  return NextResponse.json(show);
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await connectToDatabase();
  const { id } = await params;
  const payload = await request.json();
  const show = await Show.findByIdAndUpdate(id, payload, { new: true });
  if (!show) {
    return NextResponse.json({ error: 'Show not found' }, { status: 404 });
  }
  return NextResponse.json(show);
}
