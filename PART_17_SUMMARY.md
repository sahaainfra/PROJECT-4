# Part 17 — Integration Architecture

## Overview

Part 17 implements a comprehensive integration architecture for the Construction ERP, providing a secure, auditable integration hub for external services. This module manages connectors for email, SMS, WhatsApp, banking, GST, maps, OCR, BI, AI, storage, biometric devices, and other ERP systems, with robust error handling, retry mechanisms, and dead letter queue management.

## Implementation Summary

### 1. Data Model (`src/data/integrationData.ts`)

**Integration Connectors:**
- 8 sample connectors across different types:
  - EMAIL_SENDGRID (SendGrid email service)
  - SMS_TWILIO (Twilio SMS with DLT compliance)
  - WHATSAPP_BUSINESS (Twilio WhatsApp Business)
  - BANK_HDFC (HDFC Bank payment integration)
  - GST_IRN (ClearTax GST e-invoice)
  - MAPS_GOOGLE (Google Maps geocoding)
  - OCR_AWS_TEXTRACT (AWS Textract OCR)
  - ERP_TALLY (Tally ERP 9 integration)
- Health status tracking (healthy/degraded/down)
- Secret references for secure credential storage
- Configuration JSON for non-sensitive settings

**Integration Endpoints:**
- 5 sample endpoints for various connectors
- Direction tracking (outbound/inbound)
- Authentication types (api_key, oauth2, basic, none)
- Rate limiting configuration

**Integration Messages:**
- 5 sample messages with redacted sensitive data
- Status tracking (pending/sent/delivered/failed)
- Retry attempt counting
- Correlation ID for tracing
- Entity linking for context

**Integration Webhooks:**
- 3 sample webhooks for event notifications
- HTTPS-only target URLs
- Secret references for signature verification
- Active/inactive status tracking
- Last triggered timestamp

**Integration API Clients:**
- 2 sample API clients for external system access
- Scope-based access control
- IP allowlist for security
- Rate limiting per client
- Expiration dates
- Key hashing for security

**Dead Letters:**
- 2 sample dead letter entries
- Failure reason tracking
- Resolution tracking with timestamp and user

**Sample Data:**
- 8 connectors
- 5 endpoints
- 5 messages
- 3 webhooks
- 2 API clients
- 2 dead letters

### 2. Integration Service (`src/core/IntegrationService.ts`)

**Connector Management:**
- `createConnector()` - Create new integration connectors with validation
- `updateConnector()` - Update connector configuration with audit logging
- `testConnector()` - Test connector connectivity with health status update

**Message Sending:**
- `sendMessage()` - Send messages through connectors with automatic retry
- `sendMessageWithRetry()` - Exponential backoff retry logic (max 3 attempts)
- `redactSensitiveData()` - Automatic redaction of sensitive fields (passwords, API keys, account numbers, etc.)
- Connector-specific redaction rules for email, SMS, bank data

**Dead Letter Queue:**
- `addToDeadLetterQueue()` - Automatically move failed messages to DLQ after max retries
- `replayDeadLetter()` - Replay failed messages with audit logging
- Resolution tracking with user and timestamp

**Webhook Management:**
- `createWebhook()` - Create webhooks with HTTPS validation
- `triggerWebhook()` - Trigger webhooks for events with active webhook filtering

**API Client Management:**
- `createApiClient()` - Create API clients with secure key generation and hashing
- `validateApiClient()` - Validate API credentials with IP allowlist and expiration checks
- Key hashing using btoa for browser compatibility

**Health Monitoring:**
- `getConnectorHealth()` - Get health status for all connectors with 24h statistics
- Message count and failure rate calculations
- Health status aggregation

**Statistics:**
- `getIntegrationStats()` - Comprehensive integration statistics
- Total/active/healthy connector counts
- 24h message volumes and failure rates
- Unresolved dead letter count
- Active webhooks and API clients

### 3. Integration Hub (`src/pages/IntegrationHub.tsx`)

**Features:**
- Dashboard with 4 summary cards (Total Connectors, Healthy, Messages 24h, Dead Letters)
- Connector grid view with health and status indicators
- Message count and failure rate per connector (24h)
- Test connection button with loading state
- Detail panel with connector configuration
- Secret reference display (redacted)
- Health and status badges with color coding
- Last checked timestamp

**UI Components:**
- IntegrationHub - Main dashboard with grid layout
- ConnectorDetail - Detailed connector view with configuration
- Health indicators with color-coded badges
- Status indicators (active/inactive/error)
- Test connection button with spinner

### 4. Message Log & DLQ (`src/pages/MessageLog.tsx`)

**Features:**
- Two tabs: Messages and Dead Letters
- Message list with filtering by connector, status, and search
- Correlation ID tracking
- Entity linking (type and ID)
- Status badges with color coding
- Attempt count with warning indicators
- Dead letter list with replay functionality
- Detail panels for both messages and dead letters
- Redacted request/response display

**UI Components:**
- MessageLog - Main component with tab switching
- MessageDetail - Detailed message view with redacted data
- DeadLetterDetail - Dead letter details with replay action
- Filter controls for connector and status
- Search functionality

### 5. API Clients & Webhooks (`src/pages/ApiClientsWebhooks.tsx`)

**Features:**
- Two tabs: API Clients and Webhooks
- API client list with scope badges
- Rate limit display
- IP allowlist management
- Status tracking (active/inactive)
- Last used timestamp
- Webhook list with event names
- Target URL display
- Secret reference display
- Created and last triggered timestamps
- Detail panels for both clients and webhooks
- Edit and delete actions

**UI Components:**
- ApiClientsWebhooks - Main component with tab switching
- ApiClientDetail - Detailed API client view with scopes and IP allowlist
- WebhookDetail - Detailed webhook view with target URL and secret
- Scope badges with count overflow
- Status indicators

### 6. Integration

**Feature Flags:**
- `ff.intg` - Master flag for integration architecture

**Routes:**
- `/admin/intg` - Integration Hub (connectors dashboard)
- `/admin/intg/messages` - Message Log & Dead Letter Queue
- `/admin/intg/api-clients` - API Clients & Webhooks Management

**Navigation:**
- Administration → Integrations
  - Integration Hub
  - Message Log
  - API Clients & Webhooks

**Protocol Controls:**
- CP-INT-01: Integration credential changes require maker-checker approval
- CP-INT-02: Failed bank/GST/e-invoice messages monitored via DLQ

### Key Features

1. **Multi-Provider Support** - Email (SendGrid), SMS (Twilio), WhatsApp, Banking (HDFC), GST (ClearTax), Maps (Google), OCR (AWS Textract), ERP (Tally)
2. **Secure Credential Management** - Secret references with vault integration, no secrets in logs or UI
3. **Automatic Data Redaction** - Sensitive fields automatically redacted in message logs
4. **Retry with Exponential Backoff** - Failed messages automatically retried with increasing delays
5. **Dead Letter Queue** - Failed messages after max retries moved to DLQ for manual intervention
6. **Health Monitoring** - Real-time health status for all connectors with 24h statistics
7. **Rate Limiting** - Per-connector and per-client rate limiting
8. **IP Allowlisting** - API client access restricted to approved IP addresses
9. **Scope-Based Access** - API clients with granular scope permissions
10. **Webhook Management** - Event-driven webhooks with signature verification
11. **HTTPS Enforcement** - Webhook URLs must use HTTPS
12. **Audit Trail** - Complete audit logging for all integration operations
13. **Correlation Tracking** - End-to-end correlation IDs for message tracing
14. **Entity Linking** - Messages linked to business entities for context
15. **Statistics Dashboard** - Comprehensive integration metrics and health overview

### Architecture

```
Business Event
    ↓
Integration Service
    ↓
┌─────────────────────────────────────┐
│  1. Get Connector Configuration     │
│  2. Redact Sensitive Data           │
│  3. Create Message Record           │
│  4. Attempt Delivery                │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│  Success?                           │
│  ├─ Yes → Mark as Delivered         │
│  └─ No  → Retry (max 3 attempts)    │
│           ├─ Success → Delivered     │
│           └─ Failed → Dead Letter    │
└─────────────────────────────────────┘
    ↓
Update Connector Health
    ↓
Publish Events
    ↓
Audit Log
```

### Data Statistics

- **Connectors**: 8 (email, SMS, WhatsApp, bank, GST, maps, OCR, ERP)
- **Endpoints**: 5 configured endpoints
- **Messages**: 5 sample messages (3 delivered, 1 sent, 1 failed)
- **Webhooks**: 3 configured webhooks
- **API Clients**: 2 configured clients
- **Dead Letters**: 2 (1 unresolved, 1 resolved)

### Build Status

✅ **Build Successful** — 1,384.84 KB (JS) + 39.66 KB (CSS)

### Dependencies

- Part 04 (Core Services) - Shared service hooks
- Part 07 (Audit) - Audit trail integration
- Part 16 (Notifications) - Notification delivery through integrations

### Consumed By

- Part 18 (API & Developer Platform)
- Part 30 (various modules)
- Part 32 (various modules)
- Part 90 (GST compliance)
- Part 112-114 (various modules)
- Part 143 (GST compliance)
- Part 146 (Admin console)

### Next Steps

Part 18 — API, Integration & Developer Platform will build on this integration foundation to add:
- Developer portal for API documentation
- API key management
- OAuth2 flows
- SDK generation
- API usage analytics

## Conclusion

Part 17 provides a robust, secure, and auditable integration architecture that enables the Construction ERP to connect with external services safely. The comprehensive connector framework, automatic data redaction, retry mechanisms, and dead letter queue ensure reliable message delivery even in failure scenarios. The health monitoring and statistics dashboard provide visibility into integration performance, while the secure credential management and audit trail ensure compliance and security. This foundation enables all future integrations to be built consistently and securely.
