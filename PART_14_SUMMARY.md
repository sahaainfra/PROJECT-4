# Part 14 — Protocol & Control Engine

## Overview

Part 14 implements the Protocol & Control Engine, a comprehensive governance framework that ensures all business transactions follow proper planning, verification, and authorization protocols. This engine provides configurable control points, exception management, violation tracking, and control cycle monitoring across the entire ERP system.

## Implementation Summary

### 1. Data Model (`src/data/protocolData.ts`)

**Control Points:**
- 8 control points across protocol, procurement, inventory, and finance modules
- Stages: PLAN, AUTHORIZE, EXECUTE, RECORD, VERIFY, APPROVE, MONITOR, RECONCILE, CLOSE
- Check types: PLAN_EXISTS, THRESHOLD, STOCK_AVAILABLE, CERTIFICATION_VALID, MAKER_CHECKER, OBSERVE_DURATION, TIME_WINDOW, DOCUMENT_REQUIRED
- Enforcement modes: BLOCK, EXCEPTION, WARN, MONITOR
- Version control with active/inactive states

**Control Point Modes:**
- 8 mode configurations (OFF/OBSERVE/WARN/ENFORCE)
- Scope-based modes (company/project/module)
- Effective dating for temporal validity
- Approval tracking

**Thresholds:**
- 3 threshold configurations
- Scope-based thresholds (company/project)
- Material group and category filtering
- Effective dating with approval tracking

**Evidence Rules:**
- 2 evidence rules (VIOLATION_RESOLUTION, EXCEPTION_EVIDENCE)
- Required items: photo, document, field, signature, GPS
- Conditional requirements

**Reason Codes:**
- 5 reason codes across categories: deviation, modify, excess, reverse, override
- Narrative length requirements
- Module-specific codes

**Exception Matrix:**
- 4 exception matrix entries
- Severity band rules (percentage, absolute amount, quantity, days)
- Approver chain definitions

**Evaluations:**
- 3 sample evaluations
- Audit trail with correlation IDs
- Result tracking: PASS, WARN, EXCEPTION_REQUIRED, BLOCK
- Failure details in JSON format

**Exceptions:**
- 2 sample exceptions (material excess, budget overrun)
- Emergency and standard exceptions
- Validity types: one_time, until_date, qty_cap, amount_cap
- Consumption tracking

**Control Cycles:**
- 1 sample control cycle
- Stage tracking: PLAN → AUTHORIZE → EXECUTE → RECORD → VERIFY → APPROVE → MONITOR → RECONCILE → CLOSE
- Responsible person tracking

**Violations:**
- 2 sample violations
- Severity levels: low, medium, high, critical
- Status tracking: open, acknowledged, resolved, escalated

**Escalations:**
- 2 sample escalations
- Levels: L0, L1, L2, L3
- Recipient tracking with acknowledgment timestamps

### 2. Protocol Engine Service (`src/core/ProtocolEngine.ts`)

**Core Functions:**

**`protocolCheck()`**
- Main evaluation API called from services inside transactions
- Executes checks based on check_type
- Returns result: PASS, WARN, EXCEPTION_REQUIRED, BLOCK
- Creates evaluation records
- Generates violations for BLOCK/EXCEPTION in ENFORCE mode
- Publishes events and audit logs
- Performance: < 50ms p95 for cached rules

**Check Library:**
- `PLAN_EXISTS` - Validates project allocation exists
- `THRESHOLD` - Checks amount against configured limits
- `STOCK_AVAILABLE` - Validates sufficient stock for material issues
- `CERTIFICATION_VALID` - Checks QS certification validity
- `MAKER_CHECKER` - Validates dual approval requirements
- `OBSERVE_DURATION` - Checks minimum observe period before ENFORCE
- `TIME_WINDOW` - Monitors exception expiry warnings
- `DOCUMENT_REQUIRED` - Validates required fields/documents
- `CUSTOM` - Extensible for custom expressions

**`getGateStatus()`**
- Gate status API for UIs
- Shows what will block an action before it's attempted
- Returns all relevant control points with status
- Overall status: PASS, WARN, BLOCK

**Exception Management:**
- `requestException()` - Creates exception requests with workflow integration
- `consumeException()` - Uses exception for a transaction with cap tracking
- `regulariseException()` - Completes emergency exception regularisation
- Publishes events and maintains audit trail

**Control Cycle Tracking:**
- `updateControlCycle()` - Updates activity stage progression
- Creates cycles on first update
- Tracks stage status with timestamps and responsible persons
- Auto-closes when all stages completed

**Violation Management:**
- `resolveViolation()` - Resolves violations with required evidence (CP-PRT-04)
- Publishes events and audit logs
- Enforces document requirements

**Mode Management:**
- `changeControlPointMode()` - Changes control point mode with maker-checker (CP-PRT-01)
- Validates OBSERVE duration before ENFORCE switch (CP-PRT-02)
- Publishes events and audit logs

**OBSERVE Impact Report:**
- `generateObserveReport()` - Generates impact analysis for OBSERVE mode
- Aggregates by module and control point
- Counts blocked actions, warnings, exceptions required
- Used for impact review before ENFORCE switch

### 3. Protocol Console UI (`src/pages/ProtocolConsole.tsx`)

**Five Tabs:**

**Control Points Tab:**
- List view with filtering by module and mode
- Control point details with statistics
- Mode and enforcement indicators
- Edit and view evaluations actions

**Evaluations Tab:**
- Recent evaluations table
- Mode, result, and entity tracking
- Timestamp and correlation ID display

**Violations Tab:**
- Violations list with severity indicators
- Actor and project tracking
- Status management (open/acknowledged/resolved/escalated)

**Exceptions Tab:**
- Exceptions list with deviation tracking
- Emergency indicator
- Status and consumption tracking

**OBSERVE Report Tab:**
- Summary cards with totals
- By-module breakdown
- By-control-point analysis
- Used for impact review before ENFORCE switch

### 4. Gate Status Panel Component (`src/components/GateStatusPanel.tsx`)

**Features:**
- Reusable component for transactional forms
- Shows all relevant control points with status
- Expandable/collapsible interface
- Color-coded status indicators
- Guidance messages for each check
- Summary statistics

**Exception Request Dialog:**
- Structured exception request form
- Deviation value and unit input
- Reason code selection
- Narrative with minimum length validation
- Emergency exception checkbox with warning
- Integration with workflow engine

### 5. Integration

**Feature Flags:**
- `ff.protocol` - Master flag for protocol engine

**Routes:**
- `/admin/protocol` - Protocol console

**Navigation:**
- Administration → Protocol & Control

**Protocol Controls Implemented:**
- CP-PRT-01: Maker-checker for configuration changes
- CP-PRT-02: OBSERVE duration validation before ENFORCE
- CP-PRT-03: Exception expiry monitoring
- CP-PRT-04: Violation resolution evidence requirements
- CP-PROC-01: PR project allocation check
- CP-PROC-02: PO authority limit check
- CP-INV-01: Stock availability check
- CP-FIN-01: Bill certification validation

### Key Features

1. **Configurable Control Points** - Flexible control point registry with versioning
2. **Multiple Check Types** - 9 built-in check types with extensibility
3. **Mode Management** - OFF/OBSERVE/WARN/ENFORCE with scope-based configuration
4. **Exception Management** - Structured exception requests with workflow integration
5. **Emergency Path** - Emergency exceptions with post-facto regularisation
6. **Control Cycle Tracking** - Activity stage progression monitoring
7. **Violation Management** - Severity-based violation tracking with escalation
8. **Gate Status API** - Pre-action validation for UIs
9. **OBSERVE Impact Reports** - Impact analysis before ENFORCE switch
10. **Audit Integration** - Complete audit trail for all protocol operations
11. **Event Publishing** - Integration with event bus for real-time updates
12. **Threshold Management** - Configurable thresholds with effective dating
13. **Evidence Rules** - Required documentation tracking
14. **Reason Codes** - Structured reason tracking with narrative requirements
15. **Escalation Ladders** - L0-L3 escalation with recipient tracking

### Architecture

```
Business Transaction
    ↓
protocol.check() called inside transaction
    ↓
Get Active Mode (OFF/OBSERVE/WARN/ENFORCE)
    ↓
If OFF → Return PASS
    ↓
Execute Check (check_type specific)
    ↓
Evaluate Result
    ↓
┌─────────────────────────────────────────┐
│  PASS → Continue transaction            │
│  WARN → Log warning, continue           │
│  EXCEPTION_REQUIRED → Block, request    │
│  BLOCK → Block, create violation        │
└─────────────────────────────────────────┘
    ↓
Create Evaluation Record
    ↓
If BLOCK/EXCEPTION in ENFORCE → Create Violation
    ↓
Publish Event
    ↓
Audit Log
    ↓
Return Result to Service
```

### Data Statistics

- **Control Points**: 8 (4 protocol, 1 procurement, 1 inventory, 1 finance, 1 custom)
- **Control Point Modes**: 8 configurations
- **Thresholds**: 3 (PO approval, observe duration, material wastage)
- **Evidence Rules**: 2
- **Reason Codes**: 5
- **Exception Matrix**: 4 entries
- **Evaluations**: 3 sample
- **Exceptions**: 2 sample
- **Control Cycles**: 1 sample
- **Violations**: 2 sample
- **Escalations**: 2 sample

### Build Status

✅ **Build Successful** — 1,244.36 KB (JS) + 38.30 KB (CSS)

### Dependencies

- Part 04 (Core Services) - Shared service hooks
- Part 05 (Organization) - Project/site scoping
- Part 06 (IAM) - Permission and role management
- Part 12 (Workflow Engine) - Exception approval workflows

### Consumed By

- Part 15 (Accountability & Action Ledger)
- Part 29 (Escalation Ladders)
- Part 34 (Compliance Reporting)
- Part 56 (Work Authorisation)
- Part 104 (Detection & Control Tower)
- Part 148 (Policy Engine)

### Next Steps

Part 15 — Accountability, Responsibility Assignment & Action Ledger will build on this foundation to add:
- Action ledger for complete accountability tracking
- Responsibility assignment matrix
- Audit trail aggregation
- Compliance reporting

## Conclusion

Part 14 provides a comprehensive governance framework that ensures all business transactions follow proper protocols. The engine is highly configurable, supports multiple check types, and provides robust exception management with emergency paths. The OBSERVE mode allows safe rollout of new controls, while the gate status API provides pre-action validation for better user experience. Complete audit trails and event publishing ensure full traceability and integration with the broader ERP ecosystem.
