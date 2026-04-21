import { Schema, model, models, Types } from 'mongoose';

const RawMessageSchema = new Schema(
  {
    subject: String,
    from: String,
    to: String,
    body: String,
    bodyHtml: String,
    headers: Schema.Types.Mixed,
    attachments: [
      {
        filename: String,
        contentType: String,
        url: String
      }
    ],
    source: {
      type: String,
      enum: ['gmail', 'forwarded', 'api', 'csv', 'pdf'],
      default: 'api'
    },
    processedAt: Date,
    status: {
      type: String,
      enum: ['pending', 'processing', 'parsed', 'failed', 'review'],
      default: 'pending'
    },
    confidence: Number,
    parsedShowId: { type: Types.ObjectId, ref: 'Show' }
  },
  { timestamps: true }
);

export const RawMessage = models.RawMessage || model('RawMessage', RawMessageSchema);
