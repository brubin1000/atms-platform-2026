# How to Connect the Chrome Extension to ATMS API

1. Add `API_BASE_URL` to `config/constants.js`: `const API_BASE_URL = 'https://atms-api.vercel.app'`.
2. Auth: use the Google OAuth token from Chrome identity API to authenticate — send as Bearer token in headers.
3. Replace Chrome storage profile save with:
   `fetch(API_BASE_URL + '/api/artists', { method: 'POST', body: JSON.stringify(profileData), headers: { 'Authorization': 'Bearer ' + token } })`
4. When Gemini parses an email in the extension, also forward to ATMS:
   `fetch(API_BASE_URL + '/api/ingest', { method: 'POST', body: JSON.stringify({ type: 'email', content: emailText }) })`
5. Load artist profile: `fetch(API_BASE_URL + '/api/artists/' + artistId)` instead of Chrome storage.
6. All data now syncs across devices and appears in the web dashboard.
