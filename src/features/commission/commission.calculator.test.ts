import { describe, it, expect } from 'vitest';
import { calculateCommission } from './commission.calculator';
import { CommissionInput } from './commission.types';

describe('Commission Calculator', () => {
  const defaultValidInput: CommissionInput = {
    voice: { target: 100, actual: 100 },
    enterprise: {
      accounts: { target: 100, actual: 100 },
      lines: { target: 100, actual: 100 },
    },
    terminal: { target: 100, actual: 100 },
    fixed: {
      dsl: { target: 100, actual: 100 },
      connectivity: { target: 100, actual: 100 },
    }
  };

  it('1. All targets and actuals equal target => overall 100%', () => {
    const result = calculateCommission(defaultValidInput);
    expect(result.overall.achievement).toBe(100);
    expect(result.overall.isComplete).toBe(true);
  });

  it('2. Voice at 75%', () => {
    const input = { ...defaultValidInput, voice: { target: 4000, actual: 3000 } };
    const result = calculateCommission(input);
    expect(result.voice.achievement).toBe(75);
    expect(result.voice.contribution).toBe(45);
  });

  it('3. Enterprise Accounts at 50%', () => {
    const input = { ...defaultValidInput, enterprise: { ...defaultValidInput.enterprise, accounts: { target: 2, actual: 1 } } };
    const result = calculateCommission(input);
    expect(result.enterprise.accounts.achievement).toBe(50);
    expect(result.enterprise.accounts.contribution).toBe(2.5);
  });

  it('4. Enterprise Lines at 50%', () => {
    const input = { ...defaultValidInput, enterprise: { ...defaultValidInput.enterprise, lines: { target: 6, actual: 3 } } };
    const result = calculateCommission(input);
    expect(result.enterprise.lines.achievement).toBe(50);
    expect(result.enterprise.lines.contribution).toBe(2.5);
  });

  it('5. Terminal at 75%', () => {
    const input = { ...defaultValidInput, terminal: { target: 80000, actual: 60000 } };
    const result = calculateCommission(input);
    expect(result.terminal.achievement).toBe(75);
    expect(result.terminal.contribution).toBe(7.5);
  });

  it('6. DSL at 80%', () => {
    const input = { ...defaultValidInput, fixed: { ...defaultValidInput.fixed, dsl: { target: 5, actual: 4 } } };
    const result = calculateCommission(input);
    expect(result.fixed.dsl.achievement).toBe(80);
    expect(result.fixed.dsl.contribution).toBe(12.8);
  });

  it('7. Connectivity at 50%', () => {
    const input = { ...defaultValidInput, fixed: { ...defaultValidInput.fixed, connectivity: { target: 100, actual: 50 } } };
    const result = calculateCommission(input);
    expect(result.fixed.connectivity.contribution).toBe(2);
  });

  it('8. Over-achievement', () => {
    const input = { ...defaultValidInput, voice: { target: 4000, actual: 5000 } };
    const result = calculateCommission(input);
    expect(result.voice.achievement).toBe(125);
    expect(result.voice.contribution).toBe(75);
  });

  it('9. Target = 0 => must not divide by zero and should be incomplete', () => {
    const input = { ...defaultValidInput, voice: { target: 0, actual: 100 } };
    const result = calculateCommission(input);
    expect(result.voice.achievement).toBeNull();
    expect(result.voice.contribution).toBeNull();
    expect(result.overall.isComplete).toBe(false);
    expect(result.overall.achievement).toBeNull();
  });

  it('10. Negative values are rejected (incomplete)', () => {
    const input = { ...defaultValidInput, terminal: { target: 100, actual: -10 } };
    const result = calculateCommission(input);
    expect(result.terminal.achievement).toBeNull();
    expect(result.overall.isComplete).toBe(false);
  });

  it('11. Decimal values where appropriate', () => {
    const input = { ...defaultValidInput, voice: { target: 10.5, actual: 5.25 } };
    const result = calculateCommission(input);
    expect(result.voice.achievement).toBe(50);
    expect(result.voice.contribution).toBe(30);
  });

  it('12. Overall total calculation from requirements sample', () => {
    const input: CommissionInput = {
      voice: { target: 4000, actual: 3000 },
      enterprise: {
        accounts: { target: 2, actual: 2 },
        lines: { target: 6, actual: 3 },
      },
      terminal: { target: 80000, actual: 60000 },
      fixed: {
        dsl: { target: 5, actual: 4 },
        connectivity: { target: 250, actual: 125 },
      }
    };

    const result = calculateCommission(input);
    expect(result.voice.achievement).toBe(75);
    expect(result.voice.contribution).toBe(45);
    expect(result.enterprise.accounts.achievement).toBe(100);
    expect(result.enterprise.accounts.contribution).toBe(5);
    expect(result.enterprise.lines.achievement).toBe(50);
    expect(result.enterprise.lines.contribution).toBe(2.5);
    expect(result.enterprise.totalContribution).toBe(7.5);
    expect(result.terminal.achievement).toBe(75);
    expect(result.terminal.contribution).toBe(7.5);
    expect(result.fixed.dsl.achievement).toBe(80);
    expect(result.fixed.dsl.contribution).toBe(12.8);
    expect(result.fixed.connectivity.achievement).toBe(50);
    expect(result.fixed.connectivity.contribution).toBe(2);
    expect(result.fixed.totalContribution).toBe(14.8);
    
    // Overall: 45 + 7.5 + 7.5 + 14.8 = 74.8
    expect(result.overall.achievement).toBeCloseTo(74.8, 2);
    expect(result.overall.isComplete).toBe(true);
  });
});
