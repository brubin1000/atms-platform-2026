export type ShowStatus =
  | 'inquiry'
  | 'hold'
  | 'offer'
  | 'confirmed'
  | 'advancing'
  | 'day-of'
  | 'settled';

export type ParsedField<T> = {
  value: T;
  confidence: number;
};

export interface Show {
  _id?: string;
  title: string;
  status: ShowStatus;
  artistId?: string;
  venueId?: string;
  showDate?: string;
  guarantee?: number;
  currency?: string;
  billingType?: string;
  ageRestriction?: string;
  doorsTime?: string;
  setTime?: string;
  curfew?: string;
  capacity?: number;
  merchRate?: number;
  compsTotal?: number;
  nearestAirport?: string;
  radiusMiles?: number;
  radiusUntilDate?: string;
  radiusViolationPenalty?: string;
  announcementDate?: string;
  marketingObligations?: string[];
  offerValidUntil?: string;
  ticketScaling?: { min?: number; max?: number };
  wireInfo?: { bankName?: string; accountNumber?: string; routingNumber?: string; swift?: string };
  sourceEmailId?: string;
  confidence?: number;
  needsReview?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Artist {
  _id?: string;
  name: string;
  email?: string;
  phone?: string;
  dosName?: string;
  dosPhone?: string;
  dosEmail?: string;
  ldName?: string;
  ldPhone?: string;
  laserAccess?: boolean;
  travelingWithLD?: boolean;
  soundcheckRequired?: boolean;
  fohCableNotes?: string;
  recordingWaiverUrl?: string;
  tourPartySize?: number;
  governmentIdUrl?: string;
  backline?: { cdjModel?: string; mixerModel?: string; quantity?: number; notes?: string };
  techRider?: { url?: string; filename?: string };
  hospoRider?: { url?: string; filename?: string };
  stageplot?: { url?: string };
  nearestAirport?: string;
  radiusMiles?: number;
  radiusViolationPenalty?: string;
  announcementDate?: string;
  marketingObligations?: string[];
  agentName?: string;
  agentEmail?: string;
  managerName?: string;
  managerEmail?: string;
  teamId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Venue {
  _id?: string;
  name: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  capacity?: number;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  website?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface RawMessage {
  _id?: string;
  subject?: string;
  from?: string;
  to?: string;
  body?: string;
  bodyHtml?: string;
  headers?: Record<string, unknown>;
  attachments?: Array<{ filename?: string; contentType?: string; url?: string }>;
  source: 'gmail' | 'forwarded' | 'api' | 'csv' | 'pdf';
  processedAt?: string;
  status: 'pending' | 'processing' | 'parsed' | 'failed' | 'review';
  confidence?: number;
  parsedShowId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ParsedMessage {
  _id?: string;
  rawMessageId: string;
  fields: Record<string, ParsedField<unknown>>;
  overallConfidence?: number;
  needsReview?: boolean;
  reviewedBy?: string;
  reviewedAt?: string;
  humanCorrections?: Record<string, unknown>;
  trainingDataExported?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Payment {
  _id?: string;
  showId: string;
  artistId?: string;
  type: 'incoming' | 'outgoing';
  status: 'scheduled' | 'pending' | 'paid' | 'overdue';
  amount: number;
  currency?: string;
  deadline?: string;
  paidAt?: string;
  note?: string;
  stripePaymentLinkId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Contact {
  _id?: string;
  name: string;
  email?: string;
  phone?: string;
  role: 'promoter' | 'booker' | 'agent' | 'manager' | 'venue' | 'other';
  company?: string;
  reliabilityScore?: number;
  showsWorked?: string[];
  teamId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdvanceForm {
  _id?: string;
  showId: string;
  artistId?: string;
  status: 'draft' | 'in_review' | 'approved' | 'submitted';
  completionPercent?: number;
  shareToken?: string;
  artistName?: string;
  billingName?: string;
  doorsTime?: string;
  setTime?: string;
  setLength?: string;
  soundcheckTime?: string;
  loadInTime?: string;
  curfew?: string;
  venueAddress?: string;
  venueName?: string;
  venueContactName?: string;
  venueContactPhone?: string;
  venueCurfew?: string;
  greenRoomDetails?: string;
  hospitalityDetails?: string;
  tourPartySize?: number;
  tourPartyNames?: string[];
  ldName?: string;
  ldPhone?: string;
  laserAccess?: boolean;
  travelingWithLD?: boolean;
  backlineDetails?: string;
  fohCableNotes?: string;
  soundcheckRequired?: boolean;
  techRiderUrl?: string;
  hospoRiderUrl?: string;
  stageplotUrl?: string;
  recordingWaiverUrl?: string;
  groundTransport?: Array<{
    legNumber?: number;
    type?: 'car' | 'van' | 'sprinter' | 'bus' | 'other';
    from?: string;
    to?: string;
    pickupTime?: string;
    dropoffTime?: string;
    notes?: string;
  }>;
  flights?: Array<{
    legNumber?: number;
    airline?: string;
    flightNumber?: string;
    from?: string;
    to?: string;
    departureTime?: string;
    arrivalTime?: string;
    confirmationNumber?: string;
  }>;
  hotelName?: string;
  hotelAddress?: string;
  hotelPhone?: string;
  hotelCheckIn?: string;
  hotelCheckOut?: string;
  hotelConfirmation?: string;
  guestList?: { spots?: number; submissionEmail?: string; deadline?: string };
  visaRequired?: boolean;
  coiRequired?: boolean;
  passportRequired?: boolean;
  runOfShow?: string;
  guarantee?: number;
  depositSchedule?: Array<{ dueDate?: string; amount?: number; status?: string; note?: string }>;
  wireInfo?: { bankName?: string; accountNumber?: string; routingNumber?: string; swift?: string };
  createdAt?: string;
  updatedAt?: string;
}

export interface GeminiParseResult {
  artist: ParsedField<string | null>;
  venue: ParsedField<string | null>;
  showDate: ParsedField<string | null>;
  guarantee: ParsedField<number | null>;
  setTime: ParsedField<string | null>;
  doorsTime: ParsedField<string | null>;
  loadInTime: ParsedField<string | null>;
  soundcheckTime: ParsedField<string | null>;
  curfew: ParsedField<string | null>;
  deposit: ParsedField<Array<{ dueDate: string | null; amount: number | null; note?: string }>>;
  promoterName: ParsedField<string | null>;
  promoterEmail: ParsedField<string | null>;
  hotel: ParsedField<string | null>;
  groundTransport: ParsedField<Array<{ from: string; to: string; pickupTime?: string; type?: string }>>;
  guestListSpots: ParsedField<number | null>;
  backline: ParsedField<string | null>;
  documentType: ParsedField<'offer' | 'advance' | 'deal_memo' | 'run_of_show' | 'contract' | 'unknown'>;
  overallConfidence: number;
}
