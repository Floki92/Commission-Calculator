import { 
  CommissionInput, 
  CommissionResult, 
  ComponentInput, 
  ComponentResult, 
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
  const voice = calculateComponent(input.voice, COMMISSION_WEIGHTS.VOICE);
  const enterprise = calculateEnterprise(input.enterprise);
  const terminal = calculateComponent(input.terminal, COMMISSION_WEIGHTS.TERMINAL);
  const fixed = calculateFixed(input.fixed);

  const isComplete = 
    voice.contribution !== null && 
    enterprise.totalContribution !== null && 
    terminal.contribution !== null && 
    fixed.totalContribution !== null;

  let overallAchievement: number | null = null;
  if (isComplete) {
    overallAchievement = 
      voice.contribution! + 
      enterprise.totalContribution! + 
      terminal.contribution! + 
      fixed.totalContribution!;
  }

  return {
    voice,
    enterprise,
    terminal,
    fixed,
    overall: {
      achievement: overallAchievement,
      isComplete
    }
  };
}
