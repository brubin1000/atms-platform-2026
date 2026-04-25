import { Worker } from 'bullmq';
import { connectToDatabase } from '@/lib/db/mongoose';
import { ParsedMessage, Show } from '@/lib/models';
import { getRedisConnection } from '@/lib/queue/redis';

export const scoreWorker = new Worker(
  'show-create-queue',
  async (job) => {
    await connectToDatabase();
    const parsedMessage = await ParsedMessage.findById(String(job.data.parsedMessageId));
    if (!parsedMessage) {
      return;
    }

    if ((parsedMessage.overallConfidence ?? 0) >= 0.8) {
      await Show.create({
        title: parsedMessage.fields?.artist?.value || 'Untitled Show',
        confidence: parsedMessage.overallConfidence,
        needsReview: false
      });
    } else {
      parsedMessage.needsReview = true;
      await parsedMessage.save();
    }
  },
  { connection: getRedisConnection() }
);
