import { Worker } from 'bullmq';
import { connectToDatabase } from '@/lib/db/mongoose';
import { Payment, Show } from '@/lib/models';
import { getRedisConnection } from '@/lib/queue/redis';
import { canTransition, getNextStatus, transitionShow } from '@/lib/state-machine/showStateMachine';
import type { ShowSnapshot, ShowStatus } from '@/lib/state-machine/showStateMachine';

/**
 * Returns the number of non-paid payments for a given show.
 */
async function countUnpaidPayments(showId: string): Promise<number> {
  return Payment.countDocuments({ showId, status: { $ne: 'paid' } });
}

/**
 * BullMQ worker that auto-advances shows through the lifecycle state machine.
 *
 * Job name: "auto-advance-shows"
 * Queue:    "show-lifecycle-queue"
 *
 * To schedule this worker periodically, enqueue a repeatable job via
 * `getShowLifecycleQueue().add('auto-advance-shows', {}, { repeat: { ... } })`.
 */
export const showLifecycleWorker = new Worker(
  'show-lifecycle-queue',
  async () => {
    await connectToDatabase();

    const autoStatuses: ShowStatus[] = ['confirmed', 'advancing', 'day-of'];

    const shows = await Show.find({ status: { $in: autoStatuses } })
      .select('_id status artistId venueId showDate guarantee setTime doorsTime confidence')
      .lean<
        Array<{
          _id: { toString(): string };
          status: string;
          artistId?: unknown;
          venueId?: unknown;
          showDate?: Date;
          guarantee?: number;
          setTime?: string;
          doorsTime?: string;
          confidence?: number;
        }>
      >();

    for (const show of shows) {
      const snapshot: ShowSnapshot = {
        status: show.status as ShowStatus,
        artistId: show.artistId as ShowSnapshot['artistId'],
        venueId: show.venueId as ShowSnapshot['venueId'],
        showDate: show.showDate ?? null,
        guarantee: show.guarantee ?? null,
        setTime: show.setTime ?? null,
        doorsTime: show.doorsTime ?? null,
        confidence: show.confidence ?? null
      };

      let unpaidPaymentCount: number | undefined;
      if (snapshot.status === 'day-of') {
        unpaidPaymentCount = await countUnpaidPayments(show._id.toString());
      }

      const next = getNextStatus(snapshot, { unpaidPaymentCount });

      if (next !== snapshot.status && canTransition(snapshot.status, next)) {
        try {
          await transitionShow(show._id.toString(), next, 'system:showLifecycleWorker');
        } catch (err) {
          console.error('showLifecycleWorker: failed to transition show', {
            showId: show._id.toString(),
            from: snapshot.status,
            to: next,
            error: err
          });
        }
      }
    }
  },
  { connection: getRedisConnection() }
);
