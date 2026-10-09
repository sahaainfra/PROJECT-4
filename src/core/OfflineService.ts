// ═══════════════════════════════════════════════════════════
// OFFLINE SERVICE — Part 22
// Offline-First Field Mobile Engine
// ═══════════════════════════════════════════════════════════

import {
  OfflineCommand,
  OfflineConflict,
  OfflineDevice,
  OfflineSnapshot,
  MediaUpload,
  CommandType,
  ConflictResolution,
  offlineCommands,
  offlineConflicts,
  offlineDevices,
  offlineSnapshots,
  mediaUploads,
  getDeviceById,
  getCommandsByDevice,
  getLatestSnapshot,
} from '../data/offlineData';
import { getCurrentCorrelation } from './ObservabilityService';
import { writeAuditEntry } from './AuditService';
import { publishEvent } from './EventBusService';
import { protocolCheck } from './ProtocolEngine';

// ═══════════════════════════════════════════════════════════
// COMMAND QUEUE MANAGEMENT
// ═══════════════════════════════════════════════════════════

export interface CreateCommandInput {
  device_id: string;
  user_id: string;
  type: CommandType;
  payload: Record<string, any>;
  base_versions: Record<string, number>;
  gps_latitude?: number;
  gps_longitude?: number;
  gps_accuracy?: number;
}

/**
 * Create a new offline command
 */
export function createCommand(input: CreateCommandInput): OfflineCommand {
  const correlation = getCurrentCorrelation();

  // Validate device
  const device = getDeviceById(input.device_id);
  if (!device) {
    throw new Error(`Device not found: ${input.device_id}`);
  }

  if (device.status !== 'TRUSTED') {
    throw new Error(`Device not trusted: ${device.status}`);
  }

  // CP-OFF-01: Check snapshot freshness
  const snapshot = getLatestSnapshot(input.user_id, input.device_id);
  if (!snapshot) {
    throw new Error('No valid snapshot available. Please sync first.');
  }

  const snapshotAge = (Date.now() - new Date(snapshot.generated_at).getTime()) / (1000 * 60 * 60);
  if (snapshotAge > 48) { // Hard limit: 48 hours
    throw new Error(`Snapshot too old (${Math.floor(snapshotAge)}h). Please sync to refresh.`);
  }

  // Create command
  const command: OfflineCommand = {
    command_id: `cmd-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    device_id: input.device_id,
    user_id: input.user_id,
    type: input.type,
    payload_hash: `sha256:${btoa(JSON.stringify(input.payload)).substr(0, 32)}`,
    payload: input.payload,
    base_versions_json: input.base_versions,
    device_time: new Date().toISOString(),
    gps_latitude: input.gps_latitude,
    gps_longitude: input.gps_longitude,
    gps_accuracy: input.gps_accuracy,
    created_at: new Date().toISOString(),
    status: 'QUEUED',
    retry_count: 0,
    max_retries: 3,
  };

  offlineCommands.push(command);

  // Audit log
  writeAuditEntry({
    userId: input.user_id,
    userName: device.user_name,
    userEmail: '',
    action: 'CREATE',
    entityType: 'OfflineCommand',
    entityId: command.command_id,
    entityName: `Command: ${command.type}`,
    after: command,
    correlationId: correlation?.correlation_id || '',
  });

  return command;
}

/**
 * Process command queue for a device
 */
export async function processCommandQueue(deviceId: string): Promise<{
  processed: number;
  accepted: number;
  rejected: number;
  conflicts: number;
}> {
  const device = getDeviceById(deviceId);
  if (!device) {
    throw new Error(`Device not found: ${deviceId}`);
  }

  const commands = getCommandsByDevice(deviceId)
    .filter(c => c.status === 'QUEUED')
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

  let processed = 0;
  let accepted = 0;
  let rejected = 0;
  let conflicts = 0;

  for (const command of commands) {
    command.status = 'SENDING';
    processed++;

    try {
      // Simulate server processing
      const result = await simulateServerProcessing(command);
      
      if (result.success) {
        command.status = 'ACCEPTED';
        command.result_code = 'SUCCESS';
        command.record_ref = result.record_ref;
        command.server_received_at = new Date().toISOString();
        accepted++;

        // Publish event
        publishEvent({
          event_type: 'offline.command.accepted',
          company_id: 'company-001',
          project_id: command.payload.project_id,
          actor_id: command.user_id,
          payload: {
            command_id: command.command_id,
            type: command.type,
            record_ref: result.record_ref,
          },
        });
      } else if (result.conflict) {
        command.status = 'CONFLICT';
        command.result_code = 'CONFLICT_VERSION';
        command.result_message = result.message;
        conflicts++;

        // Create conflict record
        createConflict(command, result.conflict_details!);

        // Publish event
        publishEvent({
          event_type: 'offline.conflict.raised',
          company_id: 'company-001',
          project_id: command.payload.project_id,
          actor_id: command.user_id,
          payload: {
            command_id: command.command_id,
            conflict_id: result.conflict_details!.conflict_id,
          },
        });
      } else {
        command.status = 'REJECTED';
        command.result_code = result.error_code!;
        command.result_message = result.message;
        rejected++;

        // Publish event
        publishEvent({
          event_type: 'offline.command.rejected',
          company_id: 'company-001',
          actor_id: command.user_id,
          payload: {
            command_id: command.command_id,
            reason: result.error_code,
          },
        });
      }
    } catch (error) {
      command.status = 'QUEUED'; // Revert to queued for retry
      command.retry_count++;
      
      if (command.retry_count >= command.max_retries) {
        command.status = 'REJECTED';
        command.result_code = 'MAX_RETRIES_EXCEEDED';
        command.result_message = (error as Error).message;
        rejected++;
      }
    }
  }

  // Update device sync time
  device.last_sync_at = new Date().toISOString();
  device.queue_size = getCommandsByDevice(deviceId).filter(c => c.status === 'QUEUED').length;

  return { processed, accepted, rejected, conflicts };
}

/**
 * Simulate server processing (in production, this would call actual API)
 */
async function simulateServerProcessing(command: OfflineCommand): Promise<{
  success: boolean;
  conflict?: boolean;
  record_ref?: string;
  error_code?: string;
  message?: string;
  conflict_details?: any;
}> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 100));

  // Simulate different outcomes based on command type
  if (command.type === 'CREATE_MATERIAL_RECEIPT' && command.user_id === 'user-019') {
    return {
      success: false,
      error_code: 'PERMISSION_DENIED',
      message: 'User does not have material_receipt.create permission',
    };
  }

  if (command.type === 'CREATE_INSPECTION') {
    // Simulate version conflict
    const serverVersion = 13;
    const clientBaseVersion = command.base_versions_json['wbs-001'] || 12;
    
    if (serverVersion > clientBaseVersion) {
      return {
        success: false,
        conflict: true,
        message: `WBS version mismatch: server v${serverVersion}, client base v${clientBaseVersion}`,
        conflict_details: {
          conflict_id: `conflict-${Date.now()}`,
          record_type: 'Inspection',
          record_id: 'insp-001',
          record_label: 'Quality Inspection - WBS 001',
          server_version: serverVersion,
          client_base_version: clientBaseVersion,
          client_current_version: clientBaseVersion,
          fields: [
            {
              field_name: 'test_results.strength_mpa',
              server_value: 32,
              client_value: command.payload.test_results?.strength_mpa || 35,
            },
            {
              field_name: 'inspector_comments',
              server_value: 'Initial test completed',
              client_value: command.payload.inspector_comments || '',
            },
          ],
          requires_supervisor: false,
        },
      };
    }
  }

  // Default: success
  return {
    success: true,
    record_ref: `${command.type.toLowerCase()}-${Date.now()}`,
  };
}

// ═══════════════════════════════════════════════════════════
// CONFLICT MANAGEMENT
// ═══════════════════════════════════════════════════════════

/**
 * Create a conflict record
 */
function createConflict(command: OfflineCommand, details: any): OfflineConflict {
  const conflict: OfflineConflict = {
    id: details.conflict_id,
    command_id: command.command_id,
    record_type: details.record_type,
    record_id: details.record_id,
    record_label: details.record_label,
    server_version: details.server_version,
    client_base_version: details.client_base_version,
    client_current_version: details.client_current_version,
    fields_json: details.fields,
    status: 'OPEN',
    created_at: new Date().toISOString(),
    requires_supervisor: details.requires_supervisor,
  };

  offlineConflicts.push(conflict);

  // Update device conflict count
  const device = getDeviceById(command.device_id);
  if (device) {
    device.pending_conflicts = offlineConflicts.filter(c => 
      c.status === 'OPEN' && 
      getCommandsByDevice(device.device_id).some(cmd => cmd.command_id === c.command_id)
    ).length;
  }

  return conflict;
}

/**
 * Resolve a conflict
 */
export function resolveConflict(
  conflictId: string,
  resolution: ConflictResolution,
  resolvedBy: string,
  resolutionNotes?: string,
  fieldResolutions?: Record<string, { resolution: ConflictResolution; merged_value?: any }>
): OfflineConflict {
  const correlation = getCurrentCorrelation();

  const conflict = offlineConflicts.find(c => c.id === conflictId);
  if (!conflict) {
    throw new Error(`Conflict not found: ${conflictId}`);
  }

  if (conflict.status !== 'OPEN') {
    throw new Error(`Conflict already resolved: ${conflict.status}`);
  }

  // Apply field-level resolutions if provided
  if (fieldResolutions) {
    conflict.fields_json = conflict.fields_json.map(field => {
      const resolution = fieldResolutions[field.field_name];
      if (resolution) {
        return {
          ...field,
          resolution: resolution.resolution,
          merged_value: resolution.merged_value,
        };
      }
      return field;
    });
  }

  conflict.status = 'RESOLVED';
  conflict.resolved_at = new Date().toISOString();
  conflict.resolved_by = resolvedBy;
  conflict.resolution = resolution;
  conflict.resolution_notes = resolutionNotes;

  // Update command status
  const command = offlineCommands.find(c => c.command_id === conflict.command_id);
  if (command) {
    if (resolution === 'KEEP_MINE') {
      command.status = 'QUEUED'; // Re-queue for processing
      command.retry_count = 0;
    } else if (resolution === 'KEEP_SERVER') {
      command.status = 'REJECTED';
      command.result_code = 'CONFLICT_RESOLVED_KEEP_SERVER';
    } else if (resolution === 'MERGE') {
      command.status = 'QUEUED'; // Re-queue with merged data
      command.retry_count = 0;
    }
  }

  // Update device conflict count
  if (command) {
    const device = getDeviceById(command.device_id);
    if (device) {
      device.pending_conflicts = offlineConflicts.filter(c => 
        c.status === 'OPEN' && 
        getCommandsByDevice(device.device_id).some(cmd => cmd.command_id === c.command_id)
      ).length;
    }
  }

  // Audit log
  writeAuditEntry({
    userId: resolvedBy,
    userName: 'Conflict Resolution',
    userEmail: '',
    action: 'UPDATE',
    entityType: 'OfflineConflict',
    entityId: conflict.id,
    entityName: `Resolved conflict: ${conflict.record_label}`,
    before: { status: 'OPEN' },
    after: { status: 'RESOLVED', resolution },
    correlationId: correlation?.correlation_id || '',
  });

  return conflict;
}

/**
 * Approve supervisor-required conflict
 */
export function approveSupervisorConflict(
  conflictId: string,
  approvedBy: string
): OfflineConflict {
  const correlation = getCurrentCorrelation();

  const conflict = offlineConflicts.find(c => c.id === conflictId);
  if (!conflict) {
    throw new Error(`Conflict not found: ${conflictId}`);
  }

  if (!conflict.requires_supervisor) {
    throw new Error('Conflict does not require supervisor approval');
  }

  conflict.supervisor_approved = true;
  conflict.supervisor_approved_at = new Date().toISOString();
  conflict.supervisor_approved_by = approvedBy;

  // Audit log
  writeAuditEntry({
    userId: approvedBy,
    userName: 'Supervisor Approval',
    userEmail: '',
    action: 'APPROVE',
    entityType: 'OfflineConflict',
    entityId: conflict.id,
    entityName: `Approved conflict: ${conflict.record_label}`,
    after: { supervisor_approved: true },
    correlationId: correlation?.correlation_id || '',
  });

  return conflict;
}

// ═══════════════════════════════════════════════════════════
// DEVICE MANAGEMENT
// ═══════════════════════════════════════════════════════════

export interface RegisterDeviceInput {
  device_id: string;
  user_id: string;
  platform: string;
  app_version: string;
  push_token?: string;
}

/**
 * Register a new device
 */
export function registerDevice(input: RegisterDeviceInput): OfflineDevice {
  const correlation = getCurrentCorrelation();

  // Check if device already exists
  const existing = getDeviceById(input.device_id);
  if (existing) {
    throw new Error(`Device already registered: ${input.device_id}`);
  }

  const device: OfflineDevice = {
    id: `off-dev-${Date.now()}`,
    device_id: input.device_id,
    user_id: input.user_id,
    user_name: 'User Name', // Would be resolved from user service
    platform: input.platform,
    app_version: input.app_version,
    snapshot_version: 0,
    last_sync_at: new Date().toISOString(),
    registered_at: new Date().toISOString(),
    status: 'PENDING',
    encryption_key_hash: `sha256:${btoa(input.device_id + Date.now()).substr(0, 32)}`,
    push_token: input.push_token,
    queue_size: 0,
    pending_conflicts: 0,
  };

  offlineDevices.push(device);

  // Audit log
  writeAuditEntry({
    userId: input.user_id,
    userName: 'Device Registration',
    userEmail: '',
    action: 'CREATE',
    entityType: 'OfflineDevice',
    entityId: device.id,
    entityName: `Registered device: ${device.device_id}`,
    after: device,
    correlationId: correlation?.correlation_id || '',
  });

  return device;
}

/**
 * Trust a device
 */
export function trustDevice(deviceId: string, approvedBy: string): OfflineDevice {
  const correlation = getCurrentCorrelation();

  const device = getDeviceById(deviceId);
  if (!device) {
    throw new Error(`Device not found: ${deviceId}`);
  }

  if (device.status !== 'PENDING') {
    throw new Error(`Device cannot be trusted from status: ${device.status}`);
  }

  device.status = 'TRUSTED';

  // Audit log
  writeAuditEntry({
    userId: approvedBy,
    userName: 'Device Trust',
    userEmail: '',
    action: 'APPROVE',
    entityType: 'OfflineDevice',
    entityId: device.id,
    entityName: `Trusted device: ${device.device_id}`,
    before: { status: 'PENDING' },
    after: { status: 'TRUSTED' },
    correlationId: correlation?.correlation_id || '',
  });

  return device;
}

/**
 * Revoke a device
 */
export function revokeDevice(deviceId: string, revokedBy: string, reason: string): OfflineDevice {
  const correlation = getCurrentCorrelation();

  const device = getDeviceById(deviceId);
  if (!device) {
    throw new Error(`Device not found: ${deviceId}`);
  }

  device.status = 'REVOKED';

  // Reject all queued commands from this device
  const commands = getCommandsByDevice(deviceId);
  commands.forEach(cmd => {
    if (cmd.status === 'QUEUED' || cmd.status === 'SENDING') {
      cmd.status = 'REJECTED';
      cmd.result_code = 'DEVICE_REVOKED';
      cmd.result_message = reason;
    }
  });

  // Audit log
  writeAuditEntry({
    userId: revokedBy,
    userName: 'Device Revocation',
    userEmail: '',
    action: 'UPDATE',
    entityType: 'OfflineDevice',
    entityId: device.id,
    entityName: `Revoked device: ${device.device_id}`,
    before: { status: device.status },
    after: { status: 'REVOKED' },
    reason,
    correlationId: correlation?.correlation_id || '',
  });

  // Publish event
  publishEvent({
    event_type: 'offline.device.revoked',
    company_id: 'company-001',
    actor_id: revokedBy,
    payload: {
      device_id: device.id,
      reason,
    },
  });

  return device;
}

// ═══════════════════════════════════════════════════════════
// SNAPSHOT MANAGEMENT
// ═══════════════════════════════════════════════════════════

export interface GenerateSnapshotInput {
  user_id: string;
  device_id: string;
  scope: {
    project_ids: string[];
    site_ids: string[];
    include_master_data: boolean;
  };
}

/**
 * Generate a new snapshot
 */
export function generateSnapshot(input: GenerateSnapshotInput): OfflineSnapshot {
  const correlation = getCurrentCorrelation();

  const device = getDeviceById(input.device_id);
  if (!device) {
    throw new Error(`Device not found: ${input.device_id}`);
  }

  const snapshot: OfflineSnapshot = {
    id: `snap-${Date.now()}`,
    user_id: input.user_id,
    device_id: input.device_id,
    scope_json: input.scope,
    version: device.snapshot_version + 1,
    generated_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
    size_bytes: 15728640, // Simulated: 15 MB
    record_count: 2450,
    status: 'READY',
  };

  offlineSnapshots.push(snapshot);

  // Update device snapshot version
  device.snapshot_version = snapshot.version;

  // Audit log
  writeAuditEntry({
    userId: input.user_id,
    userName: 'Snapshot Generation',
    userEmail: '',
    action: 'CREATE',
    entityType: 'OfflineSnapshot',
    entityId: snapshot.id,
    entityName: `Generated snapshot v${snapshot.version}`,
    after: snapshot,
    correlationId: correlation?.correlation_id || '',
  });

  return snapshot;
}

// ═══════════════════════════════════════════════════════════
// MEDIA UPLOAD MANAGEMENT
// ═══════════════════════════════════════════════════════════

export interface UploadMediaInput {
  device_id: string;
  user_id: string;
  command_id?: string;
  filename: string;
  mime_type: string;
  size_bytes: number;
  hash: string;
  chunks_total: number;
  metadata: {
    project_id?: string;
    site_id?: string;
    gps_latitude?: number;
    gps_longitude?: number;
    captured_at: string;
    watermark_text?: string;
    compression_applied: boolean;
  };
}

/**
 * Start media upload
 */
export function startMediaUpload(input: UploadMediaInput): MediaUpload {
  const correlation = getCurrentCorrelation();

  const media: MediaUpload = {
    id: `media-${Date.now()}`,
    file_id: `file-${Date.now()}`,
    device_id: input.device_id,
    user_id: input.user_id,
    command_id: input.command_id,
    filename: input.filename,
    mime_type: input.mime_type,
    size_bytes: input.size_bytes,
    hash: input.hash,
    chunks_total: input.chunks_total,
    chunks_received: 0,
    status: 'PENDING',
    created_at: new Date().toISOString(),
    metadata: input.metadata,
  };

  mediaUploads.push(media);

  // Audit log
  writeAuditEntry({
    userId: input.user_id,
    userName: 'Media Upload',
    userEmail: '',
    action: 'CREATE',
    entityType: 'MediaUpload',
    entityId: media.id,
    entityName: `Started upload: ${media.filename}`,
    after: media,
    correlationId: correlation?.correlation_id || '',
  });

  return media;
}

/**
 * Update media upload progress
 */
export function updateMediaUploadProgress(
  mediaId: string,
  chunksReceived: number,
  status?: MediaUpload['status']
): MediaUpload {
  const media = mediaUploads.find(m => m.id === mediaId);
  if (!media) {
    throw new Error(`Media upload not found: ${mediaId}`);
  }

  media.chunks_received = chunksReceived;
  if (status) {
    media.status = status;
  }

  if (chunksReceived === media.chunks_total) {
    media.status = 'UPLOADED';
    media.uploaded_at = new Date().toISOString();
  }

  return media;
}

// ═══════════════════════════════════════════════════════════
// SYNC STATUS & DIAGNOSTICS
// ═══════════════════════════════════════════════════════════

/**
 * Get sync diagnostics for export
 */
export function getSyncDiagnostics(deviceId: string): {
  device: OfflineDevice;
  commands: Array<Omit<OfflineCommand, 'payload'> & { payload: string }>;
  conflicts: OfflineConflict[];
  media: MediaUpload[];
  snapshot: OfflineSnapshot | undefined;
} {
  const device = getDeviceById(deviceId);
  if (!device) {
    throw new Error(`Device not found: ${deviceId}`);
  }

  const commands = getCommandsByDevice(deviceId);
  const conflicts = offlineConflicts.filter(c => 
    commands.some(cmd => cmd.command_id === c.command_id)
  );
  const media = mediaUploads.filter(m => m.device_id === deviceId);
  const snapshot = getLatestSnapshot(device.user_id, deviceId);

  return {
    device,
    commands: commands.map(cmd => ({
      ...cmd,
      payload: '[REDACTED]', // Redact payload for security
    })),
    conflicts,
    media,
    snapshot,
  };
}

/**
 * Check if controlled action is allowed offline
 */
export function isControlledActionAllowed(deviceId: string, userId: string): {
  allowed: boolean;
  reason?: string;
} {
  const device = getDeviceById(deviceId);
  if (!device) {
    return { allowed: false, reason: 'Device not registered' };
  }

  if (device.status !== 'TRUSTED') {
    return { allowed: false, reason: `Device status: ${device.status}` };
  }

  const snapshot = getLatestSnapshot(userId, deviceId);
  if (!snapshot) {
    return { allowed: false, reason: 'No valid snapshot available' };
  }

  const snapshotAge = (Date.now() - new Date(snapshot.generated_at).getTime()) / (1000 * 60 * 60);
  
  // CP-OFF-01: Hard limit check
  if (snapshotAge > 48) {
    return { allowed: false, reason: `Snapshot too old (${Math.floor(snapshotAge)}h). Hard limit: 48h` };
  }

  // Warning if approaching limit
  if (snapshotAge > 24) {
    console.warn(`[OFFLINE] Snapshot age warning: ${Math.floor(snapshotAge)}h (warning threshold: 24h)`);
  }

  return { allowed: true };
}
