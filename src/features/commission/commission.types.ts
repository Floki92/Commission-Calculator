export interface ComponentInput {
  target: number | null;
  actual: number | null;
}

export interface ComponentResult {
  achievement: number | null;
  contribution: number | null;
  missing: number | null;
}

export interface EnterpriseInput {
  accounts: ComponentInput;
  lines: ComponentInput;
}

export interface EnterpriseResult {
  accounts: ComponentResult;
  lines: ComponentResult;
  totalContribution: number | null;
}

export interface FixedInput {
  dsl: ComponentInput;
  connectivity: ComponentInput;
}

export interface FixedResult {
  dsl: ComponentResult;
  connectivity: ComponentResult;
  totalContribution: number | null;
}

export interface CommissionInput {
  voice: ComponentInput;
  enterprise: EnterpriseInput;
  terminal: ComponentInput;
  fixed: FixedInput;
}

export interface OverallResult {
  achievement: number | null;
  isComplete: boolean;
}

export interface CommissionResult {
  voice: ComponentResult;
  enterprise: EnterpriseResult;
  terminal: ComponentResult;
  fixed: FixedResult;
  overall: OverallResult;
}
