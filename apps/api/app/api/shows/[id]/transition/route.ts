import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { SHOW_STATUSES } from '@/lib/models/Show';
import { transitionShow } from '@/lib/state-machine/showStateMachine';

const TransitionBodySchema = z.object({
  toStatus: z.enum(SHOW_STATUSES),
  note: z.string().optional()
});

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = TransitionBodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { toStatus, note } = parsed.data;

  try {
    const show = await transitionShow(id, toStatus, 'api', note);
    return NextResponse.json(show);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Transition failed';

    if (message.startsWith('Invalid transition:')) {
      return NextResponse.json({ error: message }, { status: 409 });
    }

    if (message.startsWith('Show not found:')) {
      return NextResponse.json({ error: message }, { status: 404 });
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
