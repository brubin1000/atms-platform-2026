import { Schema, model, models } from 'mongoose';

const VenueSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    address: String,
    city: String,
    state: String,
    country: String,
    capacity: Number,
    contactName: String,
    contactEmail: String,
    contactPhone: String,
    website: String
  },
  { timestamps: true }
);

export const Venue = models.Venue || model('Venue', VenueSchema);
