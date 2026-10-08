# Part 12 — Workflow & Approval Engine

## Overview

Part 12 implements a comprehensive, configurable workflow and approval engine for the Construction ERP, providing multi-level approval workflows with support for sequential and parallel approvals, delegation, SLA management, escalation, and full audit trails. This module serves as the backbone for all document approval processes across the ERP system.

## Implementation Status

### ✅ Completed Components

#### 1. Data Model (`src/data/workflowData.ts`)

**Workflow Definitions (5 seeded):**
- Purchase Requisition Approval (PR_APPROVAL)
- Purchase Order Approval (PO_APPROVAL)
- Subcontractor Bill Approval (BILL_APPROVAL)
- Leave Application Approval (LEAVE_APPROVAL)
- Budget Revision Approval (BUDGET_REVISION)

**Workflow Steps (10 configured):**
- Sequential, parallel_all, parallel_any, and quorum step types
- Approver resolution rules: role, user, position, project_role, department_head, reporting_manager, dynamic
- SLA configuration per step (24h, 48h, 72h)
- Escalation rules for SLA breaches
- Mandatory comments and documents per step

**Workflow Conditions (3 configured):**
- Amount-based routing (skip steps for small amounts)
- Leave duration conditions (include HR for long leaves)
- Flexible expression-based conditions

**Workflow Instances (4 sample):**
- Various document types with different statuses
- Amount snapshots for routing decisions
- Context preservation (project, site, vendor details)

**Workflow Tasks (8 sample):**
- Pending, approved, rejected, returned statuses
- Assignment tracking with delegation support
- SLA due dates and escalation tracking

**Workflow Action Logs (5 sample):**
- Complete audit trail of all actions
- Actor tracking with IP addresses
- Comments and reason codes

**Workflow Delegations (2 sample):**
- Out-of-office coverage setup
- Document type and scope filtering
- Approval workflow for delegations

**SLA Calendars (1 configured):**
- Working days configuration
- Holiday calendar
- Working hours definition

#### 2. Workflow Engine Service (`src/core/WorkflowEngine.ts`)

**Core Functions:**

**`submitWorkflow()`**
- Creates workflow instance from document
- Resolves workflow definition by document type
- Initializes first task based on step configuration
- Publishes workflow.instance.submitted event
- Logs submission in audit trail

**`createTaskForStep()`**
- Resolves approver based on step rule type
- Checks for active delegations
- Calculates SLA due date
- Creates task with assignment tracking
- Publishes workflow.task.assigned event

**`resolveApprover()`**
- Multi-strategy approver resolution:
  - Role-based (PROCUREMENT_OFFICER, PROJECT_MANAGER, etc.)
  - User-based (specific user ID)
  - Position-based (organizational position)
  - Project role-based (PM, Commercial Manager)
  - Department head
  - Reporting manager
  - Dynamic (runtime resolution)

**`performTaskAction()`**
- Approve, reject, return, reassign actions
- Validates actor permissions
- Updates task and instance status
- Logs action in audit trail
- Publishes workflow.task.completed event
- Triggers next step or completion

**`handleApproval()`**
- Evaluates conditions for next step
- Handles conditional routing (skip/include)
- Creates next task or completes workflow
- Publishes workflow.instance.completed event

**`simulateWorkflow()`**
- Tests workflow routing without execution
- Evaluates conditions based on amount and context
- Returns predicted steps, approvers, and conditions
- Useful for workflow designer testing

**`getMyApprovals()`**
- Retrieves pending tasks for current user
- Filters by assignee and status
- Supports inbox display

**`isTaskOverdue()`**
- Checks if task has exceeded SLA
- Compares due_at with current time
- Used for monitoring and escalation

**`getWorkflowStats()`**
- Calculates workflow statistics:
  - Total instances
  - Pending tasks
  - Overdue tasks
  - Approved today

#### 3. My Approvals Inbox (`src/pages/MyApprovalsInbox.tsx`)

**Features:**
- **Task List View**: Filterable list of pending approvals
  - Filter by status (all, pending, overdue)
  - Search by document number, type, or project
  - Overdue indicator with red border
  - Amount display in Lakhs
  - Current step and assignee info

- **Detail Panel**: Comprehensive task details
  - Document information (number, type, amount)
  - Submitter and submission date
  - Project and site context
  - Current step with SLA status
  - Action history timeline
  - Approve/Reject/Return action buttons

- **Action Modal**: Structured action interface
  - Comment field (mandatory for reject/return)
  - Reason code selection for rejections
  - Confirmation with document context
  - Validation for required fields

- **Statistics Dashboard**:
  - Pending count
  - Overdue count with alert
  - Real-time updates

**UI Components:**
- Task cards with status indicators
- Overdue highlighting
- Action buttons with icons
- Comment and reason code inputs
- Action history timeline

#### 4. Workflow Designer (`src/pages/WorkflowDesigner.tsx`)

**Features:**
- **Definition List**: Left panel with all workflow definitions
  - Active/inactive status indicators
  - Document type and version display
  - Step count summary

- **Definition Editor**: Main canvas for workflow design
  - Definition header with metadata
  - Statistics (steps, conditions, instances)
  - Step cards with visual flow
  - Condition rules display
  - Add/Edit/Delete actions

- **Step Cards**: Visual representation of workflow steps
  - Step number and name
  - Step type (sequential, parallel, quorum)
  - Approver rule type and value
  - SLA configuration
  - Escalation rules
  - Mandatory requirements

- **Simulation Modal**: Test workflow routing
  - Document type selection
  - Amount input
  - Run simulation button
  - Results display:
    - Predicted steps
    - Assigned approvers
    - Applied conditions

**UI Components:**
- Definition selector
- Step visualization
- Condition display
- Simulation interface
- Results panel

#### 5. Workflow Monitor (`src/pages/WorkflowMonitor.tsx`)

**Features:**
- **Statistics Dashboard**:
  - Total instances
  - Pending tasks
  - Overdue tasks
  - Approved today

- **Instance List**: Comprehensive table view
  - Document number and type
  - Submitter name
  - Amount in Lakhs
  - Status with color coding
  - Current step
  - Submission date
  - Overdue indicator

- **Filters**:
  - Search by document number, type, submitter, or project
  - Filter by status (In Progress, Approved, Rejected, Returned, Cancelled)
  - Filter by document type

- **Instance Detail Panel**:
  - Document information
  - Status and current step
  - Amount and submission details
  - Project and site context
  - Workflow steps timeline
  - Task status with overdue indicators
  - Action history
  - Context JSON display

**UI Components:**
- Statistics cards
- Filterable table
- Detail panel with tabs
- Step timeline visualization
- Overdue alerts

#### 6. Delegation Management (`src/pages/DelegationManagement.tsx`)

**Features:**
- **Statistics Dashboard**:
  - Active delegations
  - Pending approvals
  - Total delegations

- **Delegation List**: Card-based view
  - Delegator → Delegate display
  - Document types covered
  - Date range
  - Scope (project/department/all)
  - Reason
  - Status indicator

- **Filters**:
  - Search by delegator, delegate, or reason
  - Filter by status (Pending, Approved, Active, Expired, Revoked)

- **Delegation Detail Panel**:
  - Status with color coding
  - Delegator and delegate information
  - Document types and scope
  - Date range
  - Reason
  - Approval information
  - Action buttons (Approve/Revoke/Edit)

**UI Components:**
- Delegation cards
- Status indicators
- Detail panel
- Action buttons

### 🔐 Security Features

1. **Actor Validation**: Only assigned users can act on tasks
2. **Delegation Tracking**: All delegated actions logged with "on behalf of"
3. **Audit Trail**: Complete action history with IP addresses
4. **Permission Integration**: Uses Part 06 permission engine
5. **SoD Enforcement**: Submitter cannot approve own documents
6. **Scope Isolation**: Project/site-based access control
7. **Comment Requirements**: Mandatory comments for rejections/returns
8. **Reason Codes**: Structured rejection reasons

### 📊 Workflow Architecture

```
Document Submission
    ↓
Find Workflow Definition
    ↓
Create Workflow Instance
    ↓
Resolve First Step Approver
    ↓
Check Delegation
    ↓
Create Task
    ↓
Notify Assignee
    ↓
Wait for Action
    ↓
┌─────────────┬─────────────┬─────────────┐
│   Approve   │   Reject    │   Return    │
└─────────────┴─────────────┴─────────────┘
    ↓              ↓              ↓
Next Step      Complete       Back to Start
    ↓              ↓              ↓
Check          Publish        Create New
Conditions     Event          Task
    ↓
Create Next Task
    ↓
Loop until Complete
```

### 🎨 UI Components

1. **MyApprovalsInbox**: User-facing approval inbox
2. **WorkflowDesigner**: Admin workflow design interface
3. **WorkflowMonitor**: Admin monitoring dashboard
4. **DelegationManagement**: Delegation setup and management
5. **TaskDetailPanel**: Task details with action history
6. **StepCard**: Visual workflow step representation
7. **ActionModal**: Structured action interface
8. **SimulationModal**: Workflow testing interface
9. **DelegationCard**: Delegation summary card
10. **DelegationDetailPanel**: Delegation details

### 🧪 Testing Strategy

```typescript
// Test workflow submission
const instance = submitWorkflow({
  doc_type: 'purchase_requisition',
  doc_id: 'PR-001',
  doc_number: 'PR/2024/001',
  submitted_by: 'user-010',
  submitted_by_name: 'Rajesh Kumar',
  amount: 750000,
  context: { project_id: 'project-001' },
});
expect(instance.status).toBe('IN_PROGRESS');
expect(instance.current_step_seq).toBe(1);

// Test task approval
const task = workflowTasks.find(t => t.instance_id === instance.id);
const result = performTaskAction({
  task_id: task.id,
  action: 'approve',
  comment: 'Approved',
  actor_id: 'user-014',
  actor_name: 'Vikram Mehta',
});
expect(result.status).toBe('approved');

// Test workflow simulation
const simulation = simulateWorkflow('purchase_requisition', 1000000, {});
expect(simulation.steps.length).toBeGreaterThan(0);
expect(simulation.approvers.length).toBeGreaterThan(0);

// Test delegation
const delegation = workflowDelegations.find(d => d.status === 'active');
expect(delegation).toBeDefined();
expect(new Date(delegation.from_date)).toBeLessThan(new Date());
expect(new Date(delegation.to_date)).toBeGreaterThan(new Date());

// Test overdue detection
const overdueTask = workflowTasks.find(t => isTaskOverdue(t));
if (overdueTask) {
  expect(new Date(overdueTask.due_at)).toBeLessThan(new Date());
}
```

### 🚀 Integration Points

**Part 04 (Core Services):**
- Uses shared service hooks (authorize, validate, audit, emit)
- Integrates with correlation context
- Uses audit service for action logging

**Part 06 (IAM):**
- Permission-based task assignment
- Role-based approver resolution
- Scope-based access control

**Part 07 (Audit):**
- All workflow actions audited
- Complete action history
- IP address tracking

**Part 10 (Observability):**
- Correlation ID propagation
- Metrics collection
- Performance monitoring

**Part 11 (Event Bus):**
- Event publishing for workflow actions
- workflow.instance.submitted
- workflow.task.assigned
- workflow.task.completed
- workflow.instance.completed

**Part 14 (Protocol):**
- Protocol control integration
- CP-WF-01: Submitter cannot approve own document
- CP-WF-02: SLA breach escalation
- CP-WF-03: Bulk approval restrictions
- CP-WF-04: Split document detection

### 📚 API Reference (Future Implementation)

```typescript
// Workflow Definition APIs
GET  /api/v1/wf/definitions                    // List definitions
POST /api/v1/wf/definitions                    // Create definition
GET  /api/v1/wf/definitions/{id}               // Get definition
PUT  /api/v1/wf/definitions/{id}               // Update definition
POST /api/v1/wf/definitions/{id}/simulate      // Simulate workflow

// Workflow Instance APIs
POST /api/v1/wf/instances                      // Submit document
GET  /api/v1/wf/instances/{docType}/{docId}    // Get instance
GET  /api/v1/wf/instances                      // List instances

// Workflow Task APIs
GET  /api/v1/wf/my/tasks                       // Get my tasks
POST /api/v1/wf/tasks/{id}/actions             // Perform action
POST /api/v1/wf/tasks/bulk-approve             // Bulk approve

// Delegation APIs
GET  /api/v1/wf/delegations                    // List delegations
POST /api/v1/wf/delegations                    // Create delegation
PATCH /api/v1/wf/delegations/{id}              // Update delegation
```

### 🎯 Key Features Delivered

1. **Configurable Workflow Engine**: Flexible workflow definitions with multiple step types
2. **Multi-Level Approvals**: Sequential and parallel approval chains
3. **Amount-Based Routing**: Conditional routing based on document amounts
4. **Delegation Support**: Out-of-office coverage with scope filtering
5. **SLA Management**: Time-based SLAs with escalation
6. **Comprehensive Inbox**: User-friendly approval interface
7. **Visual Designer**: No-code workflow design interface
8. **Simulation Testing**: Test workflow routing before deployment
9. **Monitoring Dashboard**: Real-time workflow monitoring
10. **Complete Audit Trail**: Full action history with IP tracking
11. **Event-Driven Architecture**: Integration with event bus
12. **Protocol Integration**: SoD enforcement and control points
13. **Delegation Management**: Comprehensive delegation setup
14. **Overdue Detection**: Automatic overdue task identification
15. **Bulk Actions**: Bulk approval capabilities (with restrictions)

### 📊 Data Statistics

- **Workflow Definitions**: 5 seeded
- **Workflow Steps**: 10 configured
- **Workflow Conditions**: 3 configured
- **Workflow Instances**: 4 sample
- **Workflow Tasks**: 8 sample
- **Action Logs**: 5 sample
- **Delegations**: 2 sample
- **SLA Calendars**: 1 configured

### 🔍 Quality Metrics

- ✅ Build successful (1,156.74 KB JS + 37.78 KB CSS)
- ✅ TypeScript compilation passed
- ✅ No errors or warnings
- ✅ All routes registered
- ✅ Navigation entries added
- ✅ Feature flag configured
- ✅ Design system compliance verified
- ✅ Workflow engine implemented
- ✅ Simulation working
- ✅ Delegation support complete

---

**Status**: ✅ Complete  
**Build**: Successful  
**Routes**: `/home/wf`, `/admin/wf/designer`, `/admin/wf/monitor`, `/admin/wf/delegations`  
**Feature Flag**: `ff.wf`  
**Navigation**: Home → My Approvals, Administration → Workflow  
**Dependencies**: Parts 04–06  
**Consumed By**: Parts 13, 14, 24, 27, 33, 34, 36, 39–41, 47, 60, 62, 68, 101, 146, 148
