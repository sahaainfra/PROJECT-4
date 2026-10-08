# Part 13 — Workflow Rules & Decision Tables

## Overview

Part 13 extends the workflow engine (Part 12) with a comprehensive rules engine that provides decision tables, authority matrices, state machines, and simulation capabilities. This enables configurable, data-driven approval routing without requiring code changes.

## Implementation Summary

### 1. Data Model (`src/data/rulesData.ts`)

**Decision Tables:**
- DMN-style decision tables with inputs, outputs, and rows
- Support for multiple hit policies (first, unique, priority, any, collect)
- Version control with draft/simulated/approved/active/superseded states
- Input types: string, number, boolean, enum, date
- Conditional expressions: ranges, comparisons, wildcards, OR conditions

**Authority Matrix:**
- Role-based approval limits per document type
- Effective dating for temporal validity
- Currency support
- Company and project scoping

**State Machines:**
- Document lifecycle definitions
- States with types (initial, intermediate, final)
- Transitions with guards and role restrictions
- Support for approval-required transitions

**Simulations:**
- Historical document testing against decision tables
- Change detection and impact analysis
- Period-based simulation runs
- Detailed result tracking

**Emergency Approvals:**
- Emergency approval tracking
- Evidence attachment
- Regularisation workflow
- Overdue monitoring

**Sample Data:**
- 2 decision tables (PO and Bill approval routing)
- 5 authority matrix entries
- 1 state machine (PO lifecycle)
- 1 simulation result
- 2 emergency approvals

### 2. Rules Engine Service (`src/core/RulesEngine.ts`)

**Decision Table Evaluation:**
- `evaluateDecisionTable()` - Evaluates inputs against decision table rules
- `matchesRow()` - Checks if input values match a rule row
- `matchesCondition()` - Handles range, comparison, wildcard, and OR conditions
- Support for priority-based rule ordering

**Authority Checking:**
- `checkAuthority()` - Validates user approval authority against limits
- `checkCumulativeAuthority()` - Checks cumulative amounts for split-order detection
- Role and document type based limit enforcement

**State Machine:**
- `checkStateTransition()` - Validates state transitions with role checks
- `getAvailableTransitions()` - Returns allowed transitions from current state
- Guard condition evaluation

**Simulation:**
- `runSimulation()` - Executes decision table against historical documents
- `generateSimulationResults()` - Creates simulated routing changes
- Impact analysis with changed/unchanged counts

**Emergency Approvals:**
- `createEmergencyApproval()` - Creates emergency approval with evidence
- `regulariseEmergencyApproval()` - Completes emergency approval regularisation
- Status tracking (pending/regularised/overdue)

**Rule Versioning:**
- `createRuleVersion()` - Creates new version of decision table
- `activateRuleVersion()` - Activates a rule version with maker-checker
- Automatic superseding of previous active versions

**Integration:**
- `getApprovalRouting()` - Gets approval chain from decision table
- `parseApprovalChain()` - Converts chain strings to role arrays
- `validateApprover()` - Validates approver authority and SoD

### 3. Decision Table Editor (`src/pages/DecisionTableEditor.tsx`)

**Features:**
- List view of all decision tables with status indicators
- Filter by status, document type, and search
- Detail panel with tabs for rules, inputs, and outputs
- Rule editing with priority, inputs, outputs, and annotations
- Input/output definition management
- Simulation trigger

**UI Components:**
- DecisionTableCard - Summary card with statistics
- DecisionTableDetail - Detailed view with tabbed interface
- Rule editor with input/output grids
- Status badges and hit policy display

### 4. Authority Matrix (`src/pages/AuthorityMatrix.tsx`)

**Features:**
- Matrix grid view showing roles vs document types
- List view with detailed authority limits
- Filter by role, document type, and search
- Detail panel for editing authority entries
- Visual amount display in Lakhs

**UI Components:**
- Matrix grid with sticky headers
- Authority limit cards with color coding
- List table with edit/delete actions
- Detail panel for entry management

### 5. Simulation Dashboard (`src/pages/SimulationDashboard.tsx`)

**Features:**
- List of simulation runs with statistics
- New simulation creation modal
- Detail panel with results breakdown
- Filter by changed/unchanged routing
- Export capabilities

**UI Components:**
- SimulationCard - Summary with change statistics
- SimulationDetail - Detailed results with filtering
- New simulation modal with form inputs
- Results table with old/new routing comparison

### 6. Emergency Approvals (`src/pages/EmergencyApprovals.tsx`)

**Features:**
- List of emergency approvals with status indicators
- Overdue detection and highlighting
- Detail panel with evidence and regularisation
- Regularisation workflow
- Pending and overdue count badges

**UI Components:**
- EmergencyApprovalCard - Summary with reason and status
- EmergencyApprovalDetail - Detailed view with evidence
- Regularisation action button
- Status badges with color coding

### 7. Integration

**Feature Flags:**
- `ff.rules` - Master flag for rules engine

**Routes:**
- `/admin/rules/decision-tables` - Decision table editor
- `/admin/rules/authority-matrix` - Authority matrix management
- `/admin/rules/simulations` - Simulation dashboard
- `/admin/rules/emergency` - Emergency approvals

**Navigation:**
- Administration → Workflow Rules
  - Decision Tables
  - Authority Matrix
  - Simulations
  - Emergency Approvals

## Key Features

1. **Configurable Approval Routing** - Decision tables define routing logic without code changes
2. **Authority Limits** - Role-based approval limits with effective dating
3. **State Machine Control** - Document lifecycle with transition guards
4. **Simulation Testing** - Test rules against historical data before activation
5. **Emergency Approvals** - Track and regularise emergency exceptions
6. **Rule Versioning** - Version control with maker-checker activation
7. **Condition Expressions** - Flexible condition matching (ranges, comparisons, wildcards)
8. **Hit Policies** - Multiple evaluation strategies (first, unique, priority, any, collect)
9. **Cumulative Authority** - Split-order detection for authority limits
10. **SoD Integration** - Segregation of duties validation in approval chains

## Architecture

```
Document Submission
    ↓
Decision Table Evaluation
    ↓
┌─────────────────────────────────┐
│  Input: amount, project_type,   │
│         vendor_risk, etc.       │
└─────────────────────────────────┘
    ↓
Rule Matching (by priority)
    ↓
┌─────────────────────────────────┐
│  Output: approval_levels,       │
│          sla_hours,             │
│          mandatory_docs         │
└─────────────────────────────────┘
    ↓
Authority Check
    ↓
┌─────────────────────────────────┐
│  Validate: role limit >= amount │
│  Check: cumulative authority    │
│  Verify: SoD compliance         │
└─────────────────────────────────┘
    ↓
Create Workflow Tasks
    ↓
Notify Approvers
```

## Data Statistics

- **Decision Tables**: 2 (PO and Bill approval)
- **Authority Matrix Entries**: 5
- **State Machines**: 1 (PO lifecycle)
- **Simulations**: 1
- **Emergency Approvals**: 2

## Build Status

✅ **Build Successful** — 1,211.01 KB (JS) + 38.28 KB (CSS)

## Dependencies

- Part 06 (IAM) - Permission and role management
- Part 09 (Identity & SoD) - Segregation of duties
- Part 12 (Workflow Engine) - Base workflow infrastructure

## Consumed By

- Part 110 (Workflow Analytics)
- All document modules (Procurement, Finance, Projects, etc.)

## Next Steps

Part 14 — Protocol & Control Engine will build on this foundation to add:
- Protocol control points
- Exception management
- Control enforcement
- Compliance monitoring
