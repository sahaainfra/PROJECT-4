import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { FeatureFlagProvider } from './contexts/FeatureFlagContext';
import { AppShell } from './shell/AppShell';
import { HomeLaunchpad } from './pages/HomeLaunchpad';
import { TechnicalConsole } from './pages/ObjectPage';
import { SystemAuditPage } from './pages/SystemAudit';
import { PreviewDashboard } from './preview/PreviewDashboard';
import { WidgetStatusBoard } from './pages/WidgetStatusBoard';
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
              <Route path="preview/status" element={<WidgetStatusBoard />} />
              <Route path="audit" element={<SystemAuditPage />} />
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
