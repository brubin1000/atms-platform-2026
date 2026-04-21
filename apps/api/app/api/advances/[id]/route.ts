import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongoose';
import { AdvanceForm } from '@/lib/models';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await connectToDatabase();
  const { id } = await params;
  const advance = await AdvanceForm.findByIdAndUpdate(id, await request.json(), { new: true });
  if (!advance) {
    return NextResponse.json({ error: 'Advance form not found' }, { status: 404 });
  }
  return NextResponse.json(advance);
}
