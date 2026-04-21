import { Schema, model, models } from 'mongoose';

const ArtistSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: String,
    phone: String,
    dosName: String,
    dosPhone: String,
    dosEmail: String,
    ldName: String,
    ldPhone: String,
    laserAccess: Boolean,
    travelingWithLD: Boolean,
    soundcheckRequired: Boolean,
    fohCableNotes: String,
    recordingWaiverUrl: String,
    tourPartySize: Number,
    governmentIdUrl: String,
    backline: {
      cdjModel: String,
      mixerModel: String,
      quantity: Number,
      notes: String
    },
    techRider: {
      url: String,
      filename: String
    },
    hospoRider: {
      url: String,
      filename: String
    },
    stageplot: {
      url: String
    },
    nearestAirport: String,
    radiusMiles: Number,
    radiusViolationPenalty: String,
    announcementDate: Date,
    marketingObligations: [{ type: String }],
    agentName: String,
    agentEmail: String,
    managerName: String,
    managerEmail: String,
    teamId: String
  },
  { timestamps: true }
);

export const Artist = models.Artist || model('Artist', ArtistSchema);
