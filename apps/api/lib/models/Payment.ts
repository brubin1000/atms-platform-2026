import { Schema, model, models, Types } from 'mongoose';

const PaymentSchema = new Schema(
  {
    showId: { type: Types.ObjectId, ref: 'Show', required: true },
    artistId: { type: Types.ObjectId, ref: 'Artist' },
    type: { type: String, enum: ['incoming', 'outgoing'], required: true },
    status: {
      type: String,
      enum: ['scheduled', 'pending', 'paid', 'overdue'],
      default: 'scheduled'
    },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    deadline: Date,
    paidAt: Date,
    note: String,
    stripePaymentLinkId: String
  },
  { timestamps: true }
);

export const Payment = models.Payment || model('Payment', PaymentSchema);
