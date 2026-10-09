// ═══════════════════════════════════════════════════════════
// OFFLINE DATA MODEL — Part 22
// Offline-First Field Mobile Engine
// ═══════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════
// DEVICE MANAGEMENT
// ═══════════════════════════════════════════════════════════

export interface OfflineDevice {
  id: string;
  device_id: string;
  user_id: string;
  user_name: string;
  platform: string;
  app_version: string;
  snapshot_version: number;
  last_sync_at: string;
  registered_at: string;
  status: 'PENDING' | 'TRUSTED' | 'REVOKED';
  encryption_key_hash: string;
  push_token?: string;
  queue_size: number;
  pending_conflicts: number;
}

// ═══════════════════════════════════════════════════════════
// COMMAND QUEUE
// ═══════════════════════════════════════════════════════════

export type CommandType = 
  | 'CREATE_DPR'
  | 'UPDATE_DPR'
  | 'MARK_ATTENDANCE'
  | 'CREATE_INSPECTION'
  | 'UPDATE_INSPECTION'
  | 'CREATE_MATERIAL_RECEIPT'
  | 'CREATE_MATERIAL_ISSUE_REQUEST'
  | 'CREATE_HSE_OBSERVATION'
  | 'UPLOAD_PHOTO'
  | 'CREATE_TASK_UPDATE'
  | 'CREATE_RFI_DRAFT';

export interface OfflineCommand {
  command_id: string;
  device_id: string;
  user_id: string;
  type: CommandType;
  payload_hash: string;
  payload: Record<string, any>;
  base_versions_json: Record<string, number>;
  device_time: string;
  gps_latitude?: number;
  gps_longitude?: number;
  gps_accuracy?: number;
  created_at: string;
  status: 'QUEUED' | 'SENDING' | 'ACCEPTED' | 'REJECTED' | 'CONFLICT';
  result_code?: string;
  result_message?: string;
  record_ref?: string;
  retry_count: number;
  max_retries: number;
  server_received_at?: string;
}

// ═══════════════════════════════════════════════════════════
// CONFLICTS
// ═══════════════════════════════════════════════════════════

export type ConflictResolution = 'KEEP_MINE' | 'KEEP_SERVER' | 'MERGE';

export interface OfflineConflict {
  id: string;
  command_id: string;
  record_type: string;
  record_id: string;
  record_label: string;
  server_version: number;
  client_base_version: number;
  client_current_version: number;
  fields_json: Array<{
    field_name: string;
    server_value: any;
    client_value: any;
    resolution?: ConflictResolution;
    merged_value?: any;
  }>;
  status: 'OPEN' | 'RESOLVED' | 'DISMISSED';
  created_at: string;
  resolved_at?: string;
  resolved_by?: string;
  resolution?: ConflictResolution;
  resolution_notes?: string;
  requires_supervisor: boolean;
  supervisor_approved?: boolean;
  supervisor_approved_at?: string;
  supervisor_approved_by?: string;
}

// ═══════════════════════════════════════════════════════════
// SNAPSHOTS
// ═══════════════════════════════════════════════════════════

export interface OfflineSnapshot {
  id: string;
  user_id: string;
  device_id: string;
  scope_json: {
    project_ids: string[];
    site_ids: string[];
    include_master_data: boolean;
  };
  version: number;
  generated_at: string;
  expires_at: string;
  size_bytes: number;
  record_count: number;
  status: 'GENERATING' | 'READY' | 'EXPIRED' | 'ERROR';
  error_message?: string;
}

export interface SnapshotRecord {
  id: string;
  snapshot_id: string;
  record_type: string;
  record_id: string;
  data: Record<string, any>;
  version: number;
  updated_at: string;
}

// ═══════════════════════════════════════════════════════════
// MEDIA UPLOADS
// ═══════════════════════════════════════════════════════════

export interface MediaUpload {
  id: string;
  file_id: string;
  device_id: string;
  user_id: string;
  command_id?: string;
  filename: string;
  mime_type: string;
  size_bytes: number;
  hash: string;
  chunks_total: number;
  chunks_received: number;
  status: 'PENDING' | 'UPLOADING' | 'UPLOADED' | 'PROCESSING' | 'COMPLETE' | 'FAILED';
  error_message?: string;
  created_at: string;
  uploaded_at?: string;
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

// ═══════════════════════════════════════════════════════════
// SYNC STATUS
// ═══════════════════════════════════════════════════════════

export type SyncStatus = 'OFFLINE' | 'QUEUED' | 'SYNCING' | 'SYNCED' | 'CONFLICT' | 'FAILED';

export interface SyncStatusInfo {
  status: SyncStatus;
  last_sync_at?: string;
  pending_commands: number;
  failed_commands: number;
  open_conflicts: number;
  uploading_media: number;
  snapshot_age_hours?: number;
  snapshot_fresh: boolean;
  device_online: boolean;
}

// ═══════════════════════════════════════════════════════════
// SAMPLE DATA
// ═══════════════════════════════════════════════════════════

export const offlineDevices: OfflineDevice[] = [
  {
    id: 'off-dev-001',
    device_id: 'device-001',
    user_id: 'user-017',
    user_name: 'Suresh Kumar',
    platform: 'Android Chrome',
    app_version: '1.2.0',
    snapshot_version: 45,
    last_sync_at: '2024-01-16T11:30:00Z',
    registered_at: '2024-01-10T00:00:00Z',
    status: 'TRUSTED',
    encryption_key_hash: 'sha256:abc123def456',
    push_token: 'android-push-token-456',
    queue_size: 3,
    pending_conflicts: 0,
  },
  {
    id: 'off-dev-002',
    device_id: 'device-002',
    user_id: 'user-018',
    user_name: 'Mohan Das',
    platform: 'iOS Safari',
    app_version: '1.2.0',
    snapshot_version: 42,
    last_sync_at: '2024-01-16T10:00:00Z',
    registered_at: '2024-01-08T00:00:00Z',
    status: 'TRUSTED',
    encryption_key_hash: 'sha256:xyz789uvw012',
    push_token: 'ios-push-token-123',
    queue_size: 0,
    pending_conflicts: 2,
  },
  {
    id: 'off-dev-003',
    device_id: 'device-003',
    user_id: 'user-019',
    user_name: 'Anil Sharma',
    platform: 'Android Chrome',
    app_version: '1.1.5',
    snapshot_version: 38,
    last_sync_at: '2024-01-15T14:00:00Z',
    registered_at: '2024-01-05T00:00:00Z',
    status: 'PENDING',
    encryption_key_hash: 'sha256:mno345pqr678',
    queue_size: 12,
    pending_conflicts: 1,
  },
];

export const offlineCommands: OfflineCommand[] = [
  {
    command_id: 'cmd-001',
    device_id: 'device-001',
    user_id: 'user-017',
    type: 'CREATE_DPR',
    payload_hash: 'sha256:cmd001hash',
    payload: {
      dpr_number: 'DPR-2024-001',
      project_id: 'project-001',
      site_id: 'site-001',
      date: '2024-01-16',
      weather: 'Clear',
      work_description: 'Foundation concrete pouring',
      manpower_count: 25,
      equipment_used: ['Concrete Mixer', 'Vibrator'],
    },
    base_versions_json: { 'project-001': 45, 'site-001': 38 },
    device_time: '2024-01-16T11:00:00Z',
    gps_latitude: 18.5089,
    gps_longitude: 73.8169,
    gps_accuracy: 15,
    created_at: '2024-01-16T11:00:00Z',
    status: 'QUEUED',
    retry_count: 0,
    max_retries: 3,
  },
  {
    command_id: 'cmd-002',
    device_id: 'device-001',
    user_id: 'user-017',
    type: 'MARK_ATTENDANCE',
    payload_hash: 'sha256:cmd002hash',
    payload: {
      date: '2024-01-16',
      site_id: 'site-001',
      entries: [
        { employee_id: 'emp-001', status: 'PRESENT', check_in: '08:00', check_out: '17:00' },
        { employee_id: 'emp-002', status: 'PRESENT', check_in: '08:15', check_out: '17:30' },
        { employee_id: 'emp-003', status: 'ABSENT' },
      ],
    },
    base_versions_json: { 'site-001': 38 },
    device_time: '2024-01-16T17:30:00Z',
    gps_latitude: 18.5089,
    gps_longitude: 73.8169,
    gps_accuracy: 10,
    created_at: '2024-01-16T17:30:00Z',
    status: 'ACCEPTED',
    result_code: 'SUCCESS',
    record_ref: 'attendance-2024-01-16-site-001',
    retry_count: 0,
    max_retries: 3,
    server_received_at: '2024-01-16T17:30:05Z',
  },
  {
    command_id: 'cmd-003',
    device_id: 'device-002',
    user_id: 'user-018',
    type: 'CREATE_INSPECTION',
    payload_hash: 'sha256:cmd003hash',
    payload: {
      inspection_type: 'QUALITY',
      project_id: 'project-001',
      wbs_id: 'wbs-001',
      checklist_id: 'checklist-001',
      inspector_comments: 'Concrete strength test passed',
      test_results: { strength_mpa: 35, required_mpa: 30 },
    },
    base_versions_json: { 'wbs-001': 12 },
    device_time: '2024-01-16T10:00:00Z',
    gps_latitude: 18.5095,
    gps_longitude: 73.8175,
    gps_accuracy: 20,
    created_at: '2024-01-16T10:00:00Z',
    status: 'CONFLICT',
    result_code: 'CONFLICT_VERSION',
    result_message: 'WBS version mismatch: server v13, client base v12',
    retry_count: 0,
    max_retries: 3,
  },
  {
    command_id: 'cmd-004',
    device_id: 'device-003',
    user_id: 'user-019',
    type: 'CREATE_MATERIAL_RECEIPT',
    payload_hash: 'sha256:cmd004hash',
    payload: {
      grn_number: 'GRN-2024-001',
      po_id: 'po-001',
      material_id: 'mat-001',
      quantity_received: 100,
      unit: 'MT',
      received_at: '2024-01-16T09:00:00Z',
      quality_check: 'PASSED',
    },
    base_versions_json: { 'po-001': 5, 'mat-001': 20 },
    device_time: '2024-01-16T09:00:00Z',
    created_at: '2024-01-16T09:00:00Z',
    status: 'REJECTED',
    result_code: 'PERMISSION_DENIED',
    result_message: 'User does not have material_receipt.create permission',
    retry_count: 3,
    max_retries: 3,
  },
];

export const offlineConflicts: OfflineConflict[] = [
  {
    id: 'conflict-001',
    command_id: 'cmd-003',
    record_type: 'Inspection',
    record_id: 'insp-001',
    record_label: 'Quality Inspection - WBS 001',
    server_version: 13,
    client_base_version: 12,
    client_current_version: 12,
    fields_json: [
      {
        field_name: 'test_results.strength_mpa',
        server_value: 32,
        client_value: 35,
      },
      {
        field_name: 'inspector_comments',
        server_value: 'Initial test completed',
        client_value: 'Concrete strength test passed',
      },
    ],
    status: 'OPEN',
    created_at: '2024-01-16T10:05:00Z',
    requires_supervisor: false,
  },
  {
    id: 'conflict-002',
    command_id: 'cmd-005',
    record_type: 'DPR',
    record_id: 'dpr-001',
    record_label: 'DPR 2024-01-16',
    server_version: 5,
    client_base_version: 4,
    client_current_version: 4,
    fields_json: [
      {
        field_name: 'manpower_count',
        server_value: 22,
        client_value: 25,
      },
      {
        field_name: 'work_description',
        server_value: 'Foundation work',
        client_value: 'Foundation concrete pouring',
      },
    ],
    status: 'OPEN',
    created_at: '2024-01-16T11:30:00Z',
    requires_supervisor: true,
  },
];

export const offlineSnapshots: OfflineSnapshot[] = [
  {
    id: 'snap-001',
    user_id: 'user-017',
    device_id: 'device-001',
    scope_json: {
      project_ids: ['project-001'],
      site_ids: ['site-001', 'site-002'],
      include_master_data: true,
    },
    version: 45,
    generated_at: '2024-01-16T06:00:00Z',
    expires_at: '2024-01-17T06:00:00Z',
    size_bytes: 15728640, // 15 MB
    record_count: 2450,
    status: 'READY',
  },
  {
    id: 'snap-002',
    user_id: 'user-018',
    device_id: 'device-002',
    scope_json: {
      project_ids: ['project-001', 'project-002'],
      site_ids: ['site-003'],
      include_master_data: true,
    },
    version: 42,
    generated_at: '2024-01-16T05:00:00Z',
    expires_at: '2024-01-17T05:00:00Z',
    size_bytes: 18874368, // 18 MB
    record_count: 3120,
    status: 'READY',
  },
];

export const mediaUploads: MediaUpload[] = [
  {
    id: 'media-001',
    file_id: 'file-001',
    device_id: 'device-001',
    user_id: 'user-017',
    command_id: 'cmd-001',
    filename: 'dpr_foundation_001.jpg',
    mime_type: 'image/jpeg',
    size_bytes: 2097152, // 2 MB
    hash: 'sha256:media001hash',
    chunks_total: 4,
    chunks_received: 4,
    status: 'COMPLETE',
    created_at: '2024-01-16T11:05:00Z',
    uploaded_at: '2024-01-16T11:05:30Z',
    metadata: {
      project_id: 'project-001',
      site_id: 'site-001',
      gps_latitude: 18.5089,
      gps_longitude: 73.8169,
      captured_at: '2024-01-16T11:00:00Z',
      watermark_text: 'Riverside Tower | 2024-01-16 | Suresh Kumar',
      compression_applied: true,
    },
  },
  {
    id: 'media-002',
    file_id: 'file-002',
    device_id: 'device-001',
    user_id: 'user-017',
    command_id: 'cmd-001',
    filename: 'dpr_foundation_002.jpg',
    mime_type: 'image/jpeg',
    size_bytes: 1887436, // 1.8 MB
    hash: 'sha256:media002hash',
    chunks_total: 4,
    chunks_received: 2,
    status: 'UPLOADING',
    created_at: '2024-01-16T11:06:00Z',
    metadata: {
      project_id: 'project-001',
      site_id: 'site-001',
      gps_latitude: 18.5089,
      gps_longitude: 73.8169,
      captured_at: '2024-01-16T11:01:00Z',
      watermark_text: 'Riverside Tower | 2024-01-16 | Suresh Kumar',
      compression_applied: true,
    },
  },
];

// ═══════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════

export function getDeviceById(deviceId: string): OfflineDevice | undefined {
  return offlineDevices.find(d => d.device_id === deviceId);
}

export function getDevicesByUser(userId: string): OfflineDevice[] {
  return offlineDevices.filter(d => d.user_id === userId);
}

export function getCommandsByDevice(deviceId: string): OfflineCommand[] {
  return offlineCommands.filter(c => c.device_id === deviceId);
}

export function getCommandsByStatus(status: OfflineCommand['status']): OfflineCommand[] {
  return offlineCommands.filter(c => c.status === status);
}

export function getConflictsByDevice(deviceId: string): OfflineConflict[] {
  const commands = getCommandsByDevice(deviceId);
  const commandIds = commands.map(c => c.command_id);
  return offlineConflicts.filter(conf => commandIds.includes(conf.command_id));
}

export function getConflictsByStatus(status: OfflineConflict['status']): OfflineConflict[] {
  return offlineConflicts.filter(c => c.status === status);
}

export function getLatestSnapshot(userId: string, deviceId: string): OfflineSnapshot | undefined {
  return offlineSnapshots
    .filter(s => s.user_id === userId && s.device_id === deviceId && s.status === 'READY')
    .sort((a, b) => new Date(b.generated_at).getTime() - new Date(a.generated_at).getTime())[0];
}

export function getMediaByCommand(commandId: string): MediaUpload[] {
  return mediaUploads.filter(m => m.command_id === commandId);
}

export function getMediaByDevice(deviceId: string): MediaUpload[] {
  return mediaUploads.filter(m => m.device_id === deviceId);
}

export function getSyncStatus(deviceId: string): SyncStatusInfo {
  const device = getDeviceById(deviceId);
  if (!device) {
    return {
      status: 'OFFLINE',
      pending_commands: 0,
      failed_commands: 0,
      open_conflicts: 0,
      uploading_media: 0,
      snapshot_fresh: false,
      device_online: false,
    };
  }

  const commands = getCommandsByDevice(deviceId);
  const conflicts = getConflictsByDevice(deviceId);
  const media = getMediaByDevice(deviceId);
  const snapshot = getLatestSnapshot(device.user_id, deviceId);

  const pendingCommands = commands.filter(c => c.status === 'QUEUED' || c.status === 'SENDING').length;
  const failedCommands = commands.filter(c => c.status === 'REJECTED' || (c.status === 'CONFLICT' && c.retry_count >= c.max_retries)).length;
  const openConflicts = conflicts.filter(c => c.status === 'OPEN').length;
  const uploadingMedia = media.filter(m => m.status === 'UPLOADING' || m.status === 'PENDING').length;

  let snapshotAgeHours: number | undefined;
  let snapshotFresh = false;
  if (snapshot) {
    const now = new Date();
    const generatedAt = new Date(snapshot.generated_at);
    snapshotAgeHours = (now.getTime() - generatedAt.getTime()) / (1000 * 60 * 60);
    snapshotFresh = snapshotAgeHours < 24; // Fresh if less than 24 hours old
  }

  let status: SyncStatus = 'SYNCED';
  if (failedCommands > 0 || openConflicts > 0) {
    status = 'CONFLICT';
  } else if (pendingCommands > 0 || uploadingMedia > 0) {
    status = 'SYNCING';
  } else if (!snapshotFresh) {
    status = 'OFFLINE';
  }

  return {
    status,
    last_sync_at: device.last_sync_at,
    pending_commands: pendingCommands,
    failed_commands: failedCommands,
    open_conflicts: openConflicts,
    uploading_media: uploadingMedia,
    snapshot_age_hours: snapshotAgeHours,
    snapshot_fresh: snapshotFresh,
    device_online: device.status === 'TRUSTED',
  };
}

export function getDeviceStatusColor(status: OfflineDevice['status']): string {
  const colors: Record<OfflineDevice['status'], string> = {
    PENDING: 'var(--warning-600)',
    TRUSTED: 'var(--success-600)',
    REVOKED: 'var(--error-600)',
  };
  return colors[status];
}

export function getCommandStatusColor(status: OfflineCommand['status']): string {
  const colors: Record<OfflineCommand['status'], string> = {
    QUEUED: 'var(--info-600)',
    SENDING: 'var(--warning-600)',
    ACCEPTED: 'var(--success-600)',
    REJECTED: 'var(--error-600)',
    CONFLICT: 'var(--error-700)',
  };
  return colors[status];
}

export function getConflictStatusColor(status: OfflineConflict['status']): string {
  const colors: Record<OfflineConflict['status'], string> = {
    OPEN: 'var(--error-600)',
    RESOLVED: 'var(--success-600)',
    DISMISSED: 'var(--text-muted)',
  };
  return colors[status];
}

export function getSyncStatusColor(status: SyncStatus): string {
  const colors: Record<SyncStatus, string> = {
    OFFLINE: 'var(--text-muted)',
    QUEUED: 'var(--info-600)',
    SYNCING: 'var(--warning-600)',
    SYNCED: 'var(--success-600)',
    CONFLICT: 'var(--error-600)',
    FAILED: 'var(--error-700)',
  };
  return colors[status];
}

export function getMediaStatusColor(status: MediaUpload['status']): string {
  const colors: Record<MediaUpload['status'], string> = {
    PENDING: 'var(--info-600)',
    UPLOADING: 'var(--warning-600)',
    UPLOADED: 'var(--info-600)',
    PROCESSING: 'var(--warning-600)',
    COMPLETE: 'var(--success-600)',
    FAILED: 'var(--error-600)',
  };
  return colors[status];
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

export function formatSnapshotAge(hours: number): string {
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${Math.floor(hours)}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
