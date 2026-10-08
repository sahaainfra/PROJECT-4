import {
  Home, LayoutGrid, FileText, ShoppingCart, Package, Building2, Users,
  Calculator, ClipboardCheck, HardHat, Truck, Wrench, BarChart3,
  Settings, Bell, Search, User, ChevronDown, Menu, X, Sun, Moon,
  Monitor, Eye, Layers, Database, Shield, GitBranch, Activity,
  FileSpreadsheet, Calendar, Clock, CheckCircle2, AlertTriangle,
  ArrowRight, ArrowLeft, Plus, Filter, Download, Upload, RefreshCw,
  MoreHorizontal, Mail, Phone, MapPin, Globe, Lock, Unlock,
  Star, Flag, Target, TrendingUp, TrendingDown, DollarSign,
  Percent, Hash, Grid3X3, List, Columns, Maximize2, Minimize2,
  PanelLeft, PanelRight, Command, Zap, BookOpen, HelpCircle,
  Info, AlertCircle, CheckSquare, Square, Circle, Triangle,
  Construction, HardHat as HardHatIcon, Ruler, PenTool,
  type LucideIcon
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════
// ICON REGISTRY (DS-10)
// One licensed outline icon family (Lucide) + semantic keys
// ═══════════════════════════════════════════════════════════

export const iconRegistry: Record<string, LucideIcon> = {
  // Navigation
  'nav.home': Home,
  'nav.dashboard': LayoutGrid,
  'nav.modules': Grid3X3,
  'nav.settings': Settings,
  'nav.search': Search,
  'nav.notifications': Bell,
  'nav.user': User,
  'nav.menu': Menu,
  'nav.close': X,

  // Modules
  'module.procurement': ShoppingCart,
  'module.inventory': Package,
  'module.project': Building2,
  'module.hr': Users,
  'module.finance': Calculator,
  'module.quality': ClipboardCheck,
  'module.safety': HardHat,
  'module.transport': Truck,
  'module.maintenance': Wrench,
  'module.reports': BarChart3,

  // Status
  'status.open': Circle,
  'status.progress': Activity,
  'status.approved': CheckCircle2,
  'status.rejected': AlertTriangle,
  'status.closed': CheckSquare,
  'status.warning': AlertCircle,
  'status.info': Info,

  // Actions
  'action.add': Plus,
  'action.filter': Filter,
  'action.download': Download,
  'action.upload': Upload,
  'action.refresh': RefreshCw,
  'action.more': MoreHorizontal,
  'action.edit': PenTool,
  'action.navigate': ArrowRight,
  'action.back': ArrowLeft,

  // Data
  'data.document': FileText,
  'data.spreadsheet': FileSpreadsheet,
  'data.calendar': Calendar,
  'data.clock': Clock,
  'data.mail': Mail,
  'data.phone': Phone,
  'data.location': MapPin,

  // KPI
  'kpi.trending-up': TrendingUp,
  'kpi.trending-down': TrendingDown,
  'kpi.money': DollarSign,
  'kpi.percent': Percent,
  'kpi.target': Target,
  'kpi.star': Star,
  'kpi.flag': Flag,

  // System
  'sys.theme-light': Sun,
  'sys.theme-dark': Moon,
  'sys.theme-hc': Monitor,
  'sys.density': Maximize2,
  'sys.database': Database,
  'sys.security': Shield,
  'sys.git': GitBranch,
  'sys.activity': Activity,
  'sys.layers': Layers,
  'sys.eye': Eye,
  'sys.lock': Lock,
  'sys.unlock': Unlock,
  'sys.globe': Globe,
  'sys.hash': Hash,
  'sys.command': Command,
  'sys.zap': Zap,
  'sys.book': BookOpen,
  'sys.help': HelpCircle,

  // Layout
  'layout.list': List,
  'layout.columns': Columns,
  'layout.grid': Grid3X3,
  'layout.panel-left': PanelLeft,
  'layout.panel-right': PanelRight,
  'layout.expand': Maximize2,
  'layout.collapse': Minimize2,

  // Construction
  'construction.building': Building2,
  'construction.helmet': HardHatIcon,
  'construction.ruler': Ruler,
  'construction.truck': Truck,
  'construction.wrench': Wrench,
};

export function getIcon(key: string): LucideIcon {
  return iconRegistry[key] || iconRegistry['sys.help'];
}

// ═══════════════════════════════════════════════════════════
// NAVIGATION REGISTRY (DS-13, DS-14)
// ═══════════════════════════════════════════════════════════

export interface NavEntry {
  id: string;
  group: string;
  labelKey: string;
  label: string;
  iconKey: string;
  route: string;
  surface: 'shell' | 'page' | 'modal';
  permissionKey: string;
  featureFlag: string;
  sortOrder: number;
  parentId?: string;
  keywords: string[];
  isActive: boolean;
  badge?: string;
  children?: NavEntry[];
}

export const navigationRegistry: NavEntry[] = [
  // Home
  {
    id: 'nav-home',
    group: 'Home',
    labelKey: 'nav.home',
    label: 'Home',
    iconKey: 'nav.home',
    route: '/',
    surface: 'shell',
    permissionKey: 'shell.home.view',
    featureFlag: 'ff.pgm.launchpad',
    sortOrder: 10,
    keywords: ['home', 'launchpad', 'dashboard', 'overview'],
    isActive: true,
  },
  // Procurement
  {
    id: 'nav-procurement',
    group: 'Procurement',
    labelKey: 'nav.procurement',
    label: 'Procurement',
    iconKey: 'module.procurement',
    route: '/procurement',
    surface: 'shell',
    permissionKey: 'procurement.module.view',
    featureFlag: 'ff.modules.procurement',
    sortOrder: 100,
    keywords: ['purchase', 'procurement', 'vendor', 'supplier'],
    isActive: true,
    children: [
      {
        id: 'nav-pr',
        group: 'Procurement',
        labelKey: 'nav.pr',
        label: 'Purchase Requisitions',
        iconKey: 'data.document',
        route: '/procurement/requisitions',
        surface: 'page',
        permissionKey: 'procurement.pr.view',
        featureFlag: 'ff.modules.procurement',
        sortOrder: 101,
        parentId: 'nav-procurement',
        keywords: ['pr', 'requisition', 'request'],
        isActive: true,
      },
      {
        id: 'nav-po',
        group: 'Procurement',
        labelKey: 'nav.po',
        label: 'Purchase Orders',
        iconKey: 'data.document',
        route: '/procurement/orders',
        surface: 'page',
        permissionKey: 'procurement.po.view',
        featureFlag: 'ff.modules.procurement',
        sortOrder: 102,
        parentId: 'nav-procurement',
        keywords: ['po', 'order', 'purchase order'],
        isActive: true,
      },
    ],
  },
  // Inventory
  {
    id: 'nav-inventory',
    group: 'Inventory',
    labelKey: 'nav.inventory',
    label: 'Inventory',
    iconKey: 'module.inventory',
    route: '/inventory',
    surface: 'shell',
    permissionKey: 'inventory.module.view',
    featureFlag: 'ff.modules.inventory',
    sortOrder: 200,
    keywords: ['stock', 'material', 'inventory', 'warehouse'],
    isActive: true,
    children: [
      {
        id: 'nav-grn',
        group: 'Inventory',
        labelKey: 'nav.grn',
        label: 'Goods Receipt',
        iconKey: 'data.document',
        route: '/inventory/grn',
        surface: 'page',
        permissionKey: 'inventory.grn.view',
        featureFlag: 'ff.modules.inventory',
        sortOrder: 201,
        parentId: 'nav-inventory',
        keywords: ['grn', 'receipt', 'goods', 'receiving'],
        isActive: true,
      },
      {
        id: 'nav-stock',
        group: 'Inventory',
        labelKey: 'nav.stock',
        label: 'Stock Register',
        iconKey: 'data.spreadsheet',
        route: '/inventory/stock',
        surface: 'page',
        permissionKey: 'inventory.stock.view',
        featureFlag: 'ff.modules.inventory',
        sortOrder: 202,
        parentId: 'nav-inventory',
        keywords: ['stock', 'register', 'balance'],
        isActive: true,
      },
    ],
  },
  // Projects
  {
    id: 'nav-projects',
    group: 'Projects',
    labelKey: 'nav.projects',
    label: 'Projects',
    iconKey: 'module.project',
    route: '/projects',
    surface: 'shell',
    permissionKey: 'project.module.view',
    featureFlag: 'ff.modules.project',
    sortOrder: 300,
    keywords: ['project', 'construction', 'site', 'wbs'],
    isActive: true,
    children: [
      {
        id: 'nav-project-list',
        group: 'Projects',
        labelKey: 'nav.projectList',
        label: 'Project Register',
        iconKey: 'data.document',
        route: '/projects/list',
        surface: 'page',
        permissionKey: 'project.list.view',
        featureFlag: 'ff.modules.project',
        sortOrder: 301,
        parentId: 'nav-projects',
        keywords: ['project', 'register', 'list'],
        isActive: true,
      },
      {
        id: 'nav-boq',
        group: 'Projects',
        labelKey: 'nav.boq',
        label: 'BOQ',
        iconKey: 'data.spreadsheet',
        route: '/projects/boq',
        surface: 'page',
        permissionKey: 'project.boq.view',
        featureFlag: 'ff.modules.project',
        sortOrder: 302,
        parentId: 'nav-projects',
        keywords: ['boq', 'bill of quantities', 'estimate'],
        isActive: true,
      },
    ],
  },
  // Finance
  {
    id: 'nav-finance',
    group: 'Finance',
    labelKey: 'nav.finance',
    label: 'Finance',
    iconKey: 'module.finance',
    route: '/finance',
    surface: 'shell',
    permissionKey: 'finance.module.view',
    featureFlag: 'ff.modules.finance',
    sortOrder: 400,
    keywords: ['finance', 'accounting', 'ledger', 'payment'],
    isActive: true,
    children: [
      {
        id: 'nav-bills',
        group: 'Finance',
        labelKey: 'nav.bills',
        label: 'Subcontractor Bills',
        iconKey: 'data.document',
        route: '/finance/bills',
        surface: 'page',
        permissionKey: 'finance.bills.view',
        featureFlag: 'ff.modules.finance',
        sortOrder: 401,
        parentId: 'nav-finance',
        keywords: ['bill', 'invoice', 'subcontractor', 'payment'],
        isActive: true,
      },
    ],
  },
  // HR
  {
    id: 'nav-hr',
    group: 'Human Resources',
    labelKey: 'nav.hr',
    label: 'Human Resources',
    iconKey: 'module.hr',
    route: '/hr',
    surface: 'shell',
    permissionKey: 'hr.module.view',
    featureFlag: 'ff.modules.hr',
    sortOrder: 500,
    keywords: ['hr', 'human resources', 'employee', 'payroll', 'attendance'],
    isActive: true,
    children: [
      {
        id: 'nav-attendance',
        group: 'Human Resources',
        labelKey: 'nav.attendance',
        label: 'Attendance',
        iconKey: 'data.calendar',
        route: '/hr/attendance',
        surface: 'page',
        permissionKey: 'hr.attendance.view',
        featureFlag: 'ff.modules.hr',
        sortOrder: 501,
        parentId: 'nav-hr',
        keywords: ['attendance', 'musters', 'labour'],
        isActive: true,
      },
    ],
  },
  // Reports
  {
    id: 'nav-reports',
    group: 'Reports',
    labelKey: 'nav.reports',
    label: 'Reports',
    iconKey: 'module.reports',
    route: '/reports',
    surface: 'shell',
    permissionKey: 'reports.module.view',
    featureFlag: 'ff.pgm',
    sortOrder: 900,
    keywords: ['report', 'analytics', 'dashboard', 'export'],
    isActive: true,
  },
  // Technical Console (DS-32) — only visible to TECH_ADMIN
  {
    id: 'nav-tech-console',
    group: 'Technical',
    labelKey: 'nav.techConsole',
    label: 'Technical Console',
    iconKey: 'sys.security',
    route: '/_tech',
    surface: 'shell',
    permissionKey: 'tech.console.view',
    featureFlag: 'ff.tech_console',
    sortOrder: 9900,
    keywords: ['tech', 'console', 'admin', 'diagnostics', 'baseline', 'audit'],
    isActive: true,
    children: [
      {
        id: 'nav-tech-baseline',
        group: 'Technical',
        labelKey: 'nav.techBaseline',
        label: 'Program Baseline',
        iconKey: 'sys.database',
        route: '/_tech/program/baseline',
        surface: 'page',
        permissionKey: 'tech.console.view',
        featureFlag: 'ff.tech_console',
        sortOrder: 9901,
        parentId: 'nav-tech-console',
        keywords: ['baseline', 'schema', 'regression', 'integrity'],
        isActive: true,
      },
      {
        id: 'nav-tech-audit',
        group: 'Technical',
        labelKey: 'nav.techAudit',
        label: 'System Audit',
        iconKey: 'sys.eye',
        route: '/_tech/audit',
        surface: 'page',
        permissionKey: 'tech.console.view',
        featureFlag: 'ff.audit',
        sortOrder: 9902,
        parentId: 'nav-tech-console',
        keywords: ['audit', 'discovery', 'inventory', 'gap', 'risk', 'dependency', 'architecture'],
        isActive: true,
      },
      {
        id: 'nav-tech-widget-status',
        group: 'Technical',
        labelKey: 'nav.widgetStatus',
        label: 'Widget Status',
        iconKey: 'sys.zap',
        route: '/_tech/preview/status',
        surface: 'page',
        permissionKey: 'tech.console.view',
        featureFlag: 'ff.preview',
        sortOrder: 9903,
        parentId: 'nav-tech-console',
        keywords: ['widget', 'preview', 'status', 'live', 'promoted', 'feedback'],
        isActive: true,
      },
      {
        id: 'nav-tech-cicd',
        group: 'Technical',
        labelKey: 'nav.cicd',
        label: 'CI/CD & Releases',
        iconKey: 'sys.git',
        route: '/_tech/cicd',
        surface: 'page',
        permissionKey: 'tech.console.view',
        featureFlag: 'ff.cicd',
        sortOrder: 9904,
        parentId: 'nav-tech-console',
        keywords: ['cicd', 'pipeline', 'release', 'deploy', 'gate', 'quality', 'flag', 'feature flag', 'evidence'],
        isActive: true,
      },
    ],
  },
  // Preview Environment (DS-32 — separate, never in business nav)
  {
    id: 'nav-preview',
    group: 'Preview',
    labelKey: 'nav.preview',
    label: 'Dashboard Preview',
    iconKey: 'sys.eye',
    route: '/preview',
    surface: 'shell',
    permissionKey: 'preview.view',
    featureFlag: 'ff.preview',
    sortOrder: 9800,
    keywords: ['preview', 'demo', 'sandbox', 'stakeholder', 'persona', 'dashboard', 'walking skeleton'],
    isActive: true,
  },
];

// Flatten for search
export function flattenNav(entries: NavEntry[]): NavEntry[] {
  const result: NavEntry[] = [];
  for (const entry of entries) {
    result.push(entry);
    if (entry.children) {
      result.push(...flattenNav(entry.children));
    }
  }
  return result;
}
