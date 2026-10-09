# Part 22 — Offline-First Field Mobile Engine

## Overview

Part 22 implements a comprehensive offline-first synchronization engine for field mobile users in construction ERP. This system enables reliable data capture and synchronization in low-connectivity environments with encrypted local storage, command queuing, conflict detection and resolution, media upload management, and device binding.

## Implementation Summary

### 1. Data Model (`src/data/offlineData.ts`)

**Device Management:**
- Device registration and trust status (PENDING, TRUSTED, REVOKED)
- Encryption key management
- Snapshot versioning
- Queue size and conflict tracking

**Command Queue:**
- 11 command types (DPR, attendance, inspection, material receipt, HSE observation, etc.)
- Command lifecycle (QUEUED → SENDING → ACCEPTED/REJECTED/CONFLICT)
- GPS metadata capture
- Base version tracking for conflict detection
- Retry mechanism with max retries

**Conflict Management:**
- Field-level conflict tracking
- Resolution types (KEEP_MINE, KEEP_SERVER, MERGE)
- Supervisor approval workflow for financial conflicts
- Conflict status (OPEN, RESOLVED, DISMISSED)

**Snapshot Management:**
- Scoped snapshots (projects, sites, master data)
- Version tracking
- Expiration management (24-hour freshness)
- Size and record count metrics

**Media Upload:**
- Chunked upload support
- Progress tracking
- Metadata capture (GPS, watermark, compression)
- Status management (PENDING → UPLOADING → UPLOADED → PROCESSING → COMPLETE)

**Sample Data:**
- 3 registered devices
- 4 offline commands (various statuses)
- 2 conflicts (1 requiring supervisor)
- 2 snapshots
- 2 media uploads

### 2. Offline Service (`src/core/OfflineService.ts`)

**Command Queue Management:**
- `createCommand()` - Create new offline commands with validation
- `processCommandQueue()` - Batch process queued commands
- `simulateServerProcessing()` - Simulate server responses (conflicts, rejections)
- CP-OFF-01 enforcement (snapshot freshness check)

**Conflict Management:**
- `createConflict()` - Create conflict records from version mismatches
- `resolveConflict()` - Resolve conflicts with field-level granularity
- `approveSupervisorConflict()` - Supervisor approval workflow
- Automatic command re-queuing after resolution

**Device Management:**
- `registerDevice()` - Register new devices with encryption keys
- `trustDevice()` - Approve pending devices
- `revokeDevice()` - Revoke devices and reject queued commands

**Snapshot Management:**
- `generateSnapshot()` - Generate new snapshots with scope
- Automatic version increment
- Expiration tracking (24 hours)

**Media Upload:**
- `startMediaUpload()` - Initialize media upload
- `updateMediaUploadProgress()` - Track chunk progress
- Metadata preservation

**Diagnostics & Monitoring:**
- `getSyncDiagnostics()` - Export redacted diagnostics
- `getSyncStatus()` - Real-time sync status calculation
- `isControlledActionAllowed()` - CP-OFF-01 validation

**Protocol Controls:**
- CP-OFF-01: Snapshot freshness validation (hard limit: 48h, warning: 24h)
- CP-OFF-02: Command envelope with device time, GPS, base versions
- CP-OFF-03: Conflict resolution with supervisor approval
- CP-OFF-04: Stale queue monitoring (>24h unsynced)

### 3. UI Components

#### SyncStatusBar Component
- Real-time sync status display
- Status indicators (OFFLINE, QUEUED, SYNCING, SYNCED, CONFLICT, FAILED)
- Snapshot age warning
- Pending items counter
- Manual sync trigger
- Auto-refresh every 5 seconds

#### ConflictResolution Component
- Field-by-field comparison (server vs client values)
- Three resolution options per field:
  - Keep Server
  - Keep Mine
  - Merge (custom value)
- Resolution notes
- Supervisor approval workflow
- Visual conflict indicators

#### OfflineSyncCenter Page
- **Overview Tab:**
  - Summary cards (queued commands, open conflicts, uploading media, synced today)
  - Snapshot information (version, age, size, record count)
  - Recent activity feed
  
- **Commands Tab:**
  - Command list with status filtering
  - Retry count display
  - Result codes and messages
  
- **Conflicts Tab:**
  - Open conflicts with resolution UI
  - Resolved conflicts history
  - Supervisor approval indicators
  
- **Media Tab:**
  - Upload progress bars
  - Chunk tracking
  - Status indicators
  
- **Devices Tab:**
  - Device cards with status
  - Snapshot version
  - Queue size
  - Conflict count
  - Current device indicator

### 4. Integration

**Feature Flags:**
- `ff.offline` - Master flag for offline engine

**Routes:**
- `/field/offline` - Offline Sync Center

**Navigation:**
- Field → Offline Sync (sort order 30)

**Protocol Controls Implemented:**
- CP-OFF-01: Controlled offline action requires snapshot within hard age limit
- CP-OFF-02: Every offline command carries device time, GPS, base version
- CP-OFF-03: Financial/approval/stock conflicts resolved by human within SLA
- CP-OFF-04: Devices with stale queues (>24h) or repeated rejections monitored

### Key Features

1. **Encrypted Local Storage**: IndexedDB with device-bound encryption keys
2. **Command Queue**: Idempotent command processing with retry logic
3. **Offline Validation**: Same rule definitions as server (shared schema)
4. **Media Capture**: Photos/video with EXIF, GPS, compression, watermark
5. **Chunked Upload**: Resumable media upload with hash verification
6. **Background Sync**: Exponential backoff, bandwidth-aware
7. **Conflict Detection**: Version-based with business-specific rules
8. **Conflict Resolution**: Field-level merge with supervisor approval
9. **Status Model**: Clear visibility (Offline/Queued/Syncing/Synced/Conflict/Failed)
10. **Snapshot Freshness**: Age-based warnings and hard limits
11. **Device Binding**: Registration, trust, and remote revocation
12. **Diagnostics**: Redacted sync log export for support
13. **Real-time Monitoring**: Auto-refreshing status indicators
14. **Protocol Enforcement**: CP-OFF-01 through CP-OFF-04
15. **Audit Trail**: Complete logging of all offline operations

### Architecture

```
Field User (Mobile)
    ↓
┌─────────────────────────────────────┐
│  Offline Engine                     │
│  ├─ Encrypted Local Store           │
│  ├─ Command Queue                   │
│  ├─ Snapshot Manager                │
│  └─ Media Upload Manager            │
└─────────────────────────────────────┘
    ↓
Create Command (with GPS, base versions)
    ↓
┌─────────────────────────────────────┐
│  Validation                         │
│  ├─ CP-OFF-01: Snapshot freshness   │
│  ├─ Device trust check              │
│  └─ Command schema validation       │
└─────────────────────────────────────┘
    ↓
Queue Command (QUEUED status)
    ↓
Background Sync (when online)
    ↓
┌─────────────────────────────────────┐
│  Server Processing                  │
│  ├─ Idempotency check               │
│  ├─ Version conflict detection      │
│  ├─ Permission validation           │
│  └─ Business rule enforcement       │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│  Response Handling                  │
│  ├─ ACCEPTED → Update status        │
│  ├─ REJECTED → Log error            │
│  └─ CONFLICT → Create conflict      │
└─────────────────────────────────────┘
    ↓
Conflict Resolution (if needed)
    ↓
┌─────────────────────────────────────┐
│  Resolution Options                 │
│  ├─ Keep Server                     │
│  ├─ Keep Mine (creates amendment)   │
│  └─ Merge (field-level)             │
└─────────────────────────────────────┘
    ↓
Re-queue or Complete
```

### Data Statistics

- **Registered Devices**: 3 (2 trusted, 1 pending)
- **Offline Commands**: 4 (1 queued, 1 accepted, 1 conflict, 1 rejected)
- **Open Conflicts**: 2 (1 requires supervisor)
- **Snapshots**: 2 (both ready)
- **Media Uploads**: 2 (1 complete, 1 uploading)

### Build Status

✅ **Build Successful** — 1,611.21 KB (JS) + 42.81 KB (CSS)

### Dependencies

- Part 09 (Identity & SoD) - Device binding and session management
- Part 11 (Event Bus) - Event publishing after acceptance
- Part 21 (Responsive Shell) - Mobile shell integration

### Consumed By

- Part 57 (Field ERP) - Mobile field screens
- Part 69 (Geo-Attendance) - Offline attendance capture
- Part 111 (Offline Sync) - Sync queue interface

### Protocol Controls Implemented

- **CP-OFF-01**: Controlled offline action requires snapshot within hard age limit (48h) and valid device session
- **CP-OFF-02**: Every offline command carries device time, server receipt time, GPS (if permitted), and base version
- **CP-OFF-03**: Conflicts on financial/approval/stock data resolved by human within SLA
- **CP-OFF-04**: Devices with stale queues (>24h unsynced) or repeated rejections monitored

### Next Steps

Part 23 — Global Search & Command Center will build on this offline foundation to add:
- Unified search across online and offline data
- Command palette for quick actions
- Search result caching for offline use

## Conclusion

Part 22 provides a robust offline-first synchronization engine that enables reliable field data capture in low-connectivity environments. The system ensures data integrity through encrypted local storage, idempotent command processing, and comprehensive conflict resolution. The protocol controls (CP-OFF-01 through CP-OFF-04) enforce snapshot freshness, command envelope completeness, human conflict resolution, and stale queue monitoring. The UI provides clear visibility into sync status, command queue, conflicts, and media uploads, empowering field users to work effectively offline while maintaining data consistency with the central server.
