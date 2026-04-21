import { Queue } from 'bullmq';
import { getRedisConnection } from './redis';

let emailParseQueue: Queue | null = null;
let showCreateQueue: Queue | null = null;
let paymentReminderQueue: Queue | null = null;

export function getEmailParseQueue(): Queue {
  if (!emailParseQueue) {
    emailParseQueue = new Queue('email-parse-queue', { connection: getRedisConnection() });
  }
  return emailParseQueue;
}

export function getShowCreateQueue(): Queue {
  if (!showCreateQueue) {
    showCreateQueue = new Queue('show-create-queue', { connection: getRedisConnection() });
  }
  return showCreateQueue;
}

export function getPaymentReminderQueue(): Queue {
  if (!paymentReminderQueue) {
    paymentReminderQueue = new Queue('payment-reminder-queue', { connection: getRedisConnection() });
  }
  return paymentReminderQueue;
}
