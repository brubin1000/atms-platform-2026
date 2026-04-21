import { Worker } from 'bullmq';
import { addDays, isBefore } from 'date-fns';
import { Resend } from 'resend';
import { connectToDatabase } from '@/lib/db/mongoose';
import { Payment } from '@/lib/models';
import { getRedisConnection } from '@/lib/queue/redis';

function getResendClient(): Resend {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error('RESEND_API_KEY is required for payment reminder worker');
  }
  return new Resend(apiKey);
}

export const reminderWorker = new Worker(
  'payment-reminder-queue',
  async () => {
    await connectToDatabase();
    const resend = getResendClient();

    const upcoming = await Payment.find({
      status: { $in: ['scheduled', 'pending'] },
      deadline: { $ne: null }
    }).limit(200);

    const now = new Date();
    const threshold = addDays(now, 3);

    for (const payment of upcoming) {
      if (payment.deadline && isBefore(payment.deadline, threshold)) {
        await resend.emails.send({
          from: process.env.EMAIL_FROM || 'noreply@atms.space',
          to: [process.env.FINANCE_EMAIL || 'finance@atms.space'],
          subject: `Payment reminder: ${payment.amount} ${payment.currency}`,
          text: `Payment ${payment._id} is due by ${payment.deadline.toISOString()}.`
        });
      }
    }
  },
  { connection: getRedisConnection() }
);
