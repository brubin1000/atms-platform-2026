import { Schema, model, models, Types } from 'mongoose';

const ContactSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: String,
    phone: String,
    role: {
      type: String,
      enum: ['promoter', 'booker', 'agent', 'manager', 'venue', 'other'],
      default: 'other'
    },
    company: String,
    reliabilityScore: { type: Number, min: 0, max: 10 },
    showsWorked: [{ type: Types.ObjectId, ref: 'Show' }],
    teamId: String
  },
  { timestamps: true }
);

export const Contact = models.Contact || model('Contact', ContactSchema);
