import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ListReport } from './ListReport';
import { ObjectPage } from './ObjectPage';
import { getIcon } from '../data/registries';

// ═══════════════════════════════════════════════════════════
// MODULE PAGES — Sample data for existing live modules
// ═══════════════════════════════════════════════════════════

// ── Purchase Requisitions ──
const prData = [
  { id: 'PR-2024-0089', date: '15/01/2024', project: 'Riverside Tower', requestedBy: 'Vikram Mehta', items: 12, amount: 485000, status: 'Approved', priority: 'High' },
  { id: 'PR-2024-0088', date: '14/01/2024', project: 'Green Valley Res.', requestedBy: 'Amit Sharma', items: 8, amount: 320000, status: 'Pending', priority: 'Medium' },
  { id: 'PR-2024-0087', date: '13/01/2024', project: 'Riverside Tower', requestedBy: 'Suresh Patel', items: 5, amount: 175000, status: 'Open', priority: 'Low' },
  { id: 'PR-2024-0086', date: '12/01/2024', project: 'Metro Link Bridge', requestedBy: 'Priya Singh', items: 22, amount: 1250000, status: 'Approved', priority: 'High' },
  { id: 'PR-2024-0085', date: '11/01/2024', project: 'Riverside Tower', requestedBy: 'Rajesh Kumar', items: 3, amount: 92000, status: 'Closed', priority: 'Medium' },
  { id: 'PR-2024-0084', date: '10/01/2024', project: 'Green Valley Res.', requestedBy: 'Vikram Mehta', items: 15, amount: 680000, status: 'Rejected', priority: 'High' },
  { id: 'PR-2024-0083', date: '09/01/2024', project: 'Metro Link Bridge', requestedBy: 'Amit Sharma', items: 7, amount: 245000, status: 'Open', priority: 'Medium' },
  { id: 'PR-2024-0082', date: '08/01/2024', project: 'Riverside Tower', requestedBy: 'Suresh Patel', items: 4, amount: 156000, status: 'Approved', priority: 'Low' },
  { id: 'PR-2024-0081', date: '07/01/2024', project: 'Green Valley Res.', requestedBy: 'Priya Singh', items: 18, amount: 890000, status: 'Pending', priority: 'High' },
  { id: 'PR-2024-0080', date: '06/01/2024', project: 'Metro Link Bridge', requestedBy: 'Rajesh Kumar', items: 6, amount: 210000, status: 'Open', priority: 'Medium' },
  { id: 'PR-2024-0079', date: '05/01/2024', project: 'Riverside Tower', requestedBy: 'Vikram Mehta', items: 9, amount: 375000, status: 'Approved', priority: 'High' },
  { id: 'PR-2024-0078', date: '04/01/2024', project: 'Green Valley Res.', requestedBy: 'Amit Sharma', items: 11, amount: 520000, status: 'Closed', priority: 'Low' },
];

const prColumns = [
  { key: 'id', label: 'PR Number', width: '140px' },
  { key: 'date', label: 'Date', width: '110px' },
  { key: 'project', label: 'Project' },
  { key: 'requestedBy', label: 'Requested By' },
  { key: 'items', label: 'Items', align: 'right' as const, format: 'number' as const },
  { key: 'amount', label: 'Est. Amount', align: 'right' as const, format: 'currency' as const },
  { key: 'status', label: 'Status', format: 'status' as const },
  { key: 'priority', label: 'Priority' },
];

export function PurchaseRequisitionsPage() {
  const navigate = useNavigate();
  return (
    <ListReport
      title="Purchase Requisitions"
      subtitle="All purchase requisitions across projects"
      columns={prColumns}
      data={prData}
      onRowClick={(row) => navigate(`/procurement/requisitions/${row.id}`)}
    />
  );
}

// ── Purchase Orders ──
const poData = [
  { id: 'PO-2024-0142', date: '15/01/2024', vendor: 'Steel India Pvt Ltd', project: 'Riverside Tower', amount: 2450000, deliveryDate: '25/01/2024', status: 'Open', grnPending: 0 },
  { id: 'PO-2024-0141', date: '14/01/2024', vendor: 'Cement Corp of India', project: 'Green Valley Res.', amount: 890000, deliveryDate: '20/01/2024', status: 'In Progress', grnPending: 2 },
  { id: 'PO-2024-0140', date: '13/01/2024', vendor: 'National Brick Works', project: 'Riverside Tower', amount: 345000, deliveryDate: '18/01/2024', status: 'Approved', grnPending: 1 },
  { id: 'PO-2024-0139', date: '12/01/2024', vendor: 'PlumbTech Solutions', project: 'Metro Link Bridge', amount: 1280000, deliveryDate: '28/01/2024', status: 'Open', grnPending: 0 },
  { id: 'PO-2024-0138', date: '11/01/2024', vendor: 'ElectroFit Industries', project: 'Riverside Tower', amount: 567000, deliveryDate: '22/01/2024', status: 'In Progress', grnPending: 3 },
  { id: 'PO-2024-0137', date: '10/01/2024', vendor: 'PaintPro Dealers', project: 'Green Valley Res.', amount: 198000, deliveryDate: '16/01/2024', status: 'Closed', grnPending: 0 },
  { id: 'PO-2024-0136', date: '09/01/2024', vendor: 'Timberland Supply Co', project: 'Metro Link Bridge', amount: 725000, deliveryDate: '24/01/2024', status: 'Open', grnPending: 0 },
  { id: 'PO-2024-0135', date: '08/01/2024', vendor: 'SafetyFirst Equipments', project: 'Riverside Tower', amount: 412000, deliveryDate: '19/01/2024', status: 'Approved', grnPending: 1 },
];

const poColumns = [
  { key: 'id', label: 'PO Number', width: '140px' },
  { key: 'date', label: 'Date', width: '110px' },
  { key: 'vendor', label: 'Vendor' },
  { key: 'project', label: 'Project' },
  { key: 'amount', label: 'Order Value', align: 'right' as const, format: 'currency' as const },
  { key: 'deliveryDate', label: 'Delivery Date', width: '120px' },
  { key: 'status', label: 'Status', format: 'status' as const },
];

export function PurchaseOrdersPage() {
  const navigate = useNavigate();
  return (
    <ListReport
      title="Purchase Orders"
      subtitle="Active purchase orders and delivery tracking"
      columns={poColumns}
      data={poData}
      onRowClick={(row) => navigate(`/procurement/orders/${row.id}`)}
    />
  );
}

// ── GRN (Goods Receipt) ──
const grnData = [
  { id: 'GRN-0089', date: '15/01/2024', poNumber: 'PO-2024-0138', vendor: 'ElectroFit Industries', material: 'Copper Wire 2.5mm', qty: 500, unit: 'Mtrs', status: 'Posted', receivedBy: 'Suresh Patel' },
  { id: 'GRN-0088', date: '14/01/2024', poNumber: 'PO-2024-0140', vendor: 'National Brick Works', material: 'Red Clay Bricks', qty: 10000, unit: 'Nos', status: 'Posted', receivedBy: 'Amit Sharma' },
  { id: 'GRN-0087', date: '13/01/2024', poNumber: 'PO-2024-0135', vendor: 'SafetyFirst Equipments', material: 'Safety Helmets', qty: 50, unit: 'Nos', status: 'Pending', receivedBy: '—' },
  { id: 'GRN-0086', date: '12/01/2024', poNumber: 'PO-2024-0141', vendor: 'Cement Corp of India', material: 'OPC Cement 53 Grade', qty: 200, unit: 'Bags', status: 'Posted', receivedBy: 'Vikram Mehta' },
  { id: 'GRN-0085', date: '11/01/2024', poNumber: 'PO-2024-0137', vendor: 'PaintPro Dealers', material: 'Asian Paints Apex Ultima', qty: 80, unit: 'Ltr', status: 'Closed', receivedBy: 'Suresh Patel' },
];

const grnColumns = [
  { key: 'id', label: 'GRN No.', width: '120px' },
  { key: 'date', label: 'Date', width: '110px' },
  { key: 'poNumber', label: 'PO Ref', width: '140px' },
  { key: 'vendor', label: 'Vendor' },
  { key: 'material', label: 'Material' },
  { key: 'qty', label: 'Qty', align: 'right' as const, format: 'number' as const },
  { key: 'unit', label: 'Unit', width: '70px' },
  { key: 'status', label: 'Status', format: 'status' as const },
];

export function GoodsReceiptPage() {
  return (
    <ListReport
      title="Goods Receipt Notes"
      subtitle="Material receiving against purchase orders"
      columns={grnColumns}
      data={grnData}
    />
  );
}

// ── Stock Register ──
const stockData = [
  { id: 'MAT-001', material: 'OPC Cement 53 Grade', category: 'Cement', unit: 'Bags', stockQty: 1250, reorderLevel: 500, warehouse: 'Site Store A', lastReceipt: '12/01/2024', status: 'Open' },
  { id: 'MAT-002', material: 'TMT Bar 12mm', category: 'Steel', unit: 'MT', stockQty: 45, reorderLevel: 20, warehouse: 'Yard B', lastReceipt: '10/01/2024', status: 'Open' },
  { id: 'MAT-003', material: 'Red Clay Bricks', category: 'Masonry', unit: 'Nos', stockQty: 35000, reorderLevel: 10000, warehouse: 'Site Store A', lastReceipt: '14/01/2024', status: 'Open' },
  { id: 'MAT-004', material: 'Sand (River)', category: 'Aggregate', unit: 'Cum', stockQty: 180, reorderLevel: 100, warehouse: 'Yard B', lastReceipt: '08/01/2024', status: 'Open' },
  { id: 'MAT-005', material: 'Copper Wire 2.5mm', category: 'Electrical', unit: 'Mtrs', stockQty: 2500, reorderLevel: 1000, warehouse: 'Electrical Store', lastReceipt: '15/01/2024', status: 'Open' },
  { id: 'MAT-006', material: 'PVC Pipe 4 inch', category: 'Plumbing', unit: 'Mtrs', stockQty: 350, reorderLevel: 200, warehouse: 'Site Store A', lastReceipt: '09/01/2024', status: 'Open' },
  { id: 'MAT-007', material: 'Safety Helmets', category: 'Safety', unit: 'Nos', stockQty: 15, reorderLevel: 50, warehouse: 'Safety Store', lastReceipt: '05/01/2024', status: 'Open' },
];

const stockColumns = [
  { key: 'id', label: 'Code', width: '100px' },
  { key: 'material', label: 'Material' },
  { key: 'category', label: 'Category' },
  { key: 'stockQty', label: 'Stock', align: 'right' as const, format: 'number' as const },
  { key: 'unit', label: 'Unit', width: '60px' },
  { key: 'reorderLevel', label: 'Reorder Lvl', align: 'right' as const, format: 'number' as const },
  { key: 'warehouse', label: 'Location' },
  { key: 'lastReceipt', label: 'Last Receipt', width: '120px' },
];

export function StockRegisterPage() {
  return (
    <ListReport
      title="Stock Register"
      subtitle="Current material stock levels across warehouses"
      columns={stockColumns}
      data={stockData}
    />
  );
}

// ── Projects ──
const projectData = [
  { id: 'PRJ-001', name: 'Riverside Tower — Phase II', client: 'Riverside Developers', location: 'Pune', startDate: '01/04/2023', endDate: '30/09/2025', budget: 128000000, completion: 67, status: 'In Progress' },
  { id: 'PRJ-002', name: 'Green Valley Residences', client: 'Green Valley Homes', location: 'Mumbai', startDate: '15/06/2023', endDate: '31/12/2025', budget: 85000000, completion: 42, status: 'In Progress' },
  { id: 'PRJ-003', name: 'Metro Link Bridge', client: 'City Metro Authority', location: 'Bangalore', startDate: '01/01/2023', endDate: '30/06/2024', budget: 245000000, completion: 89, status: 'In Progress' },
  { id: 'PRJ-004', name: 'Industrial Park Warehouse', client: 'LogiPark India', location: 'Chennai', startDate: '01/09/2023', endDate: '28/02/2025', budget: 52000000, completion: 28, status: 'In Progress' },
  { id: 'PRJ-005', name: 'Highway Expansion Km 42-58', client: 'NHAI', location: 'Hyderabad', startDate: '15/03/2023', endDate: '14/03/2025', budget: 180000000, completion: 95, status: 'In Progress' },
];

const projectColumns = [
  { key: 'id', label: 'Project ID', width: '100px' },
  { key: 'name', label: 'Project Name' },
  { key: 'client', label: 'Client' },
  { key: 'location', label: 'Location' },
  { key: 'budget', label: 'Budget', align: 'right' as const, format: 'currency' as const },
  { key: 'completion', label: 'Completion', align: 'right' as const },
  { key: 'status', label: 'Status', format: 'status' as const },
];

export function ProjectListPage() {
  return (
    <ListReport
      title="Project Register"
      subtitle="Active construction projects"
      columns={projectColumns}
      data={projectData}
    />
  );
}

// ── BOQ ──
const boqData = [
  { id: 'BOQ-3.2.1-001', wbs: '3.2.1 Foundation', description: 'Excavation for foundation', unit: 'Cum', qty: 450, rate: 380, amount: 171000, status: 'Open' },
  { id: 'BOQ-3.2.1-002', wbs: '3.2.1 Foundation', description: 'PCC M15 grade', unit: 'Cum', qty: 120, rate: 5200, amount: 624000, status: 'Open' },
  { id: 'BOQ-3.2.1-003', wbs: '3.2.1 Foundation', description: 'RCC M25 footing', unit: 'Cum', qty: 280, rate: 7800, amount: 2184000, status: 'Approved' },
  { id: 'BOQ-3.2.2-001', wbs: '3.2.2 Plinth', description: 'Brick masonry in plinth', unit: 'Cum', qty: 85, rate: 6500, amount: 552500, status: 'Open' },
  { id: 'BOQ-3.2.2-002', wbs: '3.2.2 Plinth', description: 'DPC 2cm thick', unit: 'Sqm', qty: 420, rate: 180, amount: 75600, status: 'Approved' },
  { id: 'BOQ-3.3.1-001', wbs: '3.3.1 Structure', description: 'RCC columns M30', unit: 'Cum', qty: 150, rate: 8500, amount: 1275000, status: 'In Progress' },
];

const boqColumns = [
  { key: 'id', label: 'BOQ Item', width: '140px' },
  { key: 'wbs', label: 'WBS Element' },
  { key: 'description', label: 'Description' },
  { key: 'unit', label: 'Unit', width: '60px' },
  { key: 'qty', label: 'Quantity', align: 'right' as const, format: 'number' as const },
  { key: 'rate', label: 'Rate (₹)', align: 'right' as const, format: 'currency' as const },
  { key: 'amount', label: 'Amount (₹)', align: 'right' as const, format: 'currency' as const },
  { key: 'status', label: 'Status', format: 'status' as const },
];

export function BOQPage() {
  return (
    <ListReport
      title="Bill of Quantities"
      subtitle="Riverside Tower — Phase II"
      columns={boqColumns}
      data={boqData}
    />
  );
}

// ── Subcontractor Bills ──
const billData = [
  { id: 'INV-2024-0034', date: '15/01/2024', subcontractor: 'Sharma Electrical Works', project: 'Riverside Tower', billAmount: 485000, tds: 48500, netPayable: 436500, status: 'Approved' },
  { id: 'INV-2024-0033', date: '12/01/2024', subcontractor: 'Patel Plumbing Solutions', project: 'Green Valley Res.', billAmount: 320000, tds: 32000, netPayable: 288000, status: 'Pending' },
  { id: 'INV-2024-0032', date: '10/01/2024', subcontractor: 'National Steel Fabricators', project: 'Metro Link Bridge', billAmount: 1250000, tds: 125000, netPayable: 1125000, status: 'Open' },
  { id: 'INV-2024-0031', date: '08/01/2024', subcontractor: 'Gupta Painters & Co', project: 'Riverside Tower', billAmount: 175000, tds: 17500, netPayable: 157500, status: 'Approved' },
  { id: 'INV-2024-0030', date: '05/01/2024', subcontractor: 'Singh Masonry Works', project: 'Industrial Park', billAmount: 680000, tds: 68000, netPayable: 612000, status: 'Pending' },
];

const billColumns = [
  { key: 'id', label: 'Bill No.', width: '140px' },
  { key: 'date', label: 'Date', width: '110px' },
  { key: 'subcontractor', label: 'Subcontractor' },
  { key: 'project', label: 'Project' },
  { key: 'billAmount', label: 'Bill Amount', align: 'right' as const, format: 'currency' as const },
  { key: 'tds', label: 'TDS', align: 'right' as const, format: 'currency' as const },
  { key: 'netPayable', label: 'Net Payable', align: 'right' as const, format: 'currency' as const },
  { key: 'status', label: 'Status', format: 'status' as const },
];

export function BillsPage() {
  return (
    <ListReport
      title="Subcontractor Bills"
      subtitle="Running bills and payment tracking"
      columns={billColumns}
      data={billData}
    />
  );
}

// ── Attendance ──
const attendanceData = [
  { id: 'EMP-001', name: 'Ramesh Yadav', category: 'Mason', site: 'Riverside Tower', date: '15/01/2024', hours: 8, status: 'Present', overtime: 0 },
  { id: 'EMP-002', name: 'Suresh Kumar', category: 'Helper', site: 'Riverside Tower', date: '15/01/2024', hours: 8, status: 'Present', overtime: 2 },
  { id: 'EMP-003', name: 'Anil Sharma', category: 'Supervisor', site: 'Green Valley Res.', date: '15/01/2024', hours: 9, status: 'Present', overtime: 1 },
  { id: 'EMP-004', name: 'Mohan Das', category: 'Mason', site: 'Metro Link Bridge', date: '15/01/2024', hours: 0, status: 'Absent', overtime: 0 },
  { id: 'EMP-005', name: 'Priya Devi', category: 'Helper', site: 'Riverside Tower', date: '15/01/2024', hours: 8, status: 'Present', overtime: 0 },
  { id: 'EMP-006', name: 'Karan Singh', category: 'Electrician', site: 'Industrial Park', date: '15/01/2024', hours: 8, status: 'Present', overtime: 1.5 },
  { id: 'EMP-007', name: 'Deepak Verma', category: 'Plumber', site: 'Green Valley Res.', date: '15/01/2024', hours: 6, status: 'Present', overtime: 0 },
  { id: 'EMP-008', name: 'Vijay Patil', category: 'Mason', site: 'Riverside Tower', date: '15/01/2024', hours: 0, status: 'Absent', overtime: 0 },
];

const attendanceColumns = [
  { key: 'id', label: 'Emp ID', width: '100px' },
  { key: 'name', label: 'Name' },
  { key: 'category', label: 'Category' },
  { key: 'site', label: 'Site' },
  { key: 'date', label: 'Date', width: '110px' },
  { key: 'hours', label: 'Hours', align: 'right' as const },
  { key: 'overtime', label: 'OT Hours', align: 'right' as const },
  { key: 'status', label: 'Status', format: 'status' as const },
];

export function AttendancePage() {
  return (
    <ListReport
      title="Daily Attendance"
      subtitle="Site-wise attendance for 15/01/2024"
      columns={attendanceColumns}
      data={attendanceData}
    />
  );
}

// ── Reports Page ──
export function ReportsPage() {
  const navigate = useNavigate();
  const reports = [
    { title: 'Procurement Summary', desc: 'PR/PO status, values, vendor performance', icon: 'module.procurement', color: '#0066cc' },
    { title: 'Stock Position Report', desc: 'Current stock levels, consumption, reorder alerts', icon: 'module.inventory', color: '#059669' },
    { title: 'Project Cost Report', desc: 'Budget vs actual, cost variance by WBS', icon: 'module.project', color: '#7c3aed' },
    { title: 'Financial Statement', desc: 'P&L, balance sheet, cash flow', icon: 'module.finance', color: '#dc2626' },
    { title: 'Labour Attendance Report', desc: 'Monthly attendance, overtime, productivity', icon: 'module.hr', color: '#d97706' },
    { title: 'Material Reconciliation', desc: 'BOQ vs consumed vs remaining', icon: 'module.inventory', color: '#059669' },
  ];

  return (
    <div className="p-[var(--density-spacing-xl)] max-w-[1440px] mx-auto">
      <div className="mb-[var(--density-spacing-xl)]">
        <h1 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Reports</h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>Standard reports and analytics</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[var(--density-spacing-md)]">
        {reports.map((report, i) => {
          const Icon = getIcon(report.icon);
          return (
            <button
              key={i}
              className="rounded-[var(--density-border-radius)] p-5 text-left transition-all hover:shadow-md hover:-translate-y-0.5"
              style={{ background: 'var(--tile-bg)', border: '1px solid var(--tile-border)' }}
            >
              <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                style={{ background: `${report.color}15` }}>
                <Icon size={20} style={{ color: report.color }} />
              </div>
              <div className="text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>{report.title}</div>
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{report.desc}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── PO Object Page (Detail View) ──
export function PurchaseOrderDetailPage() {
  return (
    <ObjectPage
      title="PO-2024-0142"
      subtitle="Steel India Pvt Ltd · Riverside Tower — Phase II"
      status="Open"
      statusColor="var(--status-open)"
      headerFacts={[
        { label: 'Order Value', value: '24,50,000', format: 'currency' },
        { label: 'Delivery Date', value: '25/01/2024' },
        { label: 'Payment Terms', value: '45 days from GRN' },
        { label: 'Created By', value: 'Amit Sharma' },
      ]}
      actions={[
        { label: 'Create GRN', variant: 'primary' },
        { label: 'Amend', variant: 'secondary' },
        { label: 'Cancel', variant: 'danger' },
      ]}
      tabs={[
        {
          key: 'details',
          label: 'Details',
          content: (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Order Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span style={{ color: 'var(--text-muted)' }}>PO Date</span><span style={{ color: 'var(--text-primary)' }}>15/01/2024</span></div>
                  <div className="flex justify-between"><span style={{ color: 'var(--text-muted)' }}>Vendor GSTIN</span><span style={{ color: 'var(--text-primary)' }}>27AABCS1234F1ZP</span></div>
                  <div className="flex justify-between"><span style={{ color: 'var(--text-muted)' }}>Payment Terms</span><span style={{ color: 'var(--text-primary)' }}>45 days from GRN</span></div>
                  <div className="flex justify-between"><span style={{ color: 'var(--text-muted)' }}>Delivery Location</span><span style={{ color: 'var(--text-primary)' }}>Site Store A, Riverside Tower</span></div>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Line Items Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span style={{ color: 'var(--text-muted)' }}>TMT Bar 12mm</span><span className="tabular-nums" style={{ color: 'var(--text-primary)' }}>₹12,50,000</span></div>
                  <div className="flex justify-between"><span style={{ color: 'var(--text-muted)' }}>TMT Bar 16mm</span><span className="tabular-nums" style={{ color: 'var(--text-primary)' }}>₹8,00,000</span></div>
                  <div className="flex justify-between"><span style={{ color: 'var(--text-muted)' }}>TMT Bar 20mm</span><span className="tabular-nums" style={{ color: 'var(--text-primary)' }}>₹4,00,000</span></div>
                  <div className="flex justify-between border-t pt-2" style={{ borderColor: 'var(--border-color)' }}>
                    <span className="font-medium" style={{ color: 'var(--text-primary)' }}>Total</span>
                    <span className="tabular-nums font-medium" style={{ color: 'var(--text-primary)' }}>₹24,50,000</span>
                  </div>
                </div>
              </div>
            </div>
          ),
        },
        {
          key: 'lines',
          label: 'Lines',
          content: (
            <div className="rounded-[var(--density-border-radius)] overflow-hidden border" style={{ borderColor: 'var(--border-color)' }}>
              <table className="w-full">
                <thead>
                  <tr style={{ background: 'var(--shell-bg)' }}>
                    <th className="px-4 py-2 text-left text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Item</th>
                    <th className="px-4 py-2 text-left text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Description</th>
                    <th className="px-4 py-2 text-right text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Qty</th>
                    <th className="px-4 py-2 text-right text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Rate</th>
                    <th className="px-4 py-2 text-right text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { item: 'TMT Bar 12mm', desc: 'Fe 500D, 12m length', qty: '25 MT', rate: '₹50,000', amount: '₹12,50,000' },
                    { item: 'TMT Bar 16mm', desc: 'Fe 500D, 12m length', qty: '16 MT', rate: '₹50,000', amount: '₹8,00,000' },
                    { item: 'TMT Bar 20mm', desc: 'Fe 500D, 12m length', qty: '8 MT', rate: '₹50,000', amount: '₹4,00,000' },
                  ].map((line, i) => (
                    <tr key={i} className="border-t" style={{ borderColor: 'var(--border-color)' }}>
                      <td className="px-4 py-2.5 text-sm" style={{ color: 'var(--text-primary)' }}>{line.item}</td>
                      <td className="px-4 py-2.5 text-sm" style={{ color: 'var(--text-secondary)' }}>{line.desc}</td>
                      <td className="px-4 py-2.5 text-sm text-right tabular-nums" style={{ color: 'var(--text-primary)' }}>{line.qty}</td>
                      <td className="px-4 py-2.5 text-sm text-right tabular-nums" style={{ color: 'var(--text-primary)' }}>{line.rate}</td>
                      <td className="px-4 py-2.5 text-sm text-right tabular-nums font-medium" style={{ color: 'var(--text-primary)' }}>{line.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ),
        },
        {
          key: 'timeline',
          label: 'Timeline',
          content: (
            <div className="space-y-4">
              {[
                { time: '15/01/2024 10:30', action: 'PO Created', user: 'Amit Sharma', detail: 'Created from PR-2024-0089' },
                { time: '15/01/2024 11:15', action: 'Sent for Approval', user: 'Amit Sharma', detail: 'Assigned to Rajesh Kumar (PM)' },
                { time: '15/01/2024 14:00', action: 'Approved', user: 'Rajesh Kumar', detail: 'Approved with comments: "Rates verified"' },
                { time: '15/01/2024 14:30', action: 'Dispatched to Vendor', user: 'System', detail: 'Email sent to Steel India Pvt Ltd' },
              ].map((event, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ background: 'var(--brand-primary)' }} />
                  <div>
                    <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{event.action}</div>
                    <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{event.time} · {event.user}</div>
                    <div className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{event.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          ),
        },
        {
          key: 'accountability',
          label: 'Accountability',
          content: (
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b" style={{ borderColor: 'var(--border-color)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Created By</span>
                <span style={{ color: 'var(--text-primary)' }}>Amit Sharma · Procurement Officer</span>
              </div>
              <div className="flex justify-between py-2 border-b" style={{ borderColor: 'var(--border-color)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Approved By</span>
                <span style={{ color: 'var(--text-primary)' }}>Rajesh Kumar · Project Manager</span>
              </div>
              <div className="flex justify-between py-2 border-b" style={{ borderColor: 'var(--border-color)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Authority Limit</span>
                <span className="tabular-nums" style={{ color: 'var(--text-primary)' }}>₹50,00,000</span>
              </div>
              <div className="flex justify-between py-2">
                <span style={{ color: 'var(--text-muted)' }}>Protocol Status</span>
                <span style={{ color: 'var(--semantic-success)' }}>All gates passed</span>
              </div>
            </div>
          ),
        },
      ]}
    />
  );
}

// ── Module index pages (redirect to list) ──
export function ProcurementIndexPage() {
  return <PurchaseOrdersPage />;
}

export function InventoryIndexPage() {
  return <GoodsReceiptPage />;
}

export function ProjectsIndexPage() {
  return <ProjectListPage />;
}

export function FinanceIndexPage() {
  return <BillsPage />;
}

export function HRIndexPage() {
  return <AttendancePage />;
}
