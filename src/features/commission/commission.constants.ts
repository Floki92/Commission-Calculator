export const COMMISSION_WEIGHTS = {
  ACQUISITION: 0.60,
  VOICE: 0.60, // Alias for backward compatibility
  ENTERPRISE_ACCOUNTS: 0.05,
  ENTERPRISE_LINES: 0.05,
  TERMINAL: 0.10,
  DSL: 0.16,
  CONNECTIVITY: 0.04,
} as const;

export const UNITS = {
  ACQUISITION_LOW: 'Points',
  ACQUISITION_HIGH: 'Points',
  ACQUISITION_CASH: 'Points',
  ACQUISITION_TOTAL: 'Points',
  VOICE: 'Points',
  ENTERPRISE_ACCOUNTS: 'Accounts',
  ENTERPRISE_LINES: 'Lines',
  TERMINAL: 'EGP',
  DSL: 'Customers',
  CONNECTIVITY: 'Points',
} as const;
