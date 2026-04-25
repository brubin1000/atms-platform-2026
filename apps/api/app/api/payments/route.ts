import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongoose';
import { Payment } from '@/lib/models';

export async function GET(request: NextRequest) {
  await connectToDatabase();
  const { searchParams } = new URL(request.url);
  const showId = searchParams.get('showId');
  const status = searchParams.get('status');
  const query: Record<string, unknown> = {};

  if (showId) query.showId = showId;
  if (status) query.status = status;

  const payments = await Payment.find(query).sort({ deadline: 1 }).limit(500);
  return NextResponse.json(payments);
}

export async function POST(request: NextRequest) {
  await connectToDatabase();
  const payment = await Payment.create(await request.json());
  return NextResponse.json(payment, { status: 201 });
}
