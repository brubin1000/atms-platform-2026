import { Worker } from 'bullmq';
import { connectToDatabase } from '@/lib/db/mongoose';
import { ParsedMessage, RawMessage } from '@/lib/models';
import { parseEmailWithGemini } from '@/lib/parser/gemini-parser';
import { getRedisConnection } from '@/lib/queue/redis';

export const parseWorker = new Worker(
  'email-parse-queue',
  async (job) => {
    await connectToDatabase();
    const rawMessageId = String(job.data.rawMessageId);
    const rawMessage = await RawMessage.findById(rawMessageId);
    if (!rawMessage) {
      return;
    }

    const parsed = await parseEmailWithGemini(rawMessage.body || '');
    await ParsedMessage.create({
      rawMessageId,
      fields: parsed,
      overallConfidence: parsed.overallConfidence,
      needsReview: parsed.overallConfidence < 0.8
    });

    rawMessage.status = parsed.overallConfidence >= 0.8 ? 'parsed' : 'review';
    rawMessage.confidence = parsed.overallConfidence;
    rawMessage.processedAt = new Date();
    await rawMessage.save();
  },
  { connection: getRedisConnection() }
);
