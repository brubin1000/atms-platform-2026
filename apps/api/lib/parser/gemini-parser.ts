import crypto from 'crypto';
import { GoogleGenerativeAI } from '@google/generative-ai';

export type ParsedField<T> = {
  value: T;
  confidence: number;
};

export type ParsedResult = {
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
};

export const MUSIC_INDUSTRY_KEYWORDS = [
  'advance',
  'set time',
  'load in',
  'sound check',
  'soundcheck',
  'hospitality',
  'tech rider',
  'guest list',
  'green room',
  'guarantee',
  'offer',
  'deal memo',
  'contract',
  'doors',
  'curfew',
  'backline',
  'radius clause',
  'flight',
  'hotel'
];

const FIFO_CACHE_LIMIT = 500;
const parseCache = new Map<string, ParsedResult>();

const fallbackResult: ParsedResult = {
  artist: { value: null, confidence: 0 },
  venue: { value: null, confidence: 0 },
  showDate: { value: null, confidence: 0 },
  guarantee: { value: null, confidence: 0 },
  setTime: { value: null, confidence: 0 },
  doorsTime: { value: null, confidence: 0 },
  loadInTime: { value: null, confidence: 0 },
  soundcheckTime: { value: null, confidence: 0 },
  curfew: { value: null, confidence: 0 },
  deposit: { value: [], confidence: 0 },
  promoterName: { value: null, confidence: 0 },
  promoterEmail: { value: null, confidence: 0 },
  hotel: { value: null, confidence: 0 },
  groundTransport: { value: [], confidence: 0 },
  guestListSpots: { value: null, confidence: 0 },
  backline: { value: null, confidence: 0 },
  documentType: { value: 'unknown', confidence: 0 },
  overallConfidence: 0
};

const PROMPT = `You are an ATMS parser for music industry documents.
Extract fields and confidence values from text input.
Return strict JSON only with this structure:
{
  "artist": {"value": string|null, "confidence": number},
  "venue": {"value": string|null, "confidence": number},
  "showDate": {"value": string|null, "confidence": number},
  "guarantee": {"value": number|null, "confidence": number},
  "setTime": {"value": string|null, "confidence": number},
  "doorsTime": {"value": string|null, "confidence": number},
  "loadInTime": {"value": string|null, "confidence": number},
  "soundcheckTime": {"value": string|null, "confidence": number},
  "curfew": {"value": string|null, "confidence": number},
  "deposit": {"value": [{"dueDate": string|null, "amount": number|null, "note": string}], "confidence": number},
  "promoterName": {"value": string|null, "confidence": number},
  "promoterEmail": {"value": string|null, "confidence": number},
  "hotel": {"value": string|null, "confidence": number},
  "groundTransport": {"value": [{"from": string, "to": string, "pickupTime": string, "type": string}], "confidence": number},
  "guestListSpots": {"value": number|null, "confidence": number},
  "backline": {"value": string|null, "confidence": number},
  "documentType": {"value": "offer"|"advance"|"deal_memo"|"run_of_show"|"contract"|"unknown", "confidence": number},
  "overallConfidence": number
}
Confidence values must be in [0,1].`;

export function shouldParseWithAI(text: string): boolean {
  const normalized = text.toLowerCase();
  return MUSIC_INDUSTRY_KEYWORDS.some((keyword) => normalized.includes(keyword));
}

function hashText(text: string): string {
  return crypto.createHash('sha256').update(text).digest('hex');
}

function normalizeResult(candidate: Partial<ParsedResult>): ParsedResult {
  return {
    ...fallbackResult,
    ...candidate,
    overallConfidence: Number(candidate.overallConfidence ?? 0)
  } as ParsedResult;
}

function cacheSet(key: string, value: ParsedResult) {
  if (parseCache.size >= FIFO_CACHE_LIMIT) {
    const firstKey = parseCache.keys().next().value as string | undefined;
    if (firstKey) {
      parseCache.delete(firstKey);
    }
  }
  parseCache.set(key, value);
}

export async function parseEmailWithGemini(text: string): Promise<ParsedResult> {
  if (!text || !shouldParseWithAI(text)) {
    return fallbackResult;
  }

  const cacheKey = hashText(text);
  const cached = parseCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return fallbackResult;
  }

  const client = new GoogleGenerativeAI(apiKey);
  const model = client.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const response = await model.generateContent(`${PROMPT}\n\nINPUT:\n${text}`);

  try {
    const raw = response.response.text().trim();
    const parsed = normalizeResult(JSON.parse(raw));
    cacheSet(cacheKey, parsed);
    return parsed;
  } catch {
    return fallbackResult;
  }
}
