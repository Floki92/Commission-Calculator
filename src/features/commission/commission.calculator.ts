import { 
  CommissionInput, 
  CommissionResult, 
  ComponentInput, 
  ComponentResult, 
  AcquisitionInput,
  AcquisitionResult,
  EnterpriseInput, 
  EnterpriseResult,
  FixedInput,
  FixedResult
} from './commission.types';
import { COMMISSION_WEIGHTS } from './commission.constants';

function calculateComponent(input: ComponentInput, weight: number): ComponentResult {
  if (input.target === null || input.actual === null) {
    return { achievement: null, contribution: null, missing: null };
  }
  
  if (input.target <= 0) {
    return { achievement: null, contribution: null, missing: null };
  }

  if (input.actual < 0) {
    return { achievement: null, contribution: null, missing: null };
  }

  const achievement = (input.actual / input.target) * 100;
  const contribution = achievement * weight;
  
  // Calculate missing value (floor to 0 if actual exceeds target, or just target - actual)
  const missing = Math.max(0, input.target - input.actual);

  return { achievement, contribution, missing };
}

function calculateAcquisition(input: AcquisitionInput): AcquisitionResult {
  // Calculate individual achievements and missing metrics for Low, High, Cash
  const low = calculateComponent(input.low, 0);
  const high = calculateComponent(input.high, 0);
  const cash = calculateComponent(input.cash, 0);

  // Determine if any target or actual was provided
  const hasAnyTarget = input.low.target !== null || input.high.target !== null || input.cash.target !== null;
  const totalTarget = hasAnyTarget
    ? (input.low.target ?? 0) + (input.high.target ?? 0) + (input.cash.target ?? 0)
    : null;

  const hasAnyActual = input.low.actual !== null || input.high.actual !== null || input.cash.actual !== null;
  const totalActual = hasAnyActual
    ? (input.low.actual ?? 0) + (input.high.actual ?? 0) + (input.cash.actual ?? 0)
    : null;

  // Calculate Total Acquisition with 60% weight
  const total = calculateComponent(
    { target: totalTarget, actual: totalActual },
    COMMISSION_WEIGHTS.ACQUISITION
  );

  return {
    low,
    high,
    cash,
    total,
    totalTarget,
    totalActual,
  };
}

function calculateEnterprise(input: EnterpriseInput): EnterpriseResult {
  const accounts = calculateComponent(input.accounts, COMMISSION_WEIGHTS.ENTERPRISE_ACCOUNTS);
  const lines = calculateComponent(input.lines, COMMISSION_WEIGHTS.ENTERPRISE_LINES);

  const isComplete = accounts.contribution !== null && lines.contribution !== null;
  const totalContribution = isComplete ? (accounts.contribution! + lines.contribution!) : null;

  return { accounts, lines, totalContribution };
}

function calculateFixed(input: FixedInput): FixedResult {
  const dsl = calculateComponent(input.dsl, COMMISSION_WEIGHTS.DSL);
  const connectivity = calculateComponent(input.connectivity, COMMISSION_WEIGHTS.CONNECTIVITY);

  const isComplete = dsl.contribution !== null && connectivity.contribution !== null;
  const totalContribution = isComplete ? (dsl.contribution! + connectivity.contribution!) : null;

  return { dsl, connectivity, totalContribution };
}

export function calculateCommission(input: CommissionInput): CommissionResult {
  // Support legacy voice input gracefully if acquisition is not provided
  const acquisitionInput: AcquisitionInput = input.acquisition || {
    low: { target: input.voice?.target ?? null, actual: input.voice?.actual ?? null },
    high: { target: null, actual: null },
    cash: { target: null, actual: null },
  };

  const acquisition = calculateAcquisition(acquisitionInput);
  const enterprise = calculateEnterprise(input.enterprise);
  const terminal = calculateComponent(input.terminal, COMMISSION_WEIGHTS.TERMINAL);
  const fixed = calculateFixed(input.fixed);

  const isComplete = 
    acquisition.total.contribution !== null && 
    enterprise.totalContribution !== null && 
    terminal.contribution !== null && 
    fixed.totalContribution !== null;

  let overallAchievement: number | null = null;
  if (isComplete) {
    overallAchievement = 
      acquisition.total.contribution! + 
      enterprise.totalContribution! + 
      terminal.contribution! + 
      fixed.totalContribution!;
  }

  return {
    acquisition,
    voice: acquisition.total, // Backward-compatible alias
    enterprise,
    terminal,
    fixed,
    overall: {
      achievement: overallAchievement,
      isComplete
    }
  };
}

