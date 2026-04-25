import { Schema, model, models, Types } from 'mongoose';
import type { SHOW_STATUSES } from './Show';

type ShowStatus = (typeof SHOW_STATUSES)[number];

const ShowAuditLogSchema = new Schema(
  {
    showId: { type: Types.ObjectId, ref: 'Show', required: true, index: true },
    fromStatus: { type: String, required: true },
    toStatus: { type: String, required: true },
    actor: { type: String, required: true, default: 'system' },
    note: { type: String, default: null },
    timestamp: { type: Date, required: true, default: () => new Date() }
  },
  { timestamps: false }
);

export interface ShowAuditLogFields {
  showId: Types.ObjectId;
  fromStatus: ShowStatus;
  toStatus: ShowStatus;
  actor: string;
  note?: string | null;
  timestamp: Date;
}

export const ShowAuditLog =
  models.ShowAuditLog || model<ShowAuditLogFields>('ShowAuditLog', ShowAuditLogSchema);
