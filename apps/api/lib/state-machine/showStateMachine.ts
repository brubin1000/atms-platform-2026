import type { Document, Types } from 'mongoose';
import { differenceInCalendarDays, isToday, startOfDay } from 'date-fns';
import { connectToDatabase } from '@/lib/db/mongoose';
import { Show } from '@/lib/models';
import { ShowAuditLog } from '@/lib/models/ShowAuditLog';
import { SHOW_STATUSES } from '@/lib/models/Show';

export type ShowStatus = (typeof SHOW_STATUSES)[number];

export const TIER1_FIELDS = [
  'artistId',
  'venueId',
  'showDate',
  'guarantee',
  'setTime',
  'doorsTime'
] as const;

/** Minimum confidence to auto-confirm a show (all Tier 1 fields must also be present). */
export const CONFIDENCE_THRESHOLD_CONFIRM = 0.9;

/** Confidence below which a show is routed to offer (review) instead of hold. */
export const CONFIDENCE_THRESHOLD_OFFER = 0.8;

/** Minimal shape of a Show needed for state machine decisions. */
export interface ShowSnapshot {
  status: ShowStatus;
  artistId?: Types.ObjectId | string | null;
  venueId?: Types.ObjectId | string | null;
  showDate?: Date | null;
  guarantee?: number | null;
  setTime?: string | null;
  doorsTime?: string | null;
  confidence?: number | null;
}

/** Extra runtime context provided by workers (e.g. payment counts). */
export interface TransitionContext {
  unpaidPaymentCount?: number;
}

/** Map of allowed from → to[] transitions. */
export const VALID_TRANSITIONS: Record<ShowStatus, ShowStatus[]> = {
  inquiry: ['hold'],
  hold: ['offer', 'confirmed'],
  offer: ['confirmed'],
  confirmed: ['advancing'],
  advancing: ['day-of'],
  'day-of': ['settled'],
  settled: []
};

/**
 * Returns true if the given from→to pair is a declared valid transition.
 */
export function canTransition(from: ShowStatus, to: ShowStatus): boolean {
  return (VALID_TRANSITIONS[from] ?? []).includes(to);
}

/**
 * Computes the next automatic status for a show given its current state and
 * optional runtime context. Returns the current status if no automatic
 * transition applies.
 */
export function getNextStatus(show: ShowSnapshot, context: TransitionContext = {}): ShowStatus {
  switch (show.status) {
    case 'hold': {
      const allTier1Present = TIER1_FIELDS.every((field) => show[field] != null);
      const confidence = show.confidence ?? 0;
      if (allTier1Present && confidence >= CONFIDENCE_THRESHOLD_CONFIRM) return 'confirmed';
      if (!allTier1Present || confidence < CONFIDENCE_THRESHOLD_OFFER) return 'offer';
      // confidence is in [CONFIDENCE_THRESHOLD_OFFER, CONFIDENCE_THRESHOLD_CONFIRM) — stay in hold
      return 'hold';
    }

    case 'confirmed': {
      if (!show.showDate) return 'confirmed';
      const daysUntil = differenceInCalendarDays(show.showDate, new Date());
      return daysUntil <= 30 ? 'advancing' : 'confirmed';
    }

    case 'advancing': {
      if (!show.showDate) return 'advancing';
      return isToday(show.showDate) ? 'day-of' : 'advancing';
    }

    case 'day-of': {
      if (!show.showDate) return 'day-of';
      const today = startOfDay(new Date());
      const hasPassed = startOfDay(show.showDate) < today;
      const allPaid = (context.unpaidPaymentCount ?? 1) === 0;
      return hasPassed && allPaid ? 'settled' : 'day-of';
    }

    default:
      return show.status;
  }
}

/** Mongoose document type for Show (fields we care about in the state machine). */
type ShowDoc = Document & {
  status: string;
  _id: Types.ObjectId;
  save(): Promise<ShowDoc>;
};

/**
 * Validates the transition, persists the new status to MongoDB, and writes an
 * audit log entry.
 *
 * @throws {Error} if the show is not found or the transition is not valid.
 */
export async function transitionShow(
  showId: string,
  newStatus: ShowStatus,
  actor: string = 'system',
  note?: string
): Promise<ShowDoc> {
  await connectToDatabase();

  const show = (await Show.findById(showId)) as ShowDoc | null;
  if (!show) {
    throw new Error(`Show not found: ${showId}`);
  }

  const fromStatus = show.status as ShowStatus;
  if (!canTransition(fromStatus, newStatus)) {
    throw new Error(`Invalid transition: ${fromStatus} → ${newStatus}`);
  }

  show.status = newStatus;
  await show.save();

  await ShowAuditLog.create({
    showId: show._id,
    fromStatus,
    toStatus: newStatus,
    actor,
    note: note ?? null,
    timestamp: new Date()
  });

  return show;
}
