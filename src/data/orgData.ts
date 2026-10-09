// ═══════════════════════════════════════════════════════════
// ORGANIZATION DATA — Part 05
// Enterprise hierarchy: Company → Business Unit → Division → 
// Department → Project → Site → Work Package → WBS → BOQ
// ═══════════════════════════════════════════════════════════

export interface Company {
  id: string;
  code: string;
  name: string;
  legalName: string;
  pan: string;
  gstin: string;
  cin: string;
  registeredAddress: string;
  baseCurrency: string;
  isActive: boolean;
  createdAt: string;
}

export interface BusinessUnit {
  id: string;
  companyId: string;
  code: string;
  name: string;
  headUserId: string;
  headUserName: string;
  isActive: boolean;
}

export interface Division {
  id: string;
  businessUnitId: string;
  code: string;
  name: string;
  headUserId: string;
  headUserName: string;
}

export interface Department {
  id: string;
  divisionId: string;
  code: string;
  name: string;
  headUserId: string;
  headUserName: string;
  costCentreId?: string;
}

export type ProjectLifecycleStatus = 
  | 'PROPOSED' 
  | 'TENDERING' 
  | 'AWARDED' 
  | 'MOBILISATION' 
  | 'ACTIVE' 
  | 'ON_HOLD' 
  | 'SUBSTANTIALLY_COMPLETE' 
  | 'DLP' 
  | 'CLOSED' 
  | 'ARCHIVED';

export type ProjectType = 
  | 'BUILDING' 
  | 'ROAD' 
  | 'BRIDGE' 
  | 'IRRIGATION' 
  | 'RAILWAY' 
  | 'INDUSTRIAL' 
  | 'INFRA' 
  | 'OTHER';

export type ContractMode = 
  | 'ITEM_RATE' 
  | 'LS' 
  | 'EPC' 
  | 'HAM' 
  | 'COST_PLUS' 
  | 'SUBCONTRACT' 
  | 'OTHER';

export interface Project {
  id: string;
  projectCode: string;
  companyId: string;
  companyName: string;
  businessUnitId: string;
  businessUnitName: string;
  divisionId: string;
  divisionName: string;
  name: string;
  clientName: string;
  projectType: ProjectType;
  contractMode: ContractMode;
  contractValue: number;
  startDate: string;
  plannedFinish: string;
  revisedFinish?: string;
  lifecycleStatus: ProjectLifecycleStatus;
  legacyStatus?: string;
  projectManagerId: string;
  projectManagerName: string;
  planningManagerId?: string;
  planningManagerName?: string;
  commercialManagerId?: string;
  commercialManagerName?: string;
  costCentreId: string;
  costCentreName: string;
  profitCentreId: string;
  profitCentreName: string;
  stateCode: string;
  district: string;
  location: string;
  latitude?: number;
  longitude?: number;
  description?: string;
  isActive: boolean;
  createdAt: string;
}

export type SiteStatus = 
  | 'PLANNED' 
  | 'MOBILISING' 
  | 'ACTIVE' 
  | 'SUSPENDED' 
  | 'DEMOBILISING' 
  | 'CLOSED';

export interface Site {
  id: string;
  siteCode: string;
  projectId: string;
  projectName: string;
  name: string;
  siteManagerId: string;
  siteManagerName: string;
  address: string;
  stateCode: string;
  latitude: number;
  longitude: number;
  status: SiteStatus;
  timezone: string;
  hasGeofence: boolean;
  geofenceType?: 'circle' | 'polygon';
  geofenceRadius?: number;
  isActive: boolean;
  createdAt: string;
}

export interface Geofence {
  id: string;
  siteId: string;
  type: 'circle' | 'polygon';
  centerLat: number;
  centerLng: number;
  radiusM?: number;
  polygonGeoJson?: any;
  accuracyToleranceM: number;
  validFrom: string;
  validTo?: string;
  version: number;
  approvedBy: string;
  approvedByName: string;
  reason: string;
  createdAt: string;
}

export interface ProjectAllocation {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  projectId: string;
  projectName: string;
  siteId?: string;
  siteName?: string;
  roleOnProject: string;
  fromDate: string;
  toDate?: string;
  allocationPercent: number;
  isActive: boolean;
}

export interface CostCentre {
  id: string;
  companyId: string;
  code: string;
  name: string;
  parentId?: string;
  type: 'project' | 'overhead' | 'plant' | 'department';
  validFrom: string;
  validTo?: string;
  isActive: boolean;
}

export interface ProfitCentre {
  id: string;
  companyId: string;
  code: string;
  name: string;
  parentId?: string;
  isActive: boolean;
}

export interface Branch {
  id: string;
  companyId: string;
  type: 'branch' | 'regional_office' | 'site_office' | 'yard' | 'plant_depot';
  code: string;
  name: string;
  address: string;
  gstin?: string;
  stateCode: string;
  latitude?: number;
  longitude?: number;
  isActive: boolean;
}

// ═══════════════════════════════════════════════════════════
// SAMPLE DATA
// ═══════════════════════════════════════════════════════════

export const companies: Company[] = [
  {
    id: 'company-001',
    code: 'ACME',
    name: 'Acme Infrastructure Ltd',
    legalName: 'Acme Infrastructure Limited',
    pan: 'AAACA1234F',
    gstin: '27AAACA1234F1Z5',
    cin: 'U45200MH2010PTC123456',
    registeredAddress: '101, Business Park, Andheri East, Mumbai - 400069',
    baseCurrency: 'INR',
    isActive: true,
    createdAt: '2010-04-01',
  },
];

export const businessUnits: BusinessUnit[] = [
  {
    id: 'bu-001',
    companyId: 'company-001',
    code: 'BU-CIVIL',
    name: 'Civil Construction',
    headUserId: 'user-001',
    headUserName: 'Rajesh Kumar',
    isActive: true,
  },
  {
    id: 'bu-002',
    companyId: 'company-001',
    code: 'BU-MECH',
    name: 'Mechanical & Electrical',
    headUserId: 'user-002',
    headUserName: 'Priya Sharma',
    isActive: true,
  },
  {
    id: 'bu-003',
    companyId: 'company-001',
    code: 'BU-INFRA',
    name: 'Infrastructure',
    headUserId: 'user-003',
    headUserName: 'Amit Verma',
    isActive: true,
  },
];

export const divisions: Division[] = [
  {
    id: 'div-001',
    businessUnitId: 'bu-001',
    code: 'DIV-BLDG',
    name: 'Buildings',
    headUserId: 'user-004',
    headUserName: 'Vikram Mehta',
  },
  {
    id: 'div-002',
    businessUnitId: 'bu-001',
    code: 'DIV-RES',
    name: 'Residential',
    headUserId: 'user-005',
    headUserName: 'Suresh Patel',
  },
  {
    id: 'div-003',
    businessUnitId: 'bu-003',
    code: 'DIV-ROAD',
    name: 'Roads & Highways',
    headUserId: 'user-006',
    headUserName: 'Karan Singh',
  },
];

export const departments: Department[] = [
  {
    id: 'dept-001',
    divisionId: 'div-001',
    code: 'DEPT-PROJ',
    name: 'Project Management',
    headUserId: 'user-007',
    headUserName: 'Deepak Rao',
  },
  {
    id: 'dept-002',
    divisionId: 'div-001',
    code: 'DEPT-EST',
    name: 'Estimation & Planning',
    headUserId: 'user-008',
    headUserName: 'Meena Joshi',
  },
  {
    id: 'dept-003',
    divisionId: 'div-002',
    code: 'DEPT-SITE',
    name: 'Site Execution',
    headUserId: 'user-009',
    headUserName: 'Ravi Nair',
  },
];

export const costCentres: CostCentre[] = [
  {
    id: 'cc-001',
    companyId: 'company-001',
    code: 'CC-PROJ-001',
    name: 'Riverside Tower Project',
    type: 'project',
    validFrom: '2023-04-01',
    isActive: true,
  },
  {
    id: 'cc-002',
    companyId: 'company-001',
    code: 'CC-PROJ-002',
    name: 'Green Valley Residences',
    type: 'project',
    validFrom: '2023-06-15',
    isActive: true,
  },
  {
    id: 'cc-003',
    companyId: 'company-001',
    code: 'CC-OH-ADMIN',
    name: 'Administration Overhead',
    type: 'overhead',
    validFrom: '2023-04-01',
    isActive: true,
  },
];

export const profitCentres: ProfitCentre[] = [
  {
    id: 'pc-001',
    companyId: 'company-001',
    code: 'PC-CIVIL',
    name: 'Civil Construction Division',
    isActive: true,
  },
  {
    id: 'pc-002',
    companyId: 'company-001',
    code: 'PC-INFRA',
    name: 'Infrastructure Division',
    isActive: true,
  },
];

export const branches: Branch[] = [
  {
    id: 'branch-001',
    companyId: 'company-001',
    type: 'branch',
    code: 'BR-MUM',
    name: 'Mumbai Head Office',
    address: '101, Business Park, Andheri East, Mumbai - 400069',
    gstin: '27AAACA1234F1Z5',
    stateCode: '27',
    latitude: 19.1136,
    longitude: 72.8697,
    isActive: true,
  },
  {
    id: 'branch-002',
    companyId: 'company-001',
    type: 'regional_office',
    code: 'BR-PUNE',
    name: 'Pune Regional Office',
    address: '202, Tech Park, Hinjewadi, Pune - 411057',
    gstin: '27AAACA1234F2Z3',
    stateCode: '27',
    latitude: 18.5912,
    longitude: 73.7390,
    isActive: true,
  },
  {
    id: 'branch-003',
    companyId: 'company-001',
    type: 'site_office',
    code: 'BR-RT-SITE',
    name: 'Riverside Tower Site Office',
    address: 'Riverside Tower Construction Site, Kothrud, Pune',
    stateCode: '27',
    latitude: 18.5089,
    longitude: 73.8169,
    isActive: true,
  },
];

export const projects: Project[] = [
  {
    id: 'project-001',
    projectCode: 'PRJ-2023-001',
    companyId: 'company-001',
    companyName: 'Acme Infrastructure Ltd',
    businessUnitId: 'bu-001',
    businessUnitName: 'Civil Construction',
    divisionId: 'div-001',
    divisionName: 'Buildings',
    name: 'Riverside Tower - Phase II',
    clientName: 'Riverside Developers Pvt Ltd',
    projectType: 'BUILDING',
    contractMode: 'ITEM_RATE',
    contractValue: 128000000,
    startDate: '2023-04-01',
    plannedFinish: '2025-09-30',
    lifecycleStatus: 'ACTIVE',
    legacyStatus: 'In Progress',
    projectManagerId: 'user-010',
    projectManagerName: 'Rajesh Kumar',
    planningManagerId: 'user-011',
    planningManagerName: 'Vikram Mehta',
    commercialManagerId: 'user-012',
    commercialManagerName: 'Priya Sharma',
    costCentreId: 'cc-001',
    costCentreName: 'Riverside Tower Project',
    profitCentreId: 'pc-001',
    profitCentreName: 'Civil Construction Division',
    stateCode: '27',
    district: 'Pune',
    location: 'Kothrud, Pune',
    latitude: 18.5089,
    longitude: 73.8169,
    description: 'G+25 residential tower with basement parking',
    isActive: true,
    createdAt: '2023-03-15',
  },
  {
    id: 'project-002',
    projectCode: 'PRJ-2023-002',
    companyId: 'company-001',
    companyName: 'Acme Infrastructure Ltd',
    businessUnitId: 'bu-001',
    businessUnitName: 'Civil Construction',
    divisionId: 'div-002',
    divisionName: 'Residential',
    name: 'Green Valley Residences',
    clientName: 'Green Valley Homes Ltd',
    projectType: 'BUILDING',
    contractMode: 'LS',
    contractValue: 85000000,
    startDate: '2023-06-15',
    plannedFinish: '2025-12-31',
    lifecycleStatus: 'ACTIVE',
    legacyStatus: 'In Progress',
    projectManagerId: 'user-013',
    projectManagerName: 'Suresh Patel',
    costCentreId: 'cc-002',
    costCentreName: 'Green Valley Residences',
    profitCentreId: 'pc-001',
    profitCentreName: 'Civil Construction Division',
    stateCode: '27',
    district: 'Mumbai',
    location: 'Powai, Mumbai',
    latitude: 19.1176,
    longitude: 72.9060,
    description: '4 towers of G+15 residential apartments',
    isActive: true,
    createdAt: '2023-05-20',
  },
  {
    id: 'project-003',
    projectCode: 'PRJ-2023-003',
    companyId: 'company-001',
    companyName: 'Acme Infrastructure Ltd',
    businessUnitId: 'bu-003',
    businessUnitName: 'Infrastructure',
    divisionId: 'div-003',
    divisionName: 'Roads & Highways',
    name: 'Metro Link Bridge',
    clientName: 'Bangalore Metro Rail Corporation',
    projectType: 'BRIDGE',
    contractMode: 'EPC',
    contractValue: 245000000,
    startDate: '2023-01-01',
    plannedFinish: '2024-06-30',
    revisedFinish: '2024-09-30',
    lifecycleStatus: 'ACTIVE',
    legacyStatus: 'In Progress',
    projectManagerId: 'user-014',
    projectManagerName: 'Amit Verma',
    costCentreId: 'cc-001',
    costCentreName: 'Riverside Tower Project',
    profitCentreId: 'pc-002',
    profitCentreName: 'Infrastructure Division',
    stateCode: '29',
    district: 'Bangalore',
    location: 'Whitefield, Bangalore',
    latitude: 12.9698,
    longitude: 77.7500,
    description: 'Elevated metro corridor with 8 spans',
    isActive: true,
    createdAt: '2022-11-10',
  },
  {
    id: 'project-004',
    projectCode: 'PRJ-2024-001',
    companyId: 'company-001',
    companyName: 'Acme Infrastructure Ltd',
    businessUnitId: 'bu-003',
    businessUnitName: 'Infrastructure',
    divisionId: 'div-003',
    divisionName: 'Roads & Highways',
    name: 'Highway Expansion Km 42-58',
    clientName: 'National Highways Authority of India',
    projectType: 'ROAD',
    contractMode: 'HAM',
    contractValue: 180000000,
    startDate: '2023-03-15',
    plannedFinish: '2025-03-14',
    lifecycleStatus: 'ACTIVE',
    legacyStatus: 'In Progress',
    projectManagerId: 'user-015',
    projectManagerName: 'Karan Singh',
    costCentreId: 'cc-001',
    costCentreName: 'Riverside Tower Project',
    profitCentreId: 'pc-002',
    profitCentreName: 'Infrastructure Division',
    stateCode: '36',
    district: 'Hyderabad',
    location: 'NH-65, Hyderabad',
    latitude: 17.3850,
    longitude: 78.4867,
    description: '6-lane highway expansion with 2 interchanges',
    isActive: true,
    createdAt: '2023-02-28',
  },
  {
    id: 'project-005',
    projectCode: 'PRJ-2024-002',
    companyId: 'company-001',
    companyName: 'Acme Infrastructure Ltd',
    businessUnitId: 'bu-001',
    businessUnitName: 'Civil Construction',
    divisionId: 'div-001',
    divisionName: 'Buildings',
    name: 'Industrial Park Warehouse',
    clientName: 'LogiPark India Pvt Ltd',
    projectType: 'INDUSTRIAL',
    contractMode: 'ITEM_RATE',
    contractValue: 52000000,
    startDate: '2023-09-01',
    plannedFinish: '2025-02-28',
    lifecycleStatus: 'MOBILISATION',
    legacyStatus: 'Mobilizing',
    projectManagerId: 'user-016',
    projectManagerName: 'Deepak Rao',
    costCentreId: 'cc-001',
    costCentreName: 'Riverside Tower Project',
    profitCentreId: 'pc-001',
    profitCentreName: 'Civil Construction Division',
    stateCode: '33',
    district: 'Chennai',
    location: 'Sriperumbudur, Chennai',
    latitude: 13.0878,
    longitude: 80.0395,
    description: 'Pre-engineered warehouse complex - 5 lakh sqft',
    isActive: true,
    createdAt: '2023-08-15',
  },
];

export const sites: Site[] = [
  {
    id: 'site-001',
    siteCode: 'SITE-RT-01',
    projectId: 'project-001',
    projectName: 'Riverside Tower - Phase II',
    name: 'Main Construction Site',
    siteManagerId: 'user-017',
    siteManagerName: 'Suresh Kumar',
    address: 'Riverside Tower Construction Site, Kothrud, Pune - 411038',
    stateCode: '27',
    latitude: 18.5089,
    longitude: 73.8169,
    status: 'ACTIVE',
    timezone: 'Asia/Kolkata',
    hasGeofence: true,
    geofenceType: 'circle',
    geofenceRadius: 500,
    isActive: true,
    createdAt: '2023-04-01',
  },
  {
    id: 'site-002',
    siteCode: 'SITE-RT-02',
    projectId: 'project-001',
    projectName: 'Riverside Tower - Phase II',
    name: 'Batch Plant & Storage Yard',
    siteManagerId: 'user-018',
    siteManagerName: 'Mohan Das',
    address: 'Adjacent Plot, Kothrud, Pune - 411038',
    stateCode: '27',
    latitude: 18.5095,
    longitude: 73.8175,
    status: 'ACTIVE',
    timezone: 'Asia/Kolkata',
    hasGeofence: true,
    geofenceType: 'polygon',
    isActive: true,
    createdAt: '2023-04-15',
  },
  {
    id: 'site-003',
    siteCode: 'SITE-GV-01',
    projectId: 'project-002',
    projectName: 'Green Valley Residences',
    name: 'Main Site - Powai',
    siteManagerId: 'user-019',
    siteManagerName: 'Anil Sharma',
    address: 'Green Valley Construction Site, Powai, Mumbai - 400076',
    stateCode: '27',
    latitude: 19.1176,
    longitude: 72.9060,
    status: 'ACTIVE',
    timezone: 'Asia/Kolkata',
    hasGeofence: true,
    geofenceType: 'circle',
    geofenceRadius: 800,
    isActive: true,
    createdAt: '2023-06-15',
  },
  {
    id: 'site-004',
    siteCode: 'SITE-ML-01',
    projectId: 'project-003',
    projectName: 'Metro Link Bridge',
    name: 'Bridge Construction Site',
    siteManagerId: 'user-020',
    siteManagerName: 'Vijay Patil',
    address: 'Metro Corridor, Whitefield, Bangalore - 560066',
    stateCode: '29',
    latitude: 12.9698,
    longitude: 77.7500,
    status: 'ACTIVE',
    timezone: 'Asia/Kolkata',
    hasGeofence: true,
    geofenceType: 'polygon',
    isActive: true,
    createdAt: '2023-01-15',
  },
];

export const geofences: Geofence[] = [
  {
    id: 'geo-001',
    siteId: 'site-001',
    type: 'circle',
    centerLat: 18.5089,
    centerLng: 73.8169,
    radiusM: 500,
    accuracyToleranceM: 20,
    validFrom: '2023-04-01',
    version: 1,
    approvedBy: 'user-001',
    approvedByName: 'Rajesh Kumar',
    reason: 'Initial geofence setup for project mobilization',
    createdAt: '2023-03-28',
  },
  {
    id: 'geo-002',
    siteId: 'site-002',
    type: 'polygon',
    centerLat: 18.5095,
    centerLng: 73.8175,
    polygonGeoJson: {
      type: 'Polygon',
      coordinates: [[
        [73.8160, 18.5090],
        [73.8190, 18.5090],
        [73.8190, 18.5100],
        [73.8160, 18.5100],
        [73.8160, 18.5090],
      ]],
    },
    accuracyToleranceM: 15,
    validFrom: '2023-04-15',
    version: 1,
    approvedBy: 'user-001',
    approvedByName: 'Rajesh Kumar',
    reason: 'Batch plant area demarcation',
    createdAt: '2023-04-10',
  },
];

export const allocations: ProjectAllocation[] = [
  {
    id: 'alloc-001',
    userId: 'user-010',
    userName: 'Rajesh Kumar',
    userEmail: 'rajesh.kumar@acme-infra.com',
    projectId: 'project-001',
    projectName: 'Riverside Tower - Phase II',
    roleOnProject: 'Project Manager',
    fromDate: '2023-04-01',
    allocationPercent: 100,
    isActive: true,
  },
  {
    id: 'alloc-002',
    userId: 'user-017',
    userName: 'Suresh Kumar',
    userEmail: 'suresh.kumar@acme-infra.com',
    projectId: 'project-001',
    projectName: 'Riverside Tower - Phase II',
    siteId: 'site-001',
    siteName: 'Main Construction Site',
    roleOnProject: 'Site Engineer',
    fromDate: '2023-04-01',
    allocationPercent: 100,
    isActive: true,
  },
  {
    id: 'alloc-003',
    userId: 'user-011',
    userName: 'Vikram Mehta',
    userEmail: 'vikram.mehta@acme-infra.com',
    projectId: 'project-001',
    projectName: 'Riverside Tower - Phase II',
    roleOnProject: 'Planning Manager',
    fromDate: '2023-04-01',
    allocationPercent: 50,
    isActive: true,
  },
  {
    id: 'alloc-004',
    userId: 'user-013',
    userName: 'Suresh Patel',
    userEmail: 'suresh.patel@acme-infra.com',
    projectId: 'project-002',
    projectName: 'Green Valley Residences',
    roleOnProject: 'Project Manager',
    fromDate: '2023-06-15',
    allocationPercent: 100,
    isActive: true,
  },
  {
    id: 'alloc-005',
    userId: 'user-019',
    userName: 'Anil Sharma',
    userEmail: 'anil.sharma@acme-infra.com',
    projectId: 'project-002',
    projectName: 'Green Valley Residences',
    siteId: 'site-003',
    siteName: 'Main Site - Powai',
    roleOnProject: 'Site Engineer',
    fromDate: '2023-06-15',
    allocationPercent: 100,
    isActive: true,
  },
];

// ═══════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════

export function getProjectLifecycleStatusColor(status: ProjectLifecycleStatus): string {
  const colors: Record<ProjectLifecycleStatus, string> = {
    PROPOSED: 'var(--text-muted)',
    TENDERING: 'var(--info-600)',
    AWARDED: 'var(--brand-600)',
    MOBILISATION: 'var(--warning-600)',
    ACTIVE: 'var(--success-600)',
    ON_HOLD: 'var(--warning-600)',
    SUBSTANTIALLY_COMPLETE: 'var(--info-600)',
    DLP: 'var(--info-600)',
    CLOSED: 'var(--text-muted)',
    ARCHIVED: 'var(--text-muted)',
  };
  return colors[status];
}

export function getProjectLifecycleStatusLabel(status: ProjectLifecycleStatus): string {
  const labels: Record<ProjectLifecycleStatus, string> = {
    PROPOSED: 'Proposed',
    TENDERING: 'Tendering',
    AWARDED: 'Awarded',
    MOBILISATION: 'Mobilisation',
    ACTIVE: 'Active',
    ON_HOLD: 'On Hold',
    SUBSTANTIALLY_COMPLETE: 'Substantially Complete',
    DLP: 'Defect Liability',
    CLOSED: 'Closed',
    ARCHIVED: 'Archived',
  };
  return labels[status];
}

export function getSiteStatusColor(status: SiteStatus): string {
  const colors: Record<SiteStatus, string> = {
    PLANNED: 'var(--text-muted)',
    MOBILISING: 'var(--warning-600)',
    ACTIVE: 'var(--success-600)',
    SUSPENDED: 'var(--error-600)',
    DEMOBILISING: 'var(--warning-600)',
    CLOSED: 'var(--text-muted)',
  };
  return colors[status];
}

export function getSiteStatusLabel(status: SiteStatus): string {
  const labels: Record<SiteStatus, string> = {
    PLANNED: 'Planned',
    MOBILISING: 'Mobilising',
    ACTIVE: 'Active',
    SUSPENDED: 'Suspended',
    DEMOBILISING: 'Demobilising',
    CLOSED: 'Closed',
  };
  return labels[status];
}
