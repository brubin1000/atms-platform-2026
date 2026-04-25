import { Worker } from 'bullmq';
import { addDays, isBefore } from 'date-fns';
import { Resend } from 'resend';
import { connectToDatabase } from '@/lib/db/mongoose';
import { Payment } from '@/lib/models';
import { getRedisConnection } from '@/lib/queue/redis';

function getReminderConfig() {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  const financeEmail = process.env.FINANCE_EMAIL;

  if (!apiKey) {
    throw new Error('RESEND_API_KEY is required for payment reminder worker');
  }

  if (!from) {
    throw new Error('EMAIL_FROM is required for payment reminder worker');
  }

  if (!financeEmail) {
    throw new Error('FINANCE_EMAIL is required for payment reminder worker');
  }

  return { resend: new Resend(apiKey), from, financeEmail };
}

export const reminderWorker = new Worker(
  'payment-reminder-queue',
  async () => {
    await connectToDatabase();
    const { resend, from, financeEmail } = getReminderConfig();

    const upcoming = await Payment.find({
      status: { $in: ['scheduled', 'pending'] },
      deadline: { $ne: null }
    }).limit(200);

    const now = new Date();
    const threshold = addDays(now, 3);

    for (const payment of upcoming) {
      if (payment.deadline && isBefore(payment.deadline, threshold)) {
        try {
          await resend.emails.send({
            from,
            to: [financeEmail],
            subject: `Payment reminder: ${payment.amount} ${payment.currency}`,
            text: `Payment ${payment._id} is due by ${payment.deadline.toISOString()}.`
          });
        } catch (error) {
          console.error('Failed to send payment reminder', {
            paymentId: String(payment._id),
            error
          });
        }
      }
    }
  },
  { connection: getRedisConnection() }
);
