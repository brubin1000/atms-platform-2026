import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongoose';
import { AdvanceForm } from '@/lib/models';

export async function GET(request: NextRequest) {
  await connectToDatabase();
  const { searchParams } = new URL(request.url);
  const showId = searchParams.get('showId');
  const query = showId ? { showId } : {};
  const forms = await AdvanceForm.find(query).limit(100);
  return NextResponse.json(forms);
}

export async function POST(request: NextRequest) {
  await connectToDatabase();
  const advance = await AdvanceForm.create(await request.json());
  return NextResponse.json(advance, { status: 201 });
}
