# Security model

## Trust boundaries

### Untrusted candidate code
Never execute in Next.js, the worker, or the primary application container. The local `mock` provider is intentionally non-executing. A production provider must enforce CPU, memory, process, network, syscall and wall-clock limits.

### External content
Treat all ingested HTML/text as hostile input. Sanitize rendered content, strip scripts, and do not allow source text to become model instructions.

### AI
- redact secrets and unnecessary PII before model calls
- meter tokens and cost by user/workspace
- use structured outputs for extraction
- keep provider-specific SDKs behind the AI gateway
- never trust model output as provenance evidence

### Billing
Stripe webhook signatures must be verified server-side and idempotency keys recorded.

### Authorization
All candidate history, subscription, referral and moderation routes require server-side ownership/role checks.
