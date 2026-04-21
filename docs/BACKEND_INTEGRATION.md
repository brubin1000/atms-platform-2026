# How to Connect remix-of-tourlink-pro to ATMS API

1. Add env var `VITE_API_URL=https://atms-api.vercel.app` to remix-of-tourlink-pro.
2. Remove `@supabase/supabase-js` dependency (or keep for auth only temporarily).
3. Replace each Supabase query with a fetch call to the ATMS API:
   - `supabase.from('events').select()` → `fetch('/api/shows')`
   - `supabase.from('artists').select()` → `fetch('/api/artists')`
4. Auth: the ATMS API uses next-auth with Google OAuth — frontend should redirect to `VITE_API_URL/api/auth/signin`.
5. API response shapes match the TypeScript types in `packages/shared-types`.
6. For real-time updates: poll `/api/shows` every 30s (or add SSE endpoint in future PR).
