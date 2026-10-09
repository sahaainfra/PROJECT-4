// ═══════════════════════════════════════════════════════════
// UTILITIES — Part 04
// Money, quantity, date, UOM conversion utilities
// ═══════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════
// MONEY UTILITIES
// ═══════════════════════════════════════════════════════════

/**
 * Format amount in Indian currency format
 * Examples: ₹1,23,456.78, ₹12.34 Cr, ₹56.78 L
 */
export function formatCurrency(
  amount: number,
  options: {
    compact?: boolean;
    decimals?: number;
    showSymbol?: boolean;
  } = {}
): string {
  const { compact = false, decimals = 2, showSymbol = true } = options;
  
  const symbol = showSymbol ? '₹' : '';
  
  if (compact) {
    if (Math.abs(amount) >= 10000000) {
      return `${symbol}${(amount / 10000000).toFixed(decimals)} Cr`;
    }
    if (Math.abs(amount) >= 100000) {
      return `${symbol}${(amount / 100000).toFixed(decimals)} L`;
    }
    if (Math.abs(amount) >= 1000) {
      return `${symbol}${(amount / 1000).toFixed(decimals)} K`;
    }
  }
  
  // Indian number formatting
  const formatted = amount.toLocaleString('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  
  return `${symbol}${formatted}`;
}

/**
 * Parse currency string to number
 * Handles: ₹1,23,456.78, 12.34 Cr, 56.78 L, 100 K
 */
export function parseCurrency(value: string): number {
  const cleaned = value.replace(/[₹,\s]/g, '').toUpperCase();
  
  if (cleaned.includes('CR')) {
    return parseFloat(cleaned.replace('CR', '')) * 10000000;
  }
  if (cleaned.includes('L')) {
    return parseFloat(cleaned.replace('L', '')) * 100000;
  }
  if (cleaned.includes('K')) {
    return parseFloat(cleaned.replace('K', '')) * 1000;
  }
  
  return parseFloat(cleaned);
}

/**
 * Calculate GST amounts
 */
export function calculateGST(
  baseAmount: number,
  gstRate: number
): { cgst: number; sgst: number; igst: number; total: number } {
  const gstAmount = (baseAmount * gstRate) / 100;
  const cgst = gstAmount / 2;
  const sgst = gstAmount / 2;
  
  return {
    cgst,
    sgst,
    igst: gstAmount, // For inter-state
    total: baseAmount + gstAmount,
  };
}

/**
 * Calculate TDS deduction
 */
export function calculateTDS(
  amount: number,
  tdsRate: number,
  threshold: number = 0
): { tdsAmount: number; netAmount: number } {
  if (amount <= threshold) {
    return { tdsAmount: 0, netAmount: amount };
  }
  
  const tdsAmount = (amount * tdsRate) / 100;
  const netAmount = amount - tdsAmount;
  
  return { tdsAmount, netAmount };
}

// ═══════════════════════════════════════════════════════════
// QUANTITY UTILITIES
// ═══════════════════════════════════════════════════════════

/**
 * Format quantity with unit
 */
export function formatQuantity(
  quantity: number,
  unit: string,
  decimals: number = 2
): string {
  const formatted = quantity.toLocaleString('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  
  return `${formatted} ${unit}`;
}

/**
 * UOM conversion factors
 */
const uomConversions: Record<string, Record<string, number>> = {
  length: {
    mm: 1,
    cm: 10,
    m: 1000,
    km: 1000000,
    inch: 25.4,
    ft: 304.8,
  },
  weight: {
    mg: 1,
    g: 1000,
    kg: 1000000,
    ton: 1000000000,
    lb: 453592.37,
  },
  volume: {
    ml: 1,
    l: 1000,
    cum: 1000000, // cubic meter
    cft: 28316.8, // cubic feet
  },
  area: {
    sqmm: 1,
    sqcm: 100,
    sqm: 10000,
    sqft: 929.03,
    acre: 40468600,
    hectare: 100000000,
  },
};

/**
 * Convert between UOM
 */
export function convertUOM(
  value: number,
  fromUnit: string,
  toUnit: string
): number {
  // Find the category
  for (const category of Object.values(uomConversions)) {
    if (fromUnit in category && toUnit in category) {
      const fromFactor = category[fromUnit];
      const toFactor = category[toUnit];
      return (value * fromFactor) / toFactor;
    }
  }
  
  throw new Error(`Cannot convert from ${fromUnit} to ${toUnit}`);
}

// ═══════════════════════════════════════════════════════════
// DATE UTILITIES
// ═══════════════════════════════════════════════════════════

/**
 * Format date in Indian format
 */
export function formatDate(
  date: Date | string,
  format: 'DD/MM/YYYY' | 'YYYY-MM-DD' | 'DD MMM YYYY' = 'DD/MM/YYYY'
): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  switch (format) {
    case 'DD/MM/YYYY':
      return `${day}/${month}/${year}`;
    case 'YYYY-MM-DD':
      return `${year}-${month}-${day}`;
    case 'DD MMM YYYY':
      return `${day} ${months[d.getMonth()]} ${year}`;
    default:
      return `${day}/${month}/${year}`;
  }
}

/**
 * Get financial year from date
 * Indian FY: April 1 to March 31
 */
export function getFinancialYear(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const year = d.getFullYear();
  const month = d.getMonth(); // 0-11
  
  // If month is April (3) or later, FY is current year - next year
  if (month >= 3) {
    return `${year}-${String(year + 1).slice(-2)}`;
  }
  
  // Otherwise, FY is previous year - current year
  return `${year - 1}-${String(year).slice(-2)}`;
}

/**
 * Calculate days between dates
 */
export function daysBetween(date1: Date | string, date2: Date | string): number {
  const d1 = typeof date1 === 'string' ? new Date(date1) : date1;
  const d2 = typeof date2 === 'string' ? new Date(date2) : date2;
  
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Check if date is overdue
 */
export function isOverdue(dueDate: Date | string): boolean {
  const due = typeof dueDate === 'string' ? new Date(dueDate) : dueDate;
  return due < new Date();
}

// ═══════════════════════════════════════════════════════════
// PERCENTAGE UTILITIES
// ═══════════════════════════════════════════════════════════

/**
 * Calculate percentage
 */
export function calculatePercentage(
  value: number,
  total: number,
  decimals: number = 2
): number {
  if (total === 0) return 0;
  return Number(((value / total) * 100).toFixed(decimals));
}

/**
 * Format percentage
 */
export function formatPercentage(value: number, decimals: number = 2): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Calculate variance percentage
 */
export function calculateVariance(
  actual: number,
  planned: number,
  decimals: number = 2
): number {
  if (planned === 0) return 0;
  return Number((((actual - planned) / planned) * 100).toFixed(decimals));
}

// ═══════════════════════════════════════════════════════════
// NUMBER FORMATTING
// ═══════════════════════════════════════════════════════════

/**
 * Format number with Indian grouping
 */
export function formatNumber(value: number, decimals: number = 0): string {
  return value.toLocaleString('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * Parse number from string
 */
export function parseNumber(value: string): number {
  const cleaned = value.replace(/,/g, '');
  return parseFloat(cleaned);
}
