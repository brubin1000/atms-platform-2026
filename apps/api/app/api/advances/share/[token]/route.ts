import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongoose';
import { AdvanceForm } from '@/lib/models';

export async function GET(_: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  await connectToDatabase();
  const { token } = await params;
  const form = await AdvanceForm.findOne({ shareToken: token });
  if (!form) {
    return NextResponse.json({ error: 'Advance form not found' }, { status: 404 });
  }
  return NextResponse.json(form);
}
