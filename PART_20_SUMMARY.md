# Part 20 — Advanced Responsive Dashboard Architecture

## Overview

Part 20 implements a comprehensive dashboard and widget framework for the Construction ERP, providing personalized workspaces for every user with permission-aware widgets, KPI tracking, and drill-down capabilities. The system supports multiple device types (desktop, tablet, mobile) with responsive layouts and allows users to customize their dashboard while maintaining role-based defaults.

## Implementation Summary

### 1. Data Model (`src/data/dashboardData.ts`)

**Widget Registry:**
- 15 sample widgets across multiple modules (workflow, tasks, notifications, projects, finance, inventory, HR, protocol, accountability, system)
- Widget types: KPI, list, chart, custom
- Permission-based visibility
- Device-specific default sizes (desktop, tablet, mobile)
- Configurable refresh intervals
- Filter support for dynamic data

**KPI Registry:**
- 5 sample KPIs (project progress, budget variance, material consumption, workforce utilization, compliance score)
- Formula documentation for transparency
- Threshold-based status indicators (red/amber/green)
- Direction indicators (higher_better/lower_better)
- Version control for KPI definitions
- Drill-down links to source data

**Layout Definitions:**
- Role-based default layouts (Project Manager desktop/mobile)
- User-specific custom layouts
- Grid-based positioning system (12-column grid)
- Device-specific layout variants
- Widget position, size, and filter configuration

**User Quick Actions:**
- Personalized quick action shortcuts
- Permission-filtered actions
- Customizable ordering
- Direct navigation to frequently used features

**Sample Data:**
- KPI widget data with trends and status
- List widget data for approvals, tasks, notifications, projects, recent records
- Chart widget data for progress trends and cost breakdowns

### 2. Dashboard Service (`src/core/DashboardService.ts`)

**Widget Management:**
- `getPermittedWidgets()` - Filter widgets by user permissions
- `getWidgetData()` - Fetch widget data with error isolation

**Layout Management:**
- `saveUserLayout()` - Persist user's custom layout with audit logging
- `resetToRoleDefault()` - Reset to role-based default layout
- `getEffectiveLayout()` - Resolve layout priority (user > role > system)

**KPI Management:**
- `getKpiValue()` - Calculate KPI value with status determination
- `getKpisByModule()` - Get all KPIs for a specific module

**Quick Actions Management:**
- `addQuickAction()` - Add new quick action with audit logging
- `removeQuickAction()` - Remove quick action
- `reorderQuickActions()` - Reorder quick actions with audit logging

**Role Layout Management:**
- `saveRoleLayout()` - Super Admin can save role default layouts
- Protocol control CP-DASH-01 enforcement

**Statistics:**
- `getDashboardStats()` - Get overall dashboard statistics

### 3. Dashboard Workspace (`src/pages/DashboardWorkspace.tsx`)

**Main Features:**
- Responsive grid layout (12-column system)
- Device-aware rendering (desktop/tablet/mobile)
- Edit mode for layout customization
- Widget gallery drawer for adding new widgets
- Real-time data loading with error isolation
- Refresh functionality for manual data updates
- Save/reset layout actions

**Widget Container:**
- Error boundary for individual widget failures
- Loading states with spinners
- Empty states for missing data
- Edit mode controls (drag handle, remove button)
- Responsive sizing based on device type

**KPI Widget:**
- Large value display with unit
- Trend indicators (up/down/flat)
- Status badge (red/amber/green)
- Mini trend chart (sparkline)
- Drill-down link to detailed view
- Previous value comparison

**List Widget:**
- Scrollable list of items
- Priority indicators
- Status badges
- Subtitle and metadata
- Click-through to detail views
- "View more" indicator for overflow

**Chart Widget:**
- Line/area charts with multiple datasets
- Pie charts with legend
- Responsive sizing
- Tooltip support
- Color-coded datasets

**Quick Actions Widget:**
- Horizontal scrollable action buttons
- Icon and label display
- Direct navigation links
- Permission-filtered visibility

**Widget Gallery Drawer:**
- Search and filter widgets
- Module-based categorization
- Widget preview with description
- One-click add to dashboard
- Responsive drawer layout

### 4. Integration

**Feature Flags:**
- `ff.dash` - Master flag for dashboard framework

**Routes:**
- `/home/dash` - Dashboard workspace

**Navigation:**
- Home → My Workspace (sort order 19)

**Protocol Controls:**
- CP-DASH-01: Every KPI widget declares data label, formula, threshold and drill path

### Key Features

1. **Permission-Aware Widgets**: Only shows widgets the user has permission to view
2. **Responsive Design**: Adapts layout for desktop, tablet, and mobile devices
3. **Personalization**: Users can customize their dashboard layout
4. **Role-Based Defaults**: Each role has a pre-configured default layout
5. **Error Isolation**: One failing widget doesn't break the entire dashboard
6. **Real-Time Updates**: Configurable refresh intervals per widget
7. **KPI Tracking**: Standardized KPI display with trends and status indicators
8. **Drill-Down**: Click through from KPIs to detailed source data
9. **Quick Actions**: Personalized shortcuts to frequently used features
10. **Widget Gallery**: Browse and add available widgets
11. **Layout Persistence**: Save and restore custom layouts
12. **Audit Trail**: All layout changes are audited
13. **Data Freshness**: Timestamp display for each widget
14. **Status Indicators**: Visual RAG (Red/Amber/Green) status for KPIs
15. **Trend Visualization**: Mini charts showing historical trends

### Architecture

```
User Request
    ↓
Dashboard Workspace
    ↓
┌─────────────────────────────────────┐
│  1. Load Effective Layout           │
│     (User > Role > System)          │
│  2. Filter Widgets by Permission    │
│  3. Fetch Widget Data (parallel)    │
│  4. Render Grid Layout              │
└─────────────────────────────────────┘
    ↓
Widget Container (per widget)
    ↓
┌─────────────────────────────────────┐
│  Loading State                      │
│  ↓                                  │
│  Data Loaded / Error / Empty        │
│  ↓                                  │
│  Render Widget Type                 │
│  (KPI / List / Chart / Custom)      │
└─────────────────────────────────────┘
    ↓
User Interaction
    ↓
┌─────────────────────────────────────┐
│  Edit Mode:                         │
│  - Add/Remove Widgets               │
│  - Resize/Reposition                │
│  - Save/Reset Layout                │
│                                     │
│  View Mode:                         │
│  - Refresh Data                     │
│  - Drill Down                       │
│  - Quick Actions                    │
└─────────────────────────────────────┘
```

### Data Statistics

- **Widgets**: 15 registered widgets
- **KPIs**: 5 defined KPIs
- **Layouts**: 3 sample layouts (2 role defaults, 1 user custom)
- **Quick Actions**: 4 sample actions
- **Widget Types**: 4 (KPI, list, chart, custom)
- **Device Support**: 3 (desktop, tablet, mobile)

### Build Status

✅ **Build Successful** — 1,501.35 KB (JS) + 40.37 KB (CSS)

### Dependencies

- Part 06 (IAM) - Permission-based widget visibility
- Part 19 (Design System) - UI components and tokens

### Consumed By

- Part 21 (Responsive Shell) - Dashboard integration
- Part 40 (Project Management) - Project widgets
- Part 96 (Reporting) - Report widgets
- Part 98 (Control Towers) - Specialized dashboards
- Part 145 (Dashboard Framework) - Extended dashboard features

### Protocol Controls Implemented

- **CP-DASH-01**: Every KPI widget declares data label, formula, threshold and drill path

### Next Steps

Part 21 — Mobile + Tablet + Desktop Experience will build on this dashboard framework to add:
- Enhanced responsive shell
- Mobile-specific optimizations
- Touch gesture support
- Offline dashboard caching

## Conclusion

Part 20 provides a robust, flexible, and user-friendly dashboard framework that serves as the central workspace for all ERP users. The permission-aware widget system ensures security while the personalization features enhance user productivity. The responsive design supports all device types, and the error isolation ensures reliability. The KPI tracking and drill-down capabilities provide actionable insights, while the quick actions enable efficient navigation. This foundation enables all future dashboard and control tower implementations across the ERP system.
