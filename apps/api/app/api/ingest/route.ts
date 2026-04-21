import { simpleParser } from 'mailparser';
import pdfParse from 'pdf-parse';
import { parse as parseCsv } from 'csv-parse/sync';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { connectToDatabase } from '@/lib/db/mongoose';
import { RawMessage } from '@/lib/models';
import { getEmailParseQueue } from '@/lib/queue/queues';

const ingestSchema = z.object({
  type: z.enum(['email', 'pdf', 'csv']),
  content: z.string(),
  filename: z.string().optional()
});

export async function POST(request: NextRequest) {
  await connectToDatabase();
  const result = ingestSchema.safeParse(await request.json());

  if (!result.success) {
    return NextResponse.json({ error: 'Invalid ingest payload', details: result.error.flatten() }, { status: 400 });
  }

  const payload = result.data;
  let subject = payload.filename || 'Ingested content';
  let body = payload.content;
  let source: 'api' | 'csv' | 'pdf' | 'forwarded' | 'gmail' = 'api';

  if (payload.type === 'email') {
    const parsed = await simpleParser(payload.content);
    subject = parsed.subject || subject;
    body = parsed.text || body;
  }

  if (payload.type === 'pdf') {
    const data = await pdfParse(Buffer.from(payload.content, 'base64'));
    body = data.text;
    source = 'pdf';
  }

  if (payload.type === 'csv') {
    const rows = parseCsv(payload.content, { columns: true, skip_empty_lines: true });
    body = JSON.stringify(rows);
    source = 'csv';
  }

  const message = await RawMessage.create({
    subject,
    body,
    source,
    status: 'pending'
  });

  await getEmailParseQueue().add('parse-message', { rawMessageId: String(message._id) });

  return NextResponse.json({ messageId: String(message._id), status: 'queued' });
}
