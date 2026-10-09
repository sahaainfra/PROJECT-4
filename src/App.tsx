import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { FeatureFlagProvider } from './contexts/FeatureFlagContext';
import { AppShell } from './shell/AppShell';
import { HomeLaunchpad } from './pages/HomeLaunchpad';
import { TechnicalConsole } from './pages/ObjectPage';
import { PreviewDashboard } from './preview/PreviewDashboard';
import { WidgetStatusBoard } from './pages/WidgetStatusBoard';
import { CICDConsole } from './pages/CICDConsole';
import { CoreServicesConsole } from './pages/CoreServicesConsole';
import { OrganisationExplorer } from './pages/OrganisationExplorer';
import { ProjectsManagement } from './pages/ProjectsManagement';
import { AllocationsManagement } from './pages/AllocationsManagement';
import { RolesManagement } from './pages/RolesManagement';
import { UserAssignments } from './pages/UserAssignments';
import { EffectivePermissions } from './pages/EffectivePermissions';
import { AuditExplorer } from './pages/AuditExplorer';
import { SecurityConsole } from './pages/SecurityConsole';
import { SecureByDesignConsole } from './pages/SecureByDesignConsole';
import { SoDRulesManagement } from './pages/SoDRulesManagement';
import { SoDViolationsExceptions } from './pages/SoDViolationsExceptions';
import { AccessReviews } from './pages/AccessReviews';
import { PrivilegedAccessConsole } from './pages/PrivilegedAccessConsole';
import { MyDevicesSessions } from './pages/MyDevicesSessions';
import { ObservabilityConsole } from './pages/ObservabilityConsole';
import { EventBusConsole } from './pages/EventBusConsole';
import { MyApprovalsInbox } from './pages/MyApprovalsInbox';
import { WorkflowDesigner } from './pages/WorkflowDesigner';
import { WorkflowMonitor } from './pages/WorkflowMonitor';
import { DelegationManagement } from './pages/DelegationManagement';
import { DecisionTableEditor } from './pages/DecisionTableEditor';
import { AuthorityMatrix } from './pages/AuthorityMatrix';
import { SimulationDashboard } from './pages/SimulationDashboard';
import { EmergencyApprovals } from './pages/EmergencyApprovals';
import { ProtocolConsole } from './pages/ProtocolConsole';
import { RaciMatrixEditor } from './pages/RaciMatrixEditor';
import { ActionLedgerViewer } from './pages/ActionLedgerViewer';
import { MyAccountabilityWorkspace } from './pages/MyAccountabilityWorkspace';
import { TeamAccountabilityDashboard } from './pages/TeamAccountabilityDashboard';
import { ComplianceScoreExplainer } from './pages/ComplianceScoreExplainer';
import { NotificationCenter } from './pages/NotificationCenter';
import { NotificationPreferences } from './pages/NotificationPreferences';
import { TemplateManagement } from './pages/TemplateManagement';
import { IntegrationHub } from './pages/IntegrationHub';
import { MessageLog } from './pages/MessageLog';
import { ApiClientsWebhooks } from './pages/ApiClientsWebhooks';
import { DeveloperPortal } from './pages/DeveloperPortal';
import { ApiClientManagement } from './pages/ApiClientManagement';
import { ApiUsageDashboard } from './pages/ApiUsageDashboard';
import { BulkJobMonitor } from './pages/BulkJobMonitor';
import { ApiVersionManagement } from './pages/ApiVersionManagement';
import { DashboardWorkspace } from './pages/DashboardWorkspace';
import { ResponsiveShellDemo } from './pages/ResponsiveShellDemo';
import { OfflineSyncCenter } from './pages/OfflineSyncCenter';
import { DeviceManagement } from './pages/DeviceManagement';
import {
  PurchaseRequisitionsPage,
  PurchaseOrdersPage,
  PurchaseOrderDetailPage,
  GoodsReceiptPage,
  StockRegisterPage,
  ProjectListPage,
  BOQPage,
  BillsPage,
  AttendancePage,
  ReportsPage,
  ProcurementIndexPage,
  InventoryIndexPage,
  ProjectsIndexPage,
  FinanceIndexPage,
  HRIndexPage,
} from './pages/ModulePages';

// ═══════════════════════════════════════════════════════════
// APP ENTRY — Construction ERP Part 00
// Application Shell + Design System + Navigation + Pages
// ═══════════════════════════════════════════════════════════

function App() {
  return (
    <ThemeProvider>
      <FeatureFlagProvider>
        <BrowserRouter>
          <Routes>
            {/* Preview Environment — Part 02 (separate, never linked from production) */}
            <Route path="/preview" element={<PreviewDashboard />} />

            {/* Technical Console — /_tech namespace (DS-32) */}
            <Route path="/_tech">
              <Route path="evbus" element={<EventBusConsole />} />
              <Route path="obs" element={<ObservabilityConsole />} />
              <Route path="secbase" element={<SecureByDesignConsole />} />
              <Route path="core" element={<CoreServicesConsole />} />
              <Route path="cicd" element={<CICDConsole />} />
              <Route path="preview/status" element={<WidgetStatusBoard />} />
              <Route path="program/baseline" element={<TechnicalConsole />} />
              <Route path="" element={<TechnicalConsole />} />
            </Route>

            {/* Main Application Shell */}
            <Route element={<AppShell />}>
              {/* Home Launchpad */}
              <Route path="/" element={<HomeLaunchpad />} />

              {/* Workflow - My Approvals (Part 12) */}
              <Route path="/home/wf" element={<MyApprovalsInbox />} />

              {/* Dashboard - My Workspace (Part 20) */}
              <Route path="/home/dash" element={<DashboardWorkspace />} />

              {/* Responsive Shell Demo (Part 21) */}
              <Route path="/home/rsp" element={<ResponsiveShellDemo />} />

              {/* Offline Sync Center (Part 22) */}
              <Route path="/field/offline" element={<OfflineSyncCenter />} />

              {/* Home - Device Management (Part 21) */}
              <Route path="/home/devices" element={<DeviceManagement />} />

              {/* Procurement Module */}
              <Route path="/procurement" element={<ProcurementIndexPage />} />
              <Route path="/procurement/requisitions" element={<PurchaseRequisitionsPage />} />
              <Route path="/procurement/requisitions/:id" element={<PurchaseOrderDetailPage />} />
              <Route path="/procurement/orders" element={<PurchaseOrdersPage />} />
              <Route path="/procurement/orders/:id" element={<PurchaseOrderDetailPage />} />

              {/* Inventory Module */}
              <Route path="/inventory" element={<InventoryIndexPage />} />
              <Route path="/inventory/grn" element={<GoodsReceiptPage />} />
              <Route path="/inventory/stock" element={<StockRegisterPage />} />

              {/* Projects Module */}
              <Route path="/projects" element={<ProjectsIndexPage />} />
              <Route path="/projects/list" element={<ProjectListPage />} />
              <Route path="/projects/boq" element={<BOQPage />} />

              {/* Finance Module */}
              <Route path="/finance" element={<FinanceIndexPage />} />
              <Route path="/finance/bills" element={<BillsPage />} />

              {/* HR Module */}
              <Route path="/hr" element={<HRIndexPage />} />
              <Route path="/hr/attendance" element={<AttendancePage />} />

              {/* Reports */}
              <Route path="/reports" element={<ReportsPage />} />

              {/* Administration - Organization (Part 05) */}
              <Route path="/admin/org" element={<OrganisationExplorer />} />
              <Route path="/admin/org/projects" element={<ProjectsManagement />} />
              <Route path="/admin/org/allocations" element={<AllocationsManagement />} />

              {/* Administration - IAM (Part 06) */}
              <Route path="/admin/iam" element={<RolesManagement />} />
              <Route path="/admin/iam/roles" element={<RolesManagement />} />
              <Route path="/admin/iam/assignments" element={<UserAssignments />} />
              <Route path="/admin/iam/effective" element={<EffectivePermissions />} />

              {/* Administration - Audit & Security (Part 07) */}
              <Route path="/admin/audit" element={<AuditExplorer />} />
              <Route path="/admin/security" element={<SecurityConsole />} />

              {/* Administration - Identity & SoD (Part 09) */}
              <Route path="/admin/idsod" element={<SoDRulesManagement />} />
              <Route path="/admin/idsod/rules" element={<SoDRulesManagement />} />
              <Route path="/admin/idsod/violations" element={<SoDViolationsExceptions />} />
              <Route path="/admin/idsod/access-reviews" element={<AccessReviews />} />
              <Route path="/admin/idsod/privileged" element={<PrivilegedAccessConsole />} />
              <Route path="/admin/idsod/my-devices" element={<MyDevicesSessions />} />

              {/* Administration - Workflow (Part 12) */}
              <Route path="/admin/wf/designer" element={<WorkflowDesigner />} />
              <Route path="/admin/wf/monitor" element={<WorkflowMonitor />} />
              <Route path="/admin/wf/delegations" element={<DelegationManagement />} />

              {/* Administration - Rules (Part 13) */}
              <Route path="/admin/rules/decision-tables" element={<DecisionTableEditor />} />
              <Route path="/admin/rules/authority-matrix" element={<AuthorityMatrix />} />
              <Route path="/admin/rules/simulations" element={<SimulationDashboard />} />
              <Route path="/admin/rules/emergency" element={<EmergencyApprovals />} />

              {/* Administration - Protocol (Part 14) */}
              <Route path="/admin/protocol" element={<ProtocolConsole />} />

              {/* Administration - Accountability (Part 15) */}
              <Route path="/admin/acc/raci" element={<RaciMatrixEditor />} />
              <Route path="/admin/acc/ledger" element={<ActionLedgerViewer />} />
              <Route path="/admin/acc/team" element={<TeamAccountabilityDashboard />} />
              <Route path="/admin/acc/scores" element={<ComplianceScoreExplainer />} />

              {/* Home - My Accountability (Part 15) */}
              <Route path="/home/acc" element={<MyAccountabilityWorkspace />} />

              {/* Home - Notifications (Part 16) */}
              <Route path="/home/rt" element={<NotificationCenter />} />
              <Route path="/home/rt/preferences" element={<NotificationPreferences />} />

              {/* Administration - Notifications (Part 16) */}
              <Route path="/admin/rt/templates" element={<TemplateManagement />} />

              {/* Administration - Integrations (Part 17) */}
              <Route path="/admin/intg" element={<IntegrationHub />} />
              <Route path="/admin/intg/messages" element={<MessageLog />} />
              <Route path="/admin/intg/api-clients" element={<ApiClientsWebhooks />} />

              {/* Technical Console - API Platform (Part 18) */}
              <Route path="/_tech/devapi" element={<DeveloperPortal />} />
              <Route path="/_tech/devapi/portal" element={<DeveloperPortal />} />
              <Route path="/_tech/devapi/clients" element={<ApiClientManagement />} />
              <Route path="/_tech/devapi/usage" element={<ApiUsageDashboard />} />
              <Route path="/_tech/devapi/bulk-jobs" element={<BulkJobMonitor />} />
              <Route path="/_tech/devapi/versions" element={<ApiVersionManagement />} />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </FeatureFlagProvider>
    </ThemeProvider>
  );
}

export default App;
