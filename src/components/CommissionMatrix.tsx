import React from 'react';
import { CommissionInput, CommissionResult, ComponentInput } from '../features/commission/commission.types';
import { COMMISSION_WEIGHTS, UNITS } from '../features/commission/commission.constants';
import { formatPercentage } from '../features/commission/commission.utils';
import { Zap, Building2, Smartphone, Wifi, Layers, Boxes, Sigma, CalendarDays } from 'lucide-react';
import { NewsTickerNote } from './NewsTickerNote';

export interface CommissionMatrixProps {
  input: CommissionInput;
  result: CommissionResult;
  onChange: (updater: (prev: CommissionInput) => CommissionInput) => void;
  acqNote: string;
  onAcqNoteChange: (val: string) => void;
}

interface ColumnTheme {
  accentDot: string;
  subHeaderBg: string;
  titleColor: string;
  badgeBg: string;
  badgeText: string;
  unitColor: string;
  focusRing: string;
  contribBg: string;
  contribBorder: string;
  contribText: string;
}

export interface ColumnConfig {
  id: string;
  category: string;
  categoryWeight: string;
  subTitle: string;
  weight: number;
  weightLabel: string;
  unit: string;
  theme: ColumnTheme;
  isSubBox?: boolean;
  isSummary?: boolean;
  getter: (input: CommissionInput) => ComponentInput;
  setter?: (prev: CommissionInput, val: ComponentInput) => CommissionInput;
  resultGetter: (result: CommissionResult) => { 
    achievement: number | null; 
    vs?: number | null; 
    re?: number | null; 
    contribution: number | null; 
    missing: number | null 
  };
}

// Static columns definition - created ONCE, avoiding garbage collection overhead on every render
export const MATRIX_COLUMNS: ColumnConfig[] = [
  // --- ACQUISITION: 3 SUB-BOXES (Low, High, Cash) + 1 TOTAL ACQUISITION BOX ---
  {
    id: 'acq-low',
    category: 'Acquisition',
    categoryWeight: '60%',
    subTitle: 'Low',
    weight: 0,
    weightLabel: '',
    unit: UNITS.ACQUISITION_LOW,
    isSubBox: true,
    theme: {
      accentDot: 'bg-slate-400',
      subHeaderBg: 'bg-white hover:bg-slate-50/50 border-t-2 border-t-slate-300',
      titleColor: 'text-slate-800',
      badgeBg: 'bg-slate-100',
      badgeText: 'text-slate-700',
      unitColor: 'text-slate-500',
      focusRing: 'focus:ring-slate-400 focus:border-slate-500',
      contribBg: 'bg-white',
      contribBorder: 'border-slate-200',
      contribText: 'text-slate-800',
    },
    getter: (inp) => inp.acquisition.low,
    setter: (prev, val) => ({
      ...prev,
      acquisition: { ...prev.acquisition, low: val },
    }),
    resultGetter: (res) => res.acquisition.low,
  },
  {
    id: 'acq-high',
    category: 'Acquisition',
    categoryWeight: '60%',
    subTitle: 'High',
    weight: 0,
    weightLabel: '',
    unit: UNITS.ACQUISITION_HIGH,
    isSubBox: true,
    theme: {
      accentDot: 'bg-slate-400',
      subHeaderBg: 'bg-white hover:bg-slate-50/50 border-t-2 border-t-slate-300',
      titleColor: 'text-slate-800',
      badgeBg: 'bg-slate-100',
      badgeText: 'text-slate-700',
      unitColor: 'text-slate-500',
      focusRing: 'focus:ring-slate-400 focus:border-slate-500',
      contribBg: 'bg-white',
      contribBorder: 'border-slate-200',
      contribText: 'text-slate-800',
    },
    getter: (inp) => inp.acquisition.high,
    setter: (prev, val) => ({
      ...prev,
      acquisition: { ...prev.acquisition, high: val },
    }),
    resultGetter: (res) => res.acquisition.high,
  },
  {
    id: 'acq-cash',
    category: 'Acquisition',
    categoryWeight: '60%',
    subTitle: 'Cash',
    weight: 0,
    weightLabel: '',
    unit: UNITS.ACQUISITION_CASH,
    isSubBox: true,
    theme: {
      accentDot: 'bg-slate-400',
      subHeaderBg: 'bg-white hover:bg-slate-50/50 border-t-2 border-t-slate-300',
      titleColor: 'text-slate-800',
      badgeBg: 'bg-slate-100',
      badgeText: 'text-slate-700',
      unitColor: 'text-slate-500',
      focusRing: 'focus:ring-slate-400 focus:border-slate-500',
      contribBg: 'bg-white',
      contribBorder: 'border-slate-200',
      contribText: 'text-slate-800',
    },
    getter: (inp) => inp.acquisition.cash,
    setter: (prev, val) => ({
      ...prev,
      acquisition: { ...prev.acquisition, cash: val },
    }),
    resultGetter: (res) => res.acquisition.cash,
  },
  {
    id: 'acq-total',
    category: 'Acquisition',
    categoryWeight: '60%',
    subTitle: 'Total Acq',
    weight: COMMISSION_WEIGHTS.ACQUISITION,
    weightLabel: '',
    unit: UNITS.ACQUISITION_TOTAL,
    isSummary: true,
    theme: {
      accentDot: 'bg-[#E60000]',
      subHeaderBg: 'bg-white hover:bg-slate-50/50 border-t-2 border-t-[#E60000]',
      titleColor: 'text-slate-900 font-black',
      badgeBg: 'bg-[#E60000]',
      badgeText: 'text-white',
      unitColor: 'text-slate-600',
      focusRing: 'focus:ring-[#E60000] focus:border-[#E60000]',
      contribBg: 'bg-white',
      contribBorder: 'border-slate-200',
      contribText: 'text-[#E60000]',
    },
    getter: (inp) => ({
      target: ((inp.acquisition.low.target ?? 0) + (inp.acquisition.high.target ?? 0) + (inp.acquisition.cash.target ?? 0)) || null,
      actual: ((inp.acquisition.low.actual ?? 0) + (inp.acquisition.high.actual ?? 0) + (inp.acquisition.cash.actual ?? 0)) || null,
    }),
    resultGetter: (res) => res.acquisition.total,
  },

  // --- ENTERPRISE: 2 SUB-COLUMNS (Accounts 5%, Lines 5%) ---
  {
    id: 'ent-accounts',
    category: 'Enterprise',
    categoryWeight: '10%',
    subTitle: 'Accounts',
    weight: COMMISSION_WEIGHTS.ENTERPRISE_ACCOUNTS,
    weightLabel: '5%',
    unit: UNITS.ENTERPRISE_ACCOUNTS,
    theme: {
      accentDot: 'bg-slate-500',
      subHeaderBg: 'bg-white hover:bg-slate-50/50 border-t-2 border-t-slate-300',
      titleColor: 'text-slate-800',
      badgeBg: 'bg-slate-100',
      badgeText: 'text-slate-700',
      unitColor: 'text-slate-500',
      focusRing: 'focus:ring-slate-400 focus:border-slate-500',
      contribBg: 'bg-white',
      contribBorder: 'border-slate-200',
      contribText: 'text-slate-800',
    },
    getter: (inp) => inp.enterprise.accounts,
    setter: (prev, val) => ({
      ...prev,
      enterprise: { ...prev.enterprise, accounts: val },
    }),
    resultGetter: (res) => res.enterprise.accounts,
  },
  {
    id: 'ent-lines',
    category: 'Enterprise',
    categoryWeight: '10%',
    subTitle: 'Lines',
    weight: COMMISSION_WEIGHTS.ENTERPRISE_LINES,
    weightLabel: '5%',
    unit: UNITS.ENTERPRISE_LINES,
    theme: {
      accentDot: 'bg-slate-500',
      subHeaderBg: 'bg-white hover:bg-slate-50/50 border-t-2 border-t-slate-300',
      titleColor: 'text-slate-800',
      badgeBg: 'bg-slate-100',
      badgeText: 'text-slate-700',
      unitColor: 'text-slate-500',
      focusRing: 'focus:ring-slate-400 focus:border-slate-500',
      contribBg: 'bg-white',
      contribBorder: 'border-slate-200',
      contribText: 'text-slate-800',
    },
    getter: (inp) => inp.enterprise.lines,
    setter: (prev, val) => ({
      ...prev,
      enterprise: { ...prev.enterprise, lines: val },
    }),
    resultGetter: (res) => res.enterprise.lines,
  },

  // --- TERMINAL: 1 COLUMN (10%) ---
  {
    id: 'terminal',
    category: 'Terminal',
    categoryWeight: '10%',
    subTitle: 'Sales Value',
    weight: COMMISSION_WEIGHTS.TERMINAL,
    weightLabel: '10%',
    unit: UNITS.TERMINAL,
    theme: {
      accentDot: 'bg-slate-500',
      subHeaderBg: 'bg-white hover:bg-slate-50/50 border-t-2 border-t-slate-300',
      titleColor: 'text-slate-800',
      badgeBg: 'bg-slate-100',
      badgeText: 'text-slate-700',
      unitColor: 'text-slate-500',
      focusRing: 'focus:ring-slate-400 focus:border-slate-500',
      contribBg: 'bg-white',
      contribBorder: 'border-slate-200',
      contribText: 'text-slate-800',
    },
    getter: (inp) => inp.terminal,
    setter: (prev, val) => ({ ...prev, terminal: val }),
    resultGetter: (res) => res.terminal,
  },

  // --- FIXED: 2 SUB-COLUMNS (DSL 16%, Connectivity 4%) ---
  {
    id: 'fixed-dsl',
    category: 'Fixed',
    categoryWeight: '20%',
    subTitle: 'DSL',
    weight: COMMISSION_WEIGHTS.DSL,
    weightLabel: '16%',
    unit: UNITS.DSL,
    theme: {
      accentDot: 'bg-slate-500',
      subHeaderBg: 'bg-white hover:bg-slate-50/50 border-t-2 border-t-slate-300',
      titleColor: 'text-slate-800',
      badgeBg: 'bg-slate-100',
      badgeText: 'text-slate-700',
      unitColor: 'text-slate-500',
      focusRing: 'focus:ring-slate-400 focus:border-slate-500',
      contribBg: 'bg-white',
      contribBorder: 'border-slate-200',
      contribText: 'text-slate-800',
    },
    getter: (inp) => inp.fixed.dsl,
    setter: (prev, val) => ({
      ...prev,
      fixed: { ...prev.fixed, dsl: val },
    }),
    resultGetter: (res) => res.fixed.dsl,
  },
  {
    id: 'fixed-conn',
    category: 'Fixed',
    categoryWeight: '20%',
    subTitle: 'Connectivity',
    weight: COMMISSION_WEIGHTS.CONNECTIVITY,
    weightLabel: '4%',
    unit: UNITS.CONNECTIVITY,
    theme: {
      accentDot: 'bg-slate-500',
      subHeaderBg: 'bg-white hover:bg-slate-50/50 border-t-2 border-t-slate-300',
      titleColor: 'text-slate-800',
      badgeBg: 'bg-slate-100',
      badgeText: 'text-slate-700',
      unitColor: 'text-slate-500',
      focusRing: 'focus:ring-slate-400 focus:border-slate-500',
      contribBg: 'bg-white',
      contribBorder: 'border-slate-200',
      contribText: 'text-slate-800',
    },
    getter: (inp) => inp.fixed.connectivity,
    setter: (prev, val) => ({
      ...prev,
      fixed: { ...prev.fixed, connectivity: val },
    }),
    resultGetter: (res) => res.fixed.connectivity,
  },
];

/**
 * Reusable Matrix Input Cell for Row 1 (Target) & Row 2 (Actual).
 */
interface MatrixInputCellProps {
  col: ColumnConfig;
  value: number | null;
  onChange?: (val: string) => void;
  summaryValue?: number | null;
  isTarget?: boolean;
}

const MatrixInputCell = React.memo(function MatrixInputCell({
  col,
  value,
  onChange,
  summaryValue,
  isTarget = false,
}: MatrixInputCellProps) {
  const isAcq = col.category === 'Acquisition';
  const widthClass = isAcq ? 'min-w-[130px] sm:min-w-[150px] w-[145px]' : 'min-w-[115px] sm:min-w-[130px]';
  const targetNum = col.isSummary ? summaryValue : value;
  const isCurrency = col.id === 'terminal' || col.unit === 'EGP';
  const showDaily = isTarget && (col.category === 'Acquisition' || col.id === 'terminal');
  const dailyRequired = showDaily && targetNum !== null && targetNum !== undefined && targetNum > 0 ? targetNum / 22 : null;

  if (col.isSummary) {
    return (
      <td className={`p-1.5 sm:p-2 border-r border-slate-200 align-top bg-white ${widthClass}`}>
        <div className="flex flex-col items-center justify-between h-full">
          <div className="w-full max-w-[100px] flex items-center justify-center px-1.5 py-0.5 bg-white border border-slate-300 rounded-md text-center shadow-2xs h-6 sm:h-7 mx-auto">
            <div className="text-xs font-bold text-slate-900">
              {summaryValue !== null && summaryValue !== undefined ? (
                summaryValue.toLocaleString()
              ) : (
                <span className="text-slate-400 font-normal">0</span>
              )}
            </div>
          </div>
          {col.unit ? (
            <span className="block text-[9px] sm:text-[10px] text-slate-500 text-center mt-0.5 font-medium">
              {col.unit}
            </span>
          ) : (
            <span className="block text-[9px] sm:text-[10px] text-transparent text-center mt-0.5 select-none">
              &nbsp;
            </span>
          )}

          {/* Under target div input make a Line and Put daily (Only for Acquisition & Terminal) */}
          {showDaily && (
            <div className="w-full pt-1.5 mt-1.5 border-t border-slate-200 text-center">
              <div className="flex items-center justify-center gap-1 text-[9px] sm:text-[10px] text-slate-700 font-bold">
                <CalendarDays className="w-3 h-3 text-slate-500 shrink-0" />
                <span>Daily:</span>
                <span className="font-extrabold text-slate-900">
                  {dailyRequired !== null
                    ? isCurrency
                      ? `${Math.round(dailyRequired).toLocaleString()} EGP`
                      : `${dailyRequired.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} ${col.unit || "GA's"}`
                    : `0 ${col.unit || "GA's"}`}
                </span>
                <span className="text-[8px] text-slate-400 font-semibold">/d</span>
              </div>
              <span className="text-[7.5px] text-slate-400 block font-medium mt-0.5">
                Target / 22 Day
              </span>
            </div>
          )}
        </div>
      </td>
    );
  }

  const isZero = isTarget && value === 0;
  const isNegative = value !== null && value < 0;

  return (
    <td className={`p-1.5 sm:p-2 border-r last:border-r-0 border-slate-200 align-top bg-white ${widthClass}`}>
      <div className="flex flex-col items-center justify-between h-full">
        <div className={`${isAcq ? 'w-1/2 min-w-[50px] max-w-[70px] mx-auto' : 'w-full max-w-[100px] mx-auto'}`}>
          <input
            type="number"
            inputMode="decimal"
            min="0"
            step="any"
            placeholder="0"
            value={value ?? ''}
            onChange={(e) => onChange?.(e.target.value)}
            className={`w-full text-center px-1.5 py-0.5 h-6 sm:h-7 text-xs font-semibold rounded-md border transition-all focus:outline-none focus:ring-1 print:hidden export-hide-input ${
              isZero || isNegative
                ? 'border-red-500 bg-red-50/50 text-red-900 focus:ring-red-500'
                : 'border-slate-300 bg-white text-slate-900 focus:border-[#E60000] focus:ring-red-100'
            }`}
          />
          <div className="hidden print:flex export-show-text items-center justify-center text-center font-bold text-xs text-slate-900 py-0.5 px-1.5 bg-slate-50 border border-slate-300 rounded-md h-6 sm:h-7 w-full">
            {value !== null ? value : <span className="text-slate-400 font-normal">0</span>}
          </div>
          {col.unit ? (
            <span className="block text-[9px] sm:text-[10px] text-slate-400 text-center mt-0.5 font-medium">
              {col.unit}
            </span>
          ) : null}
          {isZero && (
            <span className="block text-[9px] text-[#E60000] text-center font-semibold print:hidden export-hide-input">
              Must be &gt; 0
            </span>
          )}
        </div>

        {/* Under target div input make a Line and Put daily (Only for Acquisition & Terminal) */}
        {showDaily && (
          <div className="w-full pt-1.5 mt-1.5 border-t border-slate-200 text-center">
            <div className="flex items-center justify-center gap-1 text-[9px] sm:text-[10px] text-slate-700 font-bold">
              <CalendarDays className="w-3 h-3 text-slate-500 shrink-0" />
              <span>Daily:</span>
              <span className="font-extrabold text-slate-900">
                {dailyRequired !== null
                  ? isCurrency
                    ? `${Math.round(dailyRequired).toLocaleString()} EGP`
                    : `${dailyRequired.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} ${col.unit || "GA's"}`
                  : `0 ${col.unit || "GA's"}`}
              </span>
              <span className="text-[8px] text-slate-400 font-semibold">/d</span>
            </div>
            <span className="text-[7.5px] text-slate-400 block font-medium mt-0.5">
              Target / 22 Day
            </span>
          </div>
        )}
      </div>
    </td>
  );
});

/**
 * Reusable Matrix Percentage Cell for Row 3 (Percentages: VS%, RE%, Contributions & Missing).
 */
interface MatrixPercentageCellProps {
  col: ColumnConfig;
  target?: number | null;
  res: { 
    achievement: number | null; 
    vs?: number | null; 
    re?: number | null; 
    contribution: number | null; 
    missing: number | null 
  };
}

const MatrixPercentageCell = React.memo(function MatrixPercentageCell({
  col,
  res,
}: MatrixPercentageCellProps) {
  const isExceeded = res.missing === 0 && res.achievement !== null && res.achievement >= 100;
  const vs = res.vs ?? res.achievement;
  const re = res.re ?? null;
  const isAcq = col.category === 'Acquisition';
  const widthClass = isAcq ? 'min-w-[130px] sm:min-w-[150px] w-[145px]' : 'min-w-[115px] sm:min-w-[130px]';

  return (
    <td className={`p-1.5 sm:p-2 border-r last:border-r-0 border-slate-200 align-top bg-white ${widthClass}`}>
      <div className="flex flex-col gap-1.5 sm:gap-2 h-full justify-between">
        
        {/* ONE DIV: VS in Left - RE in Right, under Both Make a Line and Put The Contribution */}
        <div className="bg-white border border-slate-200 rounded-lg p-2 text-center shadow-2xs transition-colors">
          {/* Top Row: VS in Left - RE in Right */}
          <div className="grid grid-cols-2 gap-1 items-center">
            {/* VS in Left */}
            <div className="text-center pr-1 border-r border-slate-200">
              <div className="flex items-center justify-between px-0.5">
                <span className="text-[9px] uppercase font-black text-slate-700 tracking-wider">VS%</span>
                <span className="text-[7.5px] font-semibold text-slate-400">Act</span>
              </div>
              <span className="text-xs sm:text-sm font-extrabold text-slate-900 block leading-tight mt-0.5">
                {formatPercentage(vs)}
              </span>
            </div>

            {/* RE in Right */}
            <div className="text-center pl-1">
              <div className="flex items-center justify-between px-0.5">
                <span className="text-[9px] uppercase font-black text-slate-700 tracking-wider">RE%</span>
                <span className="text-[7.5px] font-bold text-slate-400">Exp</span>
              </div>
              <span className="text-xs sm:text-sm font-black text-slate-900 block leading-tight mt-0.5">
                {formatPercentage(re)}
              </span>
            </div>
          </div>

          {/* Line under Both */}
          <div className="border-t border-slate-200 my-1.5" />

          {/* Under Both: Put The Contribution */}
          <div className="text-center pt-0.5">
            <div className="flex items-center justify-between px-0.5">
              <span className="text-[9px] uppercase font-black text-slate-700 tracking-wider">
                Contribution
              </span>
              {!col.isSummary && col.weightLabel ? (
                <span className="text-[8px] font-bold text-slate-500 bg-slate-100 px-1 py-0.2 rounded">
                  {col.weightLabel}
                </span>
              ) : null}
            </div>
            <span className="text-xs sm:text-sm font-black text-slate-900 block leading-tight mt-0.5">
              {formatPercentage(res.contribution)}
            </span>
          </div>
        </div>

        {/* Missing Box */}
        <div className="bg-white border border-slate-200 rounded-lg p-1.5 sm:p-2 text-center shadow-2xs min-h-[44px] flex flex-col justify-center transition-colors">
          <span className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-500 block mb-0.5">
            Missing
          </span>
          <span
            className={`text-xs sm:text-sm font-bold block leading-tight ${
              res.missing !== null
                ? res.missing > 0
                  ? 'text-[#E60000]'
                  : 'text-emerald-600'
                : 'text-slate-400'
            }`}
          >
            {res.missing !== null ? (
              res.missing > 0 ? (
                `-${res.missing.toLocaleString()}`
              ) : (
                isExceeded ? '✓ Met' : '0'
              )
            ) : (
              '—'
            )}
          </span>
          {res.missing !== null && (
            <span className="text-[9px] sm:text-[10px] text-slate-400 block mt-0.5">
              {col.unit || 'Points'}
            </span>
          )}
        </div>

      </div>
    </td>
  );
});

export function CommissionMatrix({ input, result, onChange, acqNote, onAcqNoteChange }: CommissionMatrixProps) {
  const handleInputChange = (col: ColumnConfig, field: 'target' | 'actual', rawValue: string) => {
    if (!col.setter) return;
    const num = rawValue === '' ? null : Number(rawValue);
    onChange((prev) => {
      const current = col.getter(prev);
      return col.setter!(prev, { ...current, [field]: num });
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden transition-colors">
      {/* Mobile Swipe Hint Bar */}
      <div className="md:hidden flex items-center justify-between px-3 py-1.5 bg-white border-b border-slate-200 text-[11px] text-slate-500 font-medium">
        <span>Swipe horizontally to view all metrics</span>
        <span className="text-[#E60000] font-semibold flex items-center gap-1">
          Acquisition (3 Sub-Boxes + Sum) • 9 Columns &rarr;
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[950px] sm:min-w-[1100px] bg-white">
          {/* Header Row: Main Categories & Weights */}
          <thead>
            {/* Top Categories grouping */}
            <tr className="border-b border-slate-200 text-xs bg-white">
              {/* Category Header Label Box */}
              <th className="p-2 sm:p-3.5 w-28 sm:w-44 text-center border-r border-slate-200 bg-white border-t-4 border-t-slate-400 sticky left-0 z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)]">
                <div className="inline-flex items-center justify-center gap-1 sm:gap-1.5 font-black text-slate-700 uppercase tracking-wider text-[11px] sm:text-xs">
                  <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-500 shrink-0" />
                  <span>Category</span>
                </div>
              </th>

              {/* Acquisition Category Box (Spans 4 columns: Low, High, Cash, Total) */}
              <th colSpan={4} className="p-2 sm:p-2.5 text-center border-r border-slate-200 bg-white border-t-4 border-t-[#E60000]">
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#E60000] shrink-0" />
                  <span className="font-black text-slate-900 text-xs sm:text-sm tracking-tight">Acquisition</span>
                  <span className="bg-[#E60000] text-white text-[9px] sm:text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-2xs">
                    Total: 60%
                  </span>
                </div>
                
                {/* News Bar Marquee Note moving from Right to Left */}
                <div className="mt-1 flex items-center justify-center">
                  <NewsTickerNote
                    note={acqNote}
                    onNoteChange={onAcqNoteChange}
                    className="w-full max-w-[480px]"
                  />
                </div>
              </th>

              {/* Enterprise Category Box (2 cols) */}
              <th colSpan={2} className="p-2.5 sm:p-3.5 text-center border-r border-slate-200 bg-white border-t-4 border-t-indigo-600">
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <Building2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-600 shrink-0" />
                  <span className="font-black text-slate-900 text-xs sm:text-sm tracking-tight">Enterprise</span>
                  <span className="bg-indigo-600 text-white text-[9px] sm:text-[10px] font-extrabold px-1.5 sm:px-2 py-0.5 rounded-full shadow-2xs">
                    Total: 10%
                  </span>
                </div>
                <div className="text-slate-600 font-semibold text-[10px] sm:text-[11px]">Accounts 5% • Lines 5%</div>
              </th>

              {/* Terminal Category Box (1 col) */}
              <th className="p-2.5 sm:p-3.5 text-center border-r border-slate-200 bg-white border-t-4 border-t-amber-600">
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <Smartphone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600 shrink-0" />
                  <span className="font-black text-slate-900 text-xs sm:text-sm tracking-tight">Terminal</span>
                  <span className="bg-amber-600 text-white text-[9px] sm:text-[10px] font-extrabold px-2 sm:px-2.5 py-0.5 rounded-full shadow-2xs">
                    Total: 10%
                  </span>
                </div>
              </th>

              {/* Fixed Category Box (2 cols) */}
              <th colSpan={2} className="p-2.5 sm:p-3.5 text-center bg-white border-t-4 border-t-teal-600">
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <Wifi className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-teal-600 shrink-0" />
                  <span className="font-black text-slate-900 text-xs sm:text-sm tracking-tight">Fixed</span>
                  <span className="bg-teal-600 text-white text-[9px] sm:text-[10px] font-extrabold px-1.5 sm:px-2 py-0.5 rounded-full shadow-2xs">
                    Total: 20%
                  </span>
                </div>
                <div className="text-slate-600 font-semibold text-[10px] sm:text-[11px]">DSL 16% • Connectivity 4%</div>
              </th>
            </tr>

            {/* Sub-column Titles and Units (Component Boxes Row) */}
            <tr className="border-b border-slate-200 text-xs font-semibold text-slate-700 bg-white">
              <th className="p-2 sm:p-3 text-center border-r border-slate-200 bg-white sticky left-0 z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)]">
                <div className="inline-flex items-center justify-center gap-1 sm:gap-1.5 font-black text-slate-700 uppercase tracking-wider text-[11px] sm:text-xs">
                  <Boxes className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-500 shrink-0" />
                  <span>Component</span>
                </div>
              </th>

              {MATRIX_COLUMNS.map((col) => {
                const isAcq = col.category === 'Acquisition';
                return (
                  <th
                    key={col.id}
                    className={`p-2 sm:p-2.5 text-center border-r last:border-r-0 border-slate-200 transition-colors ${
                      isAcq ? 'min-w-[130px] sm:min-w-[150px] w-[145px]' : 'min-w-[115px] sm:min-w-[130px]'
                    } ${col.theme.subHeaderBg}`}
                  >
                    <div className="flex items-center justify-center gap-1.5">
                      {col.isSummary ? (
                        <Sigma className="w-3 h-3 text-[#E60000] shrink-0" />
                      ) : (
                        <span className={`w-2 h-2 rounded-full ${col.theme.accentDot} shrink-0`}></span>
                      )}
                      <span className={`font-extrabold text-xs sm:text-sm ${col.theme.titleColor}`}>{col.subTitle}</span>
                    </div>
                    <div className="text-[10px] sm:text-[11px] font-normal flex items-center justify-center gap-1 sm:gap-1.5 mt-0.5 sm:mt-1 min-h-[16px]">
                      {col.weightLabel ? (
                        <span className={`font-extrabold px-1.5 sm:px-2 py-0.5 rounded-sm text-[9px] sm:text-[10px] ${col.theme.badgeBg} ${col.theme.badgeText}`}>
                          {col.weightLabel}
                        </span>
                      ) : null}
                      {col.weightLabel && col.unit ? (
                        <span className="text-slate-300">•</span>
                      ) : null}
                      {col.unit ? (
                        <span className={`text-[10px] sm:text-[11px] font-semibold ${col.theme.unitColor}`}>{col.unit}</span>
                      ) : null}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody>
            {/* ROW 1: Target */}
            <tr className="border-b border-slate-200 bg-white hover:bg-slate-50/50 transition-colors">
              <td className="p-2 sm:p-3 font-bold text-slate-900 border-r border-slate-200 bg-white sticky left-0 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-slate-800 shrink-0"></span>
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-slate-900">Target</div>
                    <div className="text-[10px] sm:text-[11px] text-slate-500 font-normal">Assigned target</div>
                  </div>
                </div>
              </td>
              {MATRIX_COLUMNS.map((col) => (
                <MatrixInputCell
                  key={col.id}
                  col={col}
                  isTarget={true}
                  value={col.getter(input).target}
                  summaryValue={result.acquisition.totalTarget}
                  onChange={(val) => handleInputChange(col, 'target', val)}
                />
              ))}
            </tr>

            {/* ROW 2: Actual / Achieve */}
            <tr className="border-b border-slate-200 bg-white hover:bg-slate-50/50 transition-colors">
              <td className="p-2 sm:p-3 font-bold text-slate-900 border-r border-slate-200 bg-white sticky left-0 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#E60000] shrink-0"></span>
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">Actual</div>
                    <div className="text-[10px] sm:text-[11px] text-slate-500 font-normal">Delivered result</div>
                  </div>
                </div>
              </td>
              {MATRIX_COLUMNS.map((col) => (
                <MatrixInputCell
                  key={col.id}
                  col={col}
                  isTarget={false}
                  value={col.getter(input).actual}
                  summaryValue={result.acquisition.totalActual}
                  onChange={(val) => handleInputChange(col, 'actual', val)}
                />
              ))}
            </tr>

            {/* ROW 3: Percentages (VS% & RE% & Contributions & Missing) */}
            <tr className="bg-white">
              <td className="p-2 sm:p-3 font-bold text-slate-900 border-r border-slate-200 bg-white sticky left-0 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)] align-top">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#E60000] shrink-0"></span>
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">VS% & RE%</div>
                    <div className="text-[10px] sm:text-[11px] text-slate-500 font-normal">Actual & Expected Run-Rate</div>
                  </div>
                </div>
              </td>
              {MATRIX_COLUMNS.map((col) => {
                const targetVal = col.isSummary ? result.acquisition.totalTarget : col.getter(input).target;
                return (
                  <MatrixPercentageCell
                    key={col.id}
                    col={col}
                    target={targetVal}
                    res={col.resultGetter(result)}
                  />
                );
              })}
            </tr>

            {/* Parent Categories Summary Sub-Row with VS% and RE% totals */}
            <tr className="border-t-2 border-slate-200 bg-white text-xs">
              <td className="p-2 sm:p-3 font-bold text-slate-700 border-r border-slate-200 text-center bg-white sticky left-0 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)]">
                Category Total
              </td>
              {/* Acquisition Combined Total */}
              <td colSpan={4} className="p-2 sm:p-2.5 text-center border-r border-slate-200 bg-white font-bold">
                <div className="flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap">
                  <span className="text-slate-900 font-bold text-xs">Total Acquisition:</span>
                  <span className="text-xs sm:text-sm font-black text-[#E60000]">
                    VS: {formatPercentage(result.acquisition.total.contribution)}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-xs sm:text-sm font-black text-slate-800">
                    RE: {formatPercentage(result.acquisition.total.re !== null && result.acquisition.total.re !== undefined ? result.acquisition.total.re * COMMISSION_WEIGHTS.ACQUISITION : null)}
                  </span>
                  <span className="text-[9px] sm:text-[10px] text-slate-500 font-semibold">(Weight: 60%)</span>
                </div>
                <div className="text-[10px] text-slate-500 font-medium mt-0.5">
                  Low + High + Cash &rarr; Target: {result.acquisition.totalTarget ?? 0} • Actual: {result.acquisition.totalActual ?? 0} Points
                </div>
              </td>
              {/* Enterprise Combined Total */}
              <td colSpan={2} className="p-2 sm:p-2.5 text-center border-r border-slate-200 bg-white">
                <div className="flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap">
                  <span className="text-slate-900 font-bold text-xs">Enterprise:</span>
                  <span className="text-xs sm:text-sm font-black text-slate-800">
                    VS: {formatPercentage(result.enterprise.totalContribution)}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-xs sm:text-sm font-black text-slate-800">
                    RE: {formatPercentage(result.enterprise.totalRE)}
                  </span>
                  <span className="text-[9px] sm:text-[10px] text-slate-500 font-bold">(10%)</span>
                </div>
              </td>
              {/* Terminal Total */}
              <td className="p-2 sm:p-2.5 text-center border-r border-slate-200 bg-white font-bold">
                <div className="flex flex-col items-center justify-center gap-0.5">
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-slate-900 font-bold text-xs">Terminal:</span>
                    <span className="text-[9px] sm:text-[10px] text-slate-500 font-semibold">(10%)</span>
                  </div>
                  <div className="flex items-center justify-center gap-1.5 flex-wrap">
                    <span className="text-xs sm:text-sm font-black text-slate-800">
                      VS: {formatPercentage(result.terminal.contribution)}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-xs sm:text-sm font-black text-slate-800">
                      RE: {formatPercentage(result.terminal.re !== null && result.terminal.re !== undefined ? result.terminal.re * COMMISSION_WEIGHTS.TERMINAL : null)}
                    </span>
                  </div>
                </div>
              </td>
              {/* Fixed Combined Total */}
              <td colSpan={2} className="p-2 sm:p-2.5 text-center bg-white">
                <div className="flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap">
                  <span className="text-slate-900 font-bold text-xs">Fixed:</span>
                  <span className="text-xs sm:text-sm font-black text-slate-800">
                    VS: {formatPercentage(result.fixed.totalContribution)}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-xs sm:text-sm font-black text-slate-800">
                    RE: {formatPercentage(result.fixed.totalRE)}
                  </span>
                  <span className="text-[9px] sm:text-[10px] text-slate-500 font-bold">(20%)</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
