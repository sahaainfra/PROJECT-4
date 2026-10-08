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
