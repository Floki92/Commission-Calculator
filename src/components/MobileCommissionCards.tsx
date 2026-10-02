import React, { useState } from 'react';
import { CommissionInput, CommissionResult, ComponentResult } from '../features/commission/commission.types';
import { formatPercentage } from '../features/commission/commission.utils';
import { MATRIX_COLUMNS, ColumnConfig } from './CommissionMatrix';
import { Zap, Building2, Smartphone, Wifi, CheckCircle2, TrendingUp, Target, CalendarDays } from 'lucide-react';
import { NewsTickerNote } from './NewsTickerNote';

interface MobileCommissionCardsProps {
  input: CommissionInput;
  result: CommissionResult;
  onChange: (updater: (prev: CommissionInput) => CommissionInput) => void;
  acqNote: string;
  onAcqNoteChange: (note: string) => void;
}

type CategoryTab = 'all' | 'Acquisition' | 'Enterprise' | 'Terminal' | 'Fixed';

interface SingleCardProps {
  title: string;
  weightLabel?: string;
  unit: string;
  target: number | null;
  actual: number | null;
  res: ComponentResult;
  accentColor: string;
  isSummary?: boolean;
  showDailyRequired?: boolean;
  isCurrency?: boolean;
  isAcquisition?: boolean;
  onTargetChange?: (val: string) => void;
  onActualChange?: (val: string) => void;
}

const DAILY_WORK_DAYS = 22; // 22 working days assuming 8 days OFF in a month

const MobileCard = React.memo(function MobileCard({
  title,
  weightLabel,
  unit,
  target,
  actual,
  res,
  accentColor,
  isSummary = false,
  showDailyRequired = false,
  isCurrency = false,
  isAcquisition = false,
  onTargetChange,
  onActualChange,
}: SingleCardProps) {
  const isZero = target === 0;
  const isNegative = (target !== null && target < 0) || (actual !== null && actual < 0);
  const isExceeded = res.missing === 0 && res.achievement !== null && res.achievement >= 100;
  const vs = res.vs ?? res.achievement;
  const re = res.re ?? null;

  // Formula: Target / 22 Day (8 Day OFF) = Daily Required
  const dailyRequired = target !== null && target > 0 ? target / DAILY_WORK_DAYS : null;

  return (
    <div
      className={`rounded-2xl border transition-all overflow-hidden ${
        isSummary
          ? 'bg-slate-50/70 border-slate-300 shadow-2xs'
          : 'bg-white border-slate-200/90 shadow-2xs hover:border-slate-300'
      } p-3 sm:p-3.5`}
    >
      {/* 1. Header: Component Title, Weight Badge & Unit */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className={`w-2.5 h-2.5 rounded-full ${accentColor} shrink-0 ring-4 ring-slate-100`} />
          <div className="min-w-0">
            <h4 className="font-black text-slate-900 text-xs sm:text-sm leading-tight truncate">
              {title}
            </h4>
            {isSummary && (
              <span className="text-[9px] text-slate-500 font-medium block mt-0.5">
                Auto-calculated total sum
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {weightLabel && (
            <span className="font-extrabold text-[9px] text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">
              {weightLabel}
            </span>
          )}
          <span className="text-[10px] font-semibold text-slate-500 bg-slate-50 border border-slate-200/60 px-1.5 py-0.5 rounded">
            {unit}
          </span>
        </div>
      </div>

      {/* 2. Interactive Input Grid: Target & Actual (Inputs of Acquisition adjusted to 50% size) */}
      <div className="grid grid-cols-2 gap-2 mb-2">
        {/* Target Input with Daily under target div input with a line */}
        <div className="flex flex-col justify-between bg-white border border-slate-200 rounded-lg p-2 transition-all">
          <div>
            <div className="flex items-center justify-between px-0.5 mb-1">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <Target className="w-2.5 h-2.5 text-slate-400" />
                <span>Target</span>
              </span>
              <span className="text-[8px] font-medium text-slate-400">Assigned</span>
            </div>

            {isSummary ? (
              <div className={`h-7 flex items-center justify-center font-bold text-xs text-slate-900 bg-white border border-slate-300 rounded ${
                isAcquisition ? 'w-1/2 min-w-[65px] max-w-[90px] mx-auto' : 'w-full'
              }`}>
                {target !== null ? target.toLocaleString() : '0'}
              </div>
            ) : (
              <div className="flex justify-center w-full">
                <input
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="any"
                  placeholder="0"
                  value={target ?? ''}
                  onChange={(e) => onTargetChange?.(e.target.value)}
                  className={`h-7 text-center font-bold text-xs rounded border outline-none transition-all ${
                    isAcquisition ? 'w-1/2 min-w-[65px] max-w-[90px] mx-auto' : 'w-full'
                  } ${
                    isZero
                      ? 'border-red-500 bg-red-50 text-red-900'
                      : 'border-slate-300 bg-white text-slate-900 focus:border-[#E60000]'
                  }`}
                />
              </div>
            )}
          </div>

          {/* Under target div input make a Line and Put daily */}
          {showDailyRequired && (
            <div className="w-full pt-1.5 mt-1.5 border-t border-slate-200 text-center">
              <div className="flex items-center justify-center gap-1 text-[9px] text-slate-700 font-bold">
                <CalendarDays className="w-2.5 h-2.5 text-slate-500 shrink-0" />
                <span>Daily:</span>
                <span className="font-extrabold text-slate-900">
                  {dailyRequired !== null
                    ? isCurrency
                      ? `${Math.round(dailyRequired).toLocaleString()} EGP`
                      : `${dailyRequired.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} ${unit || "GA's"}`
                    : `0 ${unit || "GA's"}`}
                </span>
                <span className="text-[7.5px] text-slate-400 font-semibold">/d</span>
              </div>
              <span className="text-[7px] text-slate-400 block font-medium mt-0.5">
                Target / 22 Day
              </span>
            </div>
          )}
        </div>

        {/* Actual Input */}
        <div className="flex flex-col justify-start bg-white border border-slate-200 rounded-lg p-2 transition-all">
          <div className="flex items-center justify-between px-0.5 mb-1">
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <TrendingUp className="w-2.5 h-2.5 text-slate-400" />
              <span>Actual</span>
            </span>
            <span className="text-[8px] font-medium text-slate-400">Delivered</span>
          </div>

          {isSummary ? (
            <div className={`h-7 flex items-center justify-center font-bold text-xs text-slate-900 bg-white border border-slate-300 rounded ${
              isAcquisition ? 'w-1/2 min-w-[65px] max-w-[90px] mx-auto' : 'w-full'
            }`}>
              {actual !== null ? actual.toLocaleString() : '0'}
            </div>
          ) : (
            <div className="flex justify-center w-full">
              <input
                type="number"
                inputMode="decimal"
                min="0"
                step="any"
                placeholder="0"
                value={actual ?? ''}
                onChange={(e) => onActualChange?.(e.target.value)}
                className={`h-7 text-center font-bold text-xs rounded border border-slate-300 bg-white text-slate-900 focus:border-[#E60000] outline-none transition-all ${
                  isAcquisition ? 'w-1/2 min-w-[65px] max-w-[90px] mx-auto' : 'w-full'
                }`}
              />
            </div>
          )}
        </div>
      </div>

      {/* Target Warnings */}
      {isZero && (
        <div className="text-[9px] text-red-600 font-bold mb-1.5 px-1">
          * Target must be greater than 0
        </div>
      )}
      {isNegative && (
        <div className="text-[9px] text-red-600 font-bold mb-1.5 px-1">
          * Values cannot be negative
        </div>
      )}

      {/* 3. Metric Section:
          - ONE DIV: VS in Left - RE in Right, under Both Make a Line and Put The Contribution
          - Missing / Gap Box
      */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-200/80">
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
              <span className={`text-xs sm:text-sm font-extrabold block leading-tight mt-0.5 ${
                vs !== null && vs >= 100 ? 'text-emerald-700' : 'text-slate-900'
              }`}>
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
              {weightLabel && (
                <span className="text-[8px] font-bold text-slate-500 bg-slate-100 px-1 py-0.2 rounded">
                  {weightLabel}
                </span>
              )}
            </div>
            <span className="text-xs sm:text-sm font-black text-slate-900 block leading-tight mt-0.5">
              {formatPercentage(res.contribution)}
            </span>
          </div>
        </div>

        {/* Missing / Gap Box */}
        <div className="bg-white border border-slate-200 rounded-lg p-2 text-center shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between px-0.5">
            <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">Gap / Missing</span>
            <span className="text-[8px] font-medium text-slate-400">{unit}</span>
          </div>
          <div className="my-auto py-1">
            <span className={`text-xs sm:text-sm font-black leading-tight flex items-center justify-center gap-1 ${
              res.missing !== null
                ? res.missing > 0
                  ? 'text-[#E60000]'
                  : 'text-emerald-600'
                : 'text-slate-400'
            }`}>
              {res.missing !== null ? (
                res.missing > 0 ? (
                  `-${res.missing.toLocaleString()}`
                ) : (
                  <span className="flex items-center gap-0.5 text-emerald-600">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span>Target Met</span>
                  </span>
                )
              ) : (
                '—'
              )}
            </span>
          </div>
          <span className="text-[8px] text-slate-400 block font-medium">
            {isExceeded ? 'Goal Exceeded' : (res.missing !== null && res.missing > 0 ? 'Remaining to target' : 'Delivered')}
          </span>
        </div>
      </div>
    </div>
  );
});

interface CategoryGroup {
  name: 'Acquisition' | 'Enterprise' | 'Terminal' | 'Fixed';
  weight: string;
  weightLabel: string;
  icon: typeof Zap;
  borderColor: string;
  headerBorder: string;
  activeTabBg: string;
  tabBorder: string;
  inactiveTabText: string;
  badgeBg: string;
  badgePillBg: string;
  badgePillText: string;
  badgePillBorder: string;
  textColor: string;
  getContribution: (res: CommissionResult) => number | null;
  getRE: (res: CommissionResult) => number | null;
}

const CATEGORY_GROUPS: CategoryGroup[] = [
  {
    name: 'Acquisition',
    weight: 'Total 60%',
    weightLabel: '60%',
    icon: Zap,
    borderColor: 'border-2 border-red-200 hover:border-red-300',
    headerBorder: 'border-red-100',
    activeTabBg: 'bg-[#E60000]',
    tabBorder: 'border-red-200 hover:border-red-400',
    inactiveTabText: 'text-red-700',
    badgeBg: 'bg-[#E60000]',
    badgePillBg: 'bg-red-50',
    badgePillText: 'text-[#E60000]',
    badgePillBorder: 'border-red-200',
    textColor: 'text-[#E60000]',
    getContribution: (res) => res.acquisition.total.contribution,
    getRE: (res) => (res.acquisition.total.re !== null && res.acquisition.total.re !== undefined ? res.acquisition.total.re * 0.60 : null),
  },
  {
    name: 'Enterprise',
    weight: 'Total 10%',
    weightLabel: '10%',
    icon: Building2,
    borderColor: 'border-2 border-indigo-200 hover:border-indigo-300',
    headerBorder: 'border-indigo-100',
    activeTabBg: 'bg-indigo-600',
    tabBorder: 'border-indigo-200 hover:border-indigo-400',
    inactiveTabText: 'text-indigo-700',
    badgeBg: 'bg-indigo-600',
    badgePillBg: 'bg-indigo-50',
    badgePillText: 'text-indigo-700',
    badgePillBorder: 'border-indigo-200',
    textColor: 'text-indigo-700',
    getContribution: (res) => res.enterprise.totalContribution,
    getRE: (res) => res.enterprise.totalRE ?? null,
  },
  {
    name: 'Terminal',
    weight: 'Total 10%',
    weightLabel: '10%',
    icon: Smartphone,
    borderColor: 'border-2 border-amber-200 hover:border-amber-300',
    headerBorder: 'border-amber-100',
    activeTabBg: 'bg-amber-600',
    tabBorder: 'border-amber-200 hover:border-amber-400',
    inactiveTabText: 'text-amber-700',
    badgeBg: 'bg-amber-600',
    badgePillBg: 'bg-amber-50',
    badgePillText: 'text-amber-700',
    badgePillBorder: 'border-amber-200',
    textColor: 'text-amber-700',
    getContribution: (res) => res.terminal.contribution,
    getRE: (res) => (res.terminal.re !== null && res.terminal.re !== undefined ? res.terminal.re * 0.10 : null),
  },
  {
    name: 'Fixed',
    weight: 'Total 20%',
    weightLabel: '20%',
    icon: Wifi,
    borderColor: 'border-2 border-teal-200 hover:border-teal-300',
    headerBorder: 'border-teal-100',
    activeTabBg: 'bg-teal-600',
    tabBorder: 'border-teal-200 hover:border-teal-400',
    inactiveTabText: 'text-teal-700',
    badgeBg: 'bg-teal-600',
    badgePillBg: 'bg-teal-50',
    badgePillText: 'text-teal-700',
    badgePillBorder: 'border-teal-200',
    textColor: 'text-teal-700',
    getContribution: (res) => res.fixed.totalContribution,
    getRE: (res) => res.fixed.totalRE ?? null,
  },
];

export function MobileCommissionCards({
  input,
  result,
  onChange,
  acqNote,
  onAcqNoteChange,
}: MobileCommissionCardsProps) {
  const [activeTab, setActiveTab] = useState<CategoryTab>('all');

  const handleInputChange = (col: ColumnConfig, field: 'target' | 'actual', raw: string) => {
    if (!col.setter) return;
    const val = raw === '' ? null : Number(raw);
    onChange((prev) => {
      const current = col.getter(prev);
      return col.setter!(prev, { ...current, [field]: val });
    });
  };

  return (
    <div className="space-y-2.5 sm:space-y-3">
      {/* Category Segmented Scrollable Filter Bar with Unique Tab Colors */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar text-xs font-semibold px-0.5">
        <button
          type="button"
          onClick={() => setActiveTab('all')}
          className={`h-9 px-3.5 rounded-xl whitespace-nowrap transition-all shrink-0 flex items-center gap-1.5 font-bold cursor-pointer ${
            activeTab === 'all'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
          }`}
        >
          <span>All Boxes</span>
        </button>

        {CATEGORY_GROUPS.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeTab === cat.name;
          return (
            <button
              key={cat.name}
              type="button"
              onClick={() => setActiveTab(cat.name)}
              className={`h-9 px-3.5 rounded-xl whitespace-nowrap transition-all shrink-0 flex items-center gap-1.5 font-bold cursor-pointer ${
                isActive
                  ? `${cat.activeTabBg} text-white shadow-xs`
                  : `bg-white ${cat.inactiveTabText} border ${cat.tabBorder} hover:bg-slate-50`
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.name}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-md font-bold ${
                isActive ? 'bg-black/20 text-white' : `${cat.badgePillBg} ${cat.badgePillText}`
              }`}>
                {cat.weightLabel}
              </span>
            </button>
          );
        })}
      </div>

      {/* Render Category Sections Dynamically from MATRIX_COLUMNS */}
      {CATEGORY_GROUPS.map((cat) => {
        if (activeTab !== 'all' && activeTab !== cat.name) return null;

        const Icon = cat.icon;
        const catColumns = MATRIX_COLUMNS.filter((c) => c.category === cat.name);
        const vsContribution = cat.getContribution(result);
        const reContribution = cat.getRE(result);

        return (
          <div
            key={cat.name}
            className={`bg-white rounded-2xl ${cat.borderColor} p-3.5 sm:p-4 shadow-xs space-y-3.5 transition-all`}
          >
            {/* Category Header with Title + Total XX% beside VS & RE box */}
            <div className={`flex flex-col gap-2 pb-2.5 border-b ${cat.headerBorder}`}>
              <div className="flex items-center justify-between gap-2">
                {/* Left Side: Icon + Name + Total XX% Badge (Beside VS & RE box) */}
                <div className="flex items-center gap-2 min-w-0">
                  <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg ${cat.badgeBg} text-white flex items-center justify-center shadow-2xs shrink-0`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex items-center gap-1.5 min-w-0 flex-wrap">
                    <h3 className="font-black text-slate-900 text-sm sm:text-base tracking-tight truncate">
                      {cat.name}
                    </h3>
                    <span className={`text-[10px] sm:text-[11px] font-black ${cat.badgePillBg} ${cat.badgePillText} border ${cat.badgePillBorder} px-2 py-0.5 rounded-full shrink-0 shadow-2xs`}>
                      {cat.weight}
                    </span>
                  </div>
                </div>

                {/* Right Side: VS & RE in one div ( VS in Left - RE in Right ) under Both Make a Line and Put The Contribution */}
                <div className="bg-white border border-slate-200 rounded-lg p-1.5 shadow-2xs min-w-[130px] shrink-0">
                  <div className="grid grid-cols-2 gap-1 items-center text-center">
                    <div className="pr-1 border-r border-slate-200">
                      <span className="text-[8.5px] uppercase font-black text-slate-600 block">VS%</span>
                      <span className="text-xs font-black text-slate-900 leading-tight block">
                        {formatPercentage(vsContribution)}
                      </span>
                    </div>
                    <div className="pl-1">
                      <span className="text-[8.5px] uppercase font-black text-slate-600 block">RE%</span>
                      <span className="text-xs font-black text-slate-900 leading-tight block">
                        {formatPercentage(reContribution)}
                      </span>
                    </div>
                  </div>
                  <div className="border-t border-slate-200 my-1" />
                  <div className="flex items-center justify-between px-0.5 text-[8.5px] uppercase font-black text-slate-600">
                    <span>Contribution</span>
                    <span className="text-xs font-black text-slate-900">
                      {formatPercentage(vsContribution)}
                    </span>
                  </div>
                </div>
              </div>

              {/* News Bar for Acquisition Rule */}
              {cat.name === 'Acquisition' && (
                <NewsTickerNote
                  note={acqNote}
                  onNoteChange={onAcqNoteChange}
                  className="w-full"
                  editable={false}
                />
              )}
            </div>

            {/* Component Cards */}
            <div className="space-y-3">
              {catColumns.map((col) => {
                const isSummary = col.isSummary ?? false;
                const colInput = col.getter(input);
                const colResult = col.resultGetter(result);
                const title = isSummary
                  ? 'Total Acquisition (Sum)'
                  : col.subTitle;

                const targetVal = isSummary ? result.acquisition.totalTarget : colInput.target;
                const actualVal = isSummary ? result.acquisition.totalActual : colInput.actual;

                // Daily Required applies to: Low, High, Cash, Total Acquisition, and Terminal
                const showDailyRequired = ['acq-low', 'acq-high', 'acq-cash', 'acq-total', 'terminal'].includes(col.id);
                const isCurrency = col.id === 'terminal' || col.unit === 'EGP';

                return (
                  <MobileCard
                    key={col.id}
                    title={title}
                    weightLabel={col.weightLabel || undefined}
                    unit={col.unit}
                    target={targetVal}
                    actual={actualVal}
                    res={colResult}
                    accentColor={col.theme.accentDot}
                    isSummary={isSummary}
                    showDailyRequired={showDailyRequired}
                    isCurrency={isCurrency}
                    isAcquisition={cat.name === 'Acquisition'}
                    onTargetChange={(val) => handleInputChange(col, 'target', val)}
                    onActualChange={(val) => handleInputChange(col, 'actual', val)}
                  />
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
