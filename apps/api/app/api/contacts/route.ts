import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongoose';
import { Contact } from '@/lib/models';

export async function GET(request: NextRequest) {
  await connectToDatabase();
  const { searchParams } = new URL(request.url);
  const role = searchParams.get('role');
  const contacts = await Contact.find(role ? { role } : {}).limit(500);
  return NextResponse.json(contacts);
}

export async function POST(request: NextRequest) {
  await connectToDatabase();
  const contact = await Contact.create(await request.json());
  return NextResponse.json(contact, { status: 201 });
}
