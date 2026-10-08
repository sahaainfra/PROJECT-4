# Part 15 — Accountability, Responsibility Assignment & Action Ledger

## Overview

Part 15 implements a comprehensive accountability framework that ensures every user action is tracked, every responsibility is assigned, and every transaction has a complete audit trail. This module provides RACI matrix management, action ledger recording, compliance scoring, and responsibility tracking across the entire ERP system.

## Implementation Summary

### 1. Data Model (`src/data/accountabilityData.ts`)

**Action Ledger:**
- Append-only ledger recording all lifecycle actions
- Links to audit entries, workflow tasks, and protocol evaluations
- Captures actor, role, device, location (GPS), reason codes, and narrative
- Supports 16 action types: CREATED, SUBMITTED, VERIFIED, REVIEWED, APPROVED, REJECTED, RETURNED, MODIFIED, EXECUTED, RECORDED, RECONCILED, CLOSED, CANCELLED, REVERSED, EXCEPTION_REQUESTED, EXCEPTION_APPROVED

**RACI Assignments:**
- Responsible, Accountable, Consulted, Informed role assignments
- Scope-based: company, department, project, site, WBS node, process
- Effective dating with from/to periods
- Status workflow: DRAFT → APPROVED → EFFECTIVE → EXPIRED
- Supports independent accountability requirements

**Process Catalogue:**
- Defines all processes requiring RACI assignments
- Flags for requires_raci and requires_independent_accountability
- Module-based organization

**Compliance Scores:**
- Multi-component scoring system (5 components)
- Weighted average calculation
- Appeal workflow with review process
- Period-based tracking (monthly)

**Responsibility Items:**
- Unified view of all user responsibilities across modules
- Types: task, approval, exception, violation, overdue_record
- Priority levels: low, medium, high, critical
- Status tracking: pending, in_progress, overdue, completed

**Sample Data:**
- 5 action ledger entries
- 4 RACI assignments
- 6 process catalogue entries
- 4 compliance scores
- 5 responsibility items

### 2. Accountability Service (`src/core/AccountabilityService.ts`)

**Action Ledger Writer:**
- `writeActionLedger()` - Records all lifecycle actions
- Integrates with audit service and event bus
- Maintains append-only integrity
- Publishes `acc.action.recorded` events

**RACI Management:**
- `createRaciAssignment()` - Creates new RACI assignments with validation
- `approveRaciAssignment()` - Activates RACI assignments (CP-ACC-02)
- `checkRaciAssignment()` - Validates RACI exists for process (CP-ACC-01)
- Enforces independent accountability requirements
- Publishes `acc.raci.changed` events

**Compliance Score Engine:**
- `calculateComplianceScore()` - Calculates weighted compliance scores
- `appealComplianceScore()` - Submits score appeals
- `reviewComplianceAppeal()` - Reviews and decides on appeals
- 5 components: on_time_completion, protocol_compliance, documentation_quality, exception_rate, violation_count
- Weighted average: 25% + 25% + 20% + 15% + 15%
- Publishes `acc.score.updated` events

**Responsibility Tracking:**
- `getUserResponsibilities()` - Gets all responsibilities for a user
- `getUserOverdueItems()` - Gets overdue items
- `checkOverdueResponsibilities()` - Checks for overdue items (CP-ACC-04)
- Publishes `acc.responsibility.overdue` events

**Protocol Integration:**
- `checkRaciBeforeExecution()` - Validates RACI before execution (CP-ACC-01)
- Integrates with Part 14 protocol engine
- Returns allowed/blocked with guidance

**Handover Management:**
- `checkOpenResponsibilities()` - Checks for open responsibilities (CP-ACC-03)
- `reassignResponsibilities()` - Reassigns during handover
- Blocks exit clearance if open responsibilities exist

**Reporting:**
- `generateAccountabilityReport()` - Generates user accountability report
- `generateRaciGapReport()` - Identifies missing RACI assignments

### 3. RACI Matrix Editor (`src/pages/RaciMatrixEditor.tsx`)

**Features:**
- Scope selector (project/department)
- Matrix view: processes × RACI roles
- Color-coded RACI indicators (R=blue, A=red, C=info, I=muted)
- Gap detection and reporting
- Assignment dialog with validation
- Independent accountability enforcement
- Export capability

**UI Components:**
- RaciMatrixEditor - Main editor with scope selection
- RaciAssignmentDialog - Assignment creation/editing
- Process filtering and status indicators
- Visual gap reporting

### 4. Action Ledger Viewer (`src/pages/ActionLedgerViewer.tsx`)

**Features:**
- Comprehensive ledger table with filtering
- Search by document number, entity ID, actor, narrative
- Filter by action type and entity type
- Detail panel with full entry information
- Links to audit entries, workflow tasks, protocol evaluations
- GPS location display when available
- Export capability

**UI Components:**
- ActionLedgerViewer - Main viewer with filters
- Detail panel with comprehensive information
- Timeline links to related records
- AccountabilityTab - Reusable component for document pages

### 5. My Accountability Workspace (`src/pages/MyAccountabilityWorkspace.tsx`)

**Features:**
- Summary cards: pending, in progress, overdue, compliance score
- Compliance score breakdown with 5 components
- Visual score indicators with color coding
- Overdue items section with alerts
- All responsibilities list with status indicators
- Recent actions timeline
- Appeal score functionality

**UI Components:**
- SummaryCard - Metric cards with icons
- ScoreComponent - Circular progress indicators
- ResponsibilityItemCard - Item cards with priority and status
- Visual score breakdown with weighted components

### 6. Team Accountability Dashboard (`src/pages/TeamAccountabilityDashboard.tsx`)

**Features:**
- Team summary: members, responsibilities, overdue, avg score
- Team members table with comprehensive metrics
- Workload balance visualization
- Filter by team and search by name/role
- Compliance score progress bars
- Overdue item highlighting
- Export report capability

**UI Components:**
- Team summary cards
- Members table with inline score bars
- Workload balance visualization
- Color-coded status indicators

### 7. Compliance Score Explainer (`src/pages/ComplianceScoreExplainer.tsx`)

**Features:**
- Score cards with component breakdown
- Filter by subject type and period
- Detailed score explanation with formula
- Component details with weights and descriptions
- Appeal information display
- Visual score bars for each component
- Export capability

**UI Components:**
- ScoreCard - Summary cards with breakdown
- ScoreBar - Visual component indicators
- ScoreDetail - Detailed explanation panel
- ComponentDetail - Individual component breakdown

### 8. Integration

**Feature Flags:**
- `ff.acc` - Master flag for accountability module

**Routes:**
- `/admin/acc/raci` - RACI Matrix Editor
- `/admin/acc/ledger` - Action Ledger Viewer
- `/admin/acc/team` - Team Accountability Dashboard
- `/admin/acc/scores` - Compliance Score Explainer
- `/home/acc` - My Accountability Workspace

**Navigation:**
- Home → My Accountability
- Administration → Accountability
  - RACI Matrix
  - Action Ledger
  - Team Dashboard
  - Compliance Scores

**Protocol Controls Implemented:**
- CP-ACC-01: RACI assignment required before execution
- CP-ACC-02: RACI changes require manager approval
- CP-ACC-03: Open responsibilities block exit clearance
- CP-ACC-04: Overdue responsibility monitoring

### Key Features

1. **RACI Matrix Management** - Visual assignment of Responsible, Accountable, Consulted, Informed roles
2. **Action Ledger** - Append-only audit trail of all lifecycle actions
3. **Compliance Scoring** - Multi-component weighted scoring system
4. **Responsibility Tracking** - Unified view of all user responsibilities
5. **Protocol Integration** - Enforcement of RACI requirements before execution
6. **Appeal Workflow** - Score appeal and review process
7. **Gap Detection** - Automatic identification of missing RACI assignments
8. **Workload Balance** - Visual workload distribution across team
9. **Overdue Monitoring** - Real-time tracking of overdue items
10. **Handover Management** - Responsibility reassignment during transfers
11. **Independent Accountability** - Enforcement of separation of duties
12. **Effective Dating** - Temporal validity for RACI assignments
13. **Score Components** - 5 weighted components for comprehensive evaluation
14. **Visual Indicators** - Color-coded status and priority indicators
15. **Export Capabilities** - Report generation for all views

### Architecture

```
Business Transaction
    ↓
Action Ledger Writer (append-only)
    ↓
┌─────────────────────────────────────┐
│  Record: who, what, when, where,    │
│          why, with links to audit,  │
│          workflow, protocol         │
└─────────────────────────────────────┘
    ↓
RACI Check (CP-ACC-01)
    ↓
┌─────────────────────────────────────┐
│  Validate: RACI assigned?           │
│  Independent accountability?        │
│  Effective dating valid?            │
└─────────────────────────────────────┘
    ↓
Compliance Score Calculation (nightly)
    ↓
┌─────────────────────────────────────┐
│  Components:                        │
│  - On-time completion (25%)         │
│  - Protocol compliance (25%)        │
│  - Documentation quality (20%)      │
│  - Exception rate (15%)             │
│  - Violation count (15%)            │
└─────────────────────────────────────┘
    ↓
Responsibility Tracking
    ↓
┌─────────────────────────────────────┐
│  Monitor:                           │
│  - Pending items                    │
│  - Overdue items (CP-ACC-04)        │
│  - Workload balance                 │
│  - Team performance                 │
└─────────────────────────────────────┘
```

### Data Statistics

- **Action Ledger Entries**: 5 sample entries
- **RACI Assignments**: 4 assignments across projects and departments
- **Process Catalogue**: 6 processes requiring RACI
- **Compliance Scores**: 4 scores (3 users, 1 project)
- **Responsibility Items**: 5 items across different types

### Build Status

✅ **Build Successful** — 1,301.71 KB (JS) + 39.17 KB (CSS)

### Dependencies

- Part 05 (Organization) - Project/site/department scoping
- Part 06 (IAM) - Permission and role management
- Part 07 (Audit) - Audit trail integration
- Part 14 (Protocol) - Control point enforcement

### Consumed By

- Part 29 (Escalation Ladders)
- Part 56 (Work Authorisation)
- Part 60 (Payroll)
- Part 104 (Detection & Control Tower)
- Part 147 (Task Routing)
- Part 149 (Monthly Close)

### Next Steps

Part 16 — Real-Time Notification & Collaboration Foundation will build on this accountability framework to add:
- Real-time notifications for responsibility assignments
- Collaboration features for team accountability
- Mobile notifications for overdue items
- Integration with communication gateway

## Conclusion

Part 15 provides a comprehensive accountability framework that ensures transparency, traceability, and responsibility across the entire ERP system. The RACI matrix management, action ledger, compliance scoring, and responsibility tracking work together to create a complete picture of who is responsible for what, when it was done, and how well it was performed. The integration with the protocol engine ensures that accountability requirements are enforced at the point of execution, while the compliance scoring system provides measurable performance indicators for continuous improvement.
