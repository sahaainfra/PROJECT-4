// ═══════════════════════════════════════════════════════════
// WORKFLOW ENGINE SERVICE — Part 12
// Workflow & Approval Engine
// ═══════════════════════════════════════════════════════════

import {
  WorkflowDefinition,
  WorkflowStep,
  WorkflowInstance,
  WorkflowTask,
  WorkflowActionLog,
  WorkflowDelegation,
  WorkflowCondition,
  workflowDefinitions,
  workflowSteps,
  workflowInstances,
  workflowTasks,
  workflowActionLogs,
  workflowDelegations,
  workflowConditions,
  getInstanceById,
  getStepsByDefinition,
  getConditionsByDefinition,
  getTasksByInstance,
  getInstanceStatusColor,
} from '../data/workflowData';
import { getCurrentCorrelation } from './ObservabilityService';
import { writeAuditEntry } from './AuditService';
import { publishEvent } from './EventBusService';

// ═══════════════════════════════════════════════════════════
// WORKFLOW ENGINE
// ═══════════════════════════════════════════════════════════

export interface SubmitWorkflowInput {
  doc_type: string;
  doc_id: string;
  doc_number: string;
  submitted_by: string;
  submitted_by_name: string;
  amount: number;
  context: Record<string, any>;
  project_id?: string;
  project_name?: string;
  site_id?: string;
  site_name?: string;
}

export interface TaskActionInput {
  task_id: string;
  action: 'approve' | 'reject' | 'return' | 'reassign';
  comment?: string;
  reason_code?: string;
  reassign_to?: string;
  actor_id: string;
  actor_name: string;
  on_behalf_of?: string;
}

/**
 * Submit a document for workflow approval
 */
export function submitWorkflow(input: SubmitWorkflowInput): WorkflowInstance {
  const correlation = getCurrentCorrelation();

  // Find active workflow definition for document type
  const definition = workflowDefinitions.find(
    d => d.doc_type === input.doc_type && d.is_active
  );

  if (!definition) {
    throw new Error(`No active workflow definition found for document type: ${input.doc_type}`);
  }

  // Create workflow instance
  const instance: WorkflowInstance = {
    id: `wf-inst-${Date.now()}`,
    doc_type: input.doc_type,
    doc_id: input.doc_id,
    doc_number: input.doc_number,
    definition_id: definition.id,
    definition_version: definition.version,
    status: 'IN_PROGRESS',
    current_step_seq: 1,
    submitted_by: input.submitted_by,
    submitted_by_name: input.submitted_by_name,
    submitted_at: new Date().toISOString(),
    amount_snapshot: input.amount,
    context_json: input.context,
    project_id: input.project_id,
    project_name: input.project_name,
    site_id: input.site_id,
    site_name: input.site_name,
  };

  workflowInstances.push(instance);

  // Log submission
  const log: WorkflowActionLog = {
    id: `log-${Date.now()}`,
    instance_id: instance.id,
    action: 'submitted',
    actor_id: input.submitted_by,
    actor_name: input.submitted_by_name,
    at: new Date().toISOString(),
  };
  workflowActionLogs.push(log);

  // Audit
  writeAuditEntry({
    userId: input.submitted_by,
    userName: input.submitted_by_name,
    userEmail: '', // Would be resolved from user context
    action: 'SUBMIT',
    entityType: 'WorkflowInstance',
    entityId: instance.id,
    entityName: `${input.doc_type} ${input.doc_number}`,
    after: instance,
    correlationId: correlation?.correlation_id || '',
  });

  // Publish event
  publishEvent({
    event_type: 'workflow.instance.submitted',
    company_id: 'company-001', // Would come from context
    project_id: input.project_id,
    actor_id: input.submitted_by,
    payload: {
      instance_id: instance.id,
      doc_type: input.doc_type,
      doc_id: input.doc_id,
      amount: input.amount,
    },
  });

  // Create first task
  createTaskForStep(instance, 1);

  return instance;
}

/**
 * Create task for a workflow step
 */
function createTaskForStep(instance: WorkflowInstance, stepSeq: number): void {
  const steps = getStepsByDefinition(instance.definition_id);
  const step = steps.find(s => s.seq === stepSeq);

  if (!step) {
    throw new Error(`Step ${stepSeq} not found in workflow definition`);
  }

  // Resolve approver based on rule
  const approver = resolveApprover(step, instance);

  if (!approver) {
    // Escalate if no approver found
    console.warn(`[WORKFLOW] No approver found for step ${stepSeq}, escalating`);
    // Would trigger escalation logic here
    return;
  }

  // Check for delegation
  const delegations = workflowDelegations.filter(d => 
    d.delegate_id === approver.id && 
    d.status === 'approved' &&
    new Date(d.from_date) <= new Date() &&
    new Date(d.to_date) >= new Date()
  );

  let finalAssignee = approver;
  let delegatedFrom: string | undefined;

  if (delegations.length > 0) {
    // Use first active delegation
    const delegation = delegations[0];
    finalAssignee = {
      id: delegation.delegator_id,
      name: delegation.delegator_name,
    };
    delegatedFrom = approver.id;
  }

  // Calculate due date based on SLA
  const dueAt = calculateDueDate(step.sla_hours);

  // Create task
  const task: WorkflowTask = {
    id: `task-${Date.now()}`,
    instance_id: instance.id,
    step_seq: stepSeq,
    step_name: step.name,
    assignee_user_id: finalAssignee.id,
    assignee_name: finalAssignee.name,
    original_assignee_id: approver.id,
    delegated_from: delegatedFrom,
    status: 'pending',
    due_at: dueAt,
    created_at: new Date().toISOString(),
  };

  workflowTasks.push(task);

  // Log task assignment
  const log: WorkflowActionLog = {
    id: `log-${Date.now()}`,
    instance_id: instance.id,
    task_id: task.id,
    action: 'submitted',
    actor_id: instance.submitted_by,
    actor_name: instance.submitted_by_name,
    at: new Date().toISOString(),
  };
  workflowActionLogs.push(log);

  // Publish event
  publishEvent({
    event_type: 'workflow.task.assigned',
    company_id: 'company-001',
    project_id: instance.project_id,
    actor_id: finalAssignee.id,
    payload: {
      task_id: task.id,
      instance_id: instance.id,
      assignee_id: finalAssignee.id,
      step_name: step.name,
    },
  });
}

/**
 * Resolve approver based on step rule
 */
function resolveApprover(
  step: WorkflowStep,
  instance: WorkflowInstance
): { id: string; name: string } | null {
  // Simplified resolver - in production would query user/role tables
  const ruleMap: Record<string, { id: string; name: string }[]> = {
    PROCUREMENT_OFFICER: [{ id: 'user-014', name: 'Vikram Mehta' }],
    PROCUREMENT_MANAGER: [{ id: 'user-014', name: 'Vikram Mehta' }],
    PROJECT_MANAGER: [{ id: 'user-010', name: 'Rajesh Kumar' }],
    COMMERCIAL_MANAGER: [{ id: 'user-017', name: 'Anil Sharma' }],
    FINANCE_MANAGER: [{ id: 'user-015', name: 'Suresh Kumar' }],
    MANAGEMENT: [{ id: 'user-002', name: 'Priya Sharma' }],
    QS_ENGINEER: [{ id: 'user-016', name: 'Mohan Das' }],
    AUTHORISED_SIGNATORY: [{ id: 'user-001', name: 'Rajesh Kumar' }],
  };

  const approvers = ruleMap[step.approver_rule_value];
  if (!approvers || approvers.length === 0) {
    return null;
  }

  // For parallel steps, return first approver (simplified)
  return approvers[0];
}

/**
 * Calculate due date based on SLA hours
 */
function calculateDueDate(slaHours: number): string {
  const now = new Date();
  const due = new Date(now.getTime() + slaHours * 60 * 60 * 1000);
  return due.toISOString();
}

/**
 * Perform action on a workflow task
 */
export function performTaskAction(input: TaskActionInput): WorkflowTask {
  const correlation = getCurrentCorrelation();

  const task = workflowTasks.find(t => t.id === input.task_id);
  if (!task) {
    throw new Error(`Task not found: ${input.task_id}`);
  }

  if (task.status !== 'pending') {
    throw new Error(`Task already ${task.status}`);
  }

  // Validate actor has permission
  if (task.assignee_user_id !== input.actor_id && !input.on_behalf_of) {
    throw new Error('Unauthorized: Not assigned to this task');
  }

  const instance = getInstanceById(task.instance_id);
  if (!instance) {
    throw new Error('Workflow instance not found');
  }

  // Update task
  task.status = input.action === 'approve' ? 'approved' :
                input.action === 'reject' ? 'rejected' :
                input.action === 'return' ? 'returned' : 'pending';
  task.acted_at = new Date().toISOString();
  task.comment = input.comment;
  task.reason_code = input.reason_code;

  // Log action
  const log: WorkflowActionLog = {
    id: `log-${Date.now()}`,
    instance_id: instance.id,
    task_id: task.id,
    action: input.action === 'approve' ? 'approved' :
            input.action === 'reject' ? 'rejected' :
            input.action === 'return' ? 'returned' : 'reassigned',
    actor_id: input.actor_id,
    actor_name: input.actor_name,
    on_behalf_of: input.on_behalf_of,
    comment: input.comment,
    reason: input.reason_code,
    at: new Date().toISOString(),
  };
  workflowActionLogs.push(log);

  // Audit
  writeAuditEntry({
    userId: input.actor_id,
    userName: input.actor_name,
    userEmail: '',
    action: input.action === 'approve' ? 'APPROVE' :
            input.action === 'reject' ? 'REJECT' : 'UPDATE',
    entityType: 'WorkflowTask',
    entityId: task.id,
    entityName: `Task for ${instance.doc_number}`,
    before: { status: 'pending' },
    after: { status: task.status, comment: input.comment },
    correlationId: correlation?.correlation_id || '',
  });

  // Handle instance status based on action
  if (input.action === 'approve') {
    handleApproval(instance, task);
  } else if (input.action === 'reject') {
    instance.status = 'REJECTED';
    instance.completed_at = new Date().toISOString();
  } else if (input.action === 'return') {
    instance.status = 'RETURNED';
    instance.current_step_seq = 1; // Return to start
  }

  // Publish event
  publishEvent({
    event_type: 'workflow.task.completed',
    company_id: 'company-001',
    project_id: instance.project_id,
    actor_id: input.actor_id,
    payload: {
      task_id: task.id,
      instance_id: instance.id,
      action: input.action,
    },
  });

  return task;
}

/**
 * Handle approval - move to next step or complete
 */
function handleApproval(instance: WorkflowInstance, task: WorkflowTask): void {
  const steps = getStepsByDefinition(instance.definition_id);
  const conditions = getConditionsByDefinition(instance.definition_id);

  // Check if this is the last step
  const currentStepIndex = steps.findIndex(s => s.seq === task.step_seq);
  const nextStep = steps[currentStepIndex + 1];

  if (!nextStep) {
    // Workflow complete
    instance.status = 'APPROVED';
    instance.completed_at = new Date().toISOString();

    publishEvent({
      event_type: 'workflow.instance.completed',
      company_id: 'company-001',
      project_id: instance.project_id,
      actor_id: task.assignee_user_id,
      payload: {
        instance_id: instance.id,
        doc_type: instance.doc_type,
        doc_id: instance.doc_id,
      },
    });
  } else {
    // Check conditions for next step
    const shouldSkip = conditions.some(c => {
      if (c.action !== 'skip') return false;
      // Simplified condition evaluation
      if (c.expression.includes('amount')) {
        const amountMatch = c.expression.match(/amount\s*([<>=]+)\s*(\d+)/);
        if (amountMatch) {
          const operator = amountMatch[1];
          const value = parseInt(amountMatch[2]);
          if (operator === '<' && instance.amount_snapshot < value) return true;
          if (operator === '>' && instance.amount_snapshot > value) return true;
        }
      }
      return false;
    });

    if (shouldSkip) {
      // Skip to next step
      handleApproval(instance, { ...task, step_seq: nextStep.seq } as WorkflowTask);
    } else {
      // Move to next step
      instance.current_step_seq = nextStep.seq;
      createTaskForStep(instance, nextStep.seq);
    }
  }
}

/**
 * Simulate workflow routing for a document
 */
export function simulateWorkflow(
  doc_type: string,
  amount: number,
  context: Record<string, any>
): { steps: string[]; approvers: string[]; conditions: string[] } {
  const definition = workflowDefinitions.find(
    d => d.doc_type === doc_type && d.is_active
  );

  if (!definition) {
    throw new Error(`No active workflow definition found for document type: ${doc_type}`);
  }

  const steps = getStepsByDefinition(definition.id);
  const conditions = getConditionsByDefinition(definition.id);

  const result = {
    steps: [] as string[],
    approvers: [] as string[],
    conditions: [] as string[],
  };

  for (const step of steps) {
    // Check if step should be skipped
    const skipCondition = conditions.find(c => {
      if (c.action !== 'skip') return false;
      if (c.expression.includes('amount')) {
        const amountMatch = c.expression.match(/amount\s*([<>=]+)\s*(\d+)/);
        if (amountMatch) {
          const operator = amountMatch[1];
          const value = parseInt(amountMatch[2]);
          if (operator === '<' && amount < value) return true;
          if (operator === '>' && amount > value) return true;
        }
      }
      return false;
    });

    if (skipCondition) {
      result.conditions.push(`Skip: ${step.name} (${skipCondition.expression})`);
      continue;
    }

    result.steps.push(step.name);
    
    // Resolve approver
    const approver = resolveApprover(step, {
      amount_snapshot: amount,
      context_json: context,
    } as WorkflowInstance);
    
    if (approver) {
      result.approvers.push(`${step.name}: ${approver.name}`);
    }
  }

  return result;
}

/**
 * Get pending tasks for a user (My Approvals inbox)
 */
export function getMyApprovals(userId: string): WorkflowTask[] {
  return workflowTasks.filter(t => 
    t.assignee_user_id === userId && 
    t.status === 'pending'
  );
}

/**
 * Check if task is overdue
 */
export function isTaskOverdue(task: WorkflowTask): boolean {
  return new Date(task.due_at) < new Date() && task.status === 'pending';
}

/**
 * Get workflow statistics
 */
export function getWorkflowStats() {
  const totalInstances = workflowInstances.length;
  const pendingTasks = workflowTasks.filter(t => t.status === 'pending').length;
  const overdueTasks = workflowTasks.filter(t => isTaskOverdue(t)).length;
  const approvedToday = workflowTasks.filter(t => 
    t.status === 'approved' && 
    t.acted_at && 
    new Date(t.acted_at).toDateString() === new Date().toDateString()
  ).length;

  return {
    totalInstances,
    pendingTasks,
    overdueTasks,
    approvedToday,
  };
}
