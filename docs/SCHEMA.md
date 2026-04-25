# ATMS MongoDB Schema Reference

## Collections

### Show
7-state lifecycle object for each booking (`inquiry` → `settled`) including artist/venue refs, deal terms, scheduling, radius, marketing, and confidence metadata.

### Artist
Canonical artist advance profile with DOS contact, lighting, technical fields, backline, riders, logistics, and team assignments.

### Venue
Venue profile with location, capacity, and operational contact data.

### RawMessage
Raw ingest payload for email/PDF/CSV including headers/attachments/source, parse status, confidence, and parsed show link.

### ParsedMessage
Structured parse output with per-field confidence values, review metadata, human corrections, and training-export state.

### Payment
Incoming/outgoing payment tracker tied to shows/artists including status, deadline, paid date, and Stripe link references.

### Contact
Promoter/booker/agent/manager/venue contact records with reliability score and show history.

### AdvanceForm
60-field canonical advance checklist including schedule, venue, touring party, technical/riders, transport, flights, hotel, guest list, international requirements, run of show, and finance data.
