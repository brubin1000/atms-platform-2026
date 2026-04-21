# ATMS Architecture

## System Diagram

```text
[Email/PDF/CSV Input]
        |
        v
POST /api/ingest (Next.js App Router)
        |
        v
RawMessage (MongoDB)
        |
        v
BullMQ email-parse-queue (Redis)
        |
        v
Gemini parser (music-industry extraction)
        |
        v
ParsedMessage (per-field confidence)
        |
        +--> confidence >= 0.8 -> Show auto-create
        |
        +--> confidence < 0.8  -> needsReview queue
```

## Data Flow

1. Email/PDF/CSV arrives at `/api/ingest`
2. Payload is normalized and stored in `RawMessage`
3. Parse job is queued via BullMQ
4. Gemini parser extracts structured music-industry fields
5. `ParsedMessage` is written with per-field confidence
6. High confidence records can auto-create `Show`; low confidence records are flagged for human review

## Tech Stack

| Layer | Technology |
|---|---|
| API Framework | Next.js (App Router API routes) |
| Database | MongoDB + Mongoose |
| Queue | BullMQ + Redis |
| AI Parsing | Gemini (`@google/generative-ai`) |
| Email Notifications | Resend |
| Hosting Target | Vercel |
