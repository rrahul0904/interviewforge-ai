# Data provenance policy

InterviewForge is a clean-room implementation. Do not scrape or republish a competitor's proprietary question bank, paywalled tutorials, copyrighted solutions or private community content.

Every ingested report should preserve:

- source type and canonical source URL
- retrieval timestamp
- author/submission identity only when permitted and necessary
- reported interview date when available
- company / role / stage claims
- extraction confidence
- copyright / license status
- moderation status
- raw-content retention policy
- canonical question mapping decision

## Ingestion states

`RECEIVED → EXTRACTED → DEDUPED → REVIEW_REQUIRED → APPROVED → PUBLISHED`

Potential NDA, confidential, personal, or copyrighted material should route to `REJECTED` or manual review rather than automatic publication.
