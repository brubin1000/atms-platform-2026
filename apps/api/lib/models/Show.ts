import { Schema, model, models, Types } from 'mongoose';

export const SHOW_STATUSES = [
  'inquiry',
  'hold',
  'offer',
  'confirmed',
  'advancing',
  'day-of',
  'settled'
] as const;

const ShowSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    status: { type: String, enum: SHOW_STATUSES, default: 'inquiry' },
    artistId: { type: Types.ObjectId, ref: 'Artist' },
    venueId: { type: Types.ObjectId, ref: 'Venue' },
    showDate: Date,
    guarantee: Number,
    currency: { type: String, default: 'USD' },
    billingType: String,
    ageRestriction: String,
    doorsTime: String,
    setTime: String,
    curfew: String,
    capacity: Number,
    merchRate: Number,
    compsTotal: Number,
    nearestAirport: String,
    radiusMiles: Number,
    radiusUntilDate: Date,
    radiusViolationPenalty: String,
    announcementDate: Date,
    marketingObligations: [{ type: String }],
    offerValidUntil: Date,
    ticketScaling: {
      min: Number,
      max: Number
    },
    wireInfo: {
      bankName: String,
      accountNumber: String,
      routingNumber: String,
      swift: String
    },
    sourceEmailId: { type: Types.ObjectId, ref: 'RawMessage' },
    confidence: { type: Number, min: 0, max: 1 },
    needsReview: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const Show = models.Show || model('Show', ShowSchema);
