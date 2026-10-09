import React, { useState } from 'react';
import { PreviewShell, type DeviceMode } from './PreviewShell';
import { personas, widgetRegistry, fixtureData, type Persona, type WidgetDefinition } from './data/previewData';
import { KPICardWidget, TableWidget, ProgressWidget, ActivityFeedWidget, GateStatusWidget, FeedbackDrawer } from './widgets/PreviewWidgets';
import { getIcon } from '../data/registries';

// ═══════════════════════════════════════════════════════════
// PREVIEW DASHBOARD — Part 02
// Persona-switchable dashboards with fixture data
// Route: /preview
// ═══════════════════════════════════════════════════════════

export function PreviewDashboard() {
  const [currentPersona, setCurrentPersona] = useState<Persona>(personas[1]); // PM default
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('desktop');
  const [feedbackWidget, setFeedbackWidget] = useState<string | null>(null);

  const getWidgetsForPersona = (personaId: string): WidgetDefinition[] => {
    return widgetRegistry.filter(w => w.persona === personaId);
  };

  const renderDashboard = () => {
    switch (currentPersona.id) {
      case 'cfo': return <CFODashboard widgets={getWidgetsForPersona('cfo')} onFeedback={setFeedbackWidget} />;
      case 'pm': return <PMDashboard widgets={getWidgetsForPersona('pm')} onFeedback={setFeedbackWidget} />;
      case 'site-eng': return <SiteDashboard widgets={getWidgetsForPersona('site-eng')} onFeedback={setFeedbackWidget} />;
      case 'store': return <StoreDashboard widgets={getWidgetsForPersona('store')} onFeedback={setFeedbackWidget} />;
      case 'qs': return <QSDashboard widgets={getWidgetsForPersona('qs')} onFeedback={setFeedbackWidget} />;
      case 'procurement': return <ProcurementDashboard widgets={getWidgetsForPersona('procurement')} onFeedback={setFeedbackWidget} />;
      case 'plant': return <PlantDashboard widgets={getWidgetsForPersona('plant')} onFeedback={setFeedbackWidget} />;
      case 'hr': return <HRDashboard widgets={getWidgetsForPersona('hr')} onFeedback={setFeedbackWidget} />;
      case 'qa': return <QADashboard widgets={getWidgetsForPersona('qa')} onFeedback={setFeedbackWidget} />;
      case 'hse': return <HSEDashboard widgets={getWidgetsForPersona('hse')} onFeedback={setFeedbackWidget} />;
      case 'protocol': return <ProtocolDashboard widgets={getWidgetsForPersona('protocol')} onFeedback={setFeedbackWidget} />;
      case 'admin': return <AdminDashboard widgets={getWidgetsForPersona('admin')} onFeedback={setFeedbackWidget} />;
      default: return <PMDashboard widgets={getWidgetsForPersona('pm')} onFeedback={setFeedbackWidget} />;
    }
  };

  return (
    <PreviewShell
      currentPersona={currentPersona}
      onPersonaChange={setCurrentPersona}
      deviceMode={deviceMode}
      onDeviceModeChange={setDeviceMode}
    >
      {renderDashboard()}
      {feedbackWidget && <FeedbackDrawer widgetCode={feedbackWidget} onClose={() => setFeedbackWidget(null)} />}
    </PreviewShell>
  );
}

// ── Dashboard Section Header ──
function DashboardHeader({ title, subtitle, persona }: { title: string; subtitle: string; persona: Persona }) {
  return (
    <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border-color)' }}>
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white"
          style={{ background: persona.color }}>
          {persona.avatar}
        </div>
        <div>
          <h1 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{title}</h1>
          <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{subtitle}</p>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// PERSONA DASHBOARDS
// ═══════════════════════════════════════════════════════════

function CFODashboard({ widgets, onFeedback }: { widgets: WidgetDefinition[]; onFeedback: (code: string) => void }) {
  const persona = personas.find(p => p.id === 'cfo')!;
  return (
    <div>
      <DashboardHeader title="CFO Snapshot" subtitle="Financial health overview · Acme Infra Ltd" persona={persona} />
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {widgets.filter(w => ['W-CFO-001', 'W-CFO-002'].includes(w.code)).map(w => (
            <div key={w.code} onClick={() => onFeedback(w.code)} className="cursor-pointer">
              <KPICardWidget definition={w} payload={fixtureData[w.code]} />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-3">
          {widgets.filter(w => w.code === 'W-CFO-003').map(w => (
            <div key={w.code} onClick={() => onFeedback(w.code)} className="cursor-pointer">
              <KPICardWidget definition={w} payload={fixtureData[w.code]} />
            </div>
          ))}
          <div className="col-span-2 rounded-[var(--density-border-radius)] p-4" style={{ background: 'var(--tile-bg)', border: '1px solid var(--tile-border)' }}>
            <div className="text-xs font-medium mb-3" style={{ color: 'var(--text-primary)' }}>Project P&L Summary</div>
            <TableWidget
              definition={widgets.find(w => w.code === 'W-CFO-004')!}
              title=""
              columns={[
                { key: 'project', label: 'Project' },
                { key: 'budget', label: 'Budget', align: 'right' },
                { key: 'actual', label: 'Actual', align: 'right' },
                { key: 'variance', label: 'Var %', align: 'right' },
              ]}
              data={[
                { project: 'Riverside Tower', budget: '₹12.8 Cr', actual: '₹8.6 Cr', variance: '-3.2%' },
                { project: 'Green Valley', budget: '₹8.5 Cr', actual: '₹3.2 Cr', variance: '+1.4%' },
                { project: 'Metro Link', budget: '₹24.5 Cr', actual: '₹21.8 Cr', variance: '-5.1%' },
                { project: 'Industrial Park', budget: '₹5.2 Cr', actual: '₹1.4 Cr', variance: '+2.8%' },
                { project: 'Highway Exp.', budget: '₹18.0 Cr', actual: '₹17.1 Cr', variance: '-1.2%' },
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function PMDashboard({ widgets, onFeedback }: { widgets: WidgetDefinition[]; onFeedback: (code: string) => void }) {
  const persona = personas.find(p => p.id === 'pm')!;
  return (
    <div>
      <DashboardHeader title="Project 360" subtitle="Riverside Tower — Phase II · Rajesh Kumar" persona={persona} />
      <div className="p-4 space-y-4">
        {/* KPI Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {widgets.filter(w => ['W-PM-001', 'W-PM-002', 'W-PM-003', 'W-PM-005'].includes(w.code)).map(w => (
            <div key={w.code} onClick={() => onFeedback(w.code)} className="cursor-pointer">
              <KPICardWidget definition={w} payload={fixtureData[w.code]} size="small" />
            </div>
          ))}
        </div>
        {/* Gate Status */}
        <GateStatusWidget
          definition={widgets.find(w => w.code === 'W-PM-004')!}
          gates={[
            { stage: 'PLAN', status: 'passed' },
            { stage: 'AUTH', status: 'passed' },
            { stage: 'EXEC', status: 'passed' },
            { stage: 'VERIFY', status: 'pending' },
            { stage: 'CLOSE', status: 'pending' },
          ]}
        />
        {/* My Work */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <ActivityFeedWidget
            definition={widgets.find(w => w.code === 'W-PM-004')!}
            title="My Pending Tasks"
            items={[
              { time: '10:30 AM', text: 'Approve PO-2024-0142 (₹24.5L)', type: 'warning' },
              { time: '09:15 AM', text: 'Review BOQ revision for WBS 3.2.1', type: 'info' },
              { time: 'Yesterday', text: 'Site inspection report — Foundation', type: 'success' },
              { time: 'Yesterday', text: 'Material shortage alert: Cement', type: 'error' },
              { time: '13 Jan', text: 'Subcontractor bill #INV-0034 verification', type: 'warning' },
            ]}
          />
          <ProgressWidget
            definition={widgets.find(w => w.code === 'W-PM-001')!}
            title="WBS Progress"
            items={[
              { label: '3.1 Excavation', value: 100, max: 100, color: 'var(--semantic-success)' },
              { label: '3.2 Foundation', value: 85, max: 100, color: 'var(--brand-primary)' },
              { label: '3.3 Structure', value: 45, max: 100, color: 'var(--brand-primary)' },
              { label: '3.4 Finishing', value: 12, max: 100, color: 'var(--semantic-warning)' },
              { label: '3.5 MEP', value: 8, max: 100, color: 'var(--text-muted)' },
            ]}
          />
        </div>
      </div>
    </div>
  );
}

function SiteDashboard({ widgets, onFeedback }: { widgets: WidgetDefinition[]; onFeedback: (code: string) => void }) {
  const persona = personas.find(p => p.id === 'site-eng')!;
  return (
    <div>
      <DashboardHeader title="Site Home" subtitle="Riverside Tower · Today, 15 Jan 2024" persona={persona} />
      <div className="p-4 space-y-4">
        {/* Gate Status Card */}
        <div className="rounded-[var(--density-border-radius)] p-3" style={{ background: 'linear-gradient(135deg, #fef3c7, #fde68a)', border: '1px solid #fbbf24' }}>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-bold" style={{ color: '#92400e' }}>⚠️ GATE STATUS: 3 of 5 PASSED</div>
              <div className="text-[10px] mt-0.5" style={{ color: '#78350f' }}>Material issue pending verification gate</div>
            </div>
            <span className="text-lg font-bold" style={{ color: '#92400e' }}>60%</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {widgets.filter(w => ['W-SITE-001', 'W-SITE-002'].includes(w.code)).map(w => (
            <div key={w.code} onClick={() => onFeedback(w.code)} className="cursor-pointer">
              <KPICardWidget definition={w} payload={fixtureData[w.code]} size="small" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3">
          {widgets.filter(w => ['W-SITE-003', 'W-SITE-004'].includes(w.code)).map(w => (
            <div key={w.code} onClick={() => onFeedback(w.code)} className="cursor-pointer">
              <KPICardWidget definition={w} payload={fixtureData[w.code]} size="small" />
            </div>
          ))}
        </div>
        {/* Today's Work */}
        <div className="rounded-[var(--density-border-radius)] p-3" style={{ background: 'var(--tile-bg)', border: '1px solid var(--tile-border)' }}>
          <div className="text-xs font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Today's Work Authorisations</div>
          <div className="space-y-1.5">
            {[
              { task: 'Column casting — Grid A3-A5', status: 'In Progress', color: 'var(--semantic-info)' },
              { task: 'Brick masonry — Block B Level 2', status: 'In Progress', color: 'var(--semantic-info)' },
              { task: 'Waterproofing — Basement', status: 'Pending QC', color: 'var(--semantic-warning)' },
              { task: 'Electrical conduit — Level 3', status: 'Not Started', color: 'var(--text-muted)' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between py-1 border-b last:border-0" style={{ borderColor: 'var(--border-color)' }}>
                <span className="text-[10px]" style={{ color: 'var(--text-primary)' }}>{item.task}</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded-full" style={{ background: `${item.color}20`, color: item.color }}>{item.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StoreDashboard({ widgets, onFeedback }: { widgets: WidgetDefinition[]; onFeedback: (code: string) => void }) {
  const persona = personas.find(p => p.id === 'store')!;
  return (
    <div>
      <DashboardHeader title="Stores Control" subtitle="Site Store A · Riverside Tower" persona={persona} />
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {widgets.filter(w => ['W-STORE-001', 'W-STORE-002'].includes(w.code)).map(w => (
            <div key={w.code} onClick={() => onFeedback(w.code)} className="cursor-pointer">
              <KPICardWidget definition={w} payload={fixtureData[w.code]} size="small" />
            </div>
          ))}
        </div>
        <div onClick={() => onFeedback('W-STORE-003')} className="cursor-pointer">
          <KPICardWidget definition={widgets.find(w => w.code === 'W-STORE-003')!} payload={fixtureData['W-STORE-003']} />
        </div>
        {/* Stock Alerts Table */}
        <TableWidget
          definition={widgets.find(w => w.code === 'W-STORE-001')!}
          title="Items Below Reorder Level"
          columns={[
            { key: 'material', label: 'Material' },
            { key: 'stock', label: 'Stock', align: 'right' },
            { key: 'reorder', label: 'Reorder', align: 'right' },
            { key: 'status', label: 'Status' },
          ]}
          data={[
            { material: 'Safety Helmets', stock: '15', reorder: '50', status: '🔴 Critical' },
            { material: 'Copper Wire 2.5mm', stock: '200', reorder: '500', status: '🟡 Low' },
            { material: 'PVC Pipe 4 inch', stock: '80', reorder: '100', status: '🟡 Low' },
            { material: 'Nails 3 inch', stock: '5', reorder: '20', status: '🔴 Critical' },
            { material: 'Binding Wire', stock: '12', reorder: '25', status: '🟡 Low' },
          ]}
        />
      </div>
    </div>
  );
}

function QSDashboard({ widgets, onFeedback }: { widgets: WidgetDefinition[]; onFeedback: (code: string) => void }) {
  const persona = personas.find(p => p.id === 'qs')!;
  return (
    <div>
      <DashboardHeader title="Cost Control" subtitle="All Projects · Vikram Mehta (QS)" persona={persona} />
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {widgets.map(w => (
            <div key={w.code} onClick={() => onFeedback(w.code)} className="cursor-pointer">
              <KPICardWidget definition={w} payload={fixtureData[w.code]} />
            </div>
          ))}
        </div>
        <TableWidget
          definition={widgets.find(w => w.code === 'W-QS-001')!}
          title="Cost Variance by WBS"
          columns={[
            { key: 'wbs', label: 'WBS Element' },
            { key: 'budget', label: 'Budget', align: 'right' },
            { key: 'actual', label: 'Actual', align: 'right' },
            { key: 'variance', label: 'Variance', align: 'right' },
          ]}
          data={[
            { wbs: '3.2.1 Foundation', budget: '₹48.5L', actual: '₹52.1L', variance: '+₹3.6L' },
            { wbs: '3.2.2 Plinth', budget: '₹22.3L', actual: '₹21.8L', variance: '-₹0.5L' },
            { wbs: '3.3.1 Structure', budget: '₹85.0L', actual: '₹91.2L', variance: '+₹6.2L' },
            { wbs: '3.3.2 Brickwork', budget: '₹18.4L', actual: '₹15.2L', variance: '-₹3.2L' },
          ]}
        />
      </div>
    </div>
  );
}

function ProcurementDashboard({ widgets, onFeedback }: { widgets: WidgetDefinition[]; onFeedback: (code: string) => void }) {
  const persona = personas.find(p => p.id === 'procurement')!;
  return (
    <div>
      <DashboardHeader title="Procurement Control" subtitle="All Projects · Anita Desai" persona={persona} />
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-3 gap-3">
          {widgets.filter(w => ['W-PROC-001', 'W-PROC-003'].includes(w.code)).map(w => (
            <div key={w.code} onClick={() => onFeedback(w.code)} className="cursor-pointer">
              <KPICardWidget definition={w} payload={fixtureData[w.code]} size="small" />
            </div>
          ))}
          <div onClick={() => onFeedback('W-PROC-002')} className="cursor-pointer">
            <KPICardWidget definition={widgets.find(w => w.code === 'W-PROC-002')!} payload={fixtureData['W-PROC-002']} size="small" />
          </div>
        </div>
        <TableWidget
          definition={widgets.find(w => w.code === 'W-PROC-002')!}
          title="Vendor Delivery Performance (Top 5)"
          columns={[
            { key: 'vendor', label: 'Vendor' },
            { key: 'orders', label: 'Orders', align: 'right' },
            { key: 'onTime', label: 'On Time %', align: 'right' },
            { key: 'quality', label: 'Quality', align: 'right' },
          ]}
          data={[
            { vendor: 'Steel India Pvt Ltd', orders: '24', onTime: '92%', quality: '98%' },
            { vendor: 'Cement Corp of India', orders: '18', onTime: '88%', quality: '99%' },
            { vendor: 'National Brick Works', orders: '12', onTime: '75%', quality: '95%' },
            { vendor: 'ElectroFit Industries', orders: '8', onTime: '100%', quality: '97%' },
            { vendor: 'PlumbTech Solutions', orders: '6', onTime: '83%', quality: '94%' },
          ]}
        />
      </div>
    </div>
  );
}

function PlantDashboard({ widgets, onFeedback }: { widgets: WidgetDefinition[]; onFeedback: (code: string) => void }) {
  const persona = personas.find(p => p.id === 'plant')!;
  return (
    <div>
      <DashboardHeader title="Plant Utilisation" subtitle="Fleet Overview · Karan Singh" persona={persona} />
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {widgets.map(w => (
            <div key={w.code} onClick={() => onFeedback(w.code)} className="cursor-pointer">
              <KPICardWidget definition={w} payload={fixtureData[w.code]} />
            </div>
          ))}
        </div>
        <ProgressWidget
          definition={widgets.find(w => w.code === 'W-PLANT-001')!}
          title="Equipment Utilisation by Type"
          items={[
            { label: 'Excavators (3)', value: 82, max: 100, color: 'var(--semantic-success)' },
            { label: 'Cranes (2)', value: 68, max: 100, color: 'var(--brand-primary)' },
            { label: 'Concrete Pumps (2)', value: 75, max: 100, color: 'var(--brand-primary)' },
            { label: 'Loaders (4)', value: 58, max: 100, color: 'var(--semantic-warning)' },
            { label: 'Generators (3)', value: 90, max: 100, color: 'var(--semantic-success)' },
          ]}
        />
      </div>
    </div>
  );
}

function HRDashboard({ widgets, onFeedback }: { widgets: WidgetDefinition[]; onFeedback: (code: string) => void }) {
  const persona = personas.find(p => p.id === 'hr')!;
  return (
    <div>
      <DashboardHeader title="Workforce Overview" subtitle="All Sites · Meena Joshi" persona={persona} />
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {widgets.map(w => (
            <div key={w.code} onClick={() => onFeedback(w.code)} className="cursor-pointer">
              <KPICardWidget definition={w} payload={fixtureData[w.code]} />
            </div>
          ))}
        </div>
        <ProgressWidget
          definition={widgets.find(w => w.code === 'W-HR-002')!}
          title="Manpower by Project"
          items={[
            { label: 'Riverside Tower', value: 210, max: 250, color: 'var(--brand-primary)' },
            { label: 'Green Valley', value: 145, max: 180, color: 'var(--brand-primary)' },
            { label: 'Metro Link', value: 320, max: 350, color: 'var(--brand-primary)' },
            { label: 'Industrial Park', value: 85, max: 120, color: 'var(--semantic-warning)' },
            { label: 'Highway Exp.', value: 180, max: 200, color: 'var(--brand-primary)' },
          ]}
        />
      </div>
    </div>
  );
}

function QADashboard({ widgets, onFeedback }: { widgets: WidgetDefinition[]; onFeedback: (code: string) => void }) {
  const persona = personas.find(p => p.id === 'qa')!;
  return (
    <div>
      <DashboardHeader title="Quality Dashboard" subtitle="All Projects · Deepak Rao (QA/QC)" persona={persona} />
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {widgets.map(w => (
            <div key={w.code} onClick={() => onFeedback(w.code)} className="cursor-pointer">
              <KPICardWidget definition={w} payload={fixtureData[w.code]} />
            </div>
          ))}
        </div>
        <ActivityFeedWidget
          definition={widgets.find(w => w.code === 'W-QA-002')!}
          title="Recent Inspections"
          items={[
            { time: 'Today 11:00', text: 'Column reinforcement — Grid A3: PASSED', type: 'success' },
            { time: 'Today 09:30', text: 'Concrete cube test — Batch #45: PENDING', type: 'warning' },
            { time: 'Yesterday', text: 'Waterproofing membrane — Basement: FAILED', type: 'error' },
            { time: 'Yesterday', text: 'Brick masonry — Block B: PASSED', type: 'success' },
            { time: '13 Jan', text: 'Plumbing pressure test — Level 2: PASSED', type: 'success' },
          ]}
        />
      </div>
    </div>
  );
}

function HSEDashboard({ widgets, onFeedback }: { widgets: WidgetDefinition[]; onFeedback: (code: string) => void }) {
  const persona = personas.find(p => p.id === 'hse')!;
  return (
    <div>
      <DashboardHeader title="Safety Dashboard" subtitle="All Sites · Ravi Nair (HSE)" persona={persona} />
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {widgets.map(w => (
            <div key={w.code} onClick={() => onFeedback(w.code)} className="cursor-pointer">
              <KPICardWidget definition={w} payload={fixtureData[w.code]} />
            </div>
          ))}
        </div>
        <div className="rounded-[var(--density-border-radius)] p-3" style={{ background: 'var(--tile-bg)', border: '1px solid var(--tile-border)' }}>
          <div className="text-xs font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Active Permits Today</div>
          <div className="space-y-1.5">
            {[
              { permit: 'Hot Work — Welding Grid C2', area: 'Level 3', status: 'Active', valid: '06:00-18:00' },
              { permit: 'Confined Space — Tank Foundation', area: 'Basement', status: 'Active', valid: '08:00-17:00' },
              { permit: 'Working at Height — Tower Crane', area: 'Level 8+', status: 'Pending', valid: 'Awaiting approval' },
              { permit: 'Electrical — HT Panel', area: 'Substation', status: 'Active', valid: '09:00-12:00' },
            ].map((p, i) => (
              <div key={i} className="flex items-center justify-between py-1 border-b last:border-0 text-[10px]" style={{ borderColor: 'var(--border-color)' }}>
                <span style={{ color: 'var(--text-primary)' }}>{p.permit}</span>
                <span className="px-1.5 py-0.5 rounded-full" style={{
                  background: p.status === 'Active' ? 'var(--semantic-success)' : 'var(--semantic-warning)',
                  color: '#fff'
                }}>{p.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProtocolDashboard({ widgets, onFeedback }: { widgets: WidgetDefinition[]; onFeedback: (code: string) => void }) {
  const persona = personas.find(p => p.id === 'protocol')!;
  return (
    <div>
      <DashboardHeader title="Protocol Control Tower" subtitle="Enterprise-wide compliance · Sneha Kulkarni" persona={persona} />
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-3 gap-3">
          {widgets.map(w => (
            <div key={w.code} onClick={() => onFeedback(w.code)} className="cursor-pointer">
              <KPICardWidget definition={w} payload={fixtureData[w.code]} size="small" />
            </div>
          ))}
        </div>
        <GateStatusWidget
          definition={widgets.find(w => w.code === 'W-PROTO-001')!}
          gates={[
            { stage: 'PLAN', status: 'passed' },
            { stage: 'AUTH', status: 'passed' },
            { stage: 'EXEC', status: 'passed' },
            { stage: 'RECORD', status: 'passed' },
            { stage: 'VERIFY', status: 'pending' },
            { stage: 'ANALYZE', status: 'pending' },
            { stage: 'CONTROL', status: 'blocked' },
            { stage: 'CLOSE', status: 'skipped' },
          ]}
        />
        <TableWidget
          definition={widgets.find(w => w.code === 'W-PROTO-001')!}
          title="Active Violations"
          columns={[
            { key: 'id', label: 'Violation' },
            { key: 'module', label: 'Module' },
            { key: 'control', label: 'Control Point' },
            { key: 'severity', label: 'Severity' },
          ]}
          data={[
            { id: 'V-001', module: 'INV', control: 'CP-INV-01: Issue without PR', severity: '🔴 Critical' },
            { id: 'V-002', module: 'FIN', control: 'CP-FIN-02: Payment without 3-way match', severity: '🟠 High' },
            { id: 'V-003', module: 'PROC', control: 'CP-PROC-02: PO without authority check', severity: '🟠 High' },
          ]}
        />
      </div>
    </div>
  );
}

function AdminDashboard({ widgets, onFeedback }: { widgets: WidgetDefinition[]; onFeedback: (code: string) => void }) {
  const persona = personas.find(p => p.id === 'admin')!;
  return (
    <div>
      <DashboardHeader title="System Health" subtitle="Infrastructure monitoring · Super Admin" persona={persona} />
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {widgets.map(w => (
            <div key={w.code} onClick={() => onFeedback(w.code)} className="cursor-pointer">
              <KPICardWidget definition={w} payload={fixtureData[w.code]} />
            </div>
          ))}
        </div>
        <div className="rounded-[var(--density-border-radius)] p-3" style={{ background: 'var(--tile-bg)', border: '1px solid var(--tile-border)' }}>
          <div className="text-xs font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Service Status</div>
          <div className="space-y-1.5">
            {[
              { service: 'API Server', status: 'Healthy', uptime: '99.9%', color: 'var(--semantic-success)' },
              { service: 'Database (PostgreSQL)', status: 'Healthy', uptime: '99.95%', color: 'var(--semantic-success)' },
              { service: 'Redis Cache', status: 'Healthy', uptime: '100%', color: 'var(--semantic-success)' },
              { service: 'Socket.IO', status: 'Healthy', uptime: '99.8%', color: 'var(--semantic-success)' },
              { service: 'Job Queue (BullMQ)', status: 'Degraded', uptime: '97.2%', color: 'var(--semantic-warning)' },
              { service: 'File Storage (MinIO)', status: 'Healthy', uptime: '99.9%', color: 'var(--semantic-success)' },
            ].map((s, i) => (
              <div key={i} className="flex items-center justify-between py-1 border-b last:border-0 text-[10px]" style={{ borderColor: 'var(--border-color)' }}>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.color }} />
                  <span style={{ color: 'var(--text-primary)' }}>{s.service}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="tabular-nums" style={{ color: 'var(--text-muted)' }}>{s.uptime}</span>
                  <span className="px-1.5 py-0.5 rounded-full" style={{ background: `${s.color}20`, color: s.color }}>{s.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
