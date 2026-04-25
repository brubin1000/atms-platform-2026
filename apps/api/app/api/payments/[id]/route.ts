import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongoose';
import { Payment } from '@/lib/models';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await connectToDatabase();
  const { id } = await params;
  const payment = await Payment.findByIdAndUpdate(id, await request.json(), { new: true });
  if (!payment) {
    return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
  }
  return NextResponse.json(payment);
}
