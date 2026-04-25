import { Schema, model, models, Types } from 'mongoose';

const ParsedMessageSchema = new Schema(
  {
    rawMessageId: { type: Types.ObjectId, ref: 'RawMessage', required: true },
    fields: Schema.Types.Mixed,
    overallConfidence: Number,
    needsReview: { type: Boolean, default: false },
    reviewedBy: String,
    reviewedAt: Date,
    humanCorrections: Schema.Types.Mixed,
    trainingDataExported: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const ParsedMessage = models.ParsedMessage || model('ParsedMessage', ParsedMessageSchema);
