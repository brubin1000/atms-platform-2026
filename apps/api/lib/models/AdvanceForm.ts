import { nanoid } from 'nanoid';
import { Schema, model, models, Types } from 'mongoose';

const AdvanceFormSchema = new Schema(
  {
    showId: { type: Types.ObjectId, ref: 'Show', required: true },
    artistId: { type: Types.ObjectId, ref: 'Artist' },
    status: {
      type: String,
      enum: ['draft', 'in_review', 'approved', 'submitted'],
      default: 'draft'
    },
    completionPercent: { type: Number, default: 0 },
    shareToken: { type: String, default: () => nanoid() },
    artistName: String,
    billingName: String,
    doorsTime: String,
    setTime: String,
    setLength: String,
    soundcheckTime: String,
    loadInTime: String,
    curfew: String,
    venueAddress: String,
    venueName: String,
    venueContactName: String,
    venueContactPhone: String,
    venueCurfew: String,
    greenRoomDetails: String,
    hospitalityDetails: String,
    tourPartySize: Number,
    tourPartyNames: [{ type: String }],
    ldName: String,
    ldPhone: String,
    laserAccess: Boolean,
    travelingWithLD: Boolean,
    backlineDetails: String,
    fohCableNotes: String,
    soundcheckRequired: Boolean,
    techRiderUrl: String,
    hospoRiderUrl: String,
    stageplotUrl: String,
    recordingWaiverUrl: String,
    groundTransport: [
      {
        legNumber: Number,
        type: { type: String, enum: ['car', 'van', 'sprinter', 'bus', 'other'] },
        from: String,
        to: String,
        pickupTime: Date,
        dropoffTime: Date,
        notes: String
      }
    ],
    flights: [
      {
        legNumber: Number,
        airline: String,
        flightNumber: String,
        from: String,
        to: String,
        departureTime: Date,
        arrivalTime: Date,
        confirmationNumber: String
      }
    ],
    hotelName: String,
    hotelAddress: String,
    hotelPhone: String,
    hotelCheckIn: Date,
    hotelCheckOut: Date,
    hotelConfirmation: String,
    guestList: {
      spots: Number,
      submissionEmail: String,
      deadline: Date
    },
    visaRequired: Boolean,
    coiRequired: Boolean,
    passportRequired: Boolean,
    runOfShow: String,
    guarantee: Number,
    depositSchedule: [
      {
        dueDate: Date,
        amount: Number,
        status: String,
        note: String
      }
    ],
    wireInfo: {
      bankName: String,
      accountNumber: String,
      routingNumber: String,
      swift: String
    }
  },
  { timestamps: true }
);

export const AdvanceForm = models.AdvanceForm || model('AdvanceForm', AdvanceFormSchema);
