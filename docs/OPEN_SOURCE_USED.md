# Open Source Packages Used

| Package | GitHub | Replaces Custom Code | Why |
|---------|--------|---------------------|-----|
| `mailparser` | nodemailer/mailparser | Custom MIME parser | Battle-tested, handles all edge cases |
| `pdf-parse` | mozilla/pdf.js based | Custom PDF extractor | Handles encrypted/complex PDFs |
| `csv-parse` | adaltas/node-csv | Custom CSV parser | Handles all CSV dialects, streaming |
| `bullmq` | taskforcesh/bullmq | Custom job queue | Redis-backed, retry, concurrency built in |
| `ioredis` | luin/ioredis | Raw Redis client | Cluster support, reconnect logic |
| `mongoose` | Automattic/mongoose | Raw MongoDB driver | Schema validation, virtuals, hooks |
| `zod` | colinhacks/zod | Custom validation | TypeScript-first, composable |
| `next-auth` | nextauthjs/next-auth | Custom auth system | OAuth2, JWT, sessions built in |
| `resend` | resendlabs/resend | Custom email sender | Simple API, great deliverability |
| `date-fns` | date-fns/date-fns | Custom date utils | Immutable, tree-shakeable |
| `nanoid` | ai/nanoid | Custom ID generator | URL-safe, cryptographically secure |
