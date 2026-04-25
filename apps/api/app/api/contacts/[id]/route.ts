import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongoose';
import { Contact } from '@/lib/models';

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await connectToDatabase();
  const { id } = await params;
  const contact = await Contact.findById(id);
  if (!contact) {
    return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
  }
  return NextResponse.json(contact);
}
